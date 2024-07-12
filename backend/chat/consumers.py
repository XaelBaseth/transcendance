import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.apps import apps

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

		# Join room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

	async def disconnect(self, close_code):
		# Leave room group
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive message from WebSocket
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
	   
		message = text_data_json["message"]
		role = "spectator"

		user = await self.get_user(self.user_id)
		username = f"{user.username}"

		PongRoom = apps.get_model('pong', 'PongRoom')
		code = self.room_name
		room_result = await sync_to_async(PongRoom.objects.filter)(code=code)
		
		#check if message sender is a player
		if not await sync_to_async(room_result.exists)():
			await self.send_message({"message": "Room not found"})
		else:
			room = await sync_to_async(room_result.__getitem__)(0)
			players = room.players_id
			
			if self.user_id in players:
				role = "player"

		# Send message to room group
		await self.channel_layer.group_send(
		self.room_group_name, {"type": "chat.message", "message": {"message": message, "role": role, "username": username}}
		)

	# Receive message from room group
	async def chat_message(self, event):
		message = event["message"]

		# Send message to WebSocket
		await self.send(text_data=json.dumps(message))

	@database_sync_to_async
	def get_user(self, user_id):
		from django.contrib.auth.models import AnonymousUser
		from django.contrib.auth import get_user_model
		User = get_user_model()
		try:
			return User.objects.get(user_id=user_id)
		except User.DoesNotExist:
			return AnonymousUser()
		except Exception:
			return AnonymousUser()
