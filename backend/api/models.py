from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import random
import string

class Host(models.Model):
    """Host/Organizer profile model"""
    ORGANIZATION_TYPE_CHOICES = [
        ('corporate', 'Corporate'),
        ('nonprofit', 'Non-profit'),
        ('educational', 'Educational'),
        ('government', 'Government'),
        ('healthcare', 'Healthcare'),
        ('other', 'Other'),
    ]

    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=50, unique=True, help_text="Unique username for messaging")
    company_name = models.CharField(max_length=100, blank=True)
    organization_type = models.CharField(max_length=20, choices=ORGANIZATION_TYPE_CHOICES, blank=True)
    website = models.URLField(blank=True)
    bio = models.TextField(max_length=500, blank=True)
    profile_image = models.URLField(blank=True)
    verified = models.BooleanField(default=False)

    # Admin Approval Fields
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, help_text="Reason for rejection (if applicable)")
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_hosts')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.company_name}"
    
    @property
    def total_events(self):
        return Event.objects.filter(organizer_email=self.user.email).count()
    
    @property
    def completed_events(self):
        return Event.objects.filter(organizer_email=self.user.email, status='completed').count()


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    QUALIFICATION_CHOICES = [
        ('10th', '10th Grade'),
        ('12th', '12th Grade'),
        ('diploma', 'Diploma'),
        ('bachelor', "Bachelor's Degree"),
        ('master', "Master's Degree"),
        ('phd', 'PhD'),
    ]
    
    REFERRAL_CHOICES = [
        ('social-media', 'Social Media'),
        ('friend-family', 'Friend/Family'),
        ('google-search', 'Google Search'),
        ('advertisement', 'Advertisement'),
        ('news-article', 'News Article'),
        ('government-office', 'Government Office'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Personal Information
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    qualification = models.CharField(max_length=20, choices=QUALIFICATION_CHOICES, blank=True)
    
    # Location Information
    state = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    mandal = models.CharField(max_length=100, blank=True)
    panchayath = models.CharField(max_length=100, blank=True)
    
    # Referral Source
    referral_source = models.CharField(max_length=20, choices=REFERRAL_CHOICES, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.user.email})"
    
class State(models.Model):
    state_name = models.CharField(max_length=100)

    def __str__(self):
        return self.state_name


class District(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    district_name = models.CharField(max_length=100)
    

    def __str__(self):
        return self.district_name

class Mandal(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    mandal_name = models.CharField(max_length=100)

    def __str__(self):
        return self.mandal_name


class GramPanchayat(models.Model):
    mandal = models.ForeignKey(Mandal, on_delete=models.CASCADE)
    gram_panchayat_name = models.CharField(max_length=100)

    def __str__(self):
        return self.gram_panchayat_name


class Speaker(models.Model):
    """Speaker profile model"""
    EXPERTISE_CHOICES = [
        ('technology', 'Technology'),
        ('healthcare', 'Healthcare'),
        ('business', 'Business'),
        ('education', 'Education'),
        ('science', 'Science'),
        ('arts', 'Arts & Culture'),
        ('sports', 'Sports'),
        ('government', 'Government'),
        ('social', 'Social Issues'),
        ('other', 'Other'),
    ]

    AVAILABILITY_STATUS = [
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('unavailable', 'Unavailable'),
    ]

    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=50, unique=True, help_text="Unique username for messaging")
    bio = models.TextField(max_length=1000, blank=True)
    expertise = models.CharField(max_length=20, choices=EXPERTISE_CHOICES, blank=True)
    speaking_topics = models.TextField(help_text="Comma-separated list of speaking topics", blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    availability_status = models.CharField(max_length=20, choices=AVAILABILITY_STATUS, default='available')
    profile_image = models.URLField(blank=True)
    website = models.URLField(blank=True)
    social_media = models.JSONField(default=dict, blank=True)
    location = models.CharField(max_length=200, blank=True, help_text="City, State/Country")
    languages = models.CharField(max_length=200, blank=True, help_text="Comma-separated languages")
    industry = models.CharField(max_length=100, blank=True)

    # Admin Approval Fields
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending')
    rejection_reason = models.TextField(blank=True, help_text="Reason for rejection (if applicable)")
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_speakers')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.expertise}"
    
    @property
    def average_rating(self):
        ratings = self.event_ratings.all()
        if ratings:
            return sum(rating.rating for rating in ratings) / len(ratings)
        return 0


class Event(models.Model):
    """Event model for speaking engagements"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    EVENT_TYPE_CHOICES = [
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('webinar', 'Webinar'),
        ('panel', 'Panel Discussion'),
        ('keynote', 'Keynote'),
        ('training', 'Training Session'),
        ('other', 'Other'),
    ]
    
    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    speaker = models.ForeignKey(Speaker, on_delete=models.CASCADE, related_name='events')
    
    # Organizer Information
    organizer_name = models.CharField(max_length=100)
    organizer_email = models.EmailField()
    organizer_company = models.CharField(max_length=100, blank=True)
    organizer_phone = models.CharField(max_length=20, blank=True)
    
    # Event Details
    event_date = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()
    location = models.CharField(max_length=300)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    audience = models.CharField(max_length=200)
    audience_size = models.PositiveIntegerField()
    
    # Requirements and Budget
    requirements = models.TextField(blank=True)
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Status and Metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Response tracking
    responded_at = models.DateTimeField(null=True, blank=True)
    response_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.speaker.user.first_name} {self.speaker.user.last_name}"
    
    @property
    def budget_range(self):
        if self.budget_min and self.budget_max:
            return f"${self.budget_min:,.0f} - ${self.budget_max:,.0f}"
        elif self.budget_min:
            return f"${self.budget_min:,.0f}+"
        return "Budget not specified"


class SpeakerAvailability(models.Model):
    """Speaker availability calendar"""
    speaker = models.ForeignKey(Speaker, on_delete=models.CASCADE, related_name='availability')
    date = models.DateField()
    is_available = models.BooleanField(default=True)
    notes = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['speaker', 'date']
        ordering = ['date']
    
    def __str__(self):
        status = "Available" if self.is_available else "Unavailable"
        return f"{self.speaker.user.first_name} - {self.date} - {status}"


class Payment(models.Model):
    """Payment tracking for speaking engagements"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payment processing details
    payment_method = models.CharField(max_length=50, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment for {self.event.title} - ${self.amount}"


class Conversation(models.Model):
    """Conversation between host and speaker"""
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='host_conversations')
    speaker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='speaker_conversations')
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='conversations')
    subject = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        unique_together = ['host', 'speaker', 'event']

    def __str__(self):
        return f"Conversation: {self.host.email} - {self.speaker.email}"

    @property
    def last_message(self):
        return self.messages.first()

    @property
    def unread_count_for_host(self):
        return self.messages.filter(sender=self.speaker, is_read=False).count()

    @property
    def unread_count_for_speaker(self):
        return self.messages.filter(sender=self.host, is_read=False).count()


class Message(models.Model):
    """Message system for host-speaker communication"""
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender.first_name} to {self.recipient.first_name} - {self.created_at}"


