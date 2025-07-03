from django.urls import path
from api import views

urlpatterns = [
    path('send_otp/', views.send_otp),
    path('signup/', views.signup),
    path('login/', views.login),
    path('verify_otp/', views.verify_otp),
    path('protected/', views.protected_view),
]
