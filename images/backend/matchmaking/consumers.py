import json

from channels.generic.websocket import  WebsocketConsumer
from asgiref.sync import async_to_sync
from django.apps import apps

import logging

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