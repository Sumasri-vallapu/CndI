# 🚀 Frontend Migration Guide: New OTP Authentication System

## Overview
This guide will help you migrate from the old authentication system to the new 3-step OTP-based authentication system for both Host and Speaker signups.

---

## 📋 Migration Checklist

### ✅ Step 1: Update API Endpoints (COMPLETED)
- [x] Updated `/frontend/src/utils/api.ts` with new AUTH endpoints
- [x] Created `/frontend/src/utils/authService.ts` service

### 🔄 Step 2: Update Frontend Components (YOUR TASK)

You need to update these files:

#### 2.1 Authentication Pages
- [ ] `src/pages/HostSignup.tsx` - Update to 3-step flow
- [ ] `src/pages/SpeakerSignup.tsx` - Update to 3-step flow  
- [ ] `src/pages/HostLogin.tsx` - Update to new login endpoint
- [ ] `src/pages/SpeakerLogin.tsx` - Update to new login endpoint
- [ ] `src/pages/ForgotPassword.tsx` - Update to new forgot password flow
- [ ] `src/pages/ResetPasswordOtp.tsx` - Update to new reset flow
- [ ] `src/pages/ResetPasswordNew.tsx` - Update to new reset flow

#### 2.2 Any Custom Authentication Hooks/Components
- [ ] Check for custom auth hooks in `src/hooks/`
- [ ] Update any authentication context providers
- [ ] Update any middleware/guards that use auth tokens

---

## 🔀 New Authentication Flow

### OLD FLOW (2 steps):
1. Send OTP → 2. Complete Signup (OTP + Password + Details)

### NEW FLOW (3 steps):
1. **Signup Request** (Email + User Type) → Get OTP via email
2. **Verify OTP** (Email + OTP Code) → Verify code
3. **Set Password** (Email + Password) → Create account & get JWT tokens

---

## 🛠️ Code Migration Examples

### 1. Host Signup Migration

#### OLD CODE:
```typescript
// Step 1: Send OTP
const res = await fetch(ENDPOINTS.SEND_OTP, {
  method: 'POST',
  body: JSON.stringify({ email: formData.email, name: 'Host User' })
});

// Step 2: Complete signup with OTP + all details
const res = await fetch(ENDPOINTS.SIGNUP, {
  method: 'POST',
  body: JSON.stringify({
    email, otp, password, firstName, lastName, 
    phone, organization, organizationType, position
  })
});
```

#### NEW CODE:
```typescript
import { authService } from '../utils/authService';

// Step 1: Request OTP
await authService.signupRequest({
  email: formData.email,
  user_type: 'host',
  first_name: formData.firstName,
  last_name: formData.lastName
});

// Step 2: Verify OTP
await authService.verifyOTP({
  email: formData.email,
  otp_code: formData.otp,
  purpose: 'signup_host'
});

// Step 3: Set password (this creates the account)
const result = await authService.setPassword({
  email: formData.email,
  password: formData.password,
  confirm_password: formData.confirmPassword
});

// JWT tokens are automatically stored
// Navigate to success page or dashboard
```

### 2. Speaker Signup Migration

#### OLD CODE:
```typescript
// Similar to host but with speaker-specific fields
const res = await fetch(ENDPOINTS.SIGNUP, {
  method: 'POST',
  body: JSON.stringify({
    email, otp, password, firstName, lastName,
    expertise, bio, hourlyRate, // speaker fields
  })
});
```

#### NEW CODE:
```typescript
// Step 1: Request OTP
await authService.signupRequest({
  email: formData.email,
  user_type: 'speaker', // Key difference
  first_name: formData.firstName,
  last_name: formData.lastName
});

// Step 2: Verify OTP
await authService.verifyOTP({
  email: formData.email,
  otp_code: formData.otp,
  purpose: 'signup_speaker' // Key difference
});

// Step 3: Set password
await authService.setPassword({
  email: formData.email,
  password: formData.password,
  confirm_password: formData.confirmPassword
});
```

### 3. Login Migration

#### OLD CODE:
```typescript
const res = await fetch(ENDPOINTS.LOGIN, {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

#### NEW CODE:
```typescript
const result = await authService.login({
  email: formData.email,
  password: formData.password
});

// result.user.user_type tells you if it's 'host' or 'speaker'
// JWT tokens are automatically stored
```

### 4. Forgot Password Migration

#### OLD CODE:
```typescript
// Step 1: Request reset
const res = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
  method: 'POST',
  body: JSON.stringify({ email })
});

// Step 2: Reset with OTP
const res = await fetch(ENDPOINTS.RESET_PASSWORD, {
  method: 'POST',
  body: JSON.stringify({ email, otp, new_password })
});
```

#### NEW CODE:
```typescript
// Step 1: Request reset OTP
await authService.forgotPassword({
  email: formData.email
});

