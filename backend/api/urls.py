from django.urls import path
from api import views

urlpatterns = [
    path('send_otp/', views.send_otp),
    path('signup/', views.signup),
    path('login/', views.login),
    path('verify_otp/', views.verify_otp),
    path('forgot_password/', views.forgot_password),
    path('reset_password/', views.reset_password),
    path('protected/', views.protected_view),
    path('debug_users/', views.debug_users),  # Remove in production
    
    # Location endpoints
    path('states/', views.get_states),
    path('districts/', views.get_districts),
    path('mandals/', views.get_mandals),
    path('grampanchayats/', views.get_grampanchayats),
]
