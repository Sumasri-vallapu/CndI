# 🚀 Local Testing Guide - OTP Signup Flow

## ✅ Issue Fixed
- **Unicode Encoding Error Resolved**: Removed all emoji characters that were causing `'charmap' codec can't encode character` errors
- **Email Backend**: Set to console mode for development
- **Frontend**: Configured to use localhost backend

## 📋 Prerequisites
Make sure you have:
- Python 3.12+ installed
- Node.js and npm installed
- Both backend and frontend dependencies installed

## 🛠️ Step-by-Step Testing Instructions

### Step 1: Start the Backend Server
```bash
# Navigate to backend directory
cd backend

# Start Django development server
./venv/Scripts/python.exe manage.py runserver 127.0.0.1:8000
```

**Expected Output:**
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
Django version 5.1.7, using settings 'backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Step 2: Start the Frontend Server
Open a **NEW terminal window** and run:
```bash
# Navigate to frontend directory
cd frontend

# Start React development server
npm run dev
```

**Expected Output:**
```
> frontend@0.0.0 dev
> vite

  VITE v4.4.5  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Step 3: Test the Signup Flow

1. **Open Browser**: Go to `http://localhost:5173`

2. **Navigate to Signup**: Click "Sign Up" or go to `/email-verification`

3. **Enter Email**: 
   - Enter any email address (e.g., `test@example.com`)
   - Click "Send Verification Code"

4. **Check Backend Terminal**: You should see:
   ```
   [SUCCESS] OTP sent successfully to test@example.com: 123456
   ```
   OR if using console email backend:
   ```
   Content-Type: text/plain; charset="utf-8"
   MIME-Version: 1.0
   Content-Transfer-Encoding: 7bit
   Subject: Verify Your Email - ClearMyFile
   From: noreply@clearmyfile.org
   To: test@example.com
   Date: [timestamp]

   Hello Test User!
   ...
   Verification Code: 123456
   ...
   ```

5. **Enter OTP**: 
   - Copy the 6-digit code from the backend terminal
   - Paste it into the verification form
   - Click "Verify"

6. **Set Password**: 
   - Create a strong password
   - Confirm the password
   - Click "Next"

7. **Complete Profile**: 
   - Fill in personal information (first name, last name, date of birth are required)
   - Click "Next"
   - Fill in address information (state and district are required)
   - Click "Next"
   - Select referral source
   - Click "Create Account"

8. **Success**: You should be redirected to the protected page with a success message

## 🔍 Troubleshooting

### Backend Issues:
- **Port 8000 in use**: Try `./venv/Scripts/python.exe manage.py runserver 127.0.0.1:8001`
- **Module not found**: Ensure virtual environment is activated
- **Database issues**: Run `./venv/Scripts/python.exe manage.py migrate`

### Frontend Issues:
- **CORS errors**: Backend should handle CORS automatically
- **API connection**: Check that `frontend/src/utils/api.ts` uses `http://localhost:8000/api`
- **Port 5173 in use**: Vite will automatically use next available port

### OTP Issues:
- **No OTP in terminal**: Check that `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` in settings.py
- **Unicode errors**: All emojis have been removed from code

## 📝 Test Cases to Verify

1. **Email Validation**: Try invalid emails (should show error)
2. **OTP Validation**: Try wrong OTP (should show error)
3. **Password Strength**: Try weak passwords (should show requirements)
4. **Required Fields**: Skip required fields (should show validation errors)
5. **Complete Flow**: Full signup from email to account creation

## 🎯 Expected Behavior

- ✅ Email verification sends OTP to backend console
- ✅ OTP verification works with code from console
- ✅ Password strength validation works
- ✅ Multi-step form navigation works
- ✅ Profile completion saves all data
- ✅ Account creation generates JWT tokens
- ✅ Redirect to protected page after signup

## 📊 Success Criteria

When testing is successful, you should see:
1. OTP codes displayed in backend terminal
2. Smooth navigation through all signup steps
3. No Unicode/encoding errors
4. Account created in database
5. JWT tokens generated and stored
6. Welcome message displayed

Ready to test! 🚀