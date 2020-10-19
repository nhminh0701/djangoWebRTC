from django.urls import path
from videostream import views

urlpatterns = [
    path('', views.index, name='index'),
    path('chat/<roomId>/', views.chat_room, name='chat-room'),
    path('video-stream/', 
        views.video_call, name='video-call'),
    path('video-stream/<roomId>/', 
        views.video_call_room, name='video-call-room'),
]