# 🚀 Complete Deployment Guide - Connect & Inspire Platform

## Prerequisites Checklist

- [x] EC2 instance running Ubuntu (t2.micro or larger)
- [x] Domain name purchased and ready
- [ ] SSH access to EC2 instance (.pem key file)
- [ ] Domain DNS configured to point to EC2 IP
- [ ] EC2 Security Groups: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

---

## 📝 Step-by-Step Deployment Instructions

### Step 1: Configure Your Details

Before starting, update these files with YOUR information:

#### 1.1 Update `.env.production` file
```bash
# In backend/.env.production
SECRET_KEY=YOUR_RANDOM_SECRET_KEY_HERE  # Generate using: python -c "import secrets; print(secrets.token_urlsafe(50))"
DOMAIN_NAME=yourdomain.com
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,YOUR_EC2_IP
```

#### 1.2 Update deployment scripts
```bash
# In deploy.sh - Line 12
DOMAIN_NAME="yourdomain.com"  # Replace with YOUR domain

# In setup_ssl.sh - Line 6
DOMAIN_NAME="yourdomain.com"  # Replace with YOUR domain
```

---

### Step 2: Prepare Your Local Project

```bash
# Navigate to project directory
cd /mnt/c/Users/Lenovo/cndilocal

# Build the frontend for production
cd frontend
npm install
npm run build

# This creates a 'dist' folder with production-ready files
```

---

### Step 3: Upload Project to EC2

There are 3 ways to do this:

#### Option A: Using SCP (Recommended for first deployment)

```bash
# From your local machine (Windows/WSL)
cd /mnt/c/Users/Lenovo

# Upload entire project
scp -i /path/to/your-key.pem -r cndilocal ubuntu@YOUR_EC2_IP:/home/ubuntu/

# This will take a few minutes depending on your connection
```

#### Option B: Using Git (Recommended for updates)

```bash
# On EC2 instance
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP

# Clone from your repository
git clone https://github.com/yourusername/cndilocal.git
cd cndilocal

# Or pull updates
git pull origin main
```

#### Option C: Using rsync (Best for updates)

```bash
# From your local machine
rsync -avz -e "ssh -i /path/to/your-key.pem" \
  --exclude 'node_modules' \
  --exclude 'venv' \
  --exclude '__pycache__' \
  /mnt/c/Users/Lenovo/cndilocal/ \
  ubuntu@YOUR_EC2_IP:/home/ubuntu/cndilocal/
```

---

### Step 4: Configure DNS (Do this BEFORE deployment)

#### For Route 53 (AWS):
1. Go to Route 53 → Hosted Zones
2. Create A record: `yourdomain.com` → `YOUR_EC2_IP`
3. Create A record: `www.yourdomain.com` → `YOUR_EC2_IP`

#### For Namecheap/GoDaddy:
1. Go to Domain Management → DNS Settings
2. Add A Record:
   - Host: `@` → Value: `YOUR_EC2_IP`
   - Host: `www` → Value: `YOUR_EC2_IP`

**⏰ Wait 5-30 minutes for DNS to propagate**

Verify DNS is working:
```bash
ping yourdomain.com
# Should show your EC2 IP
```

---

### Step 5: Run Deployment on EC2

```bash
# SSH into your EC2 instance
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP

# Navigate to project
cd /home/ubuntu/cndilocal

# Create production .env file
cd backend
cp .env.production .env

# IMPORTANT: Edit .env with your actual values
nano .env
# Update: SECRET_KEY, DOMAIN_NAME, ALLOWED_HOSTS
# Save: Ctrl+X, Y, Enter

# Make scripts executable
cd ..
chmod +x deploy.sh setup_ssl.sh

# Run deployment script
./deploy.sh
```

This script will:
- Install nginx, Python, and dependencies
- Set up virtual environment
- Install Python packages
- Run database migrations
- Collect static files
- Configure Gunicorn service
- Configure Nginx
- Start all services

---

### Step 6: Set Up SSL Certificate (HTTPS)

**IMPORTANT: Only run this AFTER DNS is pointing to your server!**

```bash
# Still on EC2 instance
cd /home/ubuntu/cndilocal

# Edit setup_ssl.sh with your email
nano setup_ssl.sh
# Update line 6: DOMAIN_NAME="yourdomain.com"
# Update line 15: --email your-email@example.com

# Run SSL setup
sudo ./setup_ssl.sh
```

Let's Encrypt will:
- Verify your domain ownership
- Install SSL certificates
- Configure nginx for HTTPS
- Set up auto-renewal

---

### Step 7: Create Django Superuser (Admin Account)

```bash
# On EC2 instance
cd /home/ubuntu/cndilocal/backend
source venv/bin/activate
python manage.py createsuperuser

# Follow prompts:
# Username: admin
# Email: your-email@example.com
# Password: [secure password]
```

---

### Step 8: Test Your Deployment

#### 8.1 Test HTTP (should redirect to HTTPS)
```bash
curl -I http://yourdomain.com
# Should see: 301 Moved Permanently → https://
```

#### 8.2 Test HTTPS
```bash
curl -I https://yourdomain.com
# Should see: 200 OK
```

#### 8.3 Test API
```bash
curl https://yourdomain.com/api/
# Should see API response (not 404)
```

#### 8.4 Test in Browser
1. Visit: `https://yourdomain.com`
   - Should load React frontend
