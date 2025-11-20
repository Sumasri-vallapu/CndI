from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
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
    permission_classes = [AllowAny]  # Allow public access to browse speakers

    def get_queryset(self):
        # Only show approved speakers to the public
        queryset = Speaker.objects.filter(approval_status='approved')

        # Search across name, expertise, and bio
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(expertise__icontains=search) |
                Q(bio__icontains=search)
            )

        # Expertise filter
        expertise = self.request.query_params.get('expertise', None)
        if expertise and expertise != 'All':
            queryset = queryset.filter(expertise=expertise)

        # Availability filter
        availability = self.request.query_params.get('availability', None)
        if availability and availability != 'All':
            queryset = queryset.filter(availability_status=availability)

        # Experience range filter
        experience = self.request.query_params.get('experience', None)
        if experience and experience != 'All':
            if experience == '0-5 years':
                queryset = queryset.filter(experience_years__gte=0, experience_years__lte=5)
            elif experience == '6-10 years':
                queryset = queryset.filter(experience_years__gte=6, experience_years__lte=10)
            elif experience == '11-15 years':
                queryset = queryset.filter(experience_years__gte=11, experience_years__lte=15)
            elif experience == '16-20 years':
                queryset = queryset.filter(experience_years__gte=16, experience_years__lte=20)
            elif experience == '20+ years':
                queryset = queryset.filter(experience_years__gt=20)

        # Price range filter
        price_range = self.request.query_params.get('priceRange', None)
        if price_range and price_range != 'All':
            if price_range == '$0-$2,500':
                queryset = queryset.filter(hourly_rate__gte=0, hourly_rate__lte=2500)
            elif price_range == '$2,500-$5,000':
                queryset = queryset.filter(hourly_rate__gt=2500, hourly_rate__lte=5000)
            elif price_range == '$5,000-$10,000':
                queryset = queryset.filter(hourly_rate__gt=5000, hourly_rate__lte=10000)
            elif price_range == '$10,000+':
                queryset = queryset.filter(hourly_rate__gt=10000)

        # Location filter
        location = self.request.query_params.get('location', None)
        if location and location != 'All':
            queryset = queryset.filter(location=location)

        # Language filter (check if language is in comma-separated list)
        language = self.request.query_params.get('language', None)
        if language and language != 'All':
            queryset = queryset.filter(languages__icontains=language)

        # Industry filter
        industry = self.request.query_params.get('industry', None)
        if industry and industry != 'All':
            queryset = queryset.filter(industry=industry)

        return queryset


class SpeakerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Speaker.objects.all()
    serializer_class = SpeakerSerializer
    permission_classes = [AllowAny]  # Allow public access to view speaker profiles


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

    def get_permissions(self):
        # Allow anyone to create events (send requests)
        # But require authentication to list events
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

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

