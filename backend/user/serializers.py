from rest_framework import serializers
from .models import AppUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['user_id', 'email', 'password', 'username', 'created_at',
                   'bio', 'aces', 'score', 'rank', 'is_active', 'two_fa']
        extra_kwargs = {"password": {"write_only":True}, "two_fa": {"required": False}}
    
    def create(self, validated_data):
        print(validated_data)
        two_fa = validated_data.pop('two_fa', False)
        user = AppUser.objects.create_user(**validated_data)
        return user