from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
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

    # HTML email template from emailtemplate.txt
    email_subject = "Verify Your Email - ClearMyFile"
    html_message = f"""<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; text-align: center;">
    <div style="max-width: 500px; background: #fff; margin: auto; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Welcome to <span style="color: #1D4ED8;">ClearMyFile</span>!</h2>
      <p style="font-size: 16px; color: #555;">To verify your email address, please use the code below:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #2563EB;">{otp}</div>
      <p style="font-size: 12px; color: #999; margin-top: 20px;">This code is valid for 10 minutes. If you didn't create an account, please ignore this email.</p>
    </div>
  </body>
</html>"""

    try:
        from django.core.mail import EmailMultiAlternatives
        
        # Create email with both text and HTML versions
        text_content = f"""Hello {name}!

Thank you for joining ClearMyFile! 

To verify your email address, please use the verification code below:

Verification Code: {otp}

This code will expire in 10 minutes for your security.

If you didn't create an account with ClearMyFile, please ignore this email.

Best regards,
The ClearMyFile Team"""
        
        msg = EmailMultiAlternatives(
            email_subject,
            text_content,
            "noreply@clearmyfile.org",
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
        welcome_subject = "Welcome to ClearMyFile - You're All Set!"
        welcome_message = f"""Congratulations {user.first_name}!

Your ClearMyFile account has been successfully created and verified!

You're now part of our growing community dedicated to making document verification simple, secure, and reliable.

What's Next?
• Complete your profile to get started
• Explore our document verification services
• Connect with our support team if you need any help

Why Choose ClearMyFile?
• Fast and secure document processing
• 24/7 customer support
• User-friendly interface
• Trusted by thousands of users

Ready to get started? Log in to your account and explore all the features we have to offer.

If you have any questions or need assistance, don't hesitate to reach out to our support team.

Welcome aboard!

Best regards,
The ClearMyFile Team

---
ClearMyFile.org - Making document verification simple and secure
Need help? Contact us at support@clearmyfile.org"""

        try:
            send_mail(
                welcome_subject,
                welcome_message,
                "welcome@clearmyfile.org",
                [email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Welcome email sending failed: {e}")
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Account created successfully! Welcome to ClearMyFile!",
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

@api_view(['GET'])
def get_states(request):
    states = State.objects.all()
    return Response([{"id": state.id, "name": state.state_name} for state in states])

@api_view(['GET'])
def get_districts(request):
    state_id = request.GET.get('state_id')
    districts = District.objects.filter(state_id=state_id)
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

