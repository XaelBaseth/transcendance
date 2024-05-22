from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .jwt_utils import generate_jwt
from django.http import HttpResponse
from .models import AppUserManager


User = get_user_model()

def home(request):
     return HttpResponse("Welcome to the home page!")


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()  # Utilisation du modèle d'utilisateur par défaut
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            print(type(user))

            # Générer un JWT pour le nouvel utilisateur
            jwt_token = generate_jwt(user.pk, user.username, 'user')


            # Vous pouvez également générer un token d'actualisation si nécessaire
            refresh = RefreshToken.for_user(user)

            response_data = {
                'user': serializer.data,
                'jwt_token': jwt_token,
                'refresh': str(refresh),  # Convertir le token d'actualisation en chaîne de caractères
                'access': str(refresh.access_token),  # Convertir le token d'accès en chaîne de caractères
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RetrieveUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# from rest_framework import generics
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from .models import AppUser
# from .serializers import UserSerializer
# from django.http import HttpResponse
# from django.contrib.auth import get_user_model
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.response import Response
# from rest_framework import status



# User = get_user_model()

# def home(request):
#     return HttpResponse("Welcome to the home page!")

# class CreateUserView(generics.CreateAPIView):
#     queryset = AppUser.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]
    
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             refresh = RefreshToken.for_user(user)
#             response_data = {
#                 'user': serializer.data,
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }
#             return Response(response_data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# class RetrieveUserView(generics.RetrieveAPIView):
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]

#     def get_object(self):
#         return self.request.user
