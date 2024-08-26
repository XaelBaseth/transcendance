from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
	 path('', views.home, name = 'home'),
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('delete', views.DeleteAccountView.as_view(), name='delete_account'), 
    path('update-profile', views.UpdateProfileView.as_view(), name='update_profile'),
    path('friend-request', views.FriendRequestView.as_view(), name='friend_request'),
    path('friends', views.FriendListView.as_view(), name='friend_list'),
    path('match-history', views.MatchHistoryView.as_view(), name='match_history'),
    path('user/change-Avatar', views.ChangeAvatar.as_view(), name='change_avatar'),
]
