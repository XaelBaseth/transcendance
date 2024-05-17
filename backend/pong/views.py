from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PongRoom
from .serializer import CreatePongRoomSerializer, JoinPongRoomSerializer, PongRoomSerializer

# Create your views here.
class CreatePongRoomView(APIView):
	serializer_class = CreatePongRoomSerializer

	def post(self, request, format=None):
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			player_limit = serializer.data.get('player_limit')
			room = PongRoom.objects.create(player_limit=player_limit,players_id=[])
			room.save()
			return Response(PongRoomSerializer(room).data, status=status.HTTP_201_CREATED)
		return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class JoinPongRoomView(APIView):
	serializer_class = JoinPongRoomSerializer

	def post(self, request, format=None):
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			code = serializer.data.get('code')
			room = PongRoom.objects.filter(code=code)
			if len(room) > 0:
				room = room[0]
				return Response(PongRoomSerializer(room).data, status=status.HTTP_202_ACCEPTED)
			return Response({'Bad Request': 'Room not found...'}, status=status.HTTP_400_BAD_REQUEST)
		return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)