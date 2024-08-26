import os
from django.db import models
import string
import random
import asyncio

def generate_unique_code():
	length = 6

	while True:
		code = ''.join(random.choices(string.ascii_uppercase, k=length))
		if PongRoom.objects.filter(code=code).count() == 0:
			break
	
	return code

INITIAL = 'initial'
PLAYING = 'playing'
FINISHED = 'finished'
    
STATE_CHOICES = [
    (INITIAL, 'Initial'),
    (PLAYING, 'Playing'),
    (FINISHED, 'Finished'),
]

class PongRoom(models.Model):
	code = models.CharField(max_length=10, default=generate_unique_code, unique=True)
	players_id = models.JSONField()
	score = models.IntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	player_limit = models.IntegerField(default=2)
	state = models.CharField(
        max_length=10,
        choices=STATE_CHOICES,
        default=INITIAL,
    )

class PongGameData:
	def __init__(self, code, player_limit, players):
		self.code = code
		self.player_limit = player_limit
		self.players = players
		self.disconnected_players = players.copy()
		self.score = {}
		self.left_paddle_position = 150
		self.right_paddle_position = 150
		self.top_paddle_position = 150
		self.bottom_paddle_position = 150
		self.pause = False
		self.state = INITIAL