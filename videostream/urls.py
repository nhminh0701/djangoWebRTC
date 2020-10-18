from django.urls import path
from videostream import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<roomId>/', views.room, name='room'),
]