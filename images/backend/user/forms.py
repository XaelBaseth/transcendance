from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import AppUser, Profile
from django.forms.models import ModelForm
from django.forms.widgets import FileInput

class CreateUserForm(UserCreationForm):
    class Meta:
        model = AppUser  # Utilisation du modèle AppUser
        fields = ['email', 'first_name', 'last_name', 'password1', 'password2']

class ProfileForm(ModelForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = Profile
        fields = '__all__'
        exclude = ['user']
        widgets = {
            'profile_img': FileInput(),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(ProfileForm, self).__init__(*args, **kwargs)
        if user:
            self.fields['email'].initial = user.email

    def save(self, commit=True):
        profile = super(ProfileForm, self).save(commit=False)
        user = profile.user
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            profile.save()
        return profile

# from django import forms
# from django.contrib.auth.forms import UserCreationForm
# from django.contrib.auth.models import User
# from .models import Profile
# from django.forms.models import ModelForm
# from django.forms.widgets import FileInput

# class CreateUserForm(UserCreationForm):
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password1', 'password2']
        
# class ProfileForm(ModelForm):
#     username = forms.CharField(required=True)

#     class Meta:
#         model = Profile
#         fields = '__all__'
#         exclude = ['user']
#         widgets = {
#             'profile_img': FileInput(),
#         }

#     def __init__(self, *args, **kwargs):
#         user = kwargs.pop('user', None)
#         super(ProfileForm, self).__init__(*args, **kwargs)
#         if user:
#             self.fields['username'].initial = user.username

#     def save(self, commit=True):
#         profile = super(ProfileForm, self).save(commit=False)
#         user = profile.user
#         user.username = self.cleaned_data['username']
#         if commit:
#             user.save()
#             profile.save()
#         return profile
