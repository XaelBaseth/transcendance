from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import redirect
from django.conf import settings
import requests
from django.conf import settings
from .models import AppUser 
from .serializers import UserSerializer

# Create your views here.

from django.http import HttpResponse, JsonResponse

def home(request):
    return HttpResponse("Welcome to the home page!")

class CreateUserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class Initiate42Login(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        redirect_uri = request.build_absolute_uri('/callback')
        authorization_url = (
            f"{settings.API_AUTH_URL}?client_id={settings.API_CLIENT_ID}&redirect_uri={redirect_uri}&response_type=code"
        )
        return redirect(authorization_url)

class Register42(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.query_params.get('code')
        if not code:
            return Response({"error": "Missing authorization code"}, status=status.HTTP_400_BAD_REQUEST)

        redirect_uri = request.build_absolute_uri()

        # Exchange the authorization code for an access token
        token_response = requests.post(
            settings.API_TOKEN_URL,
            data={
                'grant_type': 'authorization_code',
                'client_id': settings.API_CLIENT_ID,
                'client_secret': settings.API_CLIENT_SECRET,
                'code': code,
                'redirect_uri': redirect_uri,
            }
        )

        if token_response.status_code != 200:
            return Response({"error": "Failed to obtain access token", "details": token_response.json()}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_response.json().get('access_token')
        if not access_token:
            return Response({"error": "No access token found in response"}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve user information using the access token
        user_info_response = requests.get(
            settings.API_INFO_URL,
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if user_info_response.status_code != 200:
            return Response({"error": "Failed to retrieve user information", "details": user_info_response.json()}, status=status.HTTP_400_BAD_REQUEST)

        user_info = user_info_response.json()
        
        # Process the user information (e.g., create user account)
        # Example response
        return Response({"connected": True, "user_info": user_info})
