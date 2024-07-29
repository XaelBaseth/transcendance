from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from . import views
from user.views import CreateUserView


urlpatterns = [
	path('register', CreateUserView.as_view()),
    #path("", home, name="home"),
    path("intra", views.intra, name="intra"),
    path("intra/confirm", views.intra_confirm, name="intra_confirm"),
    path('logout', views.logout_view, name='logout'),
    path('login', views.login_view, name='login'),
    path('register', views.RegisterView.as_view(), name='register'),
]