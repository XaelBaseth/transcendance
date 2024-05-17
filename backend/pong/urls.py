from django.urls import path

from .views import CreatePongRoomView, JoinPongRoomView

urlpatterns = [
	path('create-room/', CreatePongRoomView.as_view()),
	path('join-room/', JoinPongRoomView.as_view()),
]