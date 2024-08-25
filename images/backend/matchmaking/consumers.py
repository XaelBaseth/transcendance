import json

from channels.generic.websocket import  WebsocketConsumer
from asgiref.sync import async_to_sync
from django.apps import apps

from pong.consumers import PongConsumer
import logging
import random


from jwt import decode as jwt_decode

class MatchMakingConsumer(WebsocketConsumer):
	duel_queue = []
	quarrel_queue = []

	def connect(self):
		from rest_framework_simplejwt.tokens import UntypedToken
		from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
		from django.conf import settings

		# Try to decode the token and get the user_id
		try:
			token = self.scope['query_string'].decode().split('token=')[-1]
			UntypedToken(token)
			decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
			user_id = decoded_data['user_id']
			user = self.get_user_by_id(user_id)
			self.username = f"{user.username}"
		except (InvalidToken, TokenError):
			self.username = None
		
		# check if player is in queue
		if self.username is None:
			self.close(code=4002, reason="No user found")
			return

		self.room_group_name = "matchmaking"
		self.queue = None
		# Join room group
		async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
		self.accept()

	def disconnect(self, close_code):
		if hasattr(self, 'queue'):
			self.leave_queue()
		# Leave room group
		if hasattr(self, 'room_group_name'):
			async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)

	def receive(self, text_data):
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
			case "check_game":
				self.check_game()
			case "leave_queue":
				self.leave_queue()
			case _:
				self.send_message({"message": "Invalid message type"})
				return

	def check_game(self):
		rooms = PongConsumer.pong_rooms

		if len(rooms) > 0 and self.username is not None:
			logger = logging.getLogger(__name__)
			logger.info("je cherche : " + self.username + " dans les rooms")
			for room in rooms:
				if self.username in room.players and room.state != "finished":
					self.send_message({"type": "send_message", "message": {"type": "join_game", "code": room.code, "player_limit": room.player_limit}})
					return

	def join_queue(self, event):
		queues = MatchMakingConsumer.duel_queue + MatchMakingConsumer.quarrel_queue
		for player in queues:
			if player["username"] == self.username:
				self.send_message({"message": "You are already in queue"})
				return
		if event == "duel":
			MatchMakingConsumer.duel_queue.append({"channel_name": self.channel_name, "username": self.username})
			self.queue = "duel"
			if len(MatchMakingConsumer.duel_queue) >= 2:
				self.start_match("duel")
			else:
				async_to_sync(self.channel_layer.send)(
					MatchMakingConsumer.duel_queue[0]["channel_name"], 
					{"type": "send_message", "message": {"type": "queue", "in_queue": "1", "needed": "2"}}
				)
		elif event == "quarrel":
			MatchMakingConsumer.quarrel_queue.append({"channel_name": self.channel_name, "username": self.username})
			self.queue = "quarrel"
			if len(MatchMakingConsumer.quarrel_queue) >= 4:
				self.start_match("quarrel")
			else:
				in_queue = len(MatchMakingConsumer.quarrel_queue)
				for i in range(in_queue):
					async_to_sync(self.channel_layer.send)(
						MatchMakingConsumer.quarrel_queue[i]["channel_name"], 
						{"type": "send_message", "message": {"type": "queue", "in_queue": str(in_queue), "needed": "4"}}
					)

	def start_match(self, event):
		PongRoom = apps.get_model('pong', 'PongRoom')
		if event == "duel":
			player1 = MatchMakingConsumer.duel_queue.pop(0)
			player2 = MatchMakingConsumer.duel_queue.pop(0)
			players_id = [player1["username"], player2["username"]]
			random.shuffle(players_id)
			room = PongRoom.objects.create(player_limit=2, players_id=players_id, state='initial')
			room.save()
			logger = logging.getLogger(__name__)
			logger.info("j'ai créé une room pour : " + str(room.players_id))
			async_to_sync(self.channel_layer.send)(
				player1["channel_name"],
				{"type": "send_message", "message": {"type": "join_game", "code": room.code, "player_limit": room.player_limit}}
			)
			async_to_sync(self.channel_layer.send)(
				player2["channel_name"],
				{"type": "send_message", "message": {"type": "join_game", "code": room.code, "player_limit": room.player_limit}}
			)
		elif event == "quarrel":
			player1 = MatchMakingConsumer.quarrel_queue.pop(0)
			player2 = MatchMakingConsumer.quarrel_queue.pop(0)
			player3 = MatchMakingConsumer.quarrel_queue.pop(0)
			player4 = MatchMakingConsumer.quarrel_queue.pop(0)
			players_id = [player1["username"], player2["username"], player3["username"], player4["username"]]
			random.shuffle(players_id)
			room =  PongRoom.objects.create(player_limit=4, players_id=players_id, state='initial')
			room.save()
			async_to_sync(self.channel_layer.send)(
				player1["channel_name"],
				{"type": "send_message", "message": {"type": "join_game", "code": room.code, "player_limit": room.player_limit}}
			)
			async_to_sync(self.channel_layer.send)(
				player2["channel_name"],
				{"type": "send_message", "message": {"type": "join_game", "code": room.code, "player_limit": room.player_limit}}
			)
			async_to_sync(self.channel_layer.send)(
				player3["channel_name"],
				{"type": "send_message", "message": {"type": "join_game", "code": room.code, "player_limit": room.player_limit}}
			)
			async_to_sync(self.channel_layer.send)(
				player4["channel_name"],
				{"type": "send_message", "message": {"type": "join_game", "code": room.code, "player_limit": room.player_limit}}
			)

	def leave_queue(self):
		# check if player is in queue
		if (self.queue == "duel"):
			MatchMakingConsumer.duel_queue = [
				player for player in MatchMakingConsumer.duel_queue 
				if player["channel_name"] != self.channel_name
			]
			in_queue = len(MatchMakingConsumer.duel_queue)
			for i in range(in_queue):
				async_to_sync(self.channel_layer.send)(
					MatchMakingConsumer.duel_queue[i]["channel_name"], 
					{"type": "send_message", "message": {"type": "queue", "in_queue": str(in_queue), "needed": "2"}}
				)
		elif (self.queue == "quarrel"):
			MatchMakingConsumer.quarrel_queue = [
				player for player in MatchMakingConsumer.quarrel_queue 
				if player["channel_name"] != self.channel_name
			]
			in_queue = len(MatchMakingConsumer.quarrel_queue)
			for i in range(in_queue):
				async_to_sync(self.channel_layer.send)(
					MatchMakingConsumer.quarrel_queue[i]["channel_name"], 
					{"type": "send_message", "message": {"type": "queue", "in_queue": str(in_queue), "needed": "4"}}
				)

	# Receive a message to send to the client
	def send_message(self, event):
		# Send message to WebSocket
		self.send(text_data=json.dumps(event["message"]))

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