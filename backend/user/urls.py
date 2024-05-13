from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from .views import home, send_otp_email, verify_otp

urlpatterns = [
    path("", home, name="home"),
	path("send-otp-email/", send_otp_email, name='send_otp_email'),
	path("verify-otp/", verify_otp, name='verify_otp'),
]