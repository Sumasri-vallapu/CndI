from django.urls import path
from api import views
from .views import (
    get_states, get_districts, get_mandals, get_grampanchayats,
    HostListCreateView, HostDetailView, SpeakerListView, SpeakerDetailView,
    EventListCreateView, EventDetailView, MessageListCreateView, MessageDetailView,
    PaymentListView, speaker_availability, update_speaker_availability,
    event_response, mark_message_read, create_payment, create_event_rating,
    host_dashboard_stats, speaker_dashboard_stats
)
from . import auth_views

urlpatterns = [
    # New OTP-based Authentication URLs
    path('auth/signup-request/', auth_views.signup_request, name='auth-signup-request'),
    path('auth/verify-otp/', auth_views.verify_otp, name='auth-verify-otp'),
    path('auth/set-password/', auth_views.set_password, name='auth-set-password'),
    path('auth/login/', auth_views.login, name='auth-login'),
    path('auth/forgot-password/', auth_views.forgot_password, name='auth-forgot-password'),
    path('auth/reset-password/', auth_views.reset_password, name='auth-reset-password'),
    path('auth/resend-otp/', auth_views.resend_otp, name='auth-resend-otp'),
    path('auth/check-email-exists/', auth_views.check_email_exists, name='auth-check-email-exists'),
    
    # Debug endpoints (remove in production)
    path('debug/otps/', auth_views.debug_otps, name='debug-otps'),
    path('debug/pending-users/', auth_views.debug_pending_users, name='debug-pending-users'),
    path('debug/users/', views.debug_users, name='debug-users'),
    
    # Legacy authentication endpoints (keep for backward compatibility during transition)
    path('send_otp/', views.send_otp),
    path('verify_otp/', views.verify_otp),
    path('signup/', views.signup),
    path('login/', views.login),
    path('check_email_exists/', views.check_email_exists),
    path('forgot_password/', views.forgot_password),
    path('reset_password/', views.reset_password),
    path('protected/', views.protected_view),
    
        # location api   
    path('states/', get_states, name='get_states'),
    path('districts/', get_districts, name='get_districts'),
    path('mandals/', get_mandals, name='get_mandals'),
    path('grampanchayats/', get_grampanchayats, name='get_grampanchayats'),
    
    # Host management URLs
    path('hosts/', HostListCreateView.as_view(), name='host-list-create'),
    path('hosts/<int:pk>/', HostDetailView.as_view(), name='host-detail'),
    path('host-dashboard-stats/', host_dashboard_stats, name='host-dashboard-stats'),
    
    # Speaker URLs
    path('speakers/', SpeakerListView.as_view(), name='speaker-list'),
    path('speakers/<int:pk>/', SpeakerDetailView.as_view(), name='speaker-detail'),
    path('speaker-availability/<int:speaker_id>/', speaker_availability, name='speaker-availability'),
    path('update-speaker-availability/', update_speaker_availability, name='update-speaker-availability'),
    path('speaker-dashboard-stats/', speaker_dashboard_stats, name='speaker-dashboard-stats'),
    
    # Event URLs
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('event-response/<int:event_id>/', event_response, name='event-response'),
    
    # Message URLs
    path('messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('messages/<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
    path('mark-message-read/<int:message_id>/', mark_message_read, name='mark-message-read'),
    
    # Payment URLs
    path('payments/', PaymentListView.as_view(), name='payment-list'),
    path('create-payment/', create_payment, name='create-payment'),
    
    # Rating URLs
    path('create-event-rating/', create_event_rating, name='create-event-rating'),
]
