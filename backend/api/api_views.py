"""
Comprehensive API Views for C&I Platform
Handles all endpoints for hosts, speakers, events, messaging, and payments
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics, status
from django.db.models import Q, Count
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.utils import timezone

from .models import (
    Host, Speaker, Event, SpeakerAvailability, Payment, Message, EventRating,
    Conversation, ContactSubmission
)
from .serializers import (
    HostSerializer, SpeakerSerializer, EventSerializer, SpeakerAvailabilitySerializer,
    MessageSerializer, PaymentSerializer, EventRatingSerializer, ConversationSerializer
)


# ==================== HOST ENDPOINTS ====================

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def host_profile(request):
    """Get or update host profile"""
    try:
        host = Host.objects.get(user=request.user)
    except Host.DoesNotExist:
        # Create host profile if it doesn't exist
        host = Host.objects.create(user=request.user)

    if request.method == 'GET':
        serializer = HostSerializer(host)
        response_data = serializer.data

        # Add user information
        response_data['user_info'] = {
            'id': request.user.id,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'full_name': f"{request.user.first_name} {request.user.last_name}".strip(),
        }

        return Response(response_data)

    elif request.method == 'PUT':
        # Update user fields if provided
        user_data = request.data.get('user_info', {})
        if user_data:
            if 'first_name' in user_data:
                request.user.first_name = user_data['first_name']
            if 'last_name' in user_data:
                request.user.last_name = user_data['last_name']
            request.user.save()

        # Update host profile
        serializer = HostSerializer(host, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Return updated data with user info
            response_data = serializer.data
            response_data['user_info'] = {
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'full_name': f"{request.user.first_name} {request.user.last_name}".strip(),
            }

            return Response(response_data)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def host_dashboard(request):
    """Get host dashboard data"""
    try:
        host = Host.objects.get(user=request.user)
    except Host.DoesNotExist:
        return Response({'error': 'Host profile not found'}, status=404)

    # Get all events for this host
    events = Event.objects.filter(organizer_email=request.user.email)

    stats = {
        'total_requests': events.count(),
        'pending_requests': events.filter(status='pending').count(),
        'accepted_requests': events.filter(status='accepted').count(),
        'completed_events': events.filter(status='completed').count(),
        'upcoming_events': events.filter(
            status__in=['accepted', 'confirmed'],
            event_date__gte=timezone.now()
        ).count(),
    }

    # Get recent requests
    recent_requests = EventSerializer(
        events.order_by('-created_at')[:5], many=True
    ).data

    return Response({
        'stats': stats,
        'recent_requests': recent_requests,
        'profile': HostSerializer(host).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def host_requests(request):
    """Get all requests made by the host"""
    events = Event.objects.filter(organizer_email=request.user.email)

    # Filter by status if provided
    status_filter = request.query_params.get('status')
    if status_filter:
        events = events.filter(status=status_filter)

    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


# ==================== SPEAKER ENDPOINTS ====================

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def speaker_profile(request, speaker_id=None):
    """Get or update speaker profile"""
    try:
        if speaker_id:
            # Public view of speaker profile
            speaker = Speaker.objects.get(id=speaker_id)
        else:
            # Own profile
            try:
                speaker = Speaker.objects.get(user=request.user)
            except Speaker.DoesNotExist:
                # Create speaker profile if it doesn't exist
                speaker = Speaker.objects.create(user=request.user)
    except Speaker.DoesNotExist:
        return Response({'error': 'Speaker profile not found'}, status=404)

    if request.method == 'GET':
        serializer = SpeakerSerializer(speaker)
        response_data = serializer.data

        # Add user information if viewing own profile
        if speaker.user == request.user:
            response_data['user_info'] = {
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'full_name': f"{request.user.first_name} {request.user.last_name}".strip(),
            }

        return Response(response_data)

    elif request.method == 'PUT':
        # Only allow updating own profile
        if speaker.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)

        # Update user fields if provided
        user_data = request.data.get('user_info', {})
        if user_data:
            if 'first_name' in user_data:
                request.user.first_name = user_data['first_name']
            if 'last_name' in user_data:
                request.user.last_name = user_data['last_name']
            request.user.save()

        # Update speaker profile
        serializer = SpeakerSerializer(speaker, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Return updated data with user info
            response_data = serializer.data
            response_data['user_info'] = {
                'id': request.user.id,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'full_name': f"{request.user.first_name} {request.user.last_name}".strip(),
            }

            return Response(response_data)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
def speakers_list(request):
    """List all speakers with filtering"""
    try:
        speakers = Speaker.objects.all()

        # Filter by expertise
        expertise = request.query_params.get('expertise')
        if expertise:
            speakers = speakers.filter(expertise=expertise)

        # Filter by availability
        availability = request.query_params.get('availability')
        if availability:
            speakers = speakers.filter(availability_status=availability)

        # Filter by industry
        industry = request.query_params.get('industry')
        if industry:
            speakers = speakers.filter(industry__icontains=industry)

        # Search by name or topics
        search = request.query_params.get('search')
        if search:
            speakers = speakers.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(speaking_topics__icontains=search) |
                Q(bio__icontains=search)
            )

        serializer = SpeakerSerializer(speakers, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def speaker_dashboard(request):
    """Get speaker dashboard data"""
    try:
        speaker = Speaker.objects.get(user=request.user)
    except Speaker.DoesNotExist:
        return Response({'error': 'Speaker profile not found'}, status=404)

    # Get all events for this speaker
    events = Event.objects.filter(speaker=speaker)

    stats = {
        'total_requests': events.count(),
        'pending_requests': events.filter(status='pending').count(),
        'accepted_requests': events.filter(status='accepted').count(),
        'completed_events': events.filter(status='completed').count(),
        'upcoming_events': events.filter(
            status__in=['accepted', 'confirmed'],
            event_date__gte=timezone.now()
        ).count(),
        'average_rating': speaker.average_rating,
    }

    # Get recent requests
    recent_requests = EventSerializer(
        events.order_by('-created_at')[:5], many=True
    ).data

    return Response({
        'stats': stats,
        'recent_requests': recent_requests,
        'profile': SpeakerSerializer(speaker).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def speaker_events(request):
    """Get all events for the speaker"""
    try:
        speaker = Speaker.objects.get(user=request.user)
    except Speaker.DoesNotExist:
        return Response({'error': 'Speaker profile not found'}, status=404)

    events = Event.objects.filter(speaker=speaker)

    # Filter by status if provided
    status_filter = request.query_params.get('status')
    if status_filter:
        events = events.filter(status=status_filter)

    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


# ==================== EVENT/REQUEST ENDPOINTS ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_speaker_request(request):
    """Create a new speaker request/event"""
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        event = serializer.save()

        # Create conversation for this event
        try:
            speaker_user = event.speaker.user
            # Get or determine host user
            if request.user.is_authenticated and hasattr(request.user, 'host'):
                host_user = request.user
            else:
                # For unauthenticated requests, we'll create conversation later when they sign in
                pass

            if request.user.is_authenticated:
                Conversation.objects.get_or_create(
                    host=host_user,
                    speaker=speaker_user,
                    event=event,
                    defaults={'subject': event.title}
                )
        except Exception as e:
            print(f"Conversation creation error: {e}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def event_detail(request, event_id):
    """Get event details"""
    try:
        event = Event.objects.get(id=event_id)
        serializer = EventSerializer(event)
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_event_status(request, event_id):
    """Update event status (accept/decline/confirm)"""
    try:
        event = Event.objects.get(id=event_id)

        # Check permissions
        if hasattr(request.user, 'speaker'):
            if event.speaker.user != request.user:
                return Response({'error': 'Unauthorized'}, status=403)
        elif hasattr(request.user, 'host'):
            if event.organizer_email != request.user.email:
                return Response({'error': 'Unauthorized'}, status=403)
        else:
            return Response({'error': 'Unauthorized'}, status=403)

        new_status = request.data.get('status')
        response_notes = request.data.get('response_notes', '')

        if new_status not in dict(Event.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=400)

        event.status = new_status
        event.response_notes = response_notes
        event.responded_at = timezone.now()
        event.save()

        return Response(EventSerializer(event).data)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)


# ==================== AVAILABILITY ENDPOINTS ====================

@api_view(['GET'])
def speaker_availability(request, speaker_id):
    """Get speaker's availability calendar"""
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
                date__range=[timezone.now().date(), timezone.now().date() + timedelta(days=30)]
            )

        serializer = SpeakerAvailabilitySerializer(availability, many=True)
        return Response(serializer.data)
    except Speaker.DoesNotExist:
        return Response({'error': 'Speaker not found'}, status=404)


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def update_availability(request):
    """Update speaker availability"""
    try:
        speaker = Speaker.objects.get(user=request.user)
    except Speaker.DoesNotExist:
        return Response({'error': 'Speaker profile not found'}, status=404)

    date = request.data.get('date')
    is_available = request.data.get('is_available', True)
    notes = request.data.get('notes', '')

    availability, created = SpeakerAvailability.objects.update_or_create(
        speaker=speaker,
        date=date,
        defaults={
            'is_available': is_available,
            'notes': notes
        }
    )

    serializer = SpeakerAvailabilitySerializer(availability)
    return Response(serializer.data)


