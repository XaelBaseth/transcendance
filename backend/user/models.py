from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.core.mail import send_mail
import random, string

# Create your models here.


					#####################
					#					#
					#		USER		#
					#					#
					#####################

class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password, two_fa=False):
        if not username:
            raise ValueError("A username is required.")
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, password=password, two_fa=two_fa)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, email, username, password):
        if not email:
            raise ValueError("An email is required.")
        if not password:
            raise ValueError('A password is required.')
        if not username:
            raise ValueError("A username is required.")
        email = self.normalize_email(email)
        user = self.create_user(email=email, username=username, password=password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user

class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=20, default="username", unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True)

    aces = models.IntegerField(default=0)
    score = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    two_fa = models.BooleanField(default=False)

    REQUIRED_FIELDS = ()
    USERNAME_FIELD = 'username'
    objects = AppUserManager()
    def __str__(self):
        return self.username



					#####################
					#					#
					#		OTP			#
					#					#
					#####################
    
def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class TwoFactorEmailModel(models.Model):
    code = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    expiration = models.DateTimeField(default=timezone.now() + timezone.timedelta(hours=2))
    user = models.ForeignKey(to='user.AppUser', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.code = generate_code()
        return super().save()

    def send_two_factor_email(self, subject, body):
        send_mail(subject, body, 'noreply@example.com', [self.user.email])