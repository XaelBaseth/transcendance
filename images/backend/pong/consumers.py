import asyncio
import json

from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync
from django.apps import apps
from .manage_game import game_loop_2_players, game_loop_4_players
from channels.db import database_sync_to_async

import logging


from jwt import decode as jwt_decode

class PongConsumer(AsyncWebsocketConsumer):	 
	@database_sync_to_async
	def get_user(self, user_id):
		from django.contrib.auth.models import AnonymousUser
		from django.contrib.auth import get_user_model
		User = get_user_model()
		try:
			return User.objects.get(user_id=user_id)
		except User.DoesNotExist:
			return AnonymousUser()

	async def connect(self):
		from django.conf import settings
		from rest_framework_simplejwt.tokens import UntypedToken
		from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

		self.user_id = -1
		if "room_name" not in self.scope["url_route"]["kwargs"] or not self.scope["url_route"]["kwargs"]["room_name"]:
			self.close(code=4001, reason="No room name")
		else:
			#check if the room exists
			PongRoom = apps.get_model('pong', 'PongRoom')
			room_result = await sync_to_async(PongRoom.objects.filter)(code=self.scope["url_route"]["kwargs"]["room_name"])
			if not await sync_to_async(room_result.exists)():
				self.close(code=4002, reason="Room not found")
				return
		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = f"pong_{self.room_name}"

		# Get the token from the query string
		token = self.scope['query_string'].decode().split('token=')[-1]

		# Try to decode the token and get the user_id
		try:
			UntypedToken(token)
			decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
			self.user_id = decoded_data['user_id']
		except (InvalidToken, TokenError):
			# Token is invalid
			self.user_id = -1

		# Join room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

	async def disconnect(self, close_code):
		logger = logging.getLogger(__name__)
		logger.info(str(self.user_id) + " disconnected")

		# check if self.room_name exists
		if hasattr(self, 'room_name'):
			PongRoom = apps.get_model('pong', 'PongRoom')
			code = self.room_name
			room_result = await sync_to_async(PongRoom.objects.filter)(code=code)

			if await sync_to_async(room_result.exists)():
				room = await sync_to_async(room_result.__getitem__)(0)
				if room.state == 'playing':
					# Todo: handle disconnect during game
					pass
		# Leave room group
		if hasattr(self, 'room_group_name'):
			await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive message from WebSocket
	async def receive(self, text_data):
		# print(self.scope["session"].session_key + " : " + text_data)
		logger = logging.getLogger(__name__)
		logger.info(str(self.user_id) + ' : ' + text_data)

		# check if text_data is a valid json
		try:
			text_data_json = json.loads(text_data)
		except json.JSONDecodeError:
			await self.send_message({"message": "Invalid JSON"})
			return
		except TypeError:
			await self.send_message({"message": "Invalid JSON"})
			return
		
		if text_data_json.get("type") is None:
			await self.send_message({"message": "'type' field missing"})

		match text_data_json["type"]:
			case "join_game":
				await self.join_game(event=text_data_json)
			case "start_game":
				await self.start_game(event=text_data_json)
			case "update_paddle":
				await self.update_paddle(event=text_data_json)
			case "pause":
				await self.pause_game(event=text_data_json)
			case "restart":
				await self.restart_game(event=text_data_json)
			case _:
				await self.send_message({"message": "Invalid message type"})

	async def join_game(self, event):
		PongRoom = apps.get_model('pong', 'PongRoom')
		code = self.room_name
		room_result = await sync_to_async(PongRoom.objects.filter)(code=code)
		
		if not await sync_to_async(room_result.exists)():
			await self.send_message({"message": "Room not found"})
		else:
			room = await sync_to_async(room_result.__getitem__)(0)
			players = room.players_id
			#check if player is already in the room
			if self.user_id in players:
				if self.user_id == room.players_id[0]:
					await self.send_message({"message" : {"type" : "join_game", "side": "left"}})
				elif self.user_id == room.players_id[1]:
					await self.send_message({"message" : {"type" : "join_game", "side": "right"}})
				elif self.user_id == room.players_id[2]:
					await self.send_message({"message" : {"type" : "join_game", "side": "top"}})
				elif self.user_id == room.players_id[3]:
					await self.send_message({"message" : {"type" : "join_game", "side": "bottom"}})
			else:
				players_count = len(players)
				if players_count < room.player_limit:
					await sync_to_async(room.players_id.append)(self.user_id)
					await sync_to_async(room.save)()
					if players_count == 0:
						await self.send_message({"message" : {"type" : "join_game", "side": "left"}})
					elif players_count == 1:
						await self.send_message({"message" : {"type" : "join_game", "side": "right"}})
					elif players_count == 2:
						await self.send_message({"message" : {"type" : "join_game", "side": "top"}})
					elif players_count == 3:
						await self.send_message({"message" : {"type" : "join_game", "side": "bottom"}})
				else:
					await self.send_message({"message" : {"type" : "join_game", "side": "spectator"}})

	async def restart_game(self, event):
		PongRoom = apps.get_model('pong', 'PongRoom')
		room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
		if not await sync_to_async(room_result.exists)():
			await self.send_message({"message": "Room not found"})
			return
		room = await sync_to_async(room_result.__getitem__)(0)

		room.restart = True
		room.pause = False
		await sync_to_async(room.save)()
		await asyncio.sleep(1.5)
		await self.start_game(event=event)

	async def pause_game(self, event):
		PongRoom = apps.get_model('pong', 'PongRoom')
		room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
		if not await sync_to_async(room_result.exists)():
			await self.send_message({"message": "Room not found"})
			return
		room = await sync_to_async(room_result.__getitem__)(0)
		room.pause = not room.pause
		await sync_to_async(room.save)()

	async def update_paddle(self, event):
		PongRoom = apps.get_model('pong', 'PongRoom')
		room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
		if not await sync_to_async(room_result.exists)():
			await self.send_message({"message": "Room not found"})
			return
		room = await sync_to_async(room_result.__getitem__)(0)
		text_data_json = event
		
		#todo check user permissions
		if self.user_id not in room.players_id:
			await self.send_message({"message": "You are not a player"})
			return
		elif room.pause:
			return

		if text_data_json["side"] == "left" and self.user_id == room.players_id[0]:
			if text_data_json["direction"] == "up" and room.left_paddle_position > 0:
				room.left_paddle_position = room.left_paddle_position - 10
			elif text_data_json["direction"] == "down" and room.left_paddle_position < 300:
				room.left_paddle_position = room.left_paddle_position + 10
		elif text_data_json["side"] == "right" and self.user_id == room.players_id[1]:
			if text_data_json["direction"] == "up" and room.right_paddle_position > 0:
				room.right_paddle_position = room.right_paddle_position - 10
			elif text_data_json["direction"] == "down" and room.right_paddle_position < 300:
				room.right_paddle_position = room.right_paddle_position + 10
		elif text_data_json["side"] == "top" and self.user_id == room.players_id[2]:
			if text_data_json["direction"] == "left" and room.top_paddle_position > 0:
				room.top_paddle_position = room.top_paddle_position - 10
			elif text_data_json["direction"] == "right" and room.top_paddle_position < 300:
				room.top_paddle_position = room.top_paddle_position + 10
		elif text_data_json["side"] == "bottom" and self.user_id == room.players_id[3]:
			if text_data_json["direction"] == "left" and room.bottom_paddle_position > 0:
				room.bottom_paddle_position = room.bottom_paddle_position - 10
			elif text_data_json["direction"] == "right" and room.bottom_paddle_position < 300:
				room.bottom_paddle_position = room.bottom_paddle_position + 10
		else:
			await self.send_message({"message": "Invalid paddle update request"})
			return
		await sync_to_async(room.save)()

	async def start_game(self, event):
		PongRoom = apps.get_model('pong', 'PongRoom')
		room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
		if not await sync_to_async(room_result.exists)():
			await self.send_message({"message": "Room not found"})
			return
		room = await sync_to_async(room_result.__getitem__)(0)
		if self.user_id not in room.players_id:
			await self.send_message({"message": "You are not a player"})
			return
		await self.channel_layer.group_send(
			self.room_group_name, {"type": "send_message", "message":  {"type":"game_start"}}
		)
		room.state = 'playing'
		await sync_to_async(room.save)()
		if room.player_limit <= 2:
			asyncio.ensure_future(game_loop_2_players(self=self, event=event))
		else:
			asyncio.ensure_future(game_loop_4_players(self=self, event=event))


	# Receive a message to send to the client
	async def send_message(self, event):

		# Send message to WebSocket
		await self.send(text_data=json.dumps(event["message"]))

class MatchMakingConsumer(WebsocketConsumer):
	duel_queue = []
	quarrel_queue = []

	def connect(self):
		self.room_group_name = "matchmaking"
		# Join room group
		async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
		self.accept()

	def disconnect(self, close_code):
		self.leave_queue()
		# Leave room group
		async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

	def receive(self, text_data):
		logger = logging.getLogger(__name__)
		logger.info(str(self.channel_name) + ' : ' + text_data)

		try:
			text_data_json = json.loads(text_data)
		except json.JSONDecodeError:
			self.send_message({"message": "Invalid JSON"})
			return
		except TypeError:
			self.send_message({"message": "Invalid JSON"})
			return
		
		if text_data_json.get("type") is None:
			self.send_message({"message": "'type' field missing"})

		match text_data_json["type"]:
			case "queue_duel":
				self.join_queue(event="duel")
			case "queue_quarrel":
				self.join_queue(event="quarrel")
			case "leave_queue":
				self.leave_queue()
			case _:
				self.send_message({"message": "Invalid message type"})
				return

	def join_queue(self, event):
		logger = logging.getLogger(__name__)
		logger.info(str(self.channel_name) + ' join la queue : ' + event)
		if event == "duel":
			logger.info(str(self.channel_name) + ' join la queue duel')
			MatchMakingConsumer.duel_queue.append(self.channel_name)
			if len(MatchMakingConsumer.duel_queue) >= 2:
				self.start_match("duel")
			else:
				async_to_sync(self.channel_layer.send)(
					MatchMakingConsumer.duel_queue[0], 
					{"type": "send_message", "message": {"type": "queue", "in_queue": "1", "needed": "2"}}
				)
		elif event == "quarrel":
			logger.info(str(self.channel_name) + ' join la queue quarrel')
			MatchMakingConsumer.quarrel_queue.append(self.channel_name)
			if len(MatchMakingConsumer.quarrel_queue) >= 4:
				self.start_match("quarrel")
			else:
				in_queue = len(MatchMakingConsumer.quarrel_queue)
				for i in range(in_queue):
					async_to_sync(self.channel_layer.send)(
						MatchMakingConsumer.quarrel_queue[i], 
						{"type": "send_message", "message": {"type": "queue", "in_queue": str(in_queue), "needed": "4"}}
					)

	def start_match(self, event):
		PongRoom = apps.get_model('pong', 'PongRoom')
		if event == "duel":
			player1 = MatchMakingConsumer.duel_queue.pop(0)
			player2 = MatchMakingConsumer.duel_queue.pop(0)
			room =  PongRoom.objects.create(player_limit=2, players_id=[], state='initial')
			room.save()
			async_to_sync(self.channel_layer.send)(
				player1,
				{"type": "send_message", "message": {"type": "join_game", "code": room.code}}
			)
			async_to_sync(self.channel_layer.send)(
				player2,
				{"type": "send_message", "message": {"type": "join_game", "code": room.code}}
			)
		elif event == "quarrel":
			player1 = MatchMakingConsumer.quarrel_queue.pop(0)
			player2 = MatchMakingConsumer.quarrel_queue.pop(0)
			player3 = MatchMakingConsumer.quarrel_queue.pop(0)
			player4 = MatchMakingConsumer.quarrel_queue.pop(0)
			room =  PongRoom.objects.create(player_limit=4, players_id=[], state='initial')
			room.save()
			async_to_sync(self.channel_layer.send)(
				player1,
				{"type": "send_message", "message": {"type": "join_game", "code": room.code}}
			)
			async_to_sync(self.channel_layer.send)(
				player2,
				{"type": "send_message", "message": {"type": "join_game", "code": room.code}}
			)
			async_to_sync(self.channel_layer.send)(
				player3,
				{"type": "send_message", "message": {"type": "join_game", "code": room.code}}
			)
			async_to_sync(self.channel_layer.send)(
				player4,
				{"type": "send_message", "message": {"type": "join_game", "code": room.code}}
			)

	def leave_queue(self):
		# check if player is in queue
		if self.channel_name in MatchMakingConsumer.duel_queue:
			MatchMakingConsumer.duel_queue.remove(self.channel_name)
			in_queue = len(MatchMakingConsumer.duel_queue)
			for i in range(in_queue):
				async_to_sync(self.channel_layer.send)(
					MatchMakingConsumer.duel_queue[i], 
					{"type": "send_message", "message": {"type": "queue", "in_queue": str(in_queue), "needed": "2"}}
				)
		if self.channel_name in MatchMakingConsumer.quarrel_queue:
			MatchMakingConsumer.quarrel_queue.remove(self.channel_name)
			in_queue = len(MatchMakingConsumer.quarrel_queue)
			for i in range(in_queue):
				async_to_sync(self.channel_layer.send)(
					MatchMakingConsumer.quarrel_queue[i], 
					{"type": "send_message", "message": {"type": "queue", "in_queue": str(in_queue), "needed": "4"}}
				)

	# Receive a message to send to the client
	def send_message(self, event):
		logger = logging.getLogger(__name__)
		logger.info(str(self.channel_name) + 'matchmaking sending : ' + str(event["message"]))

		# Send message to WebSocket
		self.send(text_data=json.dumps(event["message"]))