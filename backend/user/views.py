from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import AppUser, TwoFactorEmailModel
from django.http import JsonResponse
from .serializers import UserSerializer
from django.http import HttpResponse

# Create your views here.

def home(request):
    return HttpResponse("Welcome to the home page!")

					#####################
					#					#
					#		OTP			#
					#					#
					#####################

def send_otp_email(request):
    email = request.POST.get('email')
    if not email:
        return JsonResponse({'status': 'error', 'message': 'Email is required.'}, status=400)

    try:
        otp_instance = TwoFactorEmailModel.objects.create(user__email=email)
        otp_instance.send_two_factor_email("Your OTP", f"Your OTP is {otp_instance.code}")
        return JsonResponse({'status': 'success', 'message': 'OTP sent.'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
def verify_otp(request):
    email = request.POST.get('email')
    otp_code = request.POST.get('otp_code')

    try:
        otp_instance = TwoFactorEmailModel.objects.get(user__email=email, code=otp_code)
        if otp_instance.is_expired():
            return JsonResponse({'status': 'failed', 'message': 'OTP expired'})
        # OTP is valid, proceed with authentication
        return JsonResponse({'status': 'success', 'message': 'OTP verified'})
    except TwoFactorEmailModel.DoesNotExist:
        return JsonResponse({'status': 'failed', 'message': 'Invalid OTP'})


					#####################
					#					#
					#		USER		#
					#					#
					#####################

class CreateUserView(generics.CreateAPIView):
    queryset = AppUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    