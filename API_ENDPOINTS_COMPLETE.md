# Complete API Endpoints Documentation

## Overview
This document provides a comprehensive list of all available API endpoints in the C&I (Connect & Inspire) platform backend.

---

## Authentication Endpoints

### OTP-based Authentication (Primary)
- **POST** `/api/auth/signup-request/` - Initial signup request with email and user type
- **POST** `/api/auth/verify-otp/` - Verify OTP code
- **POST** `/api/auth/set-password/` - Set password after OTP verification
- **POST** `/api/auth/login/` - User login
- **POST** `/api/auth/forgot-password/` - Request password reset
- **POST** `/api/auth/reset-password/` - Reset password with OTP
- **POST** `/api/auth/resend-otp/` - Resend OTP code
- **POST** `/api/auth/check-email-exists/` - Check if email exists

### Legacy Authentication (Backward Compatibility)
- **POST** `/api/send_otp/` - Send OTP (legacy)
- **POST** `/api/verify_otp/` - Verify OTP (legacy)
- **POST** `/api/signup/` - User signup (legacy)
- **POST** `/api/login/` - User login (legacy)
- **POST** `/api/check_email_exists/` - Check email (legacy)
- **POST** `/api/forgot_password/` - Forgot password (legacy)
- **POST** `/api/reset_password/` - Reset password (legacy)

---

## Host Endpoints

### Profile Management
- **GET** `/api/host/profile/` - Get host profile with user info
  - Returns: Host profile + user_info object
  - Authentication: Required
  - Auto-creates profile if doesn't exist

- **PUT** `/api/host/profile/` - Update host profile
  - Authentication: Required
  - Can update both host profile and user_info fields

### Dashboard & Stats
- **GET** `/api/host/dashboard/` - Get host dashboard data
  - Returns: stats, recent_requests, profile
  - Authentication: Required

- **GET** `/api/host/requests/` - Get all requests made by host
  - Query params: `?status=pending|accepted|declined|completed`
  - Authentication: Required

- **GET** `/api/host-dashboard-stats/` - Get dashboard statistics (legacy)
  - Authentication: Required

---

## Speaker Endpoints

### Profile Management
- **GET** `/api/speaker/profile/` - Get authenticated speaker's profile
  - Returns: Speaker profile + user_info object
  - Authentication: Required
  - Auto-creates profile if doesn't exist

- **GET** `/api/speaker/profile/<speaker_id>/` - Get public speaker profile
  - Authentication: Required
  - Public view (no sensitive info)

- **PUT** `/api/speaker/profile/` - Update speaker profile
  - Authentication: Required
  - Can update both speaker profile and user_info fields

### Speaker Discovery
- **GET** `/api/speakers/` - List all speakers with filtering
  - Query params:
    - `?expertise=technology|healthcare|business|etc`
    - `?availability=available|busy|unavailable`
    - `?industry=...`
    - `?search=...`
  - Authentication: None (public)

### Dashboard & Stats
- **GET** `/api/speaker/dashboard/` - Get speaker dashboard data
  - Returns: stats, recent_requests, profile
  - Authentication: Required

- **GET** `/api/speaker/events/` - Get all events for speaker
  - Query params: `?status=pending|accepted|declined|completed`
  - Authentication: Required

- **GET** `/api/speaker-dashboard-stats/` - Get dashboard statistics (legacy)
  - Authentication: Required

### Ratings
- **GET** `/api/speaker/<speaker_id>/ratings/` - Get all ratings for a speaker
  - Returns: average_rating, total_ratings, ratings[]
  - Authentication: None (public)

---

## Event/Request Endpoints

### Event Management
- **POST** `/api/requests/create/` - Create a new speaker request/event
  - Authentication: Optional (AllowAny)
  - Auto-creates conversation if user authenticated

- **GET** `/api/events/<event_id>/` - Get event details
  - Authentication: Optional (AllowAny)

