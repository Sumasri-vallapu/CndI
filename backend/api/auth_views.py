from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from django.utils import timezone
import logging

from .models import OTPVerification, PendingUser, Host, Speaker, UserProfile
from .services import EmailService, UserService
from .serializers import (
    SignupRequestSerializer, OTPVerificationSerializer, PasswordSetSerializer,
    LoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, ResendOTPSerializer
)

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_request(request):
    """
    Step 1: Initial signup request
    Validates email and user type, sends OTP email
    """
    serializer = SignupRequestSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        user_type = serializer.validated_data['user_type']
        first_name = serializer.validated_data.get('first_name', '')
        last_name = serializer.validated_data.get('last_name', '')
        
        try:
            # Create or update pending user
            pending_user, created = PendingUser.objects.get_or_create(
                email=email,
                defaults={
                    'user_type': user_type,
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )
            
            if not created:
                # Update existing pending user
                pending_user.user_type = user_type
                pending_user.first_name = first_name
                pending_user.last_name = last_name
                pending_user.is_email_verified = False
                pending_user.save()
            
            # Get OTP purpose based on user type
            purpose = UserService.get_purpose_for_user_type(user_type)
            
            # Send OTP email
            success, otp_instance, message = EmailService.send_otp_email(
                email=email,
                purpose=purpose,
                user_context={
                    'first_name': first_name,
                    'user_type': user_type
                }
            )
            
            if success:
                return Response({
                    'message': 'Verification code sent to your email',
                    'email': email,
                    'user_type': user_type
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': message
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            logger.error(f"Signup request error: {str(e)}")
            return Response({
                'error': 'Failed to process signup request'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Step 2: Verify OTP code
    """
    # Debug log the incoming request
    logger.info(f"OTP Verification Request Data: {request.data}")

    serializer = OTPVerificationSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        purpose = serializer.validated_data['purpose']

        logger.info(f"Serializer validated - Email: {email}, OTP: {otp_code}, Purpose: {purpose}")

        try:
            # Verify OTP
            success, message, otp_instance = EmailService.verify_otp(email, otp_code, purpose)

            if success:
                # Mark pending user as email verified
                try:
                    pending_user = PendingUser.objects.get(email=email)
                    pending_user.is_email_verified = True
                    pending_user.save()
                except PendingUser.DoesNotExist:
                    pass

                return Response({
                    'message': message,
                    'verified': True
                }, status=status.HTTP_200_OK)
            else:
                logger.warning(f"OTP verification failed: {message}")
                return Response({
                    'error': message,
                    'verified': False
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"OTP verification error: {str(e)}")
            return Response({
                'error': 'Failed to verify OTP'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        logger.error(f"Serializer validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def set_password(request):
    """
    Step 3: Set password after OTP verification
    Creates the actual user account
    """
    serializer = PasswordSetSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            # Check if email was verified
            pending_user = PendingUser.objects.get(email=email, is_email_verified=True)

            with transaction.atomic():
                # Check if user already exists
                user = User.objects.filter(email=email).first()

                if user:
                    # User exists - add additional profile (dual registration)
                    # Verify password matches
                    if not user.check_password(password):
                        return Response({
                            'error': 'Email already registered with a different password. Please use the same password or login.'
                        }, status=status.HTTP_400_BAD_REQUEST)

                    # Add the new profile type
                    if pending_user.user_type == 'host':
                        if hasattr(user, 'host'):
                            return Response({
                                'error': 'You are already registered as a Host. Please login.'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        Host.objects.create(user=user)
                    elif pending_user.user_type == 'speaker':
                        if hasattr(user, 'speaker'):
                            return Response({
                                'error': 'You are already registered as a Speaker. Please login.'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        Speaker.objects.create(user=user)
                else:
                    # Create new Django User
                    user = User.objects.create_user(
                        username=email,
                        email=email,
                        first_name=pending_user.first_name,
                        last_name=pending_user.last_name,
                        password=password
                    )

                    # Create specific profile based on user type
                    if pending_user.user_type == 'host':
                        Host.objects.create(user=user)
                    elif pending_user.user_type == 'speaker':
                        Speaker.objects.create(user=user)

                    # Create basic UserProfile if it doesn't exist
                    if not hasattr(user, 'userprofile'):
                        UserProfile.objects.create(user=user)

                # Clean up
                pending_user.delete()

                # Clear any remaining OTPs for this email
                OTPVerification.objects.filter(email=email).delete()

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)

                # Determine current user type for response
                user_type = pending_user.user_type

                return Response({
                    'message': 'Account created successfully!',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'user_type': user_type,
                        'is_host': hasattr(user, 'host'),
                        'is_speaker': hasattr(user, 'speaker')
                    }
                }, status=status.HTTP_201_CREATED)
                
        except PendingUser.DoesNotExist:
            return Response({
                'error': 'Email not verified or verification expired. Please start the signup process again.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Password set error: {str(e)}")
            return Response({
                'error': 'Failed to create account'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    User login with email and password
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            # Get user by email
            user = User.objects.get(email=email)
            
            # Authenticate
            authenticated_user = authenticate(username=user.username, password=password)
            
            if authenticated_user:
                # Determine user types (can have both)
                is_host = hasattr(user, 'host')
                is_speaker = hasattr(user, 'speaker')

                # Default user_type for backward compatibility
                user_type = None
                if is_host and is_speaker:
                    user_type = 'both'
                elif is_host:
                    user_type = 'host'
                elif is_speaker:
                    user_type = 'speaker'

                # Generate tokens
                refresh = RefreshToken.for_user(authenticated_user)

                return Response({
                    'message': 'Login successful',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'user_type': user_type,
                        'is_host': is_host,
                        'is_speaker': is_speaker
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except User.DoesNotExist:
            return Response({
                'error': 'No account found with this email address'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'error': 'Login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """
    Step 1 of password reset: Send OTP to user's email
    """
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        try:
            # Get user to get their name for personalization
            user = User.objects.get(email=email)
            
            # Send OTP email
            success, otp_instance, message = EmailService.send_otp_email(
                email=email,
                purpose='forgot_password',
                user_context={
                    'first_name': user.first_name,
                }
            )
            
            if success:
                return Response({
                    'message': 'Password reset code sent to your email',
                    'email': email
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': message
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except User.DoesNotExist:
            # For security, don't reveal if email exists or not
            return Response({
                'message': 'If an account with this email exists, a password reset code has been sent.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Forgot password error: {str(e)}")
            return Response({
                'error': 'Failed to process password reset request'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Step 2 of password reset: Verify OTP and set new password
    """
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        otp_code = serializer.validated_data['otp_code']
        new_password = serializer.validated_data['new_password']
        
        try:
            # Verify OTP first
            success, message, otp_instance = EmailService.verify_otp(
                email, otp_code, 'forgot_password'
            )
            
            if not success:
                return Response({
                    'error': message
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get user and update password
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            
            # Clear all password reset OTPs for this email
            OTPVerification.objects.filter(email=email, purpose='forgot_password').delete()
            
            return Response({
                'message': 'Password reset successfully. You can now log in with your new password.'
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Reset password error: {str(e)}")
            return Response({
                'error': 'Failed to reset password'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_otp(request):
    """
    Resend OTP for any purpose (signup or password reset)
    """
    serializer = ResendOTPSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        purpose = serializer.validated_data['purpose']
        
        try:
            # Get user context for personalization
            user_context = {}
            if purpose == 'forgot_password':
                try:
                    user = User.objects.get(email=email)
                    user_context = {'first_name': user.first_name}
                except User.DoesNotExist:
                    pass
            else:
                # For signup purposes, try to get from pending user
                try:
                    pending_user = PendingUser.objects.get(email=email)
                    user_context = {
                        'first_name': pending_user.first_name,
                        'user_type': pending_user.user_type
                    }
                except PendingUser.DoesNotExist:
                    pass
            
            # Resend OTP
            success, message = EmailService.resend_otp(email, purpose, user_context)
            
            if success:
                return Response({
                    'message': 'New verification code sent to your email'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': message
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Resend OTP error: {str(e)}")
            return Response({
                'error': 'Failed to resend verification code'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def check_email_exists(request):
    """Check if email already exists in the system"""
    email = request.data.get('email')
    
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user with this email already exists
    exists = User.objects.filter(email=email).exists()
    
    return Response({
        "exists": exists,
        "email": email
    }, status=status.HTTP_200_OK)


# Debug endpoints (remove in production)
@api_view(['GET'])
@permission_classes([AllowAny])
def debug_otps(request):
    """Debug endpoint to check OTPs (remove in production)"""
    email = request.query_params.get('email')

    if email:
        otps = OTPVerification.objects.filter(email=email).values(
            'email', 'otp_code', 'purpose', 'is_verified', 'attempts', 'created_at', 'expires_at'
        ).order_by('-created_at')
    else:
        otps = OTPVerification.objects.all().values(
            'email', 'otp_code', 'purpose', 'is_verified', 'attempts', 'created_at', 'expires_at'
        ).order_by('-created_at')[:10]

    return Response({"otps": list(otps), "count": len(otps)})


@api_view(['GET'])
@permission_classes([AllowAny])
def debug_pending_users(request):
    """Debug endpoint to check pending users (remove in production)"""
    pending = PendingUser.objects.all().values(
        'email', 'user_type', 'first_name', 'last_name', 'is_email_verified', 'created_at'
    )
    return Response({"pending_users": list(pending)})