# ==================== MESSAGING/CONVERSATION ENDPOINTS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversations_list(request):
    """Get all conversations for the user"""
    user = request.user
    conversations = Conversation.objects.filter(
        Q(host=user) | Q(speaker=user)
    )

    serializer = ConversationSerializer(
        conversations, many=True, context={'request': request}
    )
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversation_messages(request, conversation_id):
    """Get all messages in a conversation"""
    try:
        conversation = Conversation.objects.get(id=conversation_id)

        # Check if user is part of conversation
        if request.user != conversation.host and request.user != conversation.speaker:
            return Response({'error': 'Unauthorized'}, status=403)

        messages = Message.objects.filter(conversation=conversation).order_by('created_at')

        # Mark messages as read
        messages.filter(recipient=request.user, is_read=False).update(is_read=True)

        serializer = MessageSerializer(messages, many=True)
        return Response({
            'conversation': ConversationSerializer(conversation, context={'request': request}).data,
            'messages': serializer.data
        })
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """Send a message in a conversation"""
    conversation_id = request.data.get('conversation_id')
    body = request.data.get('body')

    try:
        conversation = Conversation.objects.get(id=conversation_id)

        # Check if user is part of conversation
        if request.user != conversation.host and request.user != conversation.speaker:
            return Response({'error': 'Unauthorized'}, status=403)

        # Determine recipient
        recipient = conversation.speaker if request.user == conversation.host else conversation.host

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            recipient=recipient,
            body=body
        )

        # Update conversation timestamp
        conversation.updated_at = timezone.now()
        conversation.save()

        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_conversation(request):
    """Create a new conversation"""
    speaker_id = request.data.get('speaker_id')
    event_id = request.data.get('event_id')
    subject = request.data.get('subject', '')

    try:
        speaker = Speaker.objects.get(id=speaker_id)
        event = Event.objects.get(id=event_id) if event_id else None

        # Determine host
        if hasattr(request.user, 'host'):
            host = request.user
        else:
            return Response({'error': 'Only hosts can create conversations'}, status=403)

        conversation, created = Conversation.objects.get_or_create(
            host=host,
            speaker=speaker.user,
            event=event,
            defaults={'subject': subject}
        )

        return Response(
            ConversationSerializer(conversation, context={'request': request}).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
    except Speaker.DoesNotExist:
        return Response({'error': 'Speaker not found'}, status=404)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)


