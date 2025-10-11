# 🚀 Production Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Backend Security & Cleanup

#### ✅ Remove Debug Endpoints (CRITICAL)
Edit `/backend/api/urls.py` and remove these lines:

```python
# REMOVE THESE LINES IN PRODUCTION:
path('debug/otps/', auth_views.debug_otps, name='debug-otps'),
path('debug/pending-users/', auth_views.debug_pending_users, name='debug-pending-users'),
path('debug/users/', views.debug_users, name='debug-users'),
```

#### ✅ Update Django Settings for Production
Edit `/backend/backend/settings.py`:

```python
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False  # Change from True to False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-production-secret-key-here')

# Update allowed hosts for your domain
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1", 
    "13.53.36.126",  # Your server IP
    "yourdomain.com",  # Add your domain
    "www.yourdomain.com"  # Add www version
]

# Restrict CORS origins for production
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    # Remove localhost entries for production
]

CORS_ALLOW_ALL_ORIGINS = False  # Change from True to False

# Email Configuration (verify these are correct)
EMAIL_HOST_USER = 'vallapusumasri@gmail.com'
EMAIL_HOST_PASSWORD = 'bvvs wgmo bjcb yvld'  # Use environment variables in real production

# Production security settings
SECURE_SSL_REDIRECT = True  # Uncomment for HTTPS
SECURE_BROWSER_XSS_FILTER = True  # Uncomment
SECURE_CONTENT_TYPE_NOSNIFF = True  # Uncomment
```

#### ✅ Use Environment Variables for Secrets
Create `/backend/.env` file:

```bash
SECRET_KEY=your-super-secret-production-key-here
EMAIL_HOST_USER=vallapusumasri@gmail.com
EMAIL_HOST_PASSWORD=bvvs wgmo bjcb yvld
DEBUG=False
```

Update settings.py to use them:

```python
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
```

### 2. Frontend Production Build

#### ✅ Update API Base URL
Edit `/frontend/src/utils/api.ts`:

```typescript
// Production URL
const BASE_URL = 'https://yourdomain.com/api';

// Or if using IP:
// const BASE_URL = 'http://13.53.36.126/api';
```

#### ✅ Build Frontend for Production
```bash
cd frontend
npm run build
```

#### ✅ Update Nginx Configuration
Make sure nginx serves the built frontend and proxies API calls:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Serve frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API calls to Django
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🧪 Testing with Real Email

### Test Environment Setup

#### Option 1: Test on Local Development
1. Start Django server: `python manage.py runserver`
2. Start frontend dev server: `npm run dev`
3. Update frontend to use: `const BASE_URL = 'http://localhost:8000/api';`

#### Option 2: Test on Production Server
1. Update frontend to use your server IP: `const BASE_URL = 'http://13.53.36.126/api';`
2. Build and deploy frontend
3. Make sure Django is running on server

### Complete Email Testing Checklist

#### ✅ Host Signup Flow Test
1. **Step 1: Request OTP**
   - Go to host signup page
   - Enter: Email, First Name, Last Name
   - Click "Send Verification Code"
   - **Expected:** Success message, moves to step 2

2. **Step 2: Verify OTP**
   - **Check your email** (should arrive in 1-2 minutes)
   - Email should have:
     - Subject: "[Connect & Inspire] Complete Your Host Registration"
     - HTML template with your branding
     - 6-digit OTP code
   - Enter the OTP code
   - Click "Verify Code"
   - **Expected:** Success message, moves to step 3

3. **Step 3: Create Password**
   - Enter password (min 8 characters)
   - Confirm password
   - Click "Create Account" 
   - **Expected:** Account created, JWT tokens stored, redirected to dashboard

4. **Test Login**
   - Go to login page
   - Use the email and password you just created
   - **Expected:** Successful login with JWT token

#### ✅ Speaker Signup Flow Test
- Same process as host signup
- Should get "signup_speaker" purpose in OTP
- Should create Speaker profile instead of Host profile

#### ✅ Password Reset Flow Test
1. **Step 1: Request Reset**
   - Go to "Forgot Password" page
   - Enter registered email
   - **Expected:** Success message

