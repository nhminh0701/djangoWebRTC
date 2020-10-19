from django.shortcuts import render, redirect
import uuid

# Create your views here.
def index(request):
    return redirect('chat-room', roomId=uuid.uuid4())


def video_call(request):
    return redirect('video-call-room', roomId=uuid.uuid4())


def chat_room(request, roomId):
    context = {
        'roomId': roomId
    }
    return render(request, 
        'videostream/chat.html', context)


def video_call_room(request, roomId):
    context = {
        'roomId': roomId
    }
    return render(request, 
        'videostream/video_call.html', context)