import asyncio
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.apps import apps
from .manage_game import game_loop

class PongConsumer(AsyncWebsocketConsumer):     
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"pong_{self.room_name}"

        # Create a session key if it doesn't exist
        if not self.scope["session"].session_key:
            await sync_to_async(self.scope["session"].create)()
            await sync_to_async(self.scope["session"].save)()

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

   
    # Receive message from WebSocket
    async def receive(self, text_data):
        # print(self.scope["session"].session_key + " : " + text_data)
        text_data_json = json.loads(text_data)

        match text_data_json["type"]:
            # case "create_game":
            #     await self.create_game(event=text_data_json)
            case "join_game":
                await self.join_game(event=text_data_json)
            case "start_game":
                await self.start_game(event=text_data_json)
            case "update_paddle":
                await self.update_paddle(event=text_data_json)
            case "pause":
                await self.pause_game(event=text_data_json)
            case "restart":
                await self.restart_game(event=text_data_json)

    async def create_game(self, event):
        PongRoom = apps.get_model('pong', 'PongRoom')
        text_data_json = event
        
        room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
        if await sync_to_async(room_result.exists)():
            await self.send_message({"message": "Room already exists"})
            return
        code = self.room_name
        room = PongRoom(code=code, players_id=[self.scope["session"].session_key], player_limit=text_data_json["nb_players"])
        await sync_to_async(room.save)()
        await self.send_message({"message": "Room Created!"})

    async def join_game(self, event):
        PongRoom = apps.get_model('pong', 'PongRoom')
        code = self.room_name
        room_result = await sync_to_async(PongRoom.objects.filter)(code=code)
        
        if not await sync_to_async(room_result.exists)():
            await self.send_message({"message": "Room not found"})
        else:
            room = await sync_to_async(room_result.__getitem__)(0)
            players = room.players_id
            players_count = len(players)
            if players_count < room.player_limit:
                await sync_to_async(room.players_id.append)(self.scope["session"].session_key)
                await sync_to_async(room.save)()
                if players_count == 0:
                    await self.send_message({"message" : {"type" : "join_game", "side": "left"}})
                else:
                    await self.send_message({"message" : {"type" : "join_game", "side": "right"}})
            else:
                await self.send_message({"message" : {"type" : "join_game", "side": "spectator"}})

    async def restart_game(self, event):
        PongRoom = apps.get_model('pong', 'PongRoom')
        room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
        if not await sync_to_async(room_result.exists)():
            await self.send_message({"message": "Room not found"})
            return
        room = await sync_to_async(room_result.__getitem__)(0)

        room.restart = True
        room.pause = False
        await asyncio.sleep(1.5)
        self.start_game(event=event)

    async def pause_game(self, event):
        PongRoom = apps.get_model('pong', 'PongRoom')
        room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
        if not await sync_to_async(room_result.exists)():
            await self.send_message({"message": "Room not found"})
            return
        room = await sync_to_async(room_result.__getitem__)(0)
        room.pause = not room.pause

    async def update_paddle(self, event):
        PongRoom = apps.get_model('pong', 'PongRoom')
        room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
        if not await sync_to_async(room_result.exists)():
            await self.send_message({"message": "Room not found"})
            return
        room = await sync_to_async(room_result.__getitem__)(0)
        text_data_json = event
        
        #todo check user permissions
        request_session = self.scope["session"].session_key
        if request_session not in room.players_id:
            await self.send_message({"message": "You are not a player"})
            return
        elif room.pause:
            return

        if text_data_json["side"] == "left" and request_session == room.players_id[0]:
            if text_data_json["direction"] == "up" and room.left_paddle_position > 0:
                room.left_paddle_position = room.left_paddle_position - 10
            elif text_data_json["direction"] == "down" and room.left_paddle_position < 300:
                room.left_paddle_position = room.left_paddle_position + 10
        elif text_data_json["side"] == "right" and request_session == room.players_id[1]:
            if text_data_json["direction"] == "up" and room.right_paddle_position > 0:
                room.right_paddle_position = room.right_paddle_position - 10
            elif text_data_json["direction"] == "down" and room.right_paddle_position < 300:
                room.right_paddle_position = room.right_paddle_position + 10
        else:
            await self.send_message({"message": "Invalid paddle update request"})
            return
        await sync_to_async(room.save)()

    async def start_game(self, event):
        PongRoom = apps.get_model('pong', 'PongRoom')
        room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
        if not await sync_to_async(room_result.exists)():
            await self.send_message({"message": "Room not found"})
            return
        request_session = self.scope["session"].session_key
        room = await sync_to_async(room_result.__getitem__)(0)
        if request_session not in room.players_id:
            await self.send_message({"message": "You are not a player"})
            return
        await self.channel_layer.group_send(
                    self.room_group_name, {"type": "send_message", "message":  {"type":"game_start"}}
        )
        asyncio.ensure_future(game_loop(self=self, event=event))


    # Receive a message to send to the client
    async def send_message(self, event):

        # Send message to WebSocket
        await self.send(text_data=json.dumps(event["message"]))