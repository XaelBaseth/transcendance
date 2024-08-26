from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions, status
from rest_framework.decorators import authentication_classes
from .validations import custom_validation, validate_email, validate_password
from django.db.models import Q
from django.middleware.csrf import get_token
from django.http import HttpResponse
import json
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import AppUser, Friendship, MatchHistory
from .serializers import UserSerializer, FriendshipSerializer, MatchHistorySerializer
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
import logging
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

def home(request):
    return HttpResponse("Welcome to the home page!")

class UserRootView(APIView):
    def get(self, request):
        return Response({
            "message": "Welcome to the User API",
            "endpoints": {
                "register": "/api/user/register/",
                "login": "/api/user/login/",
                "logout": "/api/user/logout/",
                "profile": "/api/user/profile/",
                "update_profile": "/api/user/profile/update/",
                "delete_account": "/api/user/profile/delete/",
                "friend_request": "/api/user/friends/request/",
                "friend_list": "/api/user/friends/",
                "match_history": "/api/user/match-history/",
                "change_avatar": "/api/user/change-avatar/"
            }
        })
        
    
# Post request to create a new user
logger = logging.getLogger(__name__)

class UserRegister(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            clean_data = custom_validation(request.data)
            serializer = UserRegisterSerializer(data=clean_data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.create(clean_data)
                if user:
                    return Response(None, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in UserRegister: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Post request to change user avatar
class ChangeAvatar(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request):
        user = request.user
        avatar = request.data.get('avatar')
        if avatar:
            user.avatar = avatar
            user.save()
            return Response(UserSerializer(user).data)
        return Response({'error': 'No avatar provided'}, status=status.HTTP_400_BAD_REQUEST)

# Post request to login user
@method_decorator(csrf_exempt, name='dispatch')
class UserLogin(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)

# Post request to logout user
class UserLogout(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logger = logging.getLogger(__name__)

        try:
            data = request.data
            user_id = data.get("userId")
            from . models import AppUser
            user_obj = AppUser.objects.get(pk=user_id)
            if user_obj:
                user_obj.isOnline = False
                user_obj.save()
        except Exception as error:
            pass
        
        try:
            request.user.auth_token.delete()
        except Exception as error:
            logger.info("LOGOUT ERRROR : %s", error)

        logout(request)
        return Response(status=status.HTTP_200_OK)

# Get info of user connected
@method_decorator(csrf_exempt, name='dispatch')
class UserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if not request.user.is_authenticated:
            raise Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class DeleteAccountView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@method_decorator(csrf_exempt, name='dispatch')
class UpdateProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        friend_id = request.data.get('friend_id')
        friend = get_object_or_404(AppUser, pk=friend_id)
        friendship, created = Friendship.objects.get_or_create(user=request.user, friend=friend)
        if created:
            return Response({'message': 'Friend request sent'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Already friends'}, status=status.HTTP_200_OK)

class FriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        friendships = Friendship.objects.filter(user=request.user)
        serializer = FriendshipSerializer(friendships, many=True)
        return Response(serializer.data)

class MatchHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        matches = MatchHistory.objects.filter(player1=request.user) | MatchHistory.objects.filter(player2=request.user)
        serializer = MatchHistorySerializer(matches, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MatchHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