2. Visit: `https://yourdomain.com/admin`
   - Should show Django admin login
3. Test signup flow:
   - Go to host/speaker signup
   - Enter email, request OTP
   - Check email for verification code
   - Complete signup process

---

## 🔧 Useful Commands After Deployment

### View Logs

```bash
# Gunicorn (backend) logs
sudo journalctl -u gunicorn -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Django logs (if configured)
tail -f /home/ubuntu/cndilocal/backend/logs/django.log
```

### Restart Services

```bash
# Restart backend (after code changes)
sudo systemctl restart gunicorn

# Restart nginx (after config changes)
sudo systemctl restart nginx

# Check service status
sudo systemctl status gunicorn
sudo systemctl status nginx
```

### Update Deployment (After Code Changes)

```bash
# On local machine: Build frontend
cd frontend
npm run build

# Upload changes to EC2
rsync -avz -e "ssh -i /path/to/your-key.pem" \
  /mnt/c/Users/Lenovo/cndilocal/ \
  ubuntu@YOUR_EC2_IP:/home/ubuntu/cndilocal/

# On EC2: Apply changes
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP
cd /home/ubuntu/cndilocal/backend
source venv/bin/activate
python manage.py migrate  # If there are new migrations
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn
```

---

## 🐛 Troubleshooting

### Issue: "502 Bad Gateway"

**Cause**: Gunicorn is not running or crashed

**Solution**:
```bash
sudo systemctl status gunicorn
sudo journalctl -u gunicorn -n 50
sudo systemctl restart gunicorn
```

### Issue: "Static files not loading (CSS/JS)"

**Cause**: Static files not collected or nginx misconfigured

**Solution**:
```bash
cd /home/ubuntu/cndilocal/backend
source venv/bin/activate
python manage.py collectstatic --noinput
sudo systemctl restart nginx
```

### Issue: "CORS errors in browser console"

**Cause**: CORS_ALLOWED_ORIGINS not configured correctly

**Solution**:
```bash
# Edit backend/.env
nano /home/ubuntu/cndilocal/backend/.env

# Make sure this line is correct:
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Restart
sudo systemctl restart gunicorn
```

### Issue: "Database is locked"

**Cause**: SQLite doesn't handle concurrent writes well

**Solution**: For production with multiple users, upgrade to PostgreSQL:
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Configure in settings.py
# (Will provide instructions if needed)
```

### Issue: "SSL certificate renewal failed"

**Cause**: Certbot auto-renewal issue

**Solution**:
```bash
# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

---

## 📊 Monitoring & Maintenance

### Daily Checks
- Monitor server resources: `htop`
- Check disk space: `df -h`
- Review error logs

### Weekly Tasks
- Review access logs for unusual activity
- Check for Django/package updates
- Backup database:
  ```bash
  cp /home/ubuntu/cndilocal/backend/db.sqlite3 /home/ubuntu/backups/db.sqlite3.$(date +%Y%m%d)
  ```

### Monthly Tasks
- Review SSL certificate expiry (auto-renews, but verify)
- Update system packages: `sudo apt-get update && sudo apt-get upgrade`
- Review and clean old logs

---

## 💰 Cost Optimization Tips

1. **Use t2.micro** (free tier): $0/month for first year
2. **Reserved Instances**: Save 30-60% if committing to 1-3 years
3. **Monitor CloudWatch**: Set billing alarms
4. **Stop instance** when not in use (development only)
5. **Use S3 lifecycle policies** for old backups

---

## 🔒 Security Best Practices

- [ ] Change default SSH port from 22 to custom port
- [ ] Set up fail2ban for SSH brute-force protection
- [ ] Enable AWS CloudWatch alarms
- [ ] Regular backups (database + code)
- [ ] Keep packages updated: `sudo apt-get update && sudo apt-get upgrade`
- [ ] Use strong passwords for Django admin
- [ ] Rotate SECRET_KEY periodically
- [ ] Monitor access logs for suspicious activity

---

## 📧 Support & Next Steps

### After Successful Deployment:

1. **Test all features**:
   - Host signup/login
   - Speaker signup/login
   - Event creation
   - Messaging system
   - Payment tracking
   - Email notifications

2. **Configure monitoring**:
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Configure error reporting (Sentry)
   - Set up analytics (Google Analytics)

3. **Marketing**:
   - Update social media links
   - Add domain to Google Search Console
   - Submit sitemap.xml

4. **Future enhancements**:
   - Add S3 for media storage
   - Upgrade to PostgreSQL
   - Add Redis for caching
   - Set up CI/CD pipeline

---

## ✅ Deployment Checklist

- [ ] EC2 instance created and accessible
- [ ] Domain purchased and DNS configured
- [ ] Frontend built (`npm run build`)
- [ ] Project uploaded to EC2
- [ ] `.env` file configured with correct values
- [ ] `deploy.sh` executed successfully
- [ ] Gunicorn service running
- [ ] Nginx service running
- [ ] SSL certificate installed
- [ ] Django superuser created
- [ ] Website accessible at https://yourdomain.com
- [ ] API endpoints working
- [ ] Email OTP working
- [ ] All features tested

---

**🎉 Congratulations! Your Connect & Inspire platform is now live!**

For questions or issues, check the troubleshooting section or review logs.
