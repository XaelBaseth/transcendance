from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from . models import AppUser

UserModel = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('user_id', 'email', 'username', 'bio', 'avatar', 'total_games', 'victories', 'friends')
        read_only_fields = ('user_id', 'total_games', 'victories', 'friends')

class UserUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = AppUser
        fields = ('username', 'email', 'bio', 'avatar', 'current_password', 'new_password')

    def validate(self, data):
        if 'new_password' in data and not data.get('current_password'):
            raise serializers.ValidationError({"current_password": "Current password is required to set a new password."})
        return data

    def update(self, instance, validated_data):
        if 'current_password' in validated_data:
            if not instance.check_password(validated_data['current_password']):
                raise serializers.ValidationError({"current_password": "Wrong password."})
            if 'new_password' in validated_data:
                instance.set_password(validated_data['new_password'])
        
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance


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
