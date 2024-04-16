from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AppUser 
from .serializers import UserSerializer

from django.http import HttpResponse
from django.views.decorators.http import require_POST
import json

# Create your views here.

@require_POST
def signup(request):
    #Accept the POST from the frontend
    data = json.loads(request.body)
    new_username = data.get('username')
    password = data.get('password')
    
    try:
        response = signUp(new_username, password)
        return JsonResponse({'message': 'User signed up successfully!'})
    except Exception as e:
    	return JsonResponse({'error': str(e)}, status=400)

def login(request):
    #Implement logic here
    return HttpResponse("<h1>Hello, World login!</h1>")

@api_view(['GET'])
def get_users(request):
    users = AppUser.objects.all()
    serializers = UserSerializer(users, many=True)
    return Response(serializers.data)