- **PUT** `/api/events/<event_id>/update-status/` - Update event status
  - Body: `{ "status": "accepted|declined|confirmed|completed", "response_notes": "..." }`
  - Authentication: Required
  - Permission: Speaker or Host of the event

- **GET** `/api/events/` - List events (legacy)
  - Query params: `?status=...`
  - Authentication: Required

- **POST** `/api/events/` - Create event (legacy)
  - Authentication: Optional

- **POST** `/api/event-response/<event_id>/` - Respond to event (legacy)
  - Body: `{ "action": "accept|decline", "notes": "..." }`
  - Authentication: Required

---

## Availability Endpoints

### Speaker Availability
- **GET** `/api/speaker/<speaker_id>/availability/` - Get speaker's availability
  - Query params: `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
  - Authentication: None (public)
  - Default: Next 30 days if no dates provided

- **POST** `/api/speaker/availability/update/` - Update speaker availability
  - Body: `{ "date": "YYYY-MM-DD", "is_available": true, "notes": "..." }`
  - Authentication: Required (must be speaker)

- **GET** `/api/speaker-availability/<speaker_id>/` - Get availability (legacy)
  - Authentication: None

- **POST** `/api/update-speaker-availability/` - Update availability (legacy)
  - Authentication: Required

---

## Messaging/Conversation Endpoints

### Conversations
- **GET** `/api/conversations/` - Get all conversations for user
  - Returns: Array of conversations with last_message and unread_count
  - Authentication: Required

- **POST** `/api/conversations/create/` - Create new conversation
  - Body: `{ "speaker_id": 1, "event_id": 1, "subject": "..." }`
  - Authentication: Required (must be host)

- **GET** `/api/conversations/<conversation_id>/messages/` - Get messages in conversation
  - Returns: conversation object + messages array
  - Marks messages as read automatically
  - Authentication: Required

### Messages
- **POST** `/api/messages/send/` - Send a message
  - Body: `{ "conversation_id": 1, "body": "..." }`
  - Authentication: Required
  - Auto-determines recipient

- **GET** `/api/messages/` - List messages (legacy)
  - Query params: `?event_id=...`
  - Authentication: Required

- **POST** `/api/messages/` - Send message (legacy)
  - Authentication: Required

- **POST** `/api/mark-message-read/<message_id>/` - Mark message as read (legacy)
  - Authentication: Required

---

## Payment Endpoints

- **GET** `/api/payments/` - Get all payments for user
  - Returns: Payments for host's events or speaker's events
  - Authentication: Required

- **POST** `/api/payments/create/` - Create payment for event
  - Body: `{ "event_id": 1, "amount": 500.00 }`
  - Authentication: Required

- **PUT** `/api/payments/<payment_id>/update-status/` - Update payment status
  - Body: `{ "status": "completed|failed|refunded", "transaction_id": "...", "payment_method": "..." }`
  - Authentication: Required

---

## Rating Endpoints

- **POST** `/api/ratings/create/` - Create rating for completed event
  - Body: `{ "event_id": 1, "rating": 5, "feedback": "...", "would_recommend": true }`
  - Authentication: Required
  - Only for completed events

- **POST** `/api/create-event-rating/` - Create rating (legacy)
  - Authentication: Required

---

## Contact Form Endpoint

- **POST** `/api/contact/` - Handle contact form submissions
  - Body: `{ "name": "...", "email": "...", "subject": "...", "message": "..." }`
  - Authentication: None (AllowAny)
  - Features:
    - Saves submission to database
    - Sends email to admin
    - Sends confirmation email to user
    - Graceful error handling (continues even if email fails)

---

## File Upload Endpoints

### Profile Image Upload
- **POST** `/api/upload/profile-image/` - Upload profile image
  - Content-Type: multipart/form-data
  - Field: `image` (file)
  - Allowed types: JPEG, PNG, GIF, WebP
  - Max size: 5MB
  - Returns: `{ "url": "...", "filename": "..." }`
  - Authentication: Required

### Document Upload
- **POST** `/api/upload/document/` - Upload document
  - Content-Type: multipart/form-data
  - Field: `document` (file)
  - Allowed types: PDF, DOC, DOCX, TXT
  - Max size: 10MB
  - Returns: `{ "url": "...", "filename": "..." }`
  - Authentication: Required

---

## Location Endpoints

- **GET** `/api/states/` - Get all states
- **GET** `/api/districts/` - Get districts
  - Query params: `?state_id=...`
- **GET** `/api/mandals/` - Get mandals
  - Query params: `?district_id=...`
- **GET** `/api/grampanchayats/` - Get gram panchayats
  - Query params: `?mandal_id=...`

---

## Debug Endpoints (Remove in Production)

- **GET** `/api/debug/otps/` - View OTP store
- **GET** `/api/debug/pending-users/` - View pending users
- **GET** `/api/debug/users/` - View all users

---

## Legacy Generic Endpoints

- **GET/POST** `/api/hosts/` - Host list/create (legacy)
- **GET/PUT/DELETE** `/api/hosts/<id>/` - Host detail (legacy)
- **GET** `/api/speakers/` - Speaker list (legacy)
- **GET/PUT/DELETE** `/api/speakers/<id>/` - Speaker detail (legacy)

---

## Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": {...}
}
```

