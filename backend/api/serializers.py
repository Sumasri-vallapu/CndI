from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import (
    UserProfile, State, District, Mandal, GramPanchayat,
    Host, Speaker, Event, SpeakerAvailability, Payment, Message, EventRating,
    OTPVerification, PendingUser
)

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name']

class StateSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = State
        fields = ['id', 'state_name']

class DistrictSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = District
        fields = ['id', 'district_name']

class MandalSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = Mandal
        fields = ['id', 'mandal_name']

class GramPanchayatSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = GramPanchayat
        fields = ['id', 'gram_panchayat_name']


class UserProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'


class HostSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    total_events = serializers.ReadOnlyField()
    completed_events = serializers.ReadOnlyField()
    
    class Meta:
        model = Host
        fields = [
            'id', 'user', 'user_email', 'user_name', 'company_name', 
            'organization_type', 'website', 'bio', 'profile_image', 
            'verified', 'total_events', 'completed_events', 
            'created_at', 'updated_at'
        ]


class SpeakerSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    
    class Meta:
        model = Speaker
        fields = [
            'id', 'user', 'user_email', 'user_name', 'bio', 'expertise',
            'speaking_topics', 'experience_years', 'hourly_rate', 
            'availability_status', 'profile_image', 'website', 
            'social_media', 'average_rating', 'created_at', 'updated_at'
        ]


class SpeakerAvailabilitySerializer(serializers.ModelSerializer):
    speaker_name = serializers.CharField(source='speaker.user.get_full_name', read_only=True)
    
    class Meta:
        model = SpeakerAvailability
        fields = ['id', 'speaker', 'speaker_name', 'date', 'is_available', 'notes', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    speaker_name = serializers.CharField(source='speaker.user.get_full_name', read_only=True)
    budget_range = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'speaker', 'speaker_name',
            'organizer_name', 'organizer_email', 'organizer_company', 'organizer_phone',
            'event_date', 'duration_minutes', 'location', 'event_type',
            'audience', 'audience_size', 'requirements', 'budget_min', 'budget_max',
            'budget_range', 'status', 'urgency', 'responded_at', 'response_notes',
            'created_at', 'updated_at'
        ]


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'event', 'event_title', 'sender', 'sender_name', 
            'recipient', 'recipient_name', 'subject', 'body', 
            'is_read', 'created_at'
        ]


class PaymentSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'event', 'event_title', 'amount', 'currency', 'status',
            'payment_method', 'transaction_id', 'payment_date',
            'created_at', 'updated_at'
        ]


class EventRatingSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    speaker_name = serializers.CharField(source='speaker.user.get_full_name', read_only=True)
    
    class Meta:
        model = EventRating
        fields = [
            'id', 'event', 'event_title', 'speaker', 'speaker_name',
            'organizer_name', 'rating', 'feedback', 'would_recommend', 'created_at'
        ]


# Authentication Serializers
class SignupRequestSerializer(serializers.Serializer):
    """Initial signup request with email and user type"""
    email = serializers.EmailField()
    user_type = serializers.ChoiceField(choices=['host', 'speaker'])
    first_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    
    def validate_email(self, value):
        # Check if user already exists
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists")
        return value


class OTPVerificationSerializer(serializers.Serializer):
    """OTP verification"""
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)
    purpose = serializers.CharField()


class PasswordSetSerializer(serializers.Serializer):
    """Set password after OTP verification"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        
        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match")
        
        # Validate password strength
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"password": e.messages})
        
        return attrs


class LoginSerializer(serializers.Serializer):
    """User login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ForgotPasswordSerializer(serializers.Serializer):
    """Forgot password request"""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        # Check if user exists
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No account found with this email address")
        return value


class ResetPasswordSerializer(serializers.Serializer):
    """Reset password with OTP"""
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        
        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match")
        
        # Validate password strength
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": e.messages})
        
        return attrs


class ResendOTPSerializer(serializers.Serializer):
    """Resend OTP"""
    email = serializers.EmailField()
    purpose = serializers.CharField()
