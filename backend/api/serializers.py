from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import (
    UserProfile, State, District, Mandal, GramPanchayat,
    Host, Speaker, Event, SpeakerAvailability, Payment, Message, EventRating,
    OTPVerification, PendingUser, Conversation
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
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = Host
        fields = [
            'id', 'user', 'user_email', 'user_name', 'username', 'company_name',
            'organization_type', 'website', 'bio', 'profile_image',
            'verified', 'total_events', 'completed_events', 'user_type',
            'created_at', 'updated_at'
        ]

    def get_user_type(self, obj):
        return 'host'


class SpeakerSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = Speaker
        fields = [
            'id', 'user', 'user_email', 'user_name', 'username', 'bio', 'expertise',
            'speaking_topics', 'experience_years', 'hourly_rate',
            'availability_status', 'profile_image', 'website',
            'social_media', 'location', 'languages', 'industry',
            'average_rating', 'user_type', 'created_at', 'updated_at'
        ]

    def get_user_type(self, obj):
        return 'speaker'


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
    sender_email = serializers.CharField(source='sender.email', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'sender_name', 'sender_email',
            'recipient', 'recipient_name', 'body',
            'is_read', 'created_at'
        ]


class ConversationSerializer(serializers.ModelSerializer):
    host_name = serializers.CharField(source='host.get_full_name', read_only=True)
    speaker_name = serializers.CharField(source='speaker.get_full_name', read_only=True)
    host_email = serializers.CharField(source='host.email', read_only=True)
    speaker_email = serializers.CharField(source='speaker.email', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True, allow_null=True)
    last_message = MessageSerializer(read_only=True)
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'host', 'host_name', 'host_email', 'speaker', 'speaker_name',
            'speaker_email', 'event', 'event_title', 'subject', 'last_message',
            'unread_count', 'created_at', 'updated_at'
        ]

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user:
            if hasattr(request.user, 'host') and request.user == obj.host:
                return obj.unread_count_for_host
            elif hasattr(request.user, 'speaker') and request.user == obj.speaker:
                return obj.unread_count_for_speaker
        return 0


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
    otp_code = serializers.CharField(max_length=6, min_length=4)
    purpose = serializers.CharField()


class PasswordSetSerializer(serializers.Serializer):
    """Set password after OTP verification"""
    email = serializers.EmailField()
    username = serializers.CharField(max_length=50, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if value:
            # Check if username already exists in Host or Speaker models
            from .models import Host, Speaker
            if Host.objects.filter(username=value).exists() or Speaker.objects.filter(username=value).exists():
                raise serializers.ValidationError("This username is already taken")
            # Validate username format (alphanumeric and underscores only)
            import re
            if not re.match(r'^[a-zA-Z0-9_]+$', value):
                raise serializers.ValidationError("Username can only contain letters, numbers, and underscores")
        return value

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
    otp_code = serializers.CharField(max_length=4, min_length=4)
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
