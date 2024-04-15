from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def signup(request):
    #Implement logic here
    return JsonResponse({'message': 'User signed up successfully.'})

def login(request):
    #Implement logic here
    return JsonResponse({'message': 'User logged in successfully.'})