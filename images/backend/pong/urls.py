from django.urls import path

from .views import CreatePongRoomView, JoinMatchMaking, JoinPongRoomView

urlpatterns = [
	path("create-room", CreatePongRoomView.as_view()),
	path("join-room", JoinPongRoomView.as_view()),
    path("join-matchmaking", JoinMatchMaking.as_view()),
]