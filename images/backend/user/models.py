from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
import datetime
import django

# Create your models here.

class AppUserManager(BaseUserManager):
	def create_user(self, email, username, password):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		email = self.normalize_email(email)
		user = self.model(email=email, username=username, password=password)
		user.set_password(password)
		user.save()
		return user
	def create_superuser(self, email, username, password):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		user = self.create_user(email=self.normalize_email(email), username=username, password=password)
		user.is_superuser = True
		user.is_staff = True
		user.save()
		return user

class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50, unique=True)
    is_staff = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
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
