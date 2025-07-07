from django.urls import path
from api import views
from .views import (get_states,
    get_districts,
    get_mandals,
    get_grampanchayats)

urlpatterns = [
    path('send_otp/', views.send_otp),
    path('verify_otp/', views.verify_otp),
    path('signup/', views.signup),
    path('login/', views.login),
    path('check_email_exists/', views.check_email_exists),
    path('forgot_password/', views.forgot_password),
    path('reset_password/', views.reset_password),
    path('protected/', views.protected_view),
    path('debug_users/', views.debug_users),  # Remove in production
    
        # location api   
    path('states/', get_states, name='get_states'),
    path('districts/', get_districts, name='get_districts'),
    path('mandals/', get_mandals, name='get_mandals'),
    path('grampanchayats/', get_grampanchayats, name='get_grampanchayats'),
]
