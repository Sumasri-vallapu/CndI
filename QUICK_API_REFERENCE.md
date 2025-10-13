# Quick API Reference

A condensed reference guide for the most commonly used endpoints.

---

## Base URL
```
http://localhost:8000/api
```

---

## Authentication

### Login
```http
POST /auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1...",
  "refresh": "eyJ0eXAiOiJKV1...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Authenticated Requests
```http
Authorization: Bearer eyJ0eXAiOiJKV1...
```

---

## Host Endpoints

### Get Host Profile
```http
GET /host/profile/
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "company_name": "Tech Corp",
  "organization_type": "corporate",
  "user_info": {
    "id": 1,
    "email": "host@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Update Host Profile
```http
PUT /host/profile/
Authorization: Bearer {token}
Content-Type: application/json

{
  "company_name": "New Company Name",
  "bio": "Updated bio",
  "user_info": {
    "first_name": "NewFirst",
    "last_name": "NewLast"
  }
}
```

### Get Dashboard
```http
GET /host/dashboard/
Authorization: Bearer {token}

Response:
{
  "stats": {
    "total_requests": 10,
    "pending_requests": 3,
    "accepted_requests": 5,
    "completed_events": 2
  },
  "recent_requests": [...],
  "profile": {...}
}
```

---

## Speaker Endpoints

### Get Own Profile
```http
GET /speaker/profile/
Authorization: Bearer {token}
```

### Get Public Profile
```http
GET /speaker/profile/5/
Authorization: Bearer {token}
```

### Search Speakers
```http
GET /speakers/?expertise=technology&search=python
```

### Update Availability
```http
POST /speaker/availability/update/
Authorization: Bearer {token}
Content-Type: application/json

{
  "date": "2025-10-15",
  "is_available": true,
  "notes": "Available all day"
}
```

---

## Event Endpoints

### Create Speaker Request
```http
POST /requests/create/
Content-Type: application/json

{
  "title": "Tech Conference",
  "description": "Annual tech conference",
  "speaker": 5,
  "organizer_name": "John Doe",
  "organizer_email": "john@example.com",
  "event_date": "2025-11-15T10:00:00Z",
  "duration_minutes": 60,
  "location": "New York",
  "event_type": "conference",
  "audience": "Tech professionals",
  "audience_size": 200,
  "budget_min": 1000,
  "budget_max": 2000
}
```

### Update Event Status
```http
PUT /events/5/update-status/
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "accepted",
  "response_notes": "Happy to speak at your event!"
}
```

---

## Messaging Endpoints

### List Conversations
```http
GET /conversations/
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "host_name": "John Doe",
    "speaker_name": "Jane Smith",
    "subject": "Tech Conference",
    "last_message": {...},
    "unread_count": 2
  }
]
```

### Get Messages
```http
GET /conversations/1/messages/
Authorization: Bearer {token}

Response:
{
  "conversation": {...},
  "messages": [
    {
      "id": 1,
      "sender_name": "John Doe",
      "body": "Looking forward to the event!",
      "created_at": "2025-10-07T10:00:00Z"
    }
  ]
}
```

### Send Message
```http
POST /messages/send/
Authorization: Bearer {token}
Content-Type: application/json

{
  "conversation_id": 1,
  "body": "Thanks for accepting the invitation!"
}
```

---

## Contact Form

### Submit Contact Form
```http
POST /contact/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Partnership Inquiry",
  "message": "I would like to discuss a partnership opportunity."
}

Response:
{
  "message": "Thank you for your message. We will get back to you soon!"
}
```

---

## File Uploads

### Upload Profile Image
```http
POST /upload/profile-image/
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  image: [file]

Response:
{
  "url": "/media/profile_images/abc123.jpg",
  "filename": "profile_images/abc123.jpg"
}
```

### Upload Document
```http
POST /upload/document/
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  document: [file]

Response:
{
  "url": "/media/documents/def456.pdf",
  "filename": "documents/def456.pdf"
}
```

---

## Payment Endpoints

### Create Payment
```http
POST /payments/create/
Authorization: Bearer {token}
Content-Type: application/json

{
  "event_id": 5,
  "amount": 1500.00
}
```

### Update Payment Status
```http
PUT /payments/1/update-status/
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed",
  "transaction_id": "txn_123456",
  "payment_method": "credit_card"
}
```

---

## Rating Endpoints

### Create Rating
```http
POST /ratings/create/
Authorization: Bearer {token}
Content-Type: application/json

{
  "event_id": 5,
  "rating": 5,
  "feedback": "Excellent speaker!",
  "would_recommend": true
}
```

### Get Speaker Ratings
```http
GET /speaker/5/ratings/

Response:
{
  "average_rating": 4.5,
  "total_ratings": 10,
  "ratings": [...]
}
```

---

## Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal error |

---

## Error Response Format

```json
{
  "error": "Error message here",
  "details": {
    "field_name": ["Error detail"]
  }
}
```

---

## JavaScript/TypeScript Examples

### Fetch with Auth
```typescript
const response = await fetch('http://localhost:8000/api/host/profile/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

### Axios with Auth
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const response = await api.get('/host/profile/');
```

### File Upload with FormData
```typescript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:8000/api/upload/profile-image/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});
```

---

## Query Parameters

### Filtering Events
```http
GET /host/requests/?status=pending
GET /host/requests/?status=accepted
```

### Filtering Speakers
```http
GET /speakers/?expertise=technology
GET /speakers/?availability=available
GET /speakers/?search=python
```

### Date Range for Availability
```http
GET /speaker/5/availability/?start_date=2025-10-01&end_date=2025-10-31
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Profile (with auth)
```bash
curl http://localhost:8000/api/host/profile/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1..."
```

### Submit Contact Form
```bash
curl -X POST http://localhost:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "subject":"Test",
    "message":"Test message"
  }'
```

### Upload File
```bash
curl -X POST http://localhost:8000/api/upload/profile-image/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1..." \
  -F "image=@/path/to/image.jpg"
```

---

## Environment Variables

```env
# Backend URL
VITE_API_BASE_URL=http://localhost:8000/api

# For production
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## Tips

1. **Always include Authorization header** for protected endpoints
2. **Use Content-Type: application/json** for JSON data
3. **Use FormData** for file uploads (not JSON)
4. **Check response status** before parsing JSON
5. **Store tokens securely** (localStorage or httpOnly cookies)
6. **Refresh tokens** before they expire
7. **Handle errors gracefully** with try-catch
8. **Validate input** on frontend before sending

---

## Postman Collection

Import this JSON into Postman for quick testing:

```json
{
  "info": {
    "name": "C&I Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login/",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"user@example.com\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api"
    }
  ]
}
```

---

For complete API documentation, see: `API_ENDPOINTS_COMPLETE.md`