// Step 2: Reset password with OTP
await authService.resetPassword({
  email: formData.email,
  otp_code: formData.otp,
  new_password: formData.newPassword,
  confirm_password: formData.confirmPassword
});
```

---

## 📱 UI/UX Improvements

### 1. Step Indicators
Add visual step indicators to show progress:
```jsx
<div className="flex items-center justify-center mb-8">
  <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Email</div>
  <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Verify</div>
  <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Password</div>
</div>
```

### 2. OTP Input Component
Create a better OTP input experience:
```jsx
<input
  type="text"
  maxLength="6"
  pattern="[0-9]*"
  placeholder="Enter 6-digit code"
  className="text-center text-2xl tracking-widest"
/>
```

### 3. Resend OTP Feature
```jsx
<button 
  onClick={() => authService.resendOTP(email, purpose)}
  disabled={!canResend}
>
  Resend Code {countdown > 0 && `(${countdown}s)`}
</button>
```

---

## 🧪 Step 3: Test with Real Email

### 3.1 Update Base URL for Production
```typescript
// In src/utils/api.ts
const BASE_URL = 'http://13.53.36.126/api'; // Your server IP
```

### 3.2 Test the Complete Flow

1. **Host Signup Test:**
   - Go to Host Signup page
   - Enter real email address
   - Check email for OTP (should arrive within 1-2 minutes)
   - Enter OTP code
   - Create password
   - Verify you're logged in with JWT token

2. **Speaker Signup Test:**
   - Same process but with Speaker signup
   - Should get different email template context

3. **Login Test:**
   - Use created credentials to login
   - Verify JWT tokens are stored

4. **Password Reset Test:**
   - Use "Forgot Password" link
   - Enter registered email
   - Check email for reset OTP
   - Reset password with OTP
   - Login with new password

---

## 🗑️ Step 4: Remove Debug Endpoints

### 4.1 Backend Cleanup (PRODUCTION ONLY)
Remove these endpoints from `backend/api/urls.py`:
```python
# Remove these lines in PRODUCTION:
path('debug/otps/', auth_views.debug_otps, name='debug-otps'),
path('debug/pending-users/', auth_views.debug_pending_users, name='debug-pending-users'),
path('debug/users/', views.debug_users, name='debug-users'),
```

### 4.2 Frontend Cleanup
Remove any debug/testing code you added during development.

---

## 🔧 Additional Features You Can Add

### 1. Email Validation
```typescript
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### 2. Password Strength Indicator
```typescript
const getPasswordStrength = (password: string): {score: number, feedback: string} => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  return {
    score: (score / 5) * 100,
    feedback: score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong'
  };
};
```

### 3. Auto-focus Next Input
For better OTP input UX:
```jsx
const handleOtpChange = (value: string, index: number) => {
  if (value.length === 1 && index < 5) {
    otpRefs[index + 1].current?.focus();
  }
};
```

---

## 📋 Migration Priority Order

1. **High Priority** (Core Authentication):
   - `HostSignup.tsx`
   - `SpeakerSignup.tsx` 
   - `HostLogin.tsx`
   - `SpeakerLogin.tsx`

2. **Medium Priority** (Password Reset):
   - `ForgotPassword.tsx`
   - `ResetPasswordOtp.tsx`
   - `ResetPasswordNew.tsx`

3. **Low Priority** (Nice to Have):
   - Any custom auth hooks
   - Enhanced UI/UX features
   - Additional validation

---

## 🆘 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution:** Make sure your backend `CORS_ALLOWED_ORIGINS` includes your frontend URL.

### Issue 2: Email Not Received
**Solution:** 
- Check spam folder
- Verify SMTP credentials in Django settings
- Check Django logs for email sending errors

### Issue 3: OTP Expired
**Solution:** 
- Implement resend OTP functionality
- Show clear expiry timer (10 minutes)

### Issue 4: JWT Token Not Stored
**Solution:**
- Verify `authService.storeTokens()` is called after successful login/signup
- Check browser localStorage

---

## 🎯 Expected Results

After migration, you should have:

✅ **3-step signup flow** for both hosts and speakers  
✅ **Email OTP verification** with HTML templates  
✅ **Secure password creation** after email verification  
✅ **JWT token authentication** for login sessions  
✅ **Password reset flow** with email OTP  
✅ **Automatic profile creation** (Host/Speaker + UserProfile)  
✅ **Email validation** and duplicate checking  
✅ **Real email delivery** via SMTP  

---

## 📞 Need Help?

If you encounter any issues during migration:

1. Check browser console for JavaScript errors
2. Check Network tab for API request/response details
3. Check Django server logs for backend errors
4. Verify your SMTP settings are correct
5. Test with a simple email provider (Gmail, etc.) first

---

**🚀 Ready to migrate? Start with `HostSignup.tsx` first as it's likely the most complete implementation!**