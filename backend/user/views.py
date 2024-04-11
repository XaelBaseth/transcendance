from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
from .models import AppUser

# Create your views here.

class UserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