# ==================== PAYMENT ENDPOINTS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payments_list(request):
    """Get all payments for the user"""
    user = request.user

    if hasattr(user, 'host'):
        payments = Payment.objects.filter(event__organizer_email=user.email)
    elif hasattr(user, 'speaker'):
        payments = Payment.objects.filter(event__speaker=user.speaker)
    else:
        return Response({'error': 'User profile not found'}, status=404)

    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


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

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_payment_status(request, payment_id):
    """Update payment status"""
    try:
        payment = Payment.objects.get(id=payment_id)

        new_status = request.data.get('status')
        transaction_id = request.data.get('transaction_id', '')
        payment_method = request.data.get('payment_method', '')

        payment.status = new_status
        payment.transaction_id = transaction_id
        payment.payment_method = payment_method

        if new_status == 'completed':
            payment.payment_date = timezone.now()

        payment.save()

        return Response(PaymentSerializer(payment).data)
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=404)


# ==================== RATING ENDPOINTS ====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_rating(request):
    """Create a rating for a completed event"""
    event_id = request.data.get('event_id')
    rating = request.data.get('rating')
    feedback = request.data.get('feedback', '')
    would_recommend = request.data.get('would_recommend', True)

    try:
        event = Event.objects.get(id=event_id)

        # Check if event is completed
        if event.status != 'completed':
            return Response({'error': 'Can only rate completed events'}, status=400)

        # Check if rating already exists
        if hasattr(event, 'rating'):
            return Response({'error': 'Rating already exists for this event'}, status=400)

        event_rating = EventRating.objects.create(
            event=event,
            speaker=event.speaker,
            organizer_name=f"{request.user.first_name} {request.user.last_name}",
            rating=rating,
            feedback=feedback,
            would_recommend=would_recommend
        )

        return Response(EventRatingSerializer(event_rating).data, status=status.HTTP_201_CREATED)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=404)


