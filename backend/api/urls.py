from django.urls import path
from django.conf import settings
from api import views
from .views import (
    get_states, get_districts, get_mandals, get_grampanchayats,
    HostListCreateView, HostDetailView, SpeakerListView, SpeakerDetailView,
    EventListCreateView, EventDetailView, MessageListCreateView, MessageDetailView,
    PaymentListView, speaker_availability, update_speaker_availability,
    event_response, mark_message_read, create_payment, create_event_rating,
    host_dashboard_stats, speaker_dashboard_stats
)
from . import auth_views, api_views

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
    path('auth/approval-status/', auth_views.check_approval_status, name='auth-approval-status'),

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

    # ==================== NEW COMPREHENSIVE API ENDPOINTS ====================

    # Host Endpoints
    path('api/host/profile/', api_views.host_profile, name='api-host-profile'),
    path('api/host/dashboard/', api_views.host_dashboard, name='api-host-dashboard'),
    path('api/host/requests/', api_views.host_requests, name='api-host-requests'),

    # Speaker Endpoints
    path('api/speakers/', api_views.speakers_list, name='api-speakers-list'),
    path('api/speaker/profile/', api_views.speaker_profile, name='api-speaker-profile'),
    path('api/speaker/profile/<int:speaker_id>/', api_views.speaker_profile, name='api-speaker-profile-detail'),
    path('api/speaker/dashboard/', api_views.speaker_dashboard, name='api-speaker-dashboard'),
    path('api/speaker/events/', api_views.speaker_events, name='api-speaker-events'),
    path('api/speaker/<int:speaker_id>/ratings/', api_views.speaker_ratings, name='api-speaker-ratings'),

    # Event/Request Endpoints
    path('api/requests/create/', api_views.create_speaker_request, name='api-create-request'),
    path('api/events/<int:event_id>/', api_views.event_detail, name='api-event-detail'),
    path('api/events/<int:event_id>/update-status/', api_views.update_event_status, name='api-update-event-status'),

    # Availability Endpoints
    path('api/speaker/<int:speaker_id>/availability/', api_views.speaker_availability, name='api-speaker-availability'),
    path('api/speaker/availability/update/', api_views.update_availability, name='api-update-availability'),

    # Messaging/Conversation Endpoints
    path('api/conversations/', api_views.conversations_list, name='api-conversations-list'),
    path('api/conversations/create/', api_views.create_conversation, name='api-create-conversation'),
    path('api/conversations/<int:conversation_id>/messages/', api_views.conversation_messages, name='api-conversation-messages'),
    path('api/messages/send/', api_views.send_message, name='api-send-message'),

    # Payment Endpoints
    path('api/payments/', api_views.payments_list, name='api-payments-list'),
    path('api/payments/create/', api_views.create_payment, name='api-create-payment'),
    path('api/payments/<int:payment_id>/update-status/', api_views.update_payment_status, name='api-update-payment-status'),

    # Rating Endpoints
    path('api/ratings/create/', api_views.create_rating, name='api-create-rating'),

    # Contact Form Endpoint
    path('contact/', api_views.contact_form, name='api-contact-form'),

    # File Upload Endpoints
    path('api/upload/profile-image/', api_views.upload_profile_image, name='api-upload-profile-image'),
    path('api/upload/document/', api_views.upload_document, name='api-upload-document'),
]

# Add debug endpoints only in development mode
if settings.DEBUG:
    urlpatterns += [
        path('debug/otps/', auth_views.debug_otps, name='debug-otps'),
        path('debug/pending-users/', auth_views.debug_pending_users, name='debug-pending-users'),
        path('debug/users/', views.debug_users, name='debug-users'),
    ]
