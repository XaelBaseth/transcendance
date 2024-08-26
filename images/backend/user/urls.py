from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.UserRootView.as_view(), name='user_root'),  # Add this line
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('profile/', views.UserView.as_view(), name='user_profile'),
    path('profile/update/', views.UpdateProfileView.as_view(), name='update_profile'),
    path('profile/delete/', views.DeleteAccountView.as_view(), name='delete_account'),
    path('friends/request/', views.FriendRequestView.as_view(), name='friend_request'),
    path('friends/', views.FriendListView.as_view(), name='friend_list'),
    path('match-history/', views.MatchHistoryView.as_view(), name='match_history'),
    path('change-avatar/', views.ChangeAvatar.as_view(), name='change_avatar'),
    path('register', views.UserRegister.as_view(), name='register'),
    path('register/', views.UserRegister.as_view()),
    path('login', views.UserLogin.as_view(), name='login'),
    path('login/', views.UserLogin.as_view()),
]