from rest_framework import serializers
from .models import PongRoom

class PongRoomSerializer(serializers.ModelSerializer):
	class Meta:
		model = PongRoom
		fields = ('id', 'code', 'players_id', 'score', 'created_at', 'player_limit')

class CreatePongRoomSerializer(serializers.ModelSerializer):
	class Meta:
		model = PongRoom
		fields = ('player_limit',)

class JoinPongRoomSerializer(serializers.ModelSerializer):
	class Meta:
		model = PongRoom
		fields = ('code',)