@api_view(['GET'])
def speaker_ratings(request, speaker_id):
    """Get all ratings for a speaker"""
    try:
        speaker = Speaker.objects.get(id=speaker_id)
        ratings = EventRating.objects.filter(speaker=speaker)

        return Response({
            'average_rating': speaker.average_rating,
            'total_ratings': ratings.count(),
            'ratings': EventRatingSerializer(ratings, many=True).data
        })
    except Speaker.DoesNotExist:
        return Response({'error': 'Speaker not found'}, status=404)


# ==================== CONTACT FORM ENDPOINT ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form(request):
    """Handle contact form submissions"""
    from django.core.mail import send_mail
    from django.conf import settings

    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')

    if not all([name, email, subject, message]):
        return Response({'error': 'All fields are required'}, status=400)

    # Save contact submission to database
    contact = ContactSubmission.objects.create(
        name=name,
        email=email,
        subject=subject,
        message=message
    )

    # Send email to admin
    try:
        from django.core.mail import EmailMessage

        admin_message = f"""
New contact form submission from Connect & Inspire:

From: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
REPLY TO THIS EMAIL TO RESPOND DIRECTLY TO THE SENDER.
This is an automated message from the Connect & Inspire Contact Form.
"""

        # Create email with reply-to header
        email_msg = EmailMessage(
            subject=f'[C&I Contact] {subject}',
            body=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=['cndihyderabad@gmail.com'],
            reply_to=[email],  # User's email for easy reply
        )
        email_msg.send(fail_silently=False)

        # Send confirmation email to user
        user_message = f"""
Dear {name},

Thank you for contacting Connect & Inspire! We have received your message and will get back to you as soon as possible.

Your message:
Subject: {subject}
Message: {message}

Best regards,
The Connect & Inspire Team
"""

        send_mail(
            'Thank you for contacting Connect & Inspire',
            user_message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=True,  # Don't fail if user email fails
        )

    except Exception as e:
        print(f"Email sending error: {e}")
        # Continue even if email fails

    return Response({
        'message': 'Thank you for your message. We will get back to you soon!'
    }, status=status.HTTP_201_CREATED)


# ==================== FILE UPLOAD ENDPOINTS ====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    """Upload profile image"""
    from django.core.files.storage import default_storage
    from django.core.files.base import ContentFile
    import uuid
    import os

    if 'image' not in request.FILES:
        return Response({'error': 'No image file provided'}, status=400)

    image_file = request.FILES['image']

    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if image_file.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Only images are allowed.'}, status=400)

    # Validate file size (max 5MB)
    if image_file.size > 5 * 1024 * 1024:
        return Response({'error': 'File size too large. Maximum size is 5MB.'}, status=400)

    try:
        # Generate unique filename
        ext = os.path.splitext(image_file.name)[1]
        filename = f'profile_images/{uuid.uuid4()}{ext}'

        # Save file
        path = default_storage.save(filename, ContentFile(image_file.read()))
        file_url = default_storage.url(path)

        return Response({
            'url': file_url,
            'filename': filename
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Upload failed: {str(e)}'}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_document(request):
    """Upload document"""
    from django.core.files.storage import default_storage
    from django.core.files.base import ContentFile
    import uuid
    import os

    if 'document' not in request.FILES:
        return Response({'error': 'No document file provided'}, status=400)

    document_file = request.FILES['document']

    # Validate file type
    allowed_types = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ]
    if document_file.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'}, status=400)

    # Validate file size (max 10MB)
    if document_file.size > 10 * 1024 * 1024:
        return Response({'error': 'File size too large. Maximum size is 10MB.'}, status=400)

    try:
        # Generate unique filename
        ext = os.path.splitext(document_file.name)[1]
        filename = f'documents/{uuid.uuid4()}{ext}'

        # Save file
        path = default_storage.save(filename, ContentFile(document_file.read()))
        file_url = default_storage.url(path)

        return Response({
            'url': file_url,
            'filename': filename
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Upload failed: {str(e)}'}, status=500)
