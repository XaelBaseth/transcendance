from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import AppUser 
from .serializers import UserSerializer

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]