### Common HTTP Status Codes
- **200 OK** - Successful GET/PUT
- **201 Created** - Successful POST
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Permission denied
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Authentication

Most endpoints require JWT authentication. Include the token in the header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained from login endpoints and should be stored securely on the client side.

---

## Summary of New/Enhanced Endpoints

### Newly Implemented
1. **Contact Form** - `/api/contact/` - Full email integration with database storage
2. **File Uploads** - `/api/upload/profile-image/` and `/api/upload/document/`
3. **Enhanced Profile Endpoints** - Now include user_info and auto-create profiles

### Already Implemented (Comprehensive)
1. **Host Management** - Full CRUD + dashboard + stats
2. **Speaker Management** - Full CRUD + dashboard + stats + search/filter
3. **Event/Request System** - Create, view, update status, respond
4. **Messaging/Conversations** - Full conversation threading with unread counts
5. **Payments** - Create and track payments
6. **Ratings** - Event ratings and speaker average ratings
7. **Availability** - Speaker calendar management

---

## Models Updated

### New Model
- **ContactSubmission** - Stores contact form submissions
  - Fields: name, email, subject, message, is_responded, responded_at, created_at
  - Admin interface for managing submissions

### Enhanced Models
- **Host** - Auto-created on first profile access
- **Speaker** - Auto-created on first profile access
- **Conversation** - Full integration with messaging system

---

## Next Steps for Deployment

1. **Create Migration** - Run `python manage.py makemigrations` to create ContactSubmission migration
2. **Apply Migration** - Run `python manage.py migrate`
3. **Test Endpoints** - Test all new endpoints with Postman or similar tool
4. **Update Frontend** - Update frontend API calls to use new endpoints
5. **Configure Media Storage** - Set up proper file storage for uploads (AWS S3 or local)
6. **Email Configuration** - Ensure SMTP settings are configured for contact form
7. **Remove Debug Endpoints** - Remove or secure debug endpoints before production

---

## API Completeness Checklist

- [x] Authentication (OTP + legacy)
- [x] Host profile management
- [x] Speaker profile management
- [x] Event/request creation and management
- [x] Messaging/conversation system
- [x] Payment tracking
- [x] Rating system
- [x] Availability calendar
- [x] Contact form
- [x] File uploads
- [x] Dashboard statistics
- [x] Search and filtering
- [x] Location data (states, districts, mandals, panchayats)

**All critical API endpoints are now implemented and ready for use!**
