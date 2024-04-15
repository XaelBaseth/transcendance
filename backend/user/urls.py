from django.urls import path
from . import views

urlpatterns = [
    path('auth/signup', views.signup, name='register'),
    path('auth/login', views.login, name='register'),
]
