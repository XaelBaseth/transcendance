from django.contrib import admin
from django.urls import path, include
from user import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views 

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('user.urls')),
#     path('api/user/', include("user.urls")),
#     path("api/token/", jwt_views.TokenObtainPairView.as_view(), name="get_token"),
#     path("api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="refresh"),
#     path("api-auth/", include("rest_framework.urls")),
#     path("api/", include("user.urls")),
# 	  path("pong-api/", include("pong.urls")),
# ]


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('user.urls')),  # Chemin vers les URLs de l'application 'user'
    path("api/token/", jwt_views.TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
	path("pong-api/", include("pong.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
