from django.conf.urls.static import static
from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
    path('auth/signup', views.signup, name='register'),
    path('auth/login', views.login, name='register'),
	path('users/', views.get_users, name='get_users'),
] + static('/static/', document_root=settings.STATIC_ROOT)
