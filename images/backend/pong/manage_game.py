import random
import asyncio
from asgiref.sync import sync_to_async
from django.apps import apps
import datetime


# Faire une partie autonome avec 2 bots
    # Concidérer que le x et y de la balle sont le haut gauche de la balle, et donc tapper les murs bas et droit à BALL_DIAMETER de distance
    # le y du paddle est le haut du paddle
async def game_loop(self, event):
        PongRoom = apps.get_model('pong', 'PongRoom')
        MAP_HEIGHT = 400
        MAP_WIDTH = 600
        BALL_DIAMETER = 20
        BALL_SPEED = 5
        PADDLE_HEIGHT = 100
        TPS = 10

        room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
        room = await sync_to_async(room_result.__getitem__)(0)

        ball_direction = {"x": random.choice([-1, 1]), "y": random.choice([-1, 1])}
        ball_position = {"x": 290.0, "y": 190.0}
        left_paddle_position = 150
        right_paddle_position = 150
        room.pause = False
        await sync_to_async(room.save)()

        await self.channel_layer.group_send(
            self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position,  "timestamp": datetime.datetime.now().isoformat()}}
        )

        while True:
            while room.pause:
                await asyncio.sleep(1)
                room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
                room = await sync_to_async(room_result.__getitem__)(0)
        
            if room.restart:
                room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
                room = await sync_to_async(room_result.__getitem__)(0)
                room.restart = False
                await sync_to_async(room.save)()
                break

            room_result = await sync_to_async(PongRoom.objects.filter)(code=self.room_name)
            room = await sync_to_async(room_result.__getitem__)(0)

            # update paddles from users messages
            if left_paddle_position != room.left_paddle_position:
                left_paddle_position = room.left_paddle_position
                # await self.channel_layer.group_send(
                #     self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
                # )
            if room.player_limit == 2 and right_paddle_position != room.right_paddle_position:
                right_paddle_position = room.right_paddle_position
                # await self.channel_layer.group_send(
                #     self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
                # )
        
            # Ball movement
            ball_position["x"] += (ball_direction["x"] * BALL_SPEED)
            ball_position["y"] += (ball_direction["y"] * BALL_SPEED)

            # Wall collisions
            if ball_position["y"] <= 0 or ball_position["y"] >= MAP_HEIGHT - BALL_DIAMETER:
                ball_direction["y"] = -ball_direction["y"]

            # Paddle collisions
            if ball_position["x"] <= 20 and ball_position["x"] >= 0 and ball_position["y"] <= left_paddle_position + 100 and ball_position["y"] >= left_paddle_position:
                ball_direction["x"] = -ball_direction["x"]
            elif ball_position["x"] >= 560 and ball_position["x"] < 580 and ball_position["y"] <= right_paddle_position + 100 and ball_position["y"] >= right_paddle_position:
                ball_direction["x"] = -ball_direction["x"]
            
            # End of game
            if ball_position["x"] <= 0 or ball_position["x"] >= MAP_WIDTH:
                await self.channel_layer.group_send(
                    self.room_group_name, {"type": "send_message", "message":  {"type":"game_over"}}
                )
                break
            
            if room.player_limit < 2:
                # right paddle AI
                if  ball_direction["x"] > 0 and ball_position["x"] > 300 :
                    if ball_position["y"] > right_paddle_position + (PADDLE_HEIGHT / 2) and right_paddle_position < MAP_HEIGHT - PADDLE_HEIGHT:
                        right_paddle_position += 10
                        # await self.channel_layer.group_send(
                        #     self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
                        # )
                    elif right_paddle_position > 0:
                        right_paddle_position -= 10
                        # await self.channel_layer.group_send(
                        #     self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
                        # )
                else:
                    if right_paddle_position > 150:
                        right_paddle_position -= 10
                        # await self.channel_layer.group_send(
                        #     self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
                        # )
                    elif right_paddle_position < 150:
                        right_paddle_position += 10
                        # await self.channel_layer.group_send(
                        #     self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
                        # )
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "send_message", "message":  {"type":"game_state","ball_position": ball_position, "ball_direction": ball_direction, "right_paddle_position": right_paddle_position, "left_paddle_position": left_paddle_position}}
            )
            await asyncio.sleep(1/TPS)