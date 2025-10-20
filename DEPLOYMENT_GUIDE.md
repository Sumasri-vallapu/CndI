# 🚀 Production Deployment Guide
## Connect & Inspire Platform

This guide will help you deploy the Connect & Inspire platform to production.

---

## 📋 Prerequisites

- Ubuntu 20.04+ or similar Linux server
- Python 3.9+
- Node.js 18+ and npm
- PostgreSQL (optional, SQLite works too)
- Domain name pointed to your server
- SSL certificate (Let's Encrypt recommended)

---

## 🔧 Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Required Software
```bash
# Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx
sudo apt install nginx -y

# Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# PostgreSQL (optional)
sudo apt install postgresql postgresql-contrib -y
```

---

## 🔐 Environment Configuration

### Backend (.env)

1. Navigate to backend directory:
```bash
cd /path/to/cndilocal/backend
```

2. Create `.env` from example:
```bash
cp .env.example .env
nano .env
```

3. Update the following values:
```env
DEBUG=False
SECRET_KEY=generate-a-secure-key-min-50-characters-long
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,SERVER_IP

CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password

SECURE_SSL_REDIRECT=True
```

**Generate SECRET_KEY:**
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Frontend (.env.production)

1. Navigate to frontend directory:
```bash
cd /path/to/cndilocal/frontend
```

2. Create `.env.production`:
```bash
cp .env.example .env.production
nano .env.production
```

3. Update values:
```env
VITE_API_URL=https://yourdomain.com
VITE_APP_NAME=Connect & Inspire
VITE_ENV=production
```

---

## 🚀 Backend Deployment

### Option 1: Using Deployment Script (Recommended)

```bash
cd /path/to/cndilocal
chmod +x deploy_backend.sh
./deploy_backend.sh
```

### Option 2: Manual Deployment

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Generate usernames for existing users
python manage.py generate_usernames

# Collect static files
python manage.py collectstatic --no-input

# Create logs directory
mkdir -p logs
```

### Setup Gunicorn Service

1. Create systemd service file:
```bash
sudo nano /etc/systemd/system/gunicorn.service
```

2. Add the following content:
```ini
[Unit]
Description=Gunicorn daemon for Connect & Inspire
After=network.target

[Service]
User=your-username
Group=www-data
WorkingDirectory=/path/to/cndilocal/backend
Environment="PATH=/path/to/cndilocal/backend/venv/bin"
ExecStart=/path/to/cndilocal/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/path/to/cndilocal/backend/gunicorn.sock \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

3. Start and enable the service:
```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl status gunicorn
```

---

## 🌐 Frontend Deployment

### Build Frontend

```bash
cd /path/to/cndilocal
chmod +x deploy_frontend.sh
./deploy_frontend.sh
```

Or manually:
```bash
cd frontend
npm install
npm run build
```

Build output will be in `frontend/dist/`

---

## ⚙️ Nginx Configuration

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/connectinspire
```

### 2. Add Configuration:

```nginx
# Frontend server block
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /path/to/cndilocal/frontend/dist;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://unix:/path/to/cndilocal/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django admin proxy
    location /admin/ {
        proxy_pass http://unix:/path/to/cndilocal/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files for Django admin
    location /static/ {
        alias /path/to/cndilocal/backend/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /path/to/cndilocal/backend/media/;
    }
}
```

### 3. Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/connectinspire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 SSL Certificate Setup

### Using Let's Encrypt (Recommended)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically:
- Obtain SSL certificate
- Configure Nginx for HTTPS
- Set up auto-renewal

### Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

---

## 🔍 Post-Deployment Checks

### 1. Check Services

```bash
# Gunicorn status
sudo systemctl status gunicorn

# Nginx status
sudo systemctl status nginx

# View logs
sudo journalctl -u gunicorn -f
tail -f /path/to/cndilocal/backend/logs/django.log
```

### 2. Create Django Superuser

```bash
cd /path/to/cndilocal/backend
source venv/bin/activate
python manage.py createsuperuser
```

### 3. Test the Application

- Visit: `https://yourdomain.com` (Frontend)
- Visit: `https://yourdomain.com/admin` (Django Admin)
- Test signup, login, messaging features

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# Application logs
tail -f /path/to/cndilocal/backend/logs/django.log

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# Gunicorn logs
sudo journalctl -u gunicorn -f
```

### Restart Services

```bash
# After code changes
sudo systemctl restart gunicorn

# After nginx config changes
sudo nginx -t  # Test first
sudo systemctl restart nginx
```

### Database Backup (SQLite)

```bash
# Backup
cp /path/to/cndilocal/backend/db.sqlite3 /path/to/backups/db.sqlite3.$(date +%Y%m%d)

# Restore
cp /path/to/backups/db.sqlite3.20250120 /path/to/cndilocal/backend/db.sqlite3
```

---

## 🔄 Update Deployment

When you make code changes:

```bash
cd /path/to/cndilocal

# Pull latest code
git pull origin main

# Backend updates
./deploy_backend.sh

# Frontend updates
./deploy_frontend.sh

# Restart services
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

---

## 🐛 Troubleshooting

### Issue: 502 Bad Gateway

**Solution:**
```bash
# Check gunicorn is running
sudo systemctl status gunicorn

# Check socket file exists
ls -l /path/to/cndilocal/backend/gunicorn.sock

# Check permissions
sudo chown -R your-username:www-data /path/to/cndilocal/backend
```

### Issue: Static Files Not Loading

**Solution:**
```bash
cd /path/to/cndilocal/backend
source venv/bin/activate
python manage.py collectstatic --no-input --clear
sudo systemctl restart nginx
```

### Issue: Database Migrations Fail

**Solution:**
```bash
cd /path/to/cndilocal/backend
source venv/bin/activate

# Check migration status
python manage.py showmigrations

# Run migrations
python manage.py migrate --fake-initial
```

### Issue: CORS Errors

**Solution:**
- Check `CORS_ALLOWED_ORIGINS` in backend `.env`
- Ensure frontend domain is listed
- Restart gunicorn: `sudo systemctl restart gunicorn`

---

## 📞 Support

For issues or questions:
- Check logs first: `/path/to/cndilocal/backend/logs/django.log`
- Review nginx error logs: `/var/log/nginx/error.log`
- Check systemd journal: `sudo journalctl -u gunicorn -f`

---

## ✅ Production Checklist

Before going live:

- [ ] Updated `.env` with secure SECRET_KEY
- [ ] Set `DEBUG=False` in `.env`
- [ ] Configured ALLOWED_HOSTS
- [ ] Set up SSL certificate
- [ ] Ran database migrations
- [ ] Generated usernames for existing users
- [ ] Collected static files
- [ ] Configured email settings
- [ ] Created Django superuser
- [ ] Tested all major features
- [ ] Set up automated backups
- [ ] Configured log rotation
- [ ] Tested SSL certificate auto-renewal

---

**🎉 Congratulations! Your platform is now live in production!**
