# 🚀 DEPLOY NOW - connectandinspire.in

## ✅ ALL CONFIGURATIONS COMPLETE!

Your Connect & Inspire platform is **100% READY** to deploy!

**Your Details:**
- 🌐 Domain: **connectandinspire.in**
- 🖥️ EC2 IP: **13.53.36.126**
- 📍 Region: **EU North (Stockholm)**
- 🔑 Secret Key: **Generated & Configured**

---

## 📋 STEP 1: Configure DNS (Do This FIRST!) ⚠️

Go to your domain registrar (where you bought connectandinspire.in) and add these DNS records:

### DNS Records to Add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 13.53.36.126 | 3600 |
| A | www | 13.53.36.126 | 3600 |

**What this does:**
- `connectandinspire.in` → Points to your EC2
- `www.connectandinspire.in` → Points to your EC2

### Verify DNS (Wait 5-30 minutes after setting records)

```bash
# From your local machine or any terminal
ping connectandinspire.in

# Should show: 13.53.36.126
```

**⏰ IMPORTANT: Don't proceed to Step 2 until DNS is working!**

---

## 📋 STEP 2: Upload Project to EC2

### Option A: Using SCP (Recommended)

```bash
# From WSL terminal
cd /mnt/c/Users/Lenovo

# Upload entire project (replace YOUR-KEY.pem with your actual key file name)
scp -i /path/to/YOUR-KEY.pem -r cndilocal ubuntu@13.53.36.126:/home/ubuntu/

# Example if your key is in Downloads:
# scp -i ~/Downloads/ec2forcni.pem -r cndilocal ubuntu@13.53.36.126:/home/ubuntu/
```

This will take 2-5 minutes depending on your internet speed.

### Option B: Using Git (Alternative)

```bash
# First, push your code to GitHub
cd /mnt/c/Users/Lenovo/cndilocal
git add .
git commit -m "Ready for deployment"
git push origin main

# Then on EC2:
ssh -i /path/to/YOUR-KEY.pem ubuntu@13.53.36.126
git clone https://github.com/yourusername/cndilocal.git
```

---

## 📋 STEP 3: Deploy on EC2

### 3.1 SSH into your EC2 instance

```bash
# From WSL terminal (replace with your actual key file path)
ssh -i /path/to/YOUR-KEY.pem ubuntu@13.53.36.126

# Example:
# ssh -i ~/Downloads/ec2forcni.pem ubuntu@13.53.36.126
```

### 3.2 Navigate to project and set up environment

```bash
# Go to project directory
cd /home/ubuntu/cndilocal

# Copy production environment file
cp backend/.env.production backend/.env

# Verify the configuration (should already be correct)
cat backend/.env

# You should see:
# - SECRET_KEY: 6oHRGNcidtzOhJe1lnaxemHyb93EvdJpmyaeISPDOzhhSGOPcGufqWK5-HpPH61Peyc
# - DOMAIN_NAME: connectandinspire.in
# - ALLOWED_HOSTS: connectandinspire.in,www.connectandinspire.in,13.53.36.126
```

### 3.3 Make scripts executable and run deployment

```bash
# Make scripts executable
chmod +x deploy.sh setup_ssl.sh update_deployment.sh

# Run the main deployment script
./deploy.sh
```

**What deploy.sh does:**
- ✅ Installs nginx, Python, and dependencies (~3 min)
- ✅ Sets up Python virtual environment (~1 min)
- ✅ Installs Django and packages (~2 min)
- ✅ Runs database migrations (~30 sec)
- ✅ Collects static files (~30 sec)
- ✅ Configures Gunicorn service (~30 sec)
- ✅ Configures Nginx (~30 sec)
- ✅ Starts all services (~30 sec)

**Total time: ~8-10 minutes**

---

## 📋 STEP 4: Set Up SSL Certificate

**⚠️ ONLY run this AFTER DNS is working! ⚠️**

```bash
# Still on EC2, in /home/ubuntu/cndilocal
./setup_ssl.sh
```

This will:
- ✅ Install Certbot
- ✅ Obtain free SSL certificate from Let's Encrypt
- ✅ Configure nginx for HTTPS
- ✅ Set up auto-renewal

