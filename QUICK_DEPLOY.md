# ⚡ Quick Deploy Guide
## Connect & Inspire Platform

**For experienced developers who want to deploy quickly**

---

## 🚀 30-Minute Deployment

### Step 1: Server Preparation (5 min)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install everything
sudo apt install python3 python3-pip python3-venv nodejs npm nginx certbot python3-certbot-nginx -y

# Clone repository
cd /var/www
git clone <your-repo-url> connectinspire
cd connectinspire
```

### Step 2: Backend Setup (10 min)
```bash
cd backend

# Create & activate virtualenv
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
nano .env  # Edit: SECRET_KEY, ALLOWED_HOSTS, EMAIL settings

# Setup database
python manage.py migrate
python manage.py generate_usernames
python manage.py collectstatic --no-input
python manage.py createsuperuser

# Create logs directory
mkdir -p logs
```

### Step 3: Gunicorn Service (3 min)
```bash
sudo nano /etc/systemd/system/gunicorn.service
```

Paste:
```ini
[Unit]
Description=Gunicorn daemon for Connect & Inspire
After=network.target

[Service]
User=YOUR_USERNAME
Group=www-data
WorkingDirectory=/var/www/connectinspire/backend
Environment="PATH=/var/www/connectinspire/backend/venv/bin"
ExecStart=/var/www/connectinspire/backend/venv/bin/gunicorn --workers 3 --bind unix:/var/www/connectinspire/backend/gunicorn.sock backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

### Step 4: Frontend Build (5 min)
```bash
cd /var/www/connectinspire/frontend

# Configure environment
cp .env.example .env.production
nano .env.production  # Edit: VITE_API_URL

# Build
npm install
npm run build
```

### Step 5: Nginx Configuration (5 min)
```bash
sudo nano /etc/nginx/sites-available/connectinspire
```

Paste (replace paths and domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/connectinspire/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://unix:/var/www/connectinspire/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://unix:/var/www/connectinspire/backend/gunicorn.sock;
        proxy_set_header Host $host;
    }

    location /static/ {
        alias /var/www/connectinspire/backend/staticfiles/;
    }
}
```

Enable and start:
```bash
sudo ln -s /etc/nginx/sites-available/connectinspire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL Certificate (2 min)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ✅ Verify Deployment

```bash
# Check services
sudo systemctl status gunicorn
sudo systemctl status nginx

# Test site
curl https://yourdomain.com
curl https://yourdomain.com/api/

# View logs
tail -f /var/www/connectinspire/backend/logs/django.log
```

---

## 🔄 Quick Update

```bash
cd /var/www/connectinspire

# Pull changes
git pull origin main

# Backend
./deploy_backend.sh

# Frontend
./deploy_frontend.sh

# Restart
sudo systemctl restart gunicorn nginx
```

---

## 🐛 Quick Troubleshooting

**502 Bad Gateway:**
```bash
sudo systemctl restart gunicorn
ls -l /var/www/connectinspire/backend/gunicorn.sock
```

**Static files not loading:**
```bash
cd /var/www/connectinspire/backend
source venv/bin/activate
python manage.py collectstatic --no-input --clear
```

**CORS errors:**
```bash
nano /var/www/connectinspire/backend/.env
# Add frontend domain to CORS_ALLOWED_ORIGINS
sudo systemctl restart gunicorn
```

---

## 📋 Critical Environment Variables

### Backend `.env`
```env
DEBUG=False
SECRET_KEY=<50+ chars random>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
EMAIL_HOST_USER=your@email.com
EMAIL_HOST_PASSWORD=app-password
```

### Frontend `.env.production`
```env
VITE_API_URL=https://yourdomain.com
```

---

**Done! 🎉 Your platform is live!**

Visit: `https://yourdomain.com`
Admin: `https://yourdomain.com/admin`
