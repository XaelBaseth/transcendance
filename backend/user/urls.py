from django.conf.urls.static import static
from django.urls import path
from .views import testbackend
from django.conf import settings

urlpatterns = [
	path('testbackend/', testbackend, name='testbackend'),
]
