import os
from django.db import models
import string
import random

def generate_unique_code():
	length = 6

	while True:
		code = ''.join(random.choices(string.ascii_uppercase, k=length))
		if PongRoom.objects.filter(code=code).count() == 0:
			break
	
	return code

class PongRoom(models.Model):
	code = models.CharField(max_length=10, default=generate_unique_code, unique=True)
	players_id = models.JSONField()
	score = models.IntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	player_limit = models.IntegerField(default=2)
	left_paddle_position = models.IntegerField(default=150)
	right_paddle_position = models.IntegerField(default=150)
	top_paddle_position = models.IntegerField(default=150)
	bottom_paddle_position = models.IntegerField(default=150)
	pause = models.BooleanField(default=False)
	restart = models.BooleanField(default=False)

