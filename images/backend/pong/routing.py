from django.urls import re_path

from . import consumers

pong_websocket_urlpatterns = [
    re_path(r"ws/pong/(?P<room_name>\w+)/$", consumers.PongConsumer.as_asgi()),
]