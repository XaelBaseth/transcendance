from django.urls import re_path

from . import consumers

matchmaking_websocket_urlpatterns = [
    re_path(r"ws/matchmaking/$", consumers.MatchMakingConsumer.as_asgi()),
    # re_path(r"ws/pong/(?P<room_name>\w+)/$", consumers.PongConsumer.as_asgi()),

]