class EventRating(models.Model):
    """Rating and feedback for completed events"""
    event = models.OneToOneField(Event, on_delete=models.CASCADE, related_name='rating')
    speaker = models.ForeignKey(Speaker, on_delete=models.CASCADE, related_name='event_ratings')
    organizer_name = models.CharField(max_length=100)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    feedback = models.TextField(blank=True)
    would_recommend = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.event.title} - {self.rating}/5 stars"


class OTPVerification(models.Model):
    """OTP model for email verification"""
    PURPOSE_CHOICES = [
        ('signup_host', 'Host Signup'),
        ('signup_speaker', 'Speaker Signup'),
        ('forgot_password', 'Forgot Password'),
    ]
    
    email = models.EmailField()
    otp_code = models.CharField(max_length=4)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    is_verified = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)
    max_attempts = models.PositiveIntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        ordering = ['-created_at']
        # Removed unique_together constraint to allow multiple OTP attempts
    
    def save(self, *args, **kwargs):
        if not self.otp_code:
            self.otp_code = self.generate_otp()
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_otp():
        return ''.join(random.choices(string.digits, k=4))
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_expired() and not self.is_verified and self.attempts < self.max_attempts
    
    def increment_attempts(self):
        self.attempts += 1
        self.save()
    
    def __str__(self):
        return f"{self.email} - {self.purpose} - {self.otp_code}"


class PendingUser(models.Model):
    """Temporary storage for user data during signup process"""
    USER_TYPE_CHOICES = [
        ('host', 'Host'),
        ('speaker', 'Speaker/Guest'),
    ]

    email = models.EmailField(unique=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    username = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    password_hash = models.CharField(max_length=128, blank=True)  # Will be set after OTP verification
    additional_data = models.JSONField(default=dict, blank=True)  # Store any additional signup data
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} - {self.user_type}"


class ContactSubmission(models.Model):
    """Contact form submissions"""
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_responded = models.BooleanField(default=False)
    responded_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"