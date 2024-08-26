from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
import datetime
import django

# Create your models here.

class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)

# class AppUser(AbstractBaseUser, PermissionsMixin):
# 	user_id = models.AutoField(primary_key=True)
# 	email = models.EmailField(max_length=50, unique=True)
# 	username = models.CharField(max_length=50, default="username")
# 	is_staff = models.BooleanField(default=False)
# 	USERNAME_FIELD = 'email'
# 	REQUIRED_FIELDS = ['username']
# 	objects = AppUserManager()
# 	def __str__(self):
# 		return f"ID : {self.user_id} | EMAIL : {self.email} |  USERNAME : {self.username}"

class AppUser(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    avatar = models.ImageField(upload_to='media/', null=True, blank=True)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    is_online = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = AppUserManager()

    def __str__(self):
        return self.username

class Friendship(models.Model):
    user = models.ForeignKey(AppUser, related_name='friendships', on_delete=models.CASCADE)
    friend = models.ForeignKey(AppUser, related_name='friends', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')

class MatchHistory(models.Model):
    player1 = models.ForeignKey(AppUser, related_name='matches_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(AppUser, related_name='matches_as_player2', on_delete=models.CASCADE)
    winner = models.ForeignKey(AppUser, related_name='matches_won', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    score = models.CharField(max_length=20)  # e.g., "3-2"

    def __str__(self):
        return f"{self.player1} vs {self.player2} - {self.date}"
