from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from .views import home, login


urlpatterns = [
    path("", home, name="home"),
]