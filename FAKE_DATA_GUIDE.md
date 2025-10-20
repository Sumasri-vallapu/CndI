# Fake Data Guide

## Speaker Data

The backend now has 10 fake speakers populated in the database.

### How to Use

1. **View Speakers:**
   - Visit: http://localhost:5173/find-speaker
   - The page will automatically load speakers from the backend

2. **API Endpoint:**
   - `GET http://localhost:8000/api/speakers/`
   - No authentication required
   - Returns list of all speakers

3. **Filter Speakers:**
   - By expertise: `GET /api/speakers/?expertise=technology`
   - By availability: `GET /api/speakers/?availability=available`

### Fake Speakers Created

1. **Elon Musk** - Technology (20 years) - $10,000/hr - Available
2. **Sarah Chen** - Technology (12 years) - $3,500/hr - Available
3. **Dr. James Wilson** - Healthcare (18 years) - $4,500/hr - Busy
4. **Maria Rodriguez** - Business (15 years) - $5,000/hr - Available
5. **David Kim** - Technology (10 years) - $3,000/hr - Available
6. **Lisa Thompson** - Business (16 years) - $4,000/hr - Busy
7. **Dr. Amit Patel** - Education (14 years) - $2,500/hr - Available
8. **Sophia Martinez** - Science (11 years) - $3,200/hr - Available
9. **Robert Johnson** - Healthcare (22 years) - $6,000/hr - Available
10. **Emily Wong** - Business (9 years) - $2,800/hr - Available

### Login Credentials (for testing)

All fake speakers can login with:
- **Email:** [speaker_email] (e.g., elon.musk@speaker.com)
- **Password:** password123

### Management Commands

**Create more fake speakers:**
```bash
cd backend
source venv/bin/activate
python manage.py create_fake_speakers
```

**Clear all fake speakers:**
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> from api.models import Speaker
>>> Speaker.objects.filter(user__email__contains='@speaker.com').delete()
>>> User.objects.filter(email__contains='@speaker.com').delete()
```

### Next Steps

To add real speakers:
1. Users sign up as speakers via `/speaker-signup`
2. Complete their profile
3. They appear in the Find Speaker page automatically
