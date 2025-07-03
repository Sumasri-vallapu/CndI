from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile
from datetime import datetime
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
def signup(request):
    data = request.data
    email = data.get('email')
    otp = data.get('otp')
    
    # Verify OTP
    if otp_store.get(email) != int(otp):
        return Response({"error": "Invalid OTP"}, status=400)
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({"error": "User with this email already exists"}, status=400)
    
    try:
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=data.get('name', '').split(' ')[0],
            last_name=' '.join(data.get('name', '').split(' ')[1:]),
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
        del otp_store[email]
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Account created successfully",
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
                "Password Reset - ClearMyFile",
                f"Your password reset code is: {otp}",
                "clearmyfile.org@gmail.com",  # Replace with your email
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

# Location endpoints
@api_view(['GET'])
def get_states(request):
    states = [
        {"id": "1", "name": "Andhra Pradesh"},
        {"id": "2", "name": "Arunachal Pradesh"},
        {"id": "3", "name": "Assam"},
        {"id": "4", "name": "Bihar"},
        {"id": "5", "name": "Chhattisgarh"},
        {"id": "6", "name": "Goa"},
        {"id": "7", "name": "Gujarat"},
        {"id": "8", "name": "Haryana"},
        {"id": "9", "name": "Himachal Pradesh"},
        {"id": "10", "name": "Jharkhand"},
        {"id": "11", "name": "Karnataka"},
        {"id": "12", "name": "Kerala"},
        {"id": "13", "name": "Madhya Pradesh"},
        {"id": "14", "name": "Maharashtra"},
        {"id": "15", "name": "Manipur"},
        {"id": "16", "name": "Meghalaya"},
        {"id": "17", "name": "Mizoram"},
        {"id": "18", "name": "Nagaland"},
        {"id": "19", "name": "Odisha"},
        {"id": "20", "name": "Punjab"},
        {"id": "21", "name": "Rajasthan"},
        {"id": "22", "name": "Sikkim"},
        {"id": "23", "name": "Tamil Nadu"},
        {"id": "24", "name": "Telangana"},
        {"id": "25", "name": "Tripura"},
        {"id": "26", "name": "Uttar Pradesh"},
        {"id": "27", "name": "Uttarakhand"},
        {"id": "28", "name": "West Bengal"},
        {"id": "29", "name": "Delhi"},
        {"id": "30", "name": "Jammu and Kashmir"},
        {"id": "31", "name": "Ladakh"},
        {"id": "32", "name": "Puducherry"},
        {"id": "33", "name": "Chandigarh"},
        {"id": "34", "name": "Dadra and Nagar Haveli and Daman and Diu"},
        {"id": "35", "name": "Lakshadweep"},
        {"id": "36", "name": "Andaman and Nicobar Islands"}
    ]
    return Response(states)

@api_view(['GET'])
def get_districts(request):
    state_id = request.GET.get('state_id')
    # Sample districts for demonstration - you can expand this based on state_id
    districts = [
        {"id": "1", "name": "Visakhapatnam"},
        {"id": "2", "name": "Vijayawada"},
        {"id": "3", "name": "Guntur"},
        {"id": "4", "name": "Nellore"},
        {"id": "5", "name": "Kurnool"},
        {"id": "6", "name": "Rajahmundry"},
        {"id": "7", "name": "Tirupati"},
        {"id": "8", "name": "Kadapa"},
        {"id": "9", "name": "Anantapur"},
        {"id": "10", "name": "Chittoor"}
    ]
    return Response(districts)

@api_view(['GET'])
def get_mandals(request):
    district_id = request.GET.get('district_id')
    # Sample mandals for demonstration
    mandals = [
        {"id": "1", "name": "Mandal 1"},
        {"id": "2", "name": "Mandal 2"},
        {"id": "3", "name": "Mandal 3"},
        {"id": "4", "name": "Mandal 4"},
        {"id": "5", "name": "Mandal 5"}
    ]
    return Response(mandals)

@api_view(['GET'])
def get_grampanchayats(request):
    mandal_id = request.GET.get('mandal_id')
    # Sample grampanchayats for demonstration
    grampanchayats = [
        {"id": "1", "name": "Grampanchayat 1"},
        {"id": "2", "name": "Grampanchayat 2"},
        {"id": "3", "name": "Grampanchayat 3"},
        {"id": "4", "name": "Grampanchayat 4"},
        {"id": "5", "name": "Grampanchayat 5"}
    ]
    return Response(grampanchayats)
