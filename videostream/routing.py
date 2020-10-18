from django.urls import re_path
from videostream import consumers

websocket_urlpatterns = [
    re_path(r'ws\/videostream\/(?P<room_id>.+)\/$', consumers.VideoStreamConsumer),
]