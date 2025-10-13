# Database Migration Guide

## Overview
This guide will help you create and apply the database migration for the new `ContactSubmission` model.

---

## Prerequisites

- Python virtual environment activated
- Django and dependencies installed
- Database accessible

---

## Migration Steps

### Step 1: Activate Virtual Environment

**Linux/Mac:**
```bash
cd /mnt/c/Users/Lenovo/cndilocal/backend
source venv/bin/activate
```

**Windows:**
```bash
cd C:\Users\Lenovo\cndilocal\backend
venv\Scripts\activate
```

### Step 2: Create Migration

```bash
python manage.py makemigrations
```

**Expected Output:**
```
Migrations for 'api':
  api/migrations/0009_contactsubmission.py
    - Create model ContactSubmission
```

### Step 3: Review Migration (Optional)

```bash
python manage.py sqlmigrate api 0009
```

This will show you the SQL that will be executed.

### Step 4: Apply Migration

```bash
python manage.py migrate
```

**Expected Output:**
```
Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  Applying api.0009_contactsubmission... OK
```

### Step 5: Verify Migration

```bash
python manage.py showmigrations api
```

You should see all migrations marked with `[X]`.

---

## Troubleshooting

### Issue: "No changes detected"

**Solution:**
Make sure your changes to `models.py` are saved. The `ContactSubmission` model should be present in `/backend/api/models.py`.

### Issue: "Django not installed"

**Solution:**
1. Activate virtual environment (see Step 1)
2. If still not working, reinstall dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Issue: "Database is locked" (SQLite)

**Solution:**
1. Make sure Django development server is not running
2. Close any database browser tools
3. Try again

### Issue: Migration conflicts

**Solution:**
```bash
python manage.py migrate --fake-initial
```

---

## Testing the New Model

### 1. Create a superuser (if not already done)

```bash
python manage.py createsuperuser
```

### 2. Start the development server

```bash
python manage.py runserver
```

### 3. Access the admin panel

Navigate to: `http://localhost:8000/admin/`

### 4. Verify ContactSubmission model

You should see "Contact submissions" in the admin interface under the API section.

---

## Rollback (If Needed)

If you need to rollback the migration:

```bash
python manage.py migrate api 0008
```

This will revert to the previous migration.

---

## Production Migration

For production environments:

1. **Backup your database first!**
   ```bash
   python manage.py dumpdata > backup.json
   ```

2. **Test migration in staging environment**

3. **Apply migration during low-traffic period**
   ```bash
   python manage.py migrate --no-input
   ```

4. **Verify the migration**
   ```bash
   python manage.py check
   ```

---

## Additional Configuration

### Media Files Setup (for file uploads)

Add to `settings.py` if not already present:

```python
import os

# Media files (uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### Create media directories

```bash
mkdir -p media/profile_images
mkdir -p media/documents
```

### Update urls.py (for development)

In `backend/backend/urls.py`:

```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... your existing patterns
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## Verification Checklist

- [ ] Migration created successfully
- [ ] Migration applied without errors
- [ ] ContactSubmission visible in admin
- [ ] Can create contact submission via admin
- [ ] Media directories created
- [ ] MEDIA_URL and MEDIA_ROOT configured
- [ ] Test contact form endpoint works
- [ ] Test file upload endpoints work

---

## Next Steps After Migration

1. Test the contact form endpoint: `POST /api/contact/`
2. Test the file upload endpoints
3. Update frontend to use new endpoints
4. Configure email settings for contact form
5. Set up proper media storage for production (AWS S3 recommended)

---

## Support

If you encounter any issues:

1. Check Django logs: `python manage.py runserver`
2. Check database: `python manage.py dbshell`
3. Verify models: `python manage.py check`
4. Review migration files in `backend/api/migrations/`

---

## Important Notes

- Always backup your database before running migrations
- Test migrations in development/staging before production
- Keep migration files in version control
- Never edit or delete migration files after they've been applied
- For production, consider using zero-downtime migration strategies

---

**Migration File:** `/backend/api/migrations/0009_contactsubmission.py` (will be created)
**Model:** `ContactSubmission` in `/backend/api/models.py`
**Status:** Ready to apply