2. **Step 2: Check Email**
   - **Check your email** for reset OTP
   - Email should have:
     - Subject: "[Connect & Inspire] Reset Your Password"
     - 6-digit OTP code

3. **Step 3: Reset Password**
   - Enter OTP code
   - Enter new password
   - Confirm new password
   - **Expected:** Password reset successfully

4. **Test Login with New Password**
   - Login with email and new password
   - **Expected:** Successful login

### Email Troubleshooting

#### If emails are not received:

1. **Check Spam Folder**
   - Gmail might mark emails as spam initially

2. **Verify SMTP Settings**
   ```bash
   # Test Django email in shell
   cd backend
   source venv/bin/activate
   python manage.py shell
   
   >>> from django.core.mail import send_mail
   >>> send_mail('Test', 'Test message', 'vallapusumasri@gmail.com', ['your-test-email@gmail.com'])
   ```

3. **Check Django Logs**
   - Look for email sending errors in console output
   - Check if SMTP authentication is working

4. **Verify Gmail App Password**
   - Make sure "bvvs wgmo bjcb yvld" is still valid
   - You might need to regenerate it

#### If OTPs are not working:

1. **Check OTP Generation**
   ```bash
   # On development, you can check generated OTPs:
   curl http://localhost:8000/api/debug/otps/
   ```

2. **Verify OTP Expiry**
   - OTPs expire after 10 minutes
   - Check system time on server

3. **Check OTP Attempt Limits**
   - Max 3 attempts per OTP
   - Use resend functionality if needed

---

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit secrets to git
- Use `.env` files or server environment variables
- Add `.env` to `.gitignore`

### 2. HTTPS in Production
- Use SSL certificates (Let's Encrypt is free)
- Set `SECURE_SSL_REDIRECT = True`
- Update frontend to use `https://` URLs

### 3. Database Security
- Use PostgreSQL in production (not SQLite)
- Regular database backups
- Secure database credentials

### 4. Rate Limiting
Consider adding rate limiting for:
- OTP requests (max 3 per minute per IP)
- Login attempts (max 5 per minute per IP)
- Password reset requests

### 5. Logging
- Log authentication attempts
- Log email sending success/failure
- Monitor for unusual activity

---

## 🚀 Deployment Commands

### Backend Deployment
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Frontend Deployment
```bash
cd frontend
npm install
npm run build
# Copy dist/ folder to nginx web root
cp -r dist/* /var/www/html/
```

---

## 📋 Post-Deployment Verification

After deploying to production:

1. **✅ Test Host Signup** with real email
2. **✅ Test Speaker Signup** with real email  
3. **✅ Test Login** with created accounts
4. **✅ Test Password Reset** flow
5. **✅ Verify Debug Endpoints are Removed**
   - `GET /api/debug/otps/` should return 404
   - `GET /api/debug/users/` should return 404
6. **✅ Test Email Templates** look good
7. **✅ Check Browser Console** for JavaScript errors
8. **✅ Verify JWT Token Storage** in localStorage
9. **✅ Test Responsive Design** on mobile devices

---

## 🆘 Rollback Plan

If issues occur in production:

1. **Quick Fix:** Revert to legacy endpoints temporarily
   ```typescript
   // In frontend, temporarily use old endpoints:
   const BASE_URL = 'http://localhost:8000/api';
   // Use ENDPOINTS.SEND_OTP instead of ENDPOINTS.AUTH.SIGNUP_REQUEST
   ```

2. **Database Rollback:** 
   ```bash
   python manage.py migrate api 0004  # Rollback to previous migration
   ```

3. **Code Rollback:**
   - Use git to revert to previous working commit
   - Redeploy previous version

---

## 📞 Support Contacts

- **Email Issues:** Check Gmail settings and app password
- **Server Issues:** Check nginx and gunicorn logs
- **Database Issues:** Check Django migration status
- **Frontend Issues:** Check browser console and network tab

**🎉 Once everything is working in production, you'll have a complete, secure, email-verified authentication system for both hosts and speakers!**