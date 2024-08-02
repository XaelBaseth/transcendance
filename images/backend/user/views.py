from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserUpdateSerializer, UserRegisterSerializer, UserLoginSerializer, UserSerializer, HistorySerializer, ServerSerializer, FriendListSerializer
from rest_framework import permissions, status
from rest_framework.decorators import authentication_classes
from .validations import custom_validation, validate_email, validate_password
from . models import HistoryModel, GameServerModel, WaitingPlayerModel
from django.db.models import Q
from . utils import *
from django.middleware.csrf import get_token
import sys
import json
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.authtoken.models import Token
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

class UserProfileUpdate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        clean_data = custom_validation(request.data)
        serializer = UserUpdateSerializer(user, data=clean_data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

 
class UpdateUserInfo(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser
        logger = logging.getLogger(__name__)

        data = request.data
        user_id = data.get("userId")
        user_obj = AppUser.objects.get(pk=user_id)
        if user_obj:
            # Update username
            try:
                username = data.get("username")
                if username != "":
                    user_obj.username = username
            except:
                pass
            # Update password
            try:
                password = data.get("password")
                if password != "" and len(password) >= 8:
                    user_obj.set_password(password)
            except:
                pass
            # Update image
            try:
                image = request.FILES['file']
                if image:
                    user_obj.image.save(image.name, image)
            except:
                pass
            user_obj.save()
            return Response({"message": "Info updated successfuly"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Info update failed"}, status=status.HTTP_200_OK)

class UpdateUserOption(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger = logging.getLogger(__name__)

        data = request.data

        userId = data.get('userId')
        logger.info('\n\n\nuserId: %s', userId)
        language = data.get('language')
        logger.info('language: %s', language)
        color = data.get('color')
        logger.info('color: %s', color)
        music = data.get('music')
        logger.info('music: %s', music)
        key1 = data.get('key1')
        logger.info('key1: %s', key1)
        key2 = data.get('key2')
        logger.info('key2: %s', key2)
        key3 = data.get('key3')
        logger.info('key3: %s', key3)
        key4 = data.get('key4')
        logger.info('key4: %s', key4)
        
        try:
            from . models import AppUser
            user_obj = AppUser.objects.get(pk=userId)
            if user_obj:
                logger.info('USER_OBJ: %s\n\n\n', str(user_obj))
                user_obj.language = language
                user_obj.color = color
                user_obj.music = music
                user_obj.key1 = key1
                user_obj.key2 = key2
                user_obj.key3 = key3
                user_obj.key4 = key4
                user_obj.save()
            return Response({'message': 'User statistics updated successfully'})
        except Exception as e:
            logger.info('ERROR: %s\n\n\n', e)
            return Response({'message': 'User update failed', 'error': str(e)})

# Get all match history from a user
class HistoryView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        data = request.data
        user_id = data.get("userId")
        history_object = HistoryModel.objects.filter(userId=user_id)
        serializer = HistorySerializer(history_object, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Add player to a waiting queue
class JoinQueue(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        user_id = data.get("userId")
        WaitingPlayerModel.objects.create(player_id=user_id)
        return Response({'message': 'You have joined the queue.'}, status=status.HTTP_200_OK)

# Start new game
import logging
class CheckJoinGame(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        logger = logging.getLogger(__name__)
        ManageGameQueue()
        data = request.data
        user_id = data.get("userId")
        game_server = GameServerModel.objects.filter(Q(firstPlayerId=user_id) | Q(secondPlayerId=user_id)).first()
        if game_server:
            if (game_server.state == 'full'):
                return Response({'gameId': game_server.serverId}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Searching for a game.'}, status=status.HTTP_200_OK)
            # send server name to client to start the game
        else:
            return Response({'message': 'Searching for a game.'}, status=status.HTTP_200_OK)
            # send 'in queue'

class ExitQueue(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger = logging.getLogger(__name__)
        data = request.data
        user_id = data.get("userId")
        game_server = GameServerModel.objects.get(Q(firstPlayerId=user_id) | Q(secondPlayerId=user_id))
        try:
            waiting_player = WaitingPlayerModel.objects.get(player_id=user_id)
            if waiting_player:
                waiting_player.delete()
        except:
            pass
        if game_server:
            if int(game_server.firstPlayerId) == int(user_id):
                game_server.firstPlayerId = -1
            if int(game_server.secondPlayerId) == int(user_id):
                game_server.secondPlayerId = -1
            game_server.state = 'waiting'
            game_server.save()
        return Response({"message": 'You left the queue'}, status=status.HTTP_200_OK)
    
class AddFriend(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser
        logger = logging.getLogger(__name__)

        try:
            data = request.data
            friend_id = data.get("friendId")
            friend_obj = AppUser.objects.get(pk=friend_id)
            if not friend_obj:
                return Response({"error": "User doesn't exist"}, status=status.HTTP_200_OK)
            if friend_obj:
                user_id = data.get("userId")
                user_obj = AppUser.objects.get(pk=user_id)
                if user_obj:
                    if int(user_id) != int(friend_id):
                        if int(friend_id) not in user_obj.friends_list:
                            user_obj.friends_list.append(friend_id)
                    user_obj.save()
                else:
                    return Response({"message": "Friend already added"}, status=status.HTTP_200_OK)
                return Response({"message": "'" + friend_obj.username + "#" + str(friend_obj.user_id) + "' added to friend list"}, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"message": "User doesn't exist"}, status=status.HTTP_200_OK)
        

class RemoveFriend(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser
        logger = logging.getLogger(__name__)

        data = request.data
        user_id = data.get("userId")
        friend_id = data.get("friendId")
        user_obj = AppUser.objects.get(pk=user_id)
        if user_obj:
            if friend_id in user_obj.friends_list:
                user_obj.friends_list.remove(friend_id)
            user_obj.save()
            return Response({"message": "Friend deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Can't find user"}, status=status.HTTP_200_OK)
        

class GetFriendList(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser
        logger = logging.getLogger(__name__)
        data = request.data
        user_id = data.get("userId")
        user_obj = AppUser.objects.get(pk=user_id)
        friend_data = []
        if user_obj:
            for friend_id in user_obj.friends_list:
                friend = AppUser.objects.get(pk=friend_id)
                if friend :
                    friend_data.append(FriendListSerializer(friend).data)
            return Response({"friend_list": friend_data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Can't find user in database"})
        

class Register42(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from django.shortcuts import redirect
        from django.contrib.auth import login as django_login
        # Traitez les informations reçues ici
        data = request.data

        code_value = data.get('code')
        # print("\n\ncode_value :", code_value,file=sys.stderr)
        # server_url = request.build_absolute_uri('/register42')
        host_without_port = request.get_host().split(':')[0]
        
        # Génération de l'URL avec le port 8000
        server_url = 'https://' + host_without_port + ':8000/register42'
        
        # Faire ce que vous voulez avec l'URL du serveur
        # print("\n\n\nURL du serveur :", server_url,file=sys.stderr)
        
        import requests
        from . models import AppUser
        files = {
            'grant_type': 'authorization_code',
            'client_id': settings.API_CLIENT_ID,
            'client_secret': settings.API_CLIENT_SECRET,
            'code': code_value,
            'redirect_uri': server_url,
        }

        # print("\n\n", files, file=sys.stderr)
        # print("\n\n", file=sys.stderr)
        response = requests.post(settings.API_TOKEN_URL, data=files)
        # print("response: ",response, file=sys.stderr)
        if (response.status_code != status.HTTP_200_OK):
            return Response(status=status.HTTP_400_BAD_REQUEST, data=response.json())
       
        access_token = response.json().get('access_token')
        # print("\n",access_token, '\n', file=sys.stderr)
        if (access_token is not None):
            inf = requests.get(settings.API_INFO_URL, params={'access_token': access_token})
            if (inf.status_code == status.HTTP_200_OK):
                login = inf.json().get('login')
                mail = inf.json().get('email')
                # print("\n\n login ", login, " email ", mail, file=sys.stderr)

                user_exists = AppUser.objects.filter(email=mail).exists()
                if not user_exists:
                    from django.contrib.auth import authenticate
                    # Créer un nouvel utilisateur
                    user = AppUser.objects.create_user(username=login, email=mail, password=settings.API_DEFAULT_PASSWORD)
                    
                    user = authenticate(username=mail, password=settings.API_DEFAULT_PASSWORD)
                    try:
                        user_obj = AppUser.objects.get(email=data.get("email"))
                        if user_obj:
                            user_obj.isOnline = True
                            user_obj.save()
                    except Exception as error:
                        pass
                    token = create_user_token(user)

                    return Response(json.dumps({"token": token.key}), status=status.HTTP_200_OK)
                else:
                    from django.contrib.auth import authenticate
                    # Récupérer l'utilisateur existant
                    
                    user = AppUser.objects.get(email=mail)
                    user = authenticate(username=mail, password=settings.API_DEFAULT_PASSWORD)
                    
                    try:
                        user_obj = AppUser.objects.get(email=data.get("email"))
                        if user_obj:
                            user_obj.isOnline = True
                            user_obj.save()
                    except Exception as error:
                        pass
                    token = create_user_token(user)

                    return Response(json.dumps({"token": token.key}), status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=inf.json())

# register42      user = AppUser.objects.get(pk=email)

class URL42(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        lien = settings.API_CONNECT_URL
        return Response({"URL42": lien}, status=status.HTTP_200_OK)

# from django.shortcuts import render, redirect, get_object_or_404
# from django.http import HttpResponse
# from .models import FriendList, FriendRequest
# from django.contrib.auth.models import User
# from django.urls import reverse
# from .forms import CreateUserForm, ProfileForm
# from django.contrib.auth.forms import PasswordChangeForm
# from django.contrib.auth import update_session_auth_hash
# from django.contrib import messages
# from django.contrib.auth import authenticate, login, logout
# from django.contrib.auth.decorators import login_required
# from .decorators import unauthenticated_user
# # Create your views here.

# @login_required(login_url='login')
# def index(request):
#     return render(request, 'build/frontend/src/pages/home.tsx')

# @login_required
# def profile(request):
#     if request.method == 'POST':
#         profile_form = ProfileForm(request.POST, request.FILES, instance=request.user.profile, user=request.user)
#         password_form = PasswordChangeForm(user=request.user, data=request.POST)
        
#         if 'save_profile' in request.POST:
#             if profile_form.is_valid():
#                 profile_form.save()
#                 username = request.user.username
#                 messages.success(request, f'{username}, Your profile is updated.')
#                 return redirect('home')  # Redirige vers la page d'accueil après la mise à jour du profil

#         elif 'change_password' in request.POST:
#             if password_form.is_valid():
#                 user = password_form.save()
#                 update_session_auth_hash(request, user)  # Important, pour garder l'utilisateur connecté après le changement de mot de passe
#                 messages.success(request, 'Your password was successfully updated!')
#                 return redirect('profile')  # Redirige vers la page de profil après la mise à jour du mot de passe
#             else:
#                 messages.error(request, 'Please correct the error below.')

#     else:
#         profile_form = ProfileForm(instance=request.user.profile, user=request.user)
#         password_form = PasswordChangeForm(user=request.user)

#     # Ajouter la liste des utilisateurs et des demandes d'ami
#     users = User.objects.exclude(id=request.user.id)
#     friend_requests = FriendRequest.objects.filter(receiver=request.user, is_active=True)

#     context = {
#         'form': profile_form,
#         'password_form': password_form,
#         'users': users,
#         'friend_requests': friend_requests,
#     }
#     return render(request, 'build/frontend/src/pages/profile.tsx', context)
# # def profile(request):
# #     if request.method == 'POST':
# #         profile_form = ProfileForm(request.POST, request.FILES, instance=request.user.profile, user=request.user)
# #         password_form = PasswordChangeForm(user=request.user, data=request.POST)
        
# #         if 'save_profile' in request.POST:
# #             if profile_form.is_valid():
# #                 profile_form.save()
# #                 username = request.user.username
# #                 messages.success(request, f'{username}, Your profile is updated.')
# #                 return redirect('home')  # Redirige vers la page d'accueil après la mise à jour du profil

# #         elif 'change_password' in request.POST:
# #             if password_form.is_valid():
# #                 user = password_form.save()
# #                 update_session_auth_hash(request, user)  # Important, pour garder l'utilisateur connecté après le changement de mot de passe
# #                 messages.success(request, 'Your password was successfully updated!')
# #                 return redirect('profile')  # Redirige vers la page de profil après la mise à jour du mot de passe
# #             else:
# #                 messages.error(request, 'Please correct the error below.')

# #     else:
# #         profile_form = ProfileForm(instance=request.user.profile, user=request.user)
# #         password_form = PasswordChangeForm(user=request.user)

# #     context = {'form': profile_form, 'password_form': password_form}
# #     return render(request, 'profileapp/profile.html', context)

# @unauthenticated_user
# def login_user(request):

#     if request.method == 'POST':
#         username = request.POST.get('username')
#         password = request.POST.get('password')

#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             messages.info(request, f'{username}, You are logged in.')
#             return redirect("/")
#         else:
#             messages.info(request, 'Wrong passwrod or username')
#             return redirect('login')
#     return render(request, 'build/frontend/src/pages/login.tsx')

# @unauthenticated_user
# def register_user(request):
#     form = CreateUserForm()

#     if request.method == 'POST':
#         form = CreateUserForm(request.POST)
#         if form.is_valid():
#             form.save()
#             messages.info(request, 'Account is created.')
#             return redirect('login')
#         else:
#             context = {'form': form}
#             messages.info(request, 'Invalid credentials')
#             return render(request, 'build/frontend/src/pages/signUp.tsx', context)

#     context = {'form': form}
#     return render(request, 'build/frontend/src/pages/signUp.tsx', context)

# @login_required(login_url='login')
# def logout_user(request):
#     logout(request)
#     messages.info(request, 'You logged out successfully')
#     return redirect('login')

# @login_required
# def send_friend_request(request, receiver_id):
#     receiver = get_object_or_404(User, id=receiver_id)
    
#     if request.method == 'POST':
#         if receiver != request.user:  # Assurez-vous que l'utilisateur ne peut pas s'envoyer une demande à lui-même
#             # Vérifiez si une demande similaire existe déjà
#             existing_request = FriendRequest.objects.filter(sender=request.user, receiver=receiver, is_active=True).first()
#             if not existing_request:
#                 # Créer une nouvelle demande d'ami avec is_active=True
#                 FriendRequest.objects.create(sender=request.user, receiver=receiver, is_active=True)
#                 messages.success(request, f"Friend request sent to {receiver.username}.")
#             else:
#                 messages.warning(request, f"You have already sent a friend request to {receiver.username}.")
#         else:
#             messages.error(request, "You cannot send a friend request to yourself.")

#     return redirect(reverse('profile'))  # Redirigez vers la page de profil après avoir envoyé la demande d'ami

# @login_required
# # def accept_friend_request(request, request_id):
# #     friend_request = get_object_or_404(FriendRequest, id=request_id)

# #     # Vérifie si l'utilisateur connecté est le destinataire de la demande d'ami
# #     if friend_request.receiver == request.user:
# #         friend_request.accept()
# #         messages.success(request, 'Friend request accepted.')
# #     else:
# #         messages.error(request, 'You cannot accept this friend request.')

# #     # Redirige vers le profil de l'utilisateur qui a envoyé la demande d'ami
# #     return redirect('profile', user_id=friend_request.sender.id)
# @login_required
# def accept_friend_request(request, request_id):
#     friend_request = get_object_or_404(FriendRequest, id=request_id)
#     if friend_request.receiver == request.user:
#         friend_request.accept()
#         messages.success(request, f'You have accepted the friend request from {friend_request.sender.username}')
#     return redirect('profile')

# @login_required
# def decline_friend_request(request, request_id):
#     friend_request = get_object_or_404(FriendRequest, id=request_id)
#     if friend_request.receiver == request.user:
#         friend_request.decline()
#         messages.success(request, f'You have declined the friend request from {friend_request.sender.username}')
#     return redirect('profile')

# # from rest_framework import generics
# # from rest_framework.permissions import IsAuthenticated, AllowAny
# # from .models import AppUser 
# # from .serializers import UserSerializer

# # # Create your views here.

# # from django.http import HttpResponse

# # def home(request):
# #     return HttpResponse("Welcome to the home page!")

# # class CreateUserView(generics.CreateAPIView):
# #     queryset = AppUser.objects.all()
# #     serializer_class = UserSerializer
# #     permission_classes = [AllowAny]













