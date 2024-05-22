from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from .views import home
from .views import CreateUserView, RetrieveUserView

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('profile/', RetrieveUserView.as_view(), name='profile'),
    path("", home, name="home"),
]
