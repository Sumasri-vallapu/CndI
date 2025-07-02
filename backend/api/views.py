from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import random

otp_store = {}

@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=400)

    otp = random.randint(1000, 9999)
    otp_store[email] = otp

    send_mail(
        "Your ClearMyFile OTP",
        f"Your OTP is: {otp}",
        "yourapp@gmail.com",  # Replace with your email
        [email],
        fail_silently=False,
    )
    return Response({"message": "OTP sent"})

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    if otp_store.get(email) != int(otp):
        return Response({"error": "Invalid OTP"}, status=400)

    user, _ = User.objects.get_or_create(username=email)
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": f"Hello {request.user.username}"})
