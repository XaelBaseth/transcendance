from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import AppUser 
from .serializers import UserSerializer

# Create your views here.

from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the home page!")

class CreateUserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
