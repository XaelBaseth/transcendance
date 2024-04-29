from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AppUser 
from .serializers import UserSerializer

from django.http import JsonResponse

# Create your views here.

def testbackend(request):
	return JsonResponse({"message":"Back is working"})