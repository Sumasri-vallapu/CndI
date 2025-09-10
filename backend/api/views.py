from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import UserProfile
from datetime import datetime, timedelta
from django.utils import timezone
import random
from .models import(State,
    District,
    Mandal,
    GramPanchayat)

# In-memory store for OTP verification (for development)
# In production, you should use Redis or a proper database
otp_store = {}
pending_users = {}

@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    name = request.data.get('name', 'Friend')
    if not email:
        return Response({"error": "Email is required"}, status=400)

    otp = random.randint(100000, 999999)  # 6-digit OTP
    
    # Store OTP with expiration time (10 minutes)
    expiry_time = timezone.now() + timedelta(minutes=10)
    otp_store[email] = {
        'otp': otp,
        'expires_at': expiry_time,
        'name': name
    }

    # Use the same template as the new authentication system
    from django.template.loader import render_to_string
    
    email_subject = "[Connect & Inspire] Email Verification"
    
    # Prepare email context
    email_context = {
        'OTP': otp,
        'SUPPORT_EMAIL': settings.EMAIL_HOST_USER,
        'first_name': name,
        'user_type': '',
        'purpose': 'email_verification'
    }
    
    # Render email template (same as new auth system)
    html_message = render_to_string('emails/otp_email.html', email_context)

    try:
        from django.core.mail import EmailMultiAlternatives
        
        # Create email with both text and HTML versions
        text_content = f"""Hello {name}!

Thank you for joining Connect & Inspire! 

To verify your email address, please use the verification code below:

Verification Code: {otp}

This code will expire in 10 minutes for your security.

If you didn't create an account with Connect & Inspire, please ignore this email.

Best regards,
The Connect & Inspire Team"""
        
        msg = EmailMultiAlternatives(
            email_subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [email]
        )
        msg.attach_alternative(html_message, "text/html")
        msg.send()
        
        print(f"[SUCCESS] OTP sent successfully to {email}: {otp}")
    except Exception as e:
        print(f"[ERROR] Email sending failed: {e}")
        print(f"[OTP] Development OTP for {email}: {otp}")
        
    return Response({"message": "Verification code sent to your email"})

@api_view(['POST'])
def signup(request):
    data = request.data
    email = data.get('email')
    otp = data.get('otp')
    
    # Verify OTP first
    if not email or not otp:
        return Response({"error": "Email and OTP are required"}, status=400)
    
    # Check if OTP is valid
    otp_data = otp_store.get(email)
    if not otp_data:
        return Response({"error": "No verification code found. Please request a new one."}, status=400)
    
    # Check if OTP has expired
    if timezone.now() > otp_data.get('expires_at'):
        del otp_store[email]
        return Response({"error": "Verification code has expired. Please request a new one."}, status=400)
    
    # Check if OTP matches
    if otp_data.get('otp') != int(otp):
        return Response({"error": "Invalid verification code. Please check and try again."}, status=400)
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({"error": "User with this email already exists"}, status=400)
    
    try:
        # Create user
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        # Fallback to name field if firstName/lastName not provided (backward compatibility)
        if not first_name and not last_name and data.get('name'):
            name_parts = data.get('name', '').split(' ')
            first_name = name_parts[0] if name_parts else ''
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=data.get('password')
        )
        
        # Create user profile
        profile = UserProfile.objects.create(
            user=user,
            gender=data.get('gender', ''),
            occupation=data.get('occupation', ''),
            phone=data.get('phone', ''),
            date_of_birth=datetime.strptime(data.get('dateOfBirth'), '%Y-%m-%d').date() if data.get('dateOfBirth') else None,
            qualification=data.get('qualification', ''),
            state=data.get('state', ''),
            district=data.get('district', ''),
            mandal=data.get('mandal', ''),
            panchayath=data.get('panchayath', ''),
            referral_source=data.get('referralSource', '')
        )
        
        # Clear OTP after successful signup
        if email in otp_store:
            del otp_store[email]
        
        # Send welcome email
        welcome_subject = "Welcome to Connect & Inspire - You're All Set!"
        welcome_message = f"""Congratulations {user.first_name}!

Your Connect & Inspire account has been successfully created and verified!

You're now part of our growing community dedicated to connecting speakers and hosts for meaningful events.

What's Next?
• Complete your profile to get started
• Explore our speaker and event hosting services
• Connect with our support team if you need any help

Why Choose Connect & Inspire?
• Fast and secure event coordination
• 24/7 customer support
• User-friendly interface
• Trusted by speakers and hosts worldwide

Ready to get started? Log in to your account and explore all the features we have to offer.

If you have any questions or need assistance, don't hesitate to reach out to our support team.

Welcome aboard!

Best regards,
The Connect & Inspire Team

---
Connect & Inspire - Connecting speakers and hosts for meaningful events
Need help? Contact us at {settings.EMAIL_HOST_USER}"""

        try:
            send_mail(
                welcome_subject,
                welcome_message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Welcome email sending failed: {e}")
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Account created successfully! Welcome to Connect & Inspire!",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "name": f"{user.first_name} {user.last_name}".strip()
            }
        })
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)
    
    try:
        user = User.objects.get(email=email)
        user = authenticate(username=user.username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": f"{user.first_name} {user.last_name}".strip()
                }
            })
        else:
            return Response({"error": "Invalid credentials"}, status=401)
            
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['POST'])
def check_email_exists(request):
    """Check if email already exists in the system"""
    email = request.data.get('email')
    
    if not email:
        return Response({"error": "Email is required"}, status=400)
    
    # Check if user with this email already exists
    exists = User.objects.filter(email=email).exists()
    
    return Response({
        "exists": exists,
        "email": email
    })

