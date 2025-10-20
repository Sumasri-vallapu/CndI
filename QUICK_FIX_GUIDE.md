# 🚨 QUICK FIX: Remove ClearMyFile from Emails

## The Problem
You're still getting "Welcome to ClearMyFile!" emails because you're using the **OLD endpoints** instead of the **NEW authentication endpoints**.

## The Solution
Update your frontend to use the NEW endpoints:

### ❌ OLD ENDPOINTS (causing ClearMyFile emails):
```typescript
// These send ClearMyFile emails:
ENDPOINTS.SEND_OTP          // ❌ /api/send_otp/
ENDPOINTS.SIGNUP            // ❌ /api/signup/
ENDPOINTS.LOGIN             // ❌ /api/login/
ENDPOINTS.FORGOT_PASSWORD   // ❌ /api/forgot_password/
```

### ✅ NEW ENDPOINTS (send Connect & Inspire emails):
```typescript
// These send Connect & Inspire emails:
ENDPOINTS.AUTH.SIGNUP_REQUEST   // ✅ /api/auth/signup-request/
ENDPOINTS.AUTH.VERIFY_OTP       // ✅ /api/auth/verify-otp/
ENDPOINTS.AUTH.SET_PASSWORD     // ✅ /api/auth/set-password/
ENDPOINTS.AUTH.LOGIN            // ✅ /api/auth/login/
ENDPOINTS.AUTH.FORGOT_PASSWORD  // ✅ /api/auth/forgot-password/
```

---

## 🔧 Quick Frontend Fix

### 1. Update HostSignup.tsx
Replace this OLD code:
```typescript
// ❌ OLD - sends ClearMyFile email
const res = await fetch(ENDPOINTS.SEND_OTP, {
  method: 'POST',
  body: JSON.stringify({ email: formData.email, name: 'Host User' })
});
```

With this NEW code:
```typescript
// ✅ NEW - sends Connect & Inspire email
import { authService } from '../utils/authService';

await authService.signupRequest({
  email: formData.email,
  user_type: 'host',
  first_name: formData.firstName,
  last_name: formData.lastName
});
```

### 2. Update SpeakerSignup.tsx
Same pattern - replace old fetch calls with `authService` calls.

### 3. Test the Fix
1. Use the NEW endpoints in your frontend
2. Test signup flow
3. Check your email - should now say "Connect & Inspire" instead of "ClearMyFile"

---

## 🧪 Quick Test

### Test with curl (to verify backend works):
```bash
# Start your Django server
cd backend
source venv/bin/activate
python manage.py runserver

# Test NEW endpoint (should send Connect & Inspire email)
curl -X POST http://localhost:8000/api/auth/signup-request/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "user_type": "host", "first_name": "Test", "last_name": "User"}'
```

You should get Connect & Inspire email, not ClearMyFile!

---

## 🎯 Expected Email Content (NEW)

After using NEW endpoints, your emails will show:

**Subject:** `[Connect & Inspire] Complete Your Host Registration`

**Body:**
```
Connect & Inspire
Host Registration

Your verification code

Hi Test, we've sent you a verification code to complete your 
registration. This code is valid for 10 minutes.

[123456]

Enter this code to complete your Connect & Inspire registration
```

Instead of the old ClearMyFile content.

---

## 🚀 Complete Migration

For full migration, follow the `FRONTEND_MIGRATION_GUIDE.md` I created earlier. But for quick fix:

1. **Replace** old `fetch()` calls with `authService` calls
2. **Use** the NEW 3-step flow (signup-request → verify-otp → set-password)  
3. **Test** with real email to confirm Connect & Inspire branding

The email template is already updated - you just need to use the right endpoints!