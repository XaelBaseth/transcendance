import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.apps import apps

import logging

from jwt import decode as jwt_decode

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		from django.conf import settings
		from rest_framework_simplejwt.tokens import UntypedToken
		from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = f"chat_{self.room_name}"
		
		# Get the token from the query string
		token = self.scope['query_string'].decode().split('token=')[-1]

		# Try to decode the token and get the user_id
		try:
			UntypedToken(token)
			decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
			self.user_id = decoded_data['user_id'] 
		except (InvalidToken, TokenError) as e:
			# Token is invalid
			self.user_id = -1

		# Todo Vérifier si on est dans un chat publique, une game, ou un msg privé

		# Join room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

		logger = logging.getLogger(__name__)
		logger.info('created consumer : ' + self.room_group_name)

	async def disconnect(self, close_code):
		# Leave room group
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive message from WebSocket
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
	   
		message = text_data_json["message"]
		role = "spectator"

		user = await self.get_user_by_id(self.user_id)
		username = f"{user.username}"

		PongRoom = apps.get_model('pong', 'PongRoom')
		code = self.room_name
		room_result = await sync_to_async(PongRoom.objects.filter)(code=code)
		
		#check if message sender is a player
		if not await sync_to_async(room_result.exists)():
			role = "player"
		else:
			room = await sync_to_async(room_result.__getitem__)(0)
			players = room.players_id
			
			if self.user_id in players:
				role = "player"

		# check if message is a command, ie starts with /
		if message.startswith("/"):
			# split message in command and argument
			command = message.split(" ")[0]
			# check if there is an argument
			if len(message.split(" ")) > 1:
				argument = message.split(" ")[1]
			else:
				argument = None				

			# check if command is /msg
			if command == "/msg":

				# concatenate username and argument in ascii order

				# Send command result to the player
				# await self.chat_message({ "message": {"type": "command", "command": "open_private_room", "arguments": username+argument}, "players": [username, argument]})
				
				# check if username == argument
				if username == argument:
					await self.chat_message({"message": {"text": "You can't send a private message to yourself", "role": "system", "username": "system"}})
					return
				
				# check if argument is a valid username
				argument_user = await self.get_user_by_username(argument)
				if argument_user.is_anonymous:
					await self.chat_message({"message": {"text": "User not found", "role": "system", "username": "system"}})
					return

				# create a room name with the two usernames in ascii order
				if username < argument:
					room_id = username + argument
				else:
					room_id = argument + username

				logger = logging.getLogger(__name__)
				logger.info('je crée une room pour : ' + room_id)

				# Send message to room group
				await self.channel_layer.group_send(
				self.room_group_name, {"type": "create.private.chat", "message": {"type": "command", "command": "open_private_room", "arguments": {"room_id":room_id}}, "players": [username, argument]}
				)
					 
				return

			# if command is not recognized
			# Send error message to the sender
			await self.chat_message({"message": {"text": "Command not recognized, type /help for help", "role": "system", "username": "system"}}
			)
			return

		# Send message to room group
		await self.channel_layer.group_send(
		self.room_group_name, {"type": "chat.message", "message": {"text": message, "role": role, "username": username}}
		)

	async def create_private_chat(self, event):
		message = event["message"]
		players = event["players"]

		user = await self.get_user_by_id(self.user_id)
		username = f"{user.username}"

		logger = logging.getLogger(__name__)

		if (username in players):
			logger.info('je crée une room pour : ' + username + " players = " + str(players))
			# remove username from players
			players.remove(username)
			room_name = players[0]
			message["arguments"]["room_name"] = room_name
			await self.send(text_data=json.dumps(message))

	# Receive message from room group
	async def chat_message(self, event):
		message = event["message"]

		# Send message to WebSocket
		await self.send(text_data=json.dumps(message))

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
	
	@database_sync_to_async
	def get_user_by_username(self, username):
		from django.contrib.auth.models import AnonymousUser
		from django.contrib.auth import get_user_model
		User = get_user_model()
		try:
			return User.objects.get(username=username)
		except User.DoesNotExist:
			return AnonymousUser()
		except Exception:
			return AnonymousUser()
