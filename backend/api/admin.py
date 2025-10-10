from django.contrib import admin
from .models import (
    UserProfile, State, District, Mandal, GramPanchayat,
    Host, Speaker, Event, SpeakerAvailability, Payment, Message, EventRating,
    OTPVerification, PendingUser, Conversation, ContactSubmission
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'gender', 'occupation', 'state', 'district']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    list_filter = ['gender', 'state', 'qualification']


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ['id', 'state_name']
    search_fields = ['state_name']


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ['id', 'district_name', 'state']
    search_fields = ['district_name']
    list_filter = ['state']


@admin.register(Mandal)
class MandalAdmin(admin.ModelAdmin):
    list_display = ['id', 'mandal_name', 'district']
    search_fields = ['mandal_name']
    list_filter = ['district']


@admin.register(GramPanchayat)
class GramPanchayatAdmin(admin.ModelAdmin):
    list_display = ['id', 'gram_panchayat_name', 'mandal']
    search_fields = ['gram_panchayat_name']
    list_filter = ['mandal']


@admin.register(Host)
class HostAdmin(admin.ModelAdmin):
    list_display = ['user', 'company_name', 'organization_type', 'verified', 'created_at']
    search_fields = ['user__email', 'company_name']
    list_filter = ['organization_type', 'verified']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Speaker)
class SpeakerAdmin(admin.ModelAdmin):
    list_display = ['user', 'expertise', 'experience_years', 'availability_status', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'speaking_topics']
    list_filter = ['expertise', 'availability_status']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'speaker', 'organizer_name', 'event_date', 'status', 'created_at']
    search_fields = ['title', 'organizer_name', 'organizer_email']
    list_filter = ['status', 'event_type', 'urgency']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'event_date'


@admin.register(SpeakerAvailability)
class SpeakerAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['speaker', 'date', 'is_available', 'notes']
    search_fields = ['speaker__user__email']
    list_filter = ['is_available', 'date']
    date_hierarchy = 'date'


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'host', 'speaker', 'event', 'subject', 'created_at', 'updated_at']
    search_fields = ['host__email', 'speaker__email', 'subject']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'sender', 'recipient', 'is_read', 'created_at']
    search_fields = ['sender__email', 'recipient__email', 'body']
    list_filter = ['is_read', 'created_at']
    readonly_fields = ['created_at']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['event', 'amount', 'status', 'payment_method', 'payment_date']
    search_fields = ['event__title', 'transaction_id']
    list_filter = ['status', 'payment_method']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EventRating)
class EventRatingAdmin(admin.ModelAdmin):
    list_display = ['event', 'speaker', 'rating', 'would_recommend', 'created_at']
    search_fields = ['event__title', 'organizer_name']
    list_filter = ['rating', 'would_recommend']
    readonly_fields = ['created_at']


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ['email', 'otp_code', 'purpose', 'is_verified', 'attempts', 'created_at', 'expires_at']
    search_fields = ['email']
    list_filter = ['purpose', 'is_verified']
    readonly_fields = ['created_at']


@admin.register(PendingUser)
class PendingUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'user_type', 'first_name', 'last_name', 'is_email_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    list_filter = ['user_type', 'is_email_verified']
    readonly_fields = ['created_at']


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_responded', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_filter = ['is_responded', 'created_at']
    readonly_fields = ['created_at']
    list_editable = ['is_responded']
