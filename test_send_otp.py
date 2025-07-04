#!/usr/bin/env python3
"""
Test script to simulate send_otp API call
This mimics what the Django backend would do when send_otp is called
"""
import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def test_send_otp(email, name="Test User"):
    """Test OTP sending functionality"""
    
    # Generate 6-digit OTP
    otp = random.randint(100000, 999999)
    print(f"[OTP GENERATED] {otp} for {email}")
    
    # Email configuration (same as Django settings)
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = 'clearmyfile.org@gmail.com'
    EMAIL_HOST_PASSWORD = 'vdnl xmcv pmih jwks'
    
    # Email content
    email_subject = "Verify Your Email - ClearMyFile"
    email_message = f"""Hello {name}!

Thank you for joining ClearMyFile! We're excited to have you on board.

To complete your registration and verify your email address, please use the verification code below:

Verification Code: {otp}

This code will expire in 10 minutes for your security.

If you didn't create an account with ClearMyFile, please ignore this email.

Welcome to the ClearMyFile community!

Best regards,
The ClearMyFile Team

---
ClearMyFile.org - Making document verification simple and secure"""

    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_HOST_USER
        msg['To'] = email
        msg['Subject'] = email_subject
        msg.attach(MIMEText(email_message, 'plain'))
        
        # Connect to Gmail SMTP
        print(f"[CONNECTING] to {EMAIL_HOST}:{EMAIL_PORT}")
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        
        print(f"[AUTHENTICATING] with {EMAIL_HOST_USER}")
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        
        print(f"[SENDING EMAIL] to {email}")
        text = msg.as_string()
        server.sendmail(EMAIL_HOST_USER, email, text)
        server.quit()
        
        print(f"[SUCCESS] OTP sent successfully to {email}: {otp}")
        return True, otp
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"[ERROR] Authentication failed: {e}")
        print(f"[OTP] Development OTP for {email}: {otp}")
        return False, otp
    except Exception as e:
        print(f"[ERROR] Email sending failed: {e}")
        print(f"[OTP] Development OTP for {email}: {otp}")
        return False, otp

if __name__ == "__main__":
    test_email = "together.chronical.2021@gmail.com"
    print(f"Testing send_otp endpoint with email: {test_email}")
    print("=" * 60)
    
    success, otp_code = test_send_otp(test_email)
    
    print("=" * 60)
    if success:
        print(f"✅ EMAIL SENT SUCCESSFULLY!")
        print(f"📧 Check {test_email} for the verification code")
        print(f"🔢 OTP Code: {otp_code}")
    else:
        print(f"❌ EMAIL SENDING FAILED")
        print(f"🔢 OTP Code (for testing): {otp_code}")
        print(f"💡 Use this OTP code to test the verification flow")