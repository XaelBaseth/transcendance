from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from .views import home
from user.views import CreateUserView


urlpatterns = [
	path('register', CreateUserView.as_view()),
    path("", home, name="home"),
]