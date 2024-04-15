from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

# Create your models here.

class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password):
        if not email:
            raise ValueError("An email is required.")
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, password=password)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, email, username, password):
        if not email:
            raise ValueError("An email is required.")
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.create_user(email=email, username=username, password=password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user

class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=20, default="Jouez a ff14")
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AppUserManager()
    def __str__(self):
        return f"ID: {self.user_id}| EMAIL: {self.email} | USERNAME: {self.username}"
