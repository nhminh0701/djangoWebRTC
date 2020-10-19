import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import uuid

class ChatStreamConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        msg_type = text_data_json['type']
        if msg_type == 'login':
            self.room_group_name = self.scope['url_route']['kwargs']['room_id']
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )
            
            self.send(text_data=json.dumps({
                'success': True,
                'type': 'login',
            }))

        else:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'channel_name': self.channel_name,
                    'type': 'handle_msg',
                    'text_data_json': text_data_json
                }
            )


    def handle_msg(self, event):
        sender_channel = event['channel_name']
        if self.channel_name != sender_channel:
            self.send(text_data=json.dumps(event['text_data_json']))

