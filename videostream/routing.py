from django.urls import re_path
from videostream import consumers

websocket_urlpatterns = [
    re_path(r'ws\/chat\/(?P<room_id>.+)\/$', consumers.ChatStreamConsumer),
]