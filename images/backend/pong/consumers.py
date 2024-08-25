import asyncio
import json

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'source.settings')
import django
django.setup()

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.apps import apps
from channels.db import database_sync_to_async
from pong.models import PongGameData

import logging
import random
import datetime


from jwt import decode as jwt_decode

class PongConsumer(AsyncWebsocketConsumer):
	pong_rooms = []
	pong_rooms_lock = asyncio.Lock()

	@database_sync_to_async
	def get_user_by_id(self, user_id):
		from django.contrib.auth.models import AnonymousUser
		from django.contrib.auth import get_user_model
		User = get_user_model()
		try:
			return User.objects.get(user_id=user_id)
		except User.DoesNotExist:
			return AnonymousUser()
		except Exception:
			return AnonymousUser()

	async def connect(self):
		from django.conf import settings
		from rest_framework_simplejwt.tokens import UntypedToken
		from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

		self.user_id = -1
		self.username = "Anonymous"
		if "room_name" not in self.scope["url_route"]["kwargs"] or not self.scope["url_route"]["kwargs"]["room_name"]:
			self.close(code=4001, reason="No room name")
		else:
			#check if the room exists
			PongRoom = apps.get_model('pong', 'PongRoom')
			room_result = await sync_to_async(PongRoom.objects.filter)(code=self.scope["url_route"]["kwargs"]["room_name"])
			if not await sync_to_async(room_result.exists)():
				self.close(code=4002, reason="Room not found")
				return
			else:
				room = await sync_to_async(room_result.__getitem__)(0)
				if await self.find_room_by_code(PongConsumer.pong_rooms, room.code) is None:
					PongConsumer.pong_rooms.append(PongGameData(room.code, room.player_limit, room.players_id))
		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = f"pong_{self.room_name}"

		# Get the token from the query string
		token = self.scope['query_string'].decode().split('token=')[-1]

		# Try to decode the token and get the user_id
		try:
			UntypedToken(token)
			decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
			self.user_id = decoded_data['user_id']
			user = await self.get_user_by_id(self.user_id)
			self.username = f"{user.username}"
		except (InvalidToken, TokenError):
			# Token is invalid
			self.user_id = -1
			self.username = "Anonymous"

		# Join room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

	async def disconnect(self, close_code):
		logger = logging.getLogger(__name__)
		logger.info(str(self.username) + " disconnected")

		# check if self.room_name exists
		if hasattr(self, 'room_name'):
			code = self.room_name
			
			#check if the room exists in pong_rooms
			room = await self.find_room_by_code(PongConsumer.pong_rooms, code)

			if room is not None:
				if room.state == 'playing':
					if self.username in room.players:
						room.disconnected_players.append(self.username)
						await self.update_room(room)
					pass
		# Leave room group
		if hasattr(self, 'room_group_name'):
			await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive message from WebSocket
	async def receive(self, text_data):
		# print(self.scope["session"].session_key + " : " + text_data)
		logger = logging.getLogger(__name__)
		logger.info(str(self.username) + ' : ' + text_data)

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
			case _:
				await self.send_message({"message": "Invalid message type"})

	async def join_game(self, event):
		logger = logging.getLogger(__name__)
		code = self.room_name
		room = await self.find_room_by_code(PongConsumer.pong_rooms, code)
		logger.info(str(self.username) + " veut join " + str(code))
		logger.info("il y a les players : " + str(room.players))
		if room is None:
			await self.send_message({"message": "Room not found"})
		else:
			players = room.players
			#check if player is in the room
			if self.username in players:
				if self.username in room.disconnected_players:
					room.disconnected_players.remove(self.username)
					await self.update_room(room)
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"players_disconnected", "players": room.disconnected_players }}
					)
				if room.players[0] == self.username:
					await self.send_message({"message" : {"type" : "join_game", "side": "left", "state": room.state}})
				elif room.players[1] == self.username:
						await self.send_message({"message" : {"type" : "join_game", "side": "right", "state": room.state}})
				elif room.players[2] == self.username:
					await self.send_message({"message" : {"type" : "join_game", "side": "top", "state": room.state}})
				elif room.players[3] == self.username:
					await self.send_message({"message" : {"type" : "join_game", "side": "bottom", "state": room.state}})
			else:
				await self.send_message({"message" : {"type" : "join_game", "side": "spectator", "state": room.state}})


		

	async def pause_game(self, event):
		room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)
		if room is None:
			await self.send_message({"message": "Room not found"})
			return
		pause = event["pause"]

		if room.state != "playing":
			await self.send_message({"message": "Game not playing"})
			return

		if pause == "true" or pause:
			room.pause = True
		elif pause == "false" or not pause:
			room.pause = False 
		await self.update_room(room)

	async def update_paddle(self, event):
		room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)
		if room is None:
			await self.send_message({"message": "Room not found"})
			return
		text_data_json = event
		
		#todo check user permissions
		if self.username not in room.players:
			await self.send_message({"message": "You are not a player"})
			return
		elif room.pause:
			return
		
		if not "side" in text_data_json or not "direction" in text_data_json:
			await self.send_message({"message": "Invalid padel update request"})
			return
		
		max_distance = 0
		if room.player_limit == 2:
			max_distance = 300
		elif room.player_limit == 4:
			max_distance = 400

		if text_data_json["side"] == "left" and self.username == room.players[0]:
			if text_data_json["direction"] == "up" and room.left_paddle_position > 0:
				room.left_paddle_position = room.left_paddle_position - 10
			elif text_data_json["direction"] == "down" and room.left_paddle_position < max_distance:
				room.left_paddle_position = room.left_paddle_position + 10
		elif text_data_json["side"] == "right" and self.username == room.players[1]:
			if text_data_json["direction"] == "up" and room.right_paddle_position > 0:
				room.right_paddle_position = room.right_paddle_position - 10
			elif text_data_json["direction"] == "down" and room.right_paddle_position < max_distance:
				room.right_paddle_position = room.right_paddle_position + 10
		elif text_data_json["side"] == "top" and self.username == room.players[2]:
			if text_data_json["direction"] == "left" and room.top_paddle_position > 0:
				room.top_paddle_position = room.top_paddle_position - 10
			elif text_data_json["direction"] == "right" and room.top_paddle_position < max_distance:
				room.top_paddle_position = room.top_paddle_position + 10
		elif text_data_json["side"] == "bottom" and self.username == room.players[3]:
			if text_data_json["direction"] == "left" and room.bottom_paddle_position > 0:
				room.bottom_paddle_position = room.bottom_paddle_position - 10
			elif text_data_json["direction"] == "right" and room.bottom_paddle_position < max_distance:
				room.bottom_paddle_position = room.bottom_paddle_position + 10
		else:
			await self.send_message({"message": "Invalid paddle update request"})
			return
		await self.update_room(room)

	async def start_game(self, event):
		room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)
		if room is None:
			await self.send_message({"message": "Room not found"})
			return
		if self.username not in room.players:
			await self.send_message({"message": "You are not a player"})
			return
		if room.state == "initial":
			await self.channel_layer.group_send(
				self.room_group_name, {"type": "send_message", "message":  {"type":"game_start"}}
			)
			room.state = 'playing'
			await self.update_room(room)
			PongRoom = apps.get_model('pong', 'PongRoom')
			room_result = await sync_to_async(PongRoom.objects.filter)(code=self.scope["url_route"]["kwargs"]["room_name"])
			if await sync_to_async(room_result.exists)():
				db_room = await sync_to_async(room_result.__getitem__)(0)
				db_room.state = 'playing'
				await sync_to_async(db_room.save)()
			if room.player_limit <= 2:
				asyncio.ensure_future(self.game_loop_2_players(event=event))
			else:
				asyncio.ensure_future(self.game_loop_4_players(event=event))
		else:
			await self.send_message({"message": "Game already started"})


	# Receive a message to send to the client
	async def send_message(self, event):
		if "type" in event["message"] and not event["message"]["type"] == "game_state":
			logger = logging.getLogger(__name__)
			logger.info(str(self.username) + " reçoit " + str(event["message"]))

		# Send message to WebSocket
		await self.send(text_data=json.dumps(event["message"]))

	async def find_room_by_code(self, pong_rooms, code):
		return next((room for room in pong_rooms if room.code == code), None)

	async def update_room(self, room):
		await sync_to_async(PongConsumer.pong_rooms.__setitem__)(PongConsumer.pong_rooms.index(room), room)

	# Concidérer que le x et y de la balle sont le haut gauche de la balle, et donc tapper les murs bas et droit à BALL_DIAMETER de distance
	# le y du paddle est le haut du paddle
	async def game_loop_2_players(self, event):
			MAP_HEIGHT = 400
			MAP_WIDTH = 600
			BALL_DIAMETER = 20
			BALL_SPEED = 20
			PADDLE_HEIGHT = 100
			TPS = 10
			WIN_SCORE = 2

			room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)

			ball_direction = {"x": random.choice([-1, 1]), "y": random.choice([-1, 1])}
			ball_position = {"x": 290.0, "y": 190.0}
			left_paddle_position = 150
			right_paddle_position = 150
			room.pause = False
			ball_last_hit = "None"
			room.score = {"left": 0, "right": 0}
			await self.update_room(room)

			players_break_time = {}
			for player in room.players:
				players_break_time[player] = 15

			await self.channel_layer.group_send(
				self.room_group_name, {"type": "send_message", "message":  {"type":"game_state", "ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position,  "timestamp": datetime.datetime.now().isoformat()}}
			)

			while True:
				room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)

				if room.pause:
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"pause", "pause": True }}
					)
					while room.pause:
						await asyncio.sleep(1)
						room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)
					# resume the game
					remaining_time = 3
					while remaining_time > 0:
						await self.channel_layer.group_send(
							self.room_group_name, {"type": "send_message", "message":  {"type":"remaining_time", "remaining_time": remaining_time }}
						)
						await asyncio.sleep(1)
						remaining_time -= 1
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"remaining_time", "remaining_time": 0 }}
					)
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"pause", "pause": False }}
					)

				if len(room.disconnected_players) > 0 and len(players_break_time) > 0:
					player_have_time = False
					for player in room.disconnected_players:
						if player in players_break_time:
							player_have_time = True
							break
					if player_have_time:
						await self.channel_layer.group_send(
							self.room_group_name, {"type": "send_message", "message":  {"type":"pause", "pause": True }}
						)
						remaining_time = 3
						while len(room.disconnected_players) > 0 and len(players_break_time) > 0 and remaining_time > 0:
							for player in room.disconnected_players:
								if player in players_break_time:
									remaining_time = max(players_break_time[player], remaining_time)
									players_break_time[player] -= 1
									if players_break_time[player] <= 0:
										players_break_time.pop(player)
							remaining_time -= 1
							await self.channel_layer.group_send(
								self.room_group_name, {"type": "send_message", "message":  {"type":"players_disconnected", "players": room.disconnected_players }}
							)
							await self.channel_layer.group_send(
								self.room_group_name, {"type": "send_message", "message":  {"type":"remaining_time", "remaining_time": remaining_time }}
							)
							await asyncio.sleep(1)
						await self.channel_layer.group_send(
								self.room_group_name, {"type": "send_message", "message":  {"type":"remaining_time", "remaining_time": 0 }}
						)
						await self.channel_layer.group_send(
							self.room_group_name, {"type": "send_message", "message":  {"type":"pause", "pause": False }}
						)
					
				# update paddles from users messages
				left_paddle_position = room.left_paddle_position
				right_paddle_position = room.right_paddle_position
			
				# Ball movement
				ball_position["x"] += (ball_direction["x"] * BALL_SPEED)
				ball_position["y"] += (ball_direction["y"] * BALL_SPEED)

				# Wall collisions
				if ball_position["y"] <= 0 or ball_position["y"] >= MAP_HEIGHT - BALL_DIAMETER:
					ball_direction["y"] = -ball_direction["y"]
					ball_last_hit = "None"

				# Paddle collisions
				if ball_position["x"] <= 20 and ball_position["x"] >= 0 and ball_position["y"] <= left_paddle_position + 100 and ball_position["y"] >= left_paddle_position:
					if ball_last_hit != "left":
						ball_direction["x"] = -ball_direction["x"]
						ball_last_hit = "left"
				elif ball_position["x"] >= 560 and ball_position["x"] < 580 and ball_position["y"] <= right_paddle_position + 100 and ball_position["y"] >= right_paddle_position:
					if ball_last_hit != "right":
						ball_direction["x"] = -ball_direction["x"]
						ball_last_hit = "right"
				
				# Point counter
				if ball_position["x"] <= 0:
					ball_last_hit = "None"
					room.score["right"] += 1
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"score", "score": room.score}}
					)
					ball_direction = {"x": random.choice([-1, 1]), "y": random.choice([-1, 1])}
					ball_position = {"x": 290.0, "y": 190.0}
					left_paddle_position = 150
					right_paddle_position = 150
					await self.update_room(room)
					if room.score["right"] >= WIN_SCORE:
						room.state = 'finished'
						await self.update_room(room)
						PongRoom = apps.get_model('pong', 'PongRoom')
						room_result = await sync_to_async(PongRoom.objects.filter)(code=self.scope["url_route"]["kwargs"]["room_name"])
						if await sync_to_async(room_result.exists)():
							db_room = await sync_to_async(room_result.__getitem__)(0)
							db_room.state = 'finished'
							await sync_to_async(db_room.save)()
						await self.channel_layer.group_send(
							self.room_group_name, {"type": "send_message", "message":  {"type":"game_over", "winner": "right"}}
						)
						break
				elif ball_position["x"] >= MAP_WIDTH:
					ball_last_hit = "None"
					room.score["left"] += 1
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"score", "score": room.score}}
					)
					ball_direction = {"x": random.choice([-1, 1]), "y": random.choice([-1, 1])}
					ball_position = {"x": 290.0, "y": 190.0}
					left_paddle_position = 150
					right_paddle_position = 150
					await self.update_room(room)
					if room.score["left"] >= WIN_SCORE:
						room.state = 'finished'
						await self.update_room(room)
						PongRoom = apps.get_model('pong', 'PongRoom')
						room_result = await sync_to_async(PongRoom.objects.filter)(code=self.scope["url_route"]["kwargs"]["room_name"])
						if await sync_to_async(room_result.exists)():
							db_room = await sync_to_async(room_result.__getitem__)(0)
							db_room.state = 'finished'
							await sync_to_async(db_room.save)()
						await self.channel_layer.group_send(
							self.room_group_name, {"type": "send_message", "message":  {"type":"game_over", "winner": "left"}}
						)
						break
						
				await self.channel_layer.group_send(
					self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
				)
				await asyncio.sleep(1/TPS)

	async def game_loop_4_players(self, event):
			MAP_HEIGHT = 500
			MAP_WIDTH = 500
			BALL_DIAMETER = 20
			BALL_SPEED = 5
			PADDLE_HEIGHT = 100
			TPS = 10
			WIN_SCORE = 2

			room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)

			ball_last_hit = "None"
			ball_direction = {"x": random.choice([-1, 1]), "y": random.choice([-1, 1])}
			ball_position = {"x": 240.0, "y": 240.0}
			left_paddle_position = 200
			right_paddle_position = 200
			top_paddle_position = 200
			bottom_paddle_position = 200
			room.left_paddle_position = left_paddle_position
			room.right_paddle_position = right_paddle_position
			room.top_paddle_position = top_paddle_position
			room.bottom_paddle_position = bottom_paddle_position
			room.pause = False
			room.score = {"left": 0, "right": 0, "top": 0, "bottom": 0}
			await self.update_room(room)

			players_break_time = {}
			for player in room.players:
				players_break_time[player] = 15

			await self.channel_layer.group_send(
				self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position, "top_paddle_position": top_paddle_position, "bottom_paddle_position": bottom_paddle_position, "timestamp": datetime.datetime.now().isoformat()}}
			)

			while True:
				room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)

				if room.pause:
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"pause", "pause": True }}
					)
					while room.pause:
						await asyncio.sleep(1)
						room = await self.find_room_by_code(PongConsumer.pong_rooms, self.room_name)
					# resume the game
					remaining_time = 3
					while remaining_time > 0:
						await self.channel_layer.group_send(
							self.room_group_name, {"type": "send_message", "message":  {"type":"remaining_time", "remaining_time": remaining_time }}
						)
						await asyncio.sleep(1)
						remaining_time -= 1
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"remaining_time", "remaining_time": 0 }}
					)
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"pause", "pause": False }}
					)
				
				if len(room.disconnected_players) > 0 and len(players_break_time) > 0:
					player_have_time = False
					for player in room.disconnected_players:
						if player in players_break_time:
							player_have_time = True
							break
					if player_have_time:
						await self.channel_layer.group_send(
							self.room_group_name, {"type": "send_message", "message":  {"type":"pause", "pause": True }}
						)
						remaining_time = 3
						while len(room.disconnected_players) > 0 and len(players_break_time) > 0 and remaining_time > 0:
							for player in room.disconnected_players:
								if player in players_break_time:
									remaining_time = max(players_break_time[player], remaining_time)
									players_break_time[player] -= 1
									if players_break_time[player] <= 0:
										players_break_time.pop(player)
							remaining_time -= 1
							await self.channel_layer.group_send(
								self.room_group_name, {"type": "send_message", "message":  {"type":"players_disconnected", "players": room.disconnected_players }}
							)
							await self.channel_layer.group_send(
								self.room_group_name, {"type": "send_message", "message":  {"type":"remaining_time", "remaining_time": remaining_time }}
							)
							await asyncio.sleep(1)
						await self.channel_layer.group_send(
								self.room_group_name, {"type": "send_message", "message":  {"type":"remaining_time", "remaining_time": 0 }}
						)
						await self.channel_layer.group_send(
							self.room_group_name, {"type": "send_message", "message":  {"type":"pause", "pause": False }}
						)
				
				# update paddles from users messages
				left_paddle_position = room.left_paddle_position
				right_paddle_position = room.right_paddle_position
				top_paddle_position = room.top_paddle_position
				bottom_paddle_position = room.bottom_paddle_position
			
				# Ball movement
				ball_position["x"] += (ball_direction["x"] * BALL_SPEED)
				ball_position["y"] += (ball_direction["y"] * BALL_SPEED)

				# Paddle collisions
				if ball_position["x"] <= 20 and ball_position["x"] >= 0 and ball_position["y"] <= left_paddle_position + 100 and ball_position["y"] >= left_paddle_position:
					if ball_last_hit != "left":
						ball_direction["x"] = -ball_direction["x"]
						ball_last_hit = "left"
				elif ball_position["x"] >= 460 and ball_position["x"] < 480 and ball_position["y"] <= right_paddle_position + 100 and ball_position["y"] >= right_paddle_position:
					if ball_last_hit != "right":
						ball_direction["x"] = -ball_direction["x"]
						ball_last_hit = "right"
				elif ball_position["y"] <= 20 and ball_position["y"] >= 0 and ball_position["x"] <= top_paddle_position + 100 and ball_position["x"] >= top_paddle_position:
					if ball_last_hit != "top":
						ball_direction["y"] = -ball_direction["y"]
						ball_last_hit = "top"
				elif ball_position["y"] >= 460 and ball_position["y"] < 480 and ball_position["x"] <= bottom_paddle_position + 100 and ball_position["x"] >= bottom_paddle_position:
					if ball_last_hit != "bottom":
						ball_direction["y"] = -ball_direction["y"]
						ball_last_hit = "bottom"
				

				if ball_position["x"] <= 0 or ball_position["x"] >= MAP_WIDTH or ball_position["y"] <= 0 or ball_position["y"] >= MAP_HEIGHT:
					if ball_last_hit != "None":
						room.score[ball_last_hit] += 1
					ball_last_hit = "None"
					await self.channel_layer.group_send(
						self.room_group_name, {"type": "send_message", "message":  {"type":"score", "score": room.score}}
					)
					ball_direction = {"x": random.choice([-1, 1]), "y": random.choice([-1, 1])}
					ball_position = {"x": 240.0, "y": 240.0}
					left_paddle_position = 200
					right_paddle_position = 200
					top_paddle_position = 200
					bottom_paddle_position = 200
					await self.update_room(room)
					for score in room.score:
						if room.score[score] >= WIN_SCORE:
							room.state = 'finished'
							await self.update_room(room)
							PongRoom = apps.get_model('pong', 'PongRoom')
							room_result = await sync_to_async(PongRoom.objects.filter)(code=self.scope["url_route"]["kwargs"]["room_name"])
							if await sync_to_async(room_result.exists)():
								db_room = await sync_to_async(room_result.__getitem__)(0)
								db_room.state = 'finished'
								await sync_to_async(db_room.save)()
							await self.channel_layer.group_send(
								self.room_group_name, {"type": "send_message", "message":  {"type":"game_over", "winner": score}}
							)
							return
				
				await self.channel_layer.group_send(
					self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position, "top_paddle_position": top_paddle_position, "bottom_paddle_position": bottom_paddle_position}}
				)
				await asyncio.sleep(1/TPS)