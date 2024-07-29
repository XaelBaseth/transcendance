from rest_framework import generics, status
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import redirect
from django.conf import settings
import requests
from django.conf import settings
from .models import AppUser 
from .serializers import UserSerializer
from django.http import HttpResponse, JsonResponse
from datetime import datetime


# Create your views here.

def home(request):
    return HttpResponse("Welcome to the home page!")

class CreateUserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@csrf_exempt
def register(request):
    form = AppUser(request.data)
    if form.is_valid():
        form.save()
        return Response({'message': 'Registered successfully'}, status=201)
    return Response(form.errors, status=400)

@api_view(['POST'])
@csrf_exempt
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Logged in successfully'}, status=200)
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'}, status=200)

def _call_api(user_code):
    if user_code is None:
        return None, 'Error on API response'

    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.API_CLIENT_ID,
        'client_secret': settings.API_CLIENT_SECRET,
        'code': user_code,
        'redirect_uri': settings.API_TOKEN_URL,
    }

    response = requests.post('https://api.intra.42.fr/oauth/token', data=data)

    if response.status_code != 200:
        return None, 'Error getting token'

    response = requests.get(
        'https://api.intra.42.fr/v2/me',
        headers={'Authorization': 'Bearer ' + response.json()['access_token']}
    )

    if response.status_code != 200:
        return None, 'Error getting user data'

    jsón = response.json()
    ctx = {
        'username': jsón['login'],
        'email': jsón['email'],
    }

    if jsón.get('image') is None or not jsón['image']['link']:
        ctx['picture_url'] = None
    else:
        ctx['picture_url'] = jsón['image']['link']

    return ctx, None


def _register_intra(request, ctx):
    if AppUser.objects.filter(username=ctx['username']).exists():
        ctx['username'] += str(datetime.now().time().microsecond)
    try:
        pong_user = AppUser.objects.create_user(
            email=ctx['email'],
            username=ctx['username'],
            profile_picture=None
        )
        if ctx['picture_url'] is not None:
            pong_user.profile_picture.save(
                f"{ctx['username']}.png",
               # ContentFile(requests.get(ctx['picture_url']).content)
            )
        pong_user.save()
    except:
        return JsonResponse({'error': 'Error creating user'}, status=400)

    login(request, pong_user)
    return redirect('account')

@api_view(['GET'])
@csrf_exempt
def intra(request):
    ctx, err = _call_api(request.GET.get('code'))
    if err is not None:
        return Response({'error': err}, status=400)
    if AppUser.objects.filter(email=ctx['email']).exists():
        user = AppUser.objects.get(email=ctx['email'])
        login(request, user)
        return Response({'message': 'Logged in successfully'}, status=200)
    return _register_intra(request, ctx)

@api_view(['GET'])
@csrf_exempt
def intra_confirm(request):
    return Response({'redirect_url': os.getenv('INTRA_LINK')}, status=200)