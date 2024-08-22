from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('', views.home, name='home'),
    path('api/user/register', views.UserRegister.as_view(), name='register'),
    path('api/user/login', views.UserLogin.as_view(), name='login'),
    path('api/user/logout', views.UserLogout.as_view(), name='logout'),
    path('api/user', views.UserView.as_view(), name='user'),
    path('api/user/delete', views.DeleteAccountView.as_view(), name='delete_account'),
    path('api/user/update-profile', views.UpdateProfileView.as_view(), name='update_profile'),
    path('api/user/friend-request', views.FriendRequestView.as_view(), name='friend_request'),
    path('api/user/friends', views.FriendListView.as_view(), name='friend_list'),
    path('api/user/match-history', views.MatchHistoryView.as_view(), name='match_history'),
    path('api/user/change-avatar', views.ChangeAvatar.as_view(), name='change_avatar'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
