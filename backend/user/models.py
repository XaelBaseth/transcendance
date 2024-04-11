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

class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=20, default="Jouez a ff14")
    def __str__(self):
        return f"ID: {self.user_id}| EMAIL: {self.email} | USERNAME: {self.username}"

    ## BUILD ONLY, YOU HAVE TO UNDERSTAND HOW TO DELETE IT
  # Specify related_name to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="app_user_set", # Add this line
        related_query_name="app_user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="app_user_set", # Add this line
        related_query_name="app_user",
    )