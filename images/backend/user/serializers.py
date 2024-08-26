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
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('username', 'email', 'bio', 'avatar', 'current_password', 'new_password')
    
    def update(self, instance, validated_data):
        if 'current_password' in validated_data:
            print("here:",validated_data)
            if not instance.check_password(validated_data['current_password']):
                raise serializers.ValidationError({"current_password": "Wrong password."})
            if 'new_password' in validated_data:
                instance.set_password(validated_data['new_password'])
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.save()
        return instance

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            user = UserModel.objects.create_user(
                email=validated_data['email'],
                username=validated_data['username'],
                password=validated_data['password']
            )
            return user
        except Exception as e:
            raise serializers.ValidationError(f"Error creating user: {str(e)}")

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
        fields = ('id', 'user_id', 'email', 'username', 'avatar', 'wins', 'losses', 'is_online')
        read_only_fields = ('id', 'user_id', 'email', 'wins', 'losses', 'is_online')

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
