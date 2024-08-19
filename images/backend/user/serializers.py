from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import AppUser, Friendship, MatchHistory

UserModel = get_user_model()

# class UserUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AppUser
#         fields = ['username', 'email', 'password','avatar']
#         extra_kwargs = {'password': {'write_only': True}}

#     def update(self, instance, validated_data):
#         password = validated_data.pop('password', None)
#         instance = super().update(instance, validated_data)
#         if password:
#             instance.set_password(password)
#             instance.save()
#         return instance

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'
    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(email=clean_data['email'], username=clean_data['username'],
                                                 password=clean_data['password'])
        user_obj.save()
        return user_obj

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(username=clean_data['email'],
                            password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('user_id', 'email', 'username', 'avatar', 'wins', 'losses', 'is_online')
        read_only_fields = ('user_id', 'email', 'wins', 'losses', 'is_online')
        
    def update_avatar(self, instance, validated_data):
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance

class FriendshipSerializer(serializers.ModelSerializer):
    friend = UserSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = ('id', 'friend', 'created_at')

class MatchHistorySerializer(serializers.ModelSerializer):
    player1 = UserSerializer(read_only=True)
    player2 = UserSerializer(read_only=True)
    winner = UserSerializer(read_only=True)

    class Meta:
        model = MatchHistory
        fields = ('id', 'player1', 'player2', 'winner', 'date', 'score')
