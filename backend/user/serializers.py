from rest_framework import serializers
from .models import AppUser
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['user_id', 'email', 'password', 'username', 'created_at',
                   'bio', 'aces', 'score', 'rank', 'is_active']
        extra_kwargs = {"password": {"write_only":True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user