@api_view(['POST'])
def verify_otp(request):
    """Separate endpoint to verify OTP before proceeding to complete signup"""
    email = request.data.get('email')
    otp = request.data.get('otp')
    
    if not email or not otp:
        return Response({"error": "Email and OTP are required"}, status=400)
    
    # Check if OTP is valid
    otp_data = otp_store.get(email)
    if not otp_data:
        return Response({"error": "No verification code found. Please request a new one."}, status=400)
    
    # Check if OTP has expired
    if timezone.now() > otp_data.get('expires_at'):
        del otp_store[email]
        return Response({"error": "Verification code has expired. Please request a new one."}, status=400)
    
    # Check if OTP matches
    if otp_data.get('otp') != int(otp):
        return Response({"error": "Invalid verification code. Please check and try again."}, status=400)
    
    # OTP is valid - mark email as verified but don't delete OTP yet (will be deleted on signup)
    return Response({"message": "Email verified successfully"})

# OTP verification is now handled directly in the signup endpoint

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
        otp = random.randint(1000, 9999)
        otp_store[f"reset_{email}"] = otp

        try:
            send_mail(
                "[Connect & Inspire] Password Reset",
                f"Your Connect & Inspire password reset code is: {otp}",
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            print(f"Password reset OTP for {email}: {otp}")  # Development fallback
        except Exception as e:
            print(f"Email sending failed: {e}")
            print(f"Password reset OTP for {email}: {otp}")  # Development fallback
            
        return Response({"message": "Password reset code sent"})
    except User.DoesNotExist:
        return Response({"error": "No account found with this email address"}, status=404)
    except Exception as e:
        print(f"Unexpected error in forgot_password: {e}")
        return Response({"error": "Failed to process password reset request"}, status=500)

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    new_password = request.data.get('new_password')
    
    if not email or not otp or not new_password:
        return Response({"error": "Email, OTP, and new password are required"}, status=400)
    
    # Verify OTP
    if otp_store.get(f"reset_{email}") != int(otp):
        return Response({"error": "Invalid or expired reset code"}, status=400)
    
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        
        # Clear the reset OTP
        del otp_store[f"reset_{email}"]
        
        return Response({"message": "Password reset successfully"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": f"Hello {request.user.username}"})

# Debug endpoint to check users (remove in production)
@api_view(['GET'])
def debug_users(request):
    users = User.objects.all().values('id', 'username', 'email', 'first_name', 'last_name')
    return Response({"users": list(users)})

@api_view(['GET'])
def get_states(request):
    states = State.objects.all()
    return Response([{"id": state.id, "name": state.state_name} for state in states])

@api_view(['GET'])
def get_districts(request):
    state_id = request.GET.get('state_id')
    if state_id:
        districts = District.objects.filter(state_id=state_id)
    else:
        # Load all districts if no state_id provided
        districts = District.objects.all().order_by('district_name')
    return Response([{"id": district.id, "name": district.district_name} for district in districts])

@api_view(['GET'])
def get_mandals(request):
    district_id = request.GET.get('district_id')
    mandals = Mandal.objects.filter(district_id=district_id)
    return Response([{"id": mandal.id, "name": mandal.mandal_name} for mandal in mandals])

@api_view(['GET'])
def get_grampanchayats(request):
    mandal_id = request.GET.get('mandal_id')
    grampanchayats = GramPanchayat.objects.filter(mandal_id=mandal_id)
    return Response([{"id": grampanchayat.id, "name": grampanchayat.gram_panchayat_name} for grampanchayat in grampanchayats])


# Import additional modules for new views
from rest_framework import generics, status
from django.db.models import Q
from .models import Host, Speaker, Event, SpeakerAvailability, Payment, Message, EventRating
from .serializers import (
    HostSerializer, SpeakerSerializer, EventSerializer, SpeakerAvailabilitySerializer,
    MessageSerializer, PaymentSerializer, EventRatingSerializer
)


# Host Views
class HostListCreateView(generics.ListCreateAPIView):
    queryset = Host.objects.all()
    serializer_class = HostSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Host.objects.all()
    serializer_class = HostSerializer
    permission_classes = [IsAuthenticated]


# Speaker Views
class SpeakerListView(generics.ListAPIView):
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer
    
    def get_queryset(self):
        queryset = Speaker.objects.all()
        expertise = self.request.query_params.get('expertise', None)
        availability = self.request.query_params.get('availability', None)
        
        if expertise:
            queryset = queryset.filter(expertise=expertise)
        if availability:
            queryset = queryset.filter(availability_status=availability)
            
        return queryset


class SpeakerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer
    permission_classes = [IsAuthenticated]


# Speaker Availability Views
@api_view(['GET'])
def speaker_availability(request, speaker_id):
    """Get speaker's availability for a specific date range"""
    try:
        speaker = Speaker.objects.get(id=speaker_id)
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        
        if start_date and end_date:
            availability = SpeakerAvailability.objects.filter(
                speaker=speaker,
                date__range=[start_date, end_date]
            )
        else:
            # Default to next 30 days
            availability = SpeakerAvailability.objects.filter(
                speaker=speaker,
                date__range=[datetime.now().date(), datetime.now().date() + timedelta(days=30)]
            )
            
        serializer = SpeakerAvailabilitySerializer(availability, many=True)
        return Response(serializer.data)
    except Speaker.DoesNotExist:
        return Response({'error': 'Speaker not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_speaker_availability(request):
    """Update speaker's availability"""
    serializer = SpeakerAvailabilitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Event Views
class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Event.objects.all()
        
        # Filter by organizer if user is a host
        if hasattr(user, 'host'):
            queryset = queryset.filter(organizer_email=user.email)
        # Filter by speaker if user is a speaker
        elif hasattr(user, 'speaker'):
            queryset = queryset.filter(speaker=user.speaker)
            
        # Additional filters
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def event_response(request, event_id):
    """Handle speaker response to event request"""
    try:
        event = Event.objects.get(id=event_id)
        action = request.data.get('action')  # 'accept' or 'decline'
        notes = request.data.get('notes', '')
        
        if action == 'accept':
            event.status = 'accepted'
        elif action == 'decline':
            event.status = 'declined'
        else:
            return Response({'error': 'Invalid action'}, status=400)
            
        event.responded_at = datetime.now()
        event.response_notes = notes
        event.save()
        
        serializer = EventSerializer(event)
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)


# Message Views
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        event_id = self.request.query_params.get('event_id', None)
        
        queryset = Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        )
        
        if event_id:
            queryset = queryset.filter(event_id=event_id)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(Q(sender=user) | Q(recipient=user))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_message_read(request, message_id):
    """Mark a message as read"""
    try:
        message = Message.objects.get(id=message_id, recipient=request.user)
        message.is_read = True
        message.save()
        return Response({'status': 'Message marked as read'})
    except Message.DoesNotExist:
        return Response({'error': 'Message not found'}, status=404)


# Payment Views
class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'host'):
            return Payment.objects.filter(event__organizer_email=user.email)
        elif hasattr(user, 'speaker'):
            return Payment.objects.filter(event__speaker=user.speaker)
        return Payment.objects.none()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request):
    """Create a payment for an event"""
    event_id = request.data.get('event_id')
    amount = request.data.get('amount')
    
    try:
        event = Event.objects.get(id=event_id)
        
        # Check if payment already exists
        if hasattr(event, 'payment'):
            return Response({'error': 'Payment already exists for this event'}, status=400)
            
        payment = Payment.objects.create(
            event=event,
            amount=amount,
            status='pending'
        )
        
        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)


