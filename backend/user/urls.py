from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from .views import home


urlpatterns = [
    path("", home, name="home")  # Removed.as_view()
]