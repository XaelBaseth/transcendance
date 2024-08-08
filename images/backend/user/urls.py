from django.urls import path
from . import views

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('delete', views.UserDelete.as_view(), name='delete'),
    path('user', views.UserView.as_view(), name='user'),
    path('', views.UserView.as_view(), name='user'),
]
# from django.conf.urls.static import static
# from django.urls import path
# from django.conf import settings
# from .views import home
# # from user.views import CreateUserView


# # urlpatterns = [
# # 	path('register', CreateUserView.as_view()),
# #     path("", home, name="home"),
# # ]

# from typing import ValuesView
# from . import views

# urlpatterns = [
#     path('', views.home, name = 'home'),
#     path('profile/<int:user_id>/', views.profile, name='profile'),
#     path('login/', views.login_user, name = 'login'),
#     path('register/', views.register_user, name = 'register'),
#     path('logout/', views.logout_user, name = 'logout'),
#     path('send_friend_request/<int:receiver_id>/', views.send_friend_request, name='send_friend_request'),    path('accept_friend_request/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
#     path('accept_friend_request/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
#     path('decline_friend_request/<int:request_id>/', views.decline_friend_request, name='decline_friend_request'),
#     path('profile/', views.profile, name='profile'), 
# ]