# Rating Views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event_rating(request):
    """Create a rating for a completed event"""
    serializer = EventRatingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Dashboard Stats Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def host_dashboard_stats(request):
    """Get dashboard statistics for hosts"""
    user = request.user
    if not hasattr(user, 'host'):
        return Response({'error': 'User is not a host'}, status=400)
    
    events = Event.objects.filter(organizer_email=user.email)
    
    stats = {
        'total_requests': events.count(),
        'pending_requests': events.filter(status='pending').count(),
        'accepted_requests': events.filter(status='accepted').count(),
        'completed_events': events.filter(status='completed').count(),
        'upcoming_events': events.filter(
            status='accepted',
            event_date__gte=datetime.now()
        ).count(),
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def speaker_dashboard_stats(request):
    """Get dashboard statistics for speakers"""
    user = request.user
    if not hasattr(user, 'speaker'):
        return Response({'error': 'User is not a speaker'}, status=400)
    
    events = Event.objects.filter(speaker=user.speaker)
    
    stats = {
        'total_requests': events.count(),
        'pending_requests': events.filter(status='pending').count(),
        'accepted_requests': events.filter(status='accepted').count(),
        'completed_events': events.filter(status='completed').count(),
        'upcoming_events': events.filter(
            status='accepted',
            event_date__gte=datetime.now()
        ).count(),
        'average_rating': user.speaker.average_rating,
    }
    
    return Response(stats)