**Time: ~2 minutes**

---

## 📋 STEP 5: Create Django Admin User

```bash
# Still on EC2
cd /home/ubuntu/cndilocal/backend
source venv/bin/activate
python manage.py createsuperuser

# Follow the prompts:
Username: admin
Email: vallapusumasri@gmail.com
Password: [choose a strong password]
Password (again): [same password]
```

---

## 📋 STEP 6: Test Your Deployment! 🎉

### Test from your local machine:

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://connectandinspire.in

# Test HTTPS
curl -I https://connectandinspire.in

# Test API
curl https://connectandinspire.in/api/
```

### Test in Browser:

1. **Main Website**: https://connectandinspire.in
   - Should load your React frontend

2. **Django Admin**: https://connectandinspire.in/admin
   - Login with the admin user you just created

3. **API**: https://connectandinspire.in/api/
   - Should show API endpoints (not 404)

4. **Test Signup Flow**:
   - Go to: https://connectandinspire.in
   - Try host/speaker signup
   - Enter email and request OTP
   - Check email for verification code
   - Complete signup process

---

## 🔧 Useful Commands (Save These!)

### View Logs

```bash
# Backend logs
sudo journalctl -u gunicorn -f

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Restart Services

```bash
# Restart backend
sudo systemctl restart gunicorn

# Restart nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status gunicorn
sudo systemctl status nginx
```

### Update Code (After Making Changes)

```bash
# On EC2
cd /home/ubuntu/cndilocal
./update_deployment.sh
```

---

## 🆘 Troubleshooting

### Issue: "502 Bad Gateway"

```bash
# Check if Gunicorn is running
sudo systemctl status gunicorn

# View Gunicorn logs
sudo journalctl -u gunicorn -n 50

# Restart Gunicorn
sudo systemctl restart gunicorn
```

### Issue: "Static files not loading (CSS/JS missing)"

```bash
cd /home/ubuntu/cndilocal/backend
source venv/bin/activate
python manage.py collectstatic --noinput
sudo systemctl restart nginx
```

### Issue: "DNS not resolving"

```bash
# Check DNS propagation
ping connectandinspire.in

# If it doesn't show 13.53.36.126, wait longer for DNS propagation
# Can take up to 1-2 hours in some cases
```

### Issue: "Permission denied" when running scripts

```bash
chmod +x deploy.sh setup_ssl.sh update_deployment.sh
```

### Issue: "SSL certificate failed"

This means DNS isn't ready yet. Wait longer for DNS propagation, then try again:

```bash
./setup_ssl.sh
```

---

## ✅ Deployment Checklist

- [ ] DNS records configured (A records for @ and www)
- [ ] DNS verified (ping shows correct IP)
- [ ] Project uploaded to EC2
- [ ] Copied .env.production to .env
- [ ] Ran deploy.sh successfully
- [ ] Ran setup_ssl.sh successfully
- [ ] Created Django superuser
- [ ] Tested website in browser (https://connectandinspire.in)
- [ ] Tested Django admin (https://connectandinspire.in/admin)
- [ ] Tested API (https://connectandinspire.in/api/)
- [ ] Tested signup/OTP flow

---

## 🎉 You're Live!

Once all steps are complete, your Connect & Inspire platform will be live at:

**🌐 https://connectandinspire.in**

### What's Working:
✅ Host signup/login with OTP
✅ Speaker signup/login with OTP
✅ Email notifications (Gmail SMTP)
✅ Event booking system
✅ Messaging between hosts & speakers
✅ Payment tracking
✅ Availability calendar
✅ Rating system
✅ Responsive mobile-first design
✅ HTTPS/SSL security

---

## 💰 Monthly Costs

- EC2 t2.micro: **$0-8/month** (free tier eligible)
- Domain: **Already paid** (~$10-15/year)
- SSL: **$0** (Let's Encrypt)

**Total: $0-8/month** (likely $0 if within free tier)

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. View logs (commands provided above)
3. See `DEPLOYMENT_STEPS.md` for detailed debugging

---

## 🚀 Ready to Deploy?

**Start with Step 1 (DNS configuration) and follow the steps in order!**

Good luck! Your platform will be amazing! 🎉
