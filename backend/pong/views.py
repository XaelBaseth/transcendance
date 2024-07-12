from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from json.decoder import JSONDecodeError

from .models import PongRoom
from .serializer import CreatePongRoomSerializer, JoinPongRoomSerializer, PongRoomSerializer

import logging

# Create your views here.
class CreatePongRoomView(APIView):
	serializer_class = CreatePongRoomSerializer

	def post(self, request, format=None):
		logger = logging.getLogger(__name__)
		try:
			serializer = self.serializer_class(data=request.data)
			if serializer.is_valid():
				player_limit = serializer.data.get('player_limit')
				room = PongRoom.objects.create(player_limit=player_limit, players_id=[])
				room.save()
				return Response(PongRoomSerializer(room).data, status=status.HTTP_201_CREATED)
			return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
		except ValidationError as e:
			return Response({'Bad Request': str(e)}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			logger.error(f'Unexpected error: {str(e)}')
			return Response({'Error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class JoinPongRoomView(APIView):

	def post(self, request, format=None):
		logger = logging.getLogger(__name__)
		try:
			code = request.data.get('code')
			if code and isinstance(code, str):
				room = PongRoom.objects.filter(code=code)
				if len(room) > 0:
					room = room[0]
					return Response(PongRoomSerializer(room).data, status=status.HTTP_202_ACCEPTED)
				return Response({'Bad Request': 'Room not found...'}, status=status.HTTP_400_BAD_REQUEST)
			return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
		except JSONDecodeError:
			return Response({'Bad Request': 'Malformed JSON...'}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			logger.error(f'Unexpected error: {str(e)}')
			return Response({'Error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)