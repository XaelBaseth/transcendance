import asyncio
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.apps import apps
from .manage_game import game_loop
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
		# Leave room group
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
				return
			players_count = len(players)
			if players_count < room.player_limit:
				await sync_to_async(room.players_id.append)(self.user_id)
				await sync_to_async(room.save)()
				if players_count == 0:
					await self.send_message({"message" : {"type" : "join_game", "side": "left"}})
				else:
					await self.send_message({"message" : {"type" : "join_game", "side": "right"}})
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
		asyncio.ensure_future(game_loop(self=self, event=event))


	# Receive a message to send to the client
	async def send_message(self, event):

		# Send message to WebSocket
		await self.send(text_data=json.dumps(event["message"]))