from django.contrib import admin
from django.urls import path, include
from user.views import CreateUserView
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register', CreateUserView.as_view(), name="register"),
    path("api/token/", jwt_views.TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("user.urls")),
	path("pong-api/", include("pong.urls")),
]

