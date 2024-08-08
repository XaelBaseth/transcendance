from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from rest_framework.decorators import authentication_classes
from .validations import custom_validation, validate_email, validate_password
from django.db.models import Q
from django.middleware.csrf import get_token
import sys
import json
from django.conf import settings
#from ..GameServer import test

# Create your views here.

# Post request to create a new user
@authentication_classes([])
class UserRegister(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response(None, status=status.
                                HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

# Post request to login user
@authentication_classes([])
class UserLogin(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        logger = logging.getLogger(__name__)
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)

            try:
                from . models import AppUser
                user_obj = AppUser.objects.get(email=data.get("email"))
                if user_obj:
                    user_obj.isOnline = True
                    user_obj.save()
            except Exception as error:
                pass

            token = create_user_token(user)
            return Response(json.dumps({"token": token.key}), status=status.HTTP_200_OK)

# Post request to logout user
class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]

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
            logger.info("LOGOUT ERRRO : %s", error)

        logout(request)
        return Response(status=status.HTTP_200_OK)

# Get info of user connected
class UserView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        try:
            logger = logging.getLogger(__name__)
            serializer = UserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'user': "You are not connected"}, status=status.HTTP_200_OK)

class UserDelete(APIView):
    permission_classes = [permissions.AllowAny]
    
    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=status.HTTP_200_OK, headers={'Access-Control-Allow-Origin':'*'})
        except User.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST, headers={'Access-Control-Allow-Origin':'*'})
