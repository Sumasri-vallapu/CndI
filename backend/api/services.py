from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from .models import OTPVerification
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """Service class for sending emails"""
    
    @staticmethod
    def send_otp_email(email, purpose, user_context=None):
        """
        Send OTP email to user
        
        Args:
            email (str): Recipient email address
            purpose (str): Purpose of OTP (signup_host, signup_speaker, forgot_password)
            user_context (dict): Additional context for personalization
            
        Returns:
            tuple: (success: bool, otp_instance: OTPVerification or None, message: str)
        """
        try:
            # Remove any existing unverified OTP for this email and purpose
            OTPVerification.objects.filter(
                email=email, 
                purpose=purpose, 
                is_verified=False
            ).delete()
            
            # Create new OTP
            otp_instance = OTPVerification.objects.create(
                email=email,
                purpose=purpose
            )
            
            # Prepare email context
            email_context = {
                'OTP': otp_instance.otp_code,
                'SUPPORT_EMAIL': settings.EMAIL_HOST_USER,
                'purpose': purpose,
                'user_type': 'Host' if 'host' in purpose else 'Speaker/Guest',
                'first_name': user_context.get('first_name', '') if user_context else '',
                'expires_minutes': 10
            }
            
            # Render email template
            html_message = render_to_string('emails/otp_email.html', email_context)
            
            # Determine subject based on purpose
            subject_map = {
                'signup_host': 'Complete Your Host Registration',
                'signup_speaker': 'Complete Your Speaker Registration', 
                'forgot_password': 'Reset Your Password'
            }
            subject = subject_map.get(purpose, 'Your Verification Code')
            
            # Send email
            send_mail(
                subject=subject,
                message=f'Your verification code is: {otp_instance.otp_code}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"OTP email sent successfully to {email} for {purpose}")
            return True, otp_instance, "OTP sent successfully"
            
        except Exception as e:
            logger.error(f"Failed to send OTP email to {email}: {str(e)}")
            return False, None, f"Failed to send email: {str(e)}"
    
    @staticmethod
    def verify_otp(email, otp_code, purpose):
        """
        Verify OTP code
        
        Args:
            email (str): Email address
            otp_code (str): OTP code to verify
            purpose (str): Purpose of OTP
            
        Returns:
            tuple: (success: bool, message: str, otp_instance: OTPVerification or None)
        """
        try:
            # Find the OTP instance
            otp_instance = OTPVerification.objects.filter(
                email=email,
                purpose=purpose,
                is_verified=False
            ).first()
            
            if not otp_instance:
                return False, "No valid OTP found for this email", None
            
            # Check if expired
            if otp_instance.is_expired():
                return False, "OTP has expired. Please request a new one", otp_instance
            
            # Check max attempts
            if otp_instance.attempts >= otp_instance.max_attempts:
                return False, "Maximum verification attempts exceeded. Please request a new OTP", otp_instance
            
            # Verify OTP code
            if otp_instance.otp_code != otp_code:
                otp_instance.increment_attempts()
                remaining_attempts = otp_instance.max_attempts - otp_instance.attempts
                if remaining_attempts > 0:
                    return False, f"Invalid OTP code. {remaining_attempts} attempts remaining", otp_instance
                else:
                    return False, "Invalid OTP code. Maximum attempts exceeded", otp_instance
            
            # OTP is valid
            otp_instance.is_verified = True
            otp_instance.save()
            
            logger.info(f"OTP verified successfully for {email} - {purpose}")
            return True, "OTP verified successfully", otp_instance
            
        except Exception as e:
            logger.error(f"Error verifying OTP for {email}: {str(e)}")
            return False, f"Verification error: {str(e)}", None
    
    @staticmethod
    def resend_otp(email, purpose, user_context=None):
        """
        Resend OTP (creates a new one and invalidates old ones)
        
        Args:
            email (str): Email address
            purpose (str): Purpose of OTP
            user_context (dict): Additional context for personalization
            
        Returns:
            tuple: (success: bool, message: str)
        """
        # Check if too many recent attempts
        recent_otps = OTPVerification.objects.filter(
            email=email,
            purpose=purpose,
            created_at__gte=timezone.now() - timezone.timedelta(minutes=1)
        ).count()
        
        if recent_otps >= 3:
            return False, "Too many OTP requests. Please wait before requesting again"
        
        # Send new OTP (this will automatically remove old ones)
        success, otp_instance, message = EmailService.send_otp_email(email, purpose, user_context)
        return success, message


class UserService:
    """Service class for user management during signup process"""
    
    @staticmethod
    def get_purpose_for_user_type(user_type):
        """Convert user_type to OTP purpose"""
        if user_type == 'host':
            return 'signup_host'
        elif user_type in ['speaker', 'guest']:
            return 'signup_speaker'
        else:
            raise ValueError(f"Invalid user_type: {user_type}")