from django.shortcuts import render, redirect
import uuid

# Create your views here.
def index(request):
    return redirect('room', roomId=uuid.uuid4())

def room(request, roomId):
    context = {
        'roomId': roomId
    }
    return render(request, 
        'videostream/index.html', context)