# 🚀 COMPLETE STEP-BY-STEP DEPLOYMENT GUIDE
## Connect & Inspire Platform - connectandinspire.in

---

## 📋 **PHASE 1: PUSH CODE TO GITHUB** (Windows/WSL)

### **Location:** Your Windows machine (WSL Terminal or PowerShell)
### **Directory:** `/mnt/c/Users/Lenovo/cndilocal`

```bash
# Open WSL terminal (Windows Terminal or Ubuntu)
# Make sure you're in the project directory
cd /mnt/c/Users/Lenovo/cndilocal

# Step 1.1: Check git status
git status

# Step 1.2: Add all changes
git add .

# Step 1.3: Commit changes
git commit -m "Production-ready deployment setup for connectandinspire.in"

# Step 1.4: Push to GitHub
git push origin main
# If you're on a different branch:
# git push origin testing  (or your branch name)
```

**✅ Expected Result:** Code pushed to GitHub successfully

---

## 📋 **PHASE 2: CONFIGURE DNS** (Your Domain Registrar Website)

### **Location:** Your domain registrar's website (where you bought connectandinspire.in)
### **Interface:** Web browser

### **Steps:**

1. **Login to your domain registrar** (e.g., GoDaddy, Namecheap, etc.)

2. **Go to DNS Management** section for `connectandinspire.in`

3. **Add these DNS records:**

   **Record 1:**
   ```
   Type: A Record
   Host/Name: @
   Value/Points to: 13.53.36.126
   TTL: 3600 (or default)
   ```

   **Record 2:**
   ```
   Type: A Record
   Host/Name: www
   Value/Points to: 13.53.36.126
   TTL: 3600 (or default)
   ```

4. **Save changes**

5. **Wait 5-30 minutes** for DNS propagation

### **Verify DNS (Run this from your Windows/WSL terminal):**

```bash
# Location: Windows WSL Terminal
# Wait 5-10 minutes after setting DNS, then test:

ping connectandinspire.in

# Should show: Reply from 13.53.36.126
```

**If ping doesn't work, wait longer (up to 30 minutes) and try again.**

**✅ Expected Result:** `ping connectandinspire.in` shows `13.53.36.126`

---

## 📋 **PHASE 3: PREPARE EC2 SECURITY GROUPS** (AWS Console)

### **Location:** AWS Console (web browser)
### **Interface:** AWS EC2 Dashboard

### **Steps:**

1. **Login to AWS Console** → https://console.aws.amazon.com

2. **Go to EC2 Dashboard**

3. **Click on "Security Groups"** (left sidebar)

4. **Find security group** attached to your EC2 instance (ec2forcni)

5. **Edit Inbound Rules** → Add these if not present:

   ```
   Type: SSH
   Protocol: TCP
   Port: 22
   Source: 0.0.0.0/0 (or your IP for security)

   Type: HTTP
   Protocol: TCP
   Port: 80
   Source: 0.0.0.0/0

   Type: HTTPS
   Protocol: TCP
   Port: 443
   Source: 0.0.0.0/0
   ```

6. **Save Rules**

**✅ Expected Result:** Ports 22, 80, 443 are open

---

## 📋 **PHASE 4: UPLOAD CODE TO EC2** (Windows/WSL)

### **Location:** Your Windows machine (WSL Terminal)
### **Directory:** `/mnt/c/Users/Lenovo`

### **Prerequisites:**
- You have your EC2 SSH key file (e.g., `ec2forcni.pem`)
- Let's assume it's in: `/mnt/c/Users/Lenovo/Downloads/ec2forcni.pem`

### **Steps:**

```bash
# Location: Windows WSL Terminal
# Directory: /mnt/c/Users/Lenovo

cd /mnt/c/Users/Lenovo

# Step 4.1: Ensure your key file has correct permissions
chmod 400 Downloads/ec2forcni.pem

# Step 4.2: Upload entire project to EC2
scp -i Downloads/ec2forcni.pem -r cndilocal ubuntu@13.53.36.126:/home/ubuntu/

# This will take 2-5 minutes depending on internet speed
# You'll see files being copied one by one
```

**Alternative if SCP gives errors:**

```bash
# Use rsync instead (if available)
rsync -avz -e "ssh -i Downloads/ec2forcni.pem" \
  --exclude 'node_modules' \
  --exclude 'venv' \
  --exclude '.git' \
  cndilocal/ ubuntu@13.53.36.126:/home/ubuntu/cndilocal/
```

**✅ Expected Result:** All files uploaded to EC2

---

## 📋 **PHASE 5: DEPLOY ON EC2** (EC2 Instance)

### **Location:** EC2 Instance (via SSH)
### **Interface:** SSH Terminal

### **Step 5.1: Connect to EC2**

```bash
# Location: Windows WSL Terminal
# Connect to your EC2 instance

ssh -i /mnt/c/Users/Lenovo/Downloads/ec2forcni.pem ubuntu@13.53.36.126

# You should see something like:
# Welcome to Ubuntu...
# ubuntu@ip-172-31-xx-xx:~$
```

**✅ Expected Result:** You're now logged into EC2 (prompt shows `ubuntu@ip-...`)

---

### **Step 5.2: Verify Files Were Uploaded**

```bash
# Location: EC2 Instance (you're now inside EC2)
# Directory: /home/ubuntu

# Check if project folder exists
ls -la

# You should see "cndilocal" folder
# Enter the project directory
cd cndilocal

# Verify contents
ls -la

# You should see: backend, frontend, deploy.sh, etc.
```

**✅ Expected Result:** All project files are present

---

### **Step 5.3: Prepare Environment File**

```bash
# Location: EC2 Instance
# Directory: /home/ubuntu/cndilocal

# Copy production environment template
cp backend/.env.production backend/.env

# Verify the content (should already have your details)
cat backend/.env

# You should see:
# - SECRET_KEY: 6oHRGNcidtzOhJe1lnaxemHyb93EvdJpmyaeISPDOzhhSGOPcGufqWK5-HpPH61Peyc
# - DOMAIN_NAME: connectandinspire.in
# - ALLOWED_HOSTS: connectandinspire.in,www.connectandinspire.in,13.53.36.126
```

**✅ Expected Result:** `.env` file created with correct values

---

### **Step 5.4: Make Scripts Executable**

```bash
# Location: EC2 Instance
# Directory: /home/ubuntu/cndilocal

# Make deployment scripts executable
chmod +x deploy.sh
chmod +x setup_ssl.sh
chmod +x update_deployment.sh

# Verify permissions
ls -la *.sh

# Should show -rwxr-xr-x (executable)
```

**✅ Expected Result:** Scripts are executable

---

### **Step 5.5: Run Main Deployment Script**

```bash
# Location: EC2 Instance
# Directory: /home/ubuntu/cndilocal

# Run deployment (this takes 8-10 minutes)
./deploy.sh

# You'll see output like:
# 📦 Step 1: Installing system dependencies...
# 📁 Step 2: Setting up project directory...
# 🐍 Step 3: Setting up Python virtual environment...
# etc.
```

**What happens during deployment:**
1. ⏱️ Installs nginx, Python, git (~3 min)
2. ⏱️ Creates Python virtual environment (~1 min)
3. ⏱️ Installs Python packages (~2 min)
4. ⏱️ Runs database migrations (~30 sec)
5. ⏱️ Collects static files (~30 sec)
6. ⏱️ Configures Gunicorn service (~30 sec)
7. ⏱️ Configures Nginx (~30 sec)
8. ⏱️ Starts services (~30 sec)

**⏰ Total Time: ~8-10 minutes**

### **Possible Issues During Deployment:**

**Issue: "Permission denied"**
```bash
# Solution: Run with sudo
sudo ./deploy.sh
```

**Issue: "Port 80 already in use"**
```bash
# Check what's using port 80
sudo lsof -i :80

# Stop any existing nginx
sudo systemctl stop nginx
sudo systemctl stop apache2  # if apache is installed

# Then run deploy again
./deploy.sh
```

**✅ Expected Result:**
```
🎉 Deployment complete!
Next steps:
1. Point your domain DNS to this server's IP
2. Run SSL setup: sudo certbot --nginx -d connectandinspire.in -d www.connectandinspire.in
3. Create Django superuser: cd /home/ubuntu/cndilocal/backend && source venv/bin/activate && python manage.py createsuperuser

Your application should now be accessible at http://connectandinspire.in
```

---

### **Step 5.6: Test Basic Deployment (HTTP Only)**

```bash
# Location: EC2 Instance
# Directory: /home/ubuntu/cndilocal

# Check if services are running
sudo systemctl status gunicorn
sudo systemctl status nginx

# Both should show "active (running)"

# Test locally on EC2
curl http://localhost

# Should return HTML content (not an error)
```

**Test from your Windows machine:**

```bash
# Location: Windows WSL Terminal
# Test via IP address
curl http://13.53.36.126

# Should return HTML content
```

**Or open in browser:**
- Go to: `http://13.53.36.126`
- Should see your website (without HTTPS yet)

**✅ Expected Result:** Website loads via HTTP

---

## 📋 **PHASE 6: SETUP SSL CERTIFICATE** (EC2 Instance)

### **Location:** EC2 Instance (still SSH'd in)
### **Directory:** /home/ubuntu/cndilocal

### **⚠️ IMPORTANT: Only do this AFTER DNS is working!**

Verify DNS first:
```bash
# From EC2 instance
ping connectandinspire.in

# Should show: 13.53.36.126
```

**If DNS is not working, WAIT and try again later. SSL setup will fail without DNS!**

---

### **Step 6.1: Run SSL Setup Script**

```bash
# Location: EC2 Instance
# Directory: /home/ubuntu/cndilocal

# Run SSL setup (takes ~2 minutes)
./setup_ssl.sh

# You'll see:
# 🔒 Setting up SSL certificate for connectandinspire.in...
# Installing certbot...
# Obtaining SSL certificate...
```

**What happens:**
1. Installs Certbot (~1 min)
2. Contacts Let's Encrypt (~30 sec)
3. Verifies domain ownership (~30 sec)
4. Installs SSL certificates (~30 sec)
5. Configures nginx for HTTPS (~10 sec)
6. Tests auto-renewal (~10 sec)

**Possible Issues:**

**Issue: "Domain not found" or "DNS lookup failed"**
```
This means DNS is not ready yet.
Wait 10-20 more minutes and try again.
```

**Issue: "Port 80 not accessible"**
```bash
# Check firewall
sudo ufw status

# If firewall is enabled, allow ports
sudo ufw allow 80
sudo ufw allow 443
```

**✅ Expected Result:**
```
✅ SSL certificate installed successfully!
🔒 Your site is now accessible at https://connectandinspire.in
```

---

### **Step 6.2: Verify HTTPS Works**

```bash
# Location: EC2 Instance

# Test HTTPS locally
curl https://connectandinspire.in

# Should return HTML content with no errors
```

**Test from your Windows machine:**

Open browser and go to:
- `https://connectandinspire.in`
- `https://www.connectandinspire.in`

**Both should:**
- ✅ Load your website
- ✅ Show a green padlock 🔒 in browser
- ✅ Show "Connection is secure"

**✅ Expected Result:** Website loads with HTTPS and green padlock

---

## 📋 **PHASE 7: CREATE ADMIN USER** (EC2 Instance)

### **Location:** EC2 Instance
### **Directory:** /home/ubuntu/cndilocal/backend

```bash
# Location: EC2 Instance
# Navigate to backend
cd /home/ubuntu/cndilocal/backend

# Activate virtual environment
source venv/bin/activate

# You'll see (venv) before your prompt:
# (venv) ubuntu@ip-172-31-xx-xx:~/cndilocal/backend$

# Create superuser
python manage.py createsuperuser

# You'll be prompted:
# Username (leave blank to use 'ubuntu'): admin
# Email address: vallapusumasri@gmail.com
# Password: [enter a strong password]
# Password (again): [same password]

# Superuser created successfully.
```

**✅ Expected Result:** Admin user created

---

## 📋 **PHASE 8: FINAL TESTING** (Your Windows Browser)

### **Location:** Your Windows PC - Web Browser

### **Test 8.1: Main Website**

Open browser and go to: `https://connectandinspire.in`

**Should see:**
- ✅ Your React frontend
- ✅ Home page with branding
- ✅ Green padlock (secure)

---

### **Test 8.2: Django Admin**

Go to: `https://connectandinspire.in/admin`

**Should see:**
- ✅ Django admin login page
- ✅ Login with: admin / [your password]
- ✅ See Django admin dashboard

---

### **Test 8.3: API Endpoints**

Go to: `https://connectandinspire.in/api/`

**Should see:**
- ✅ JSON response or API listing (not 404 error)

Test specific endpoint:
- `https://connectandinspire.in/api/speakers/`
- Should return JSON (empty list or speaker data)

---

### **Test 8.4: Signup Flow (Most Important!)**

1. **Go to host signup:**
   - `https://connectandinspire.in` → Click "Signup as Host"

2. **Enter details:**
   - Email: your-test-email@gmail.com
   - First Name: Test
   - Last Name: User
   - Click "Send Verification Code"

3. **Check email:**
   - Wait 1-2 minutes
   - Check inbox (and spam folder)
   - Look for email from "Connect and Inspire"
   - Should have 6-digit OTP code

4. **Enter OTP:**
   - Enter the code from email
   - Click "Verify Code"

5. **Set Password:**
   - Enter password
   - Confirm password
   - Click "Create Account"

6. **Should redirect to dashboard:**
   - ✅ Host dashboard should load
   - ✅ See welcome message

**✅ Expected Result:** Complete signup flow works with email OTP

---

## 📋 **PHASE 9: VIEW LOGS** (If Something Goes Wrong)

### **Location:** EC2 Instance (SSH)

### **View Backend Logs:**

```bash
# Location: EC2 Instance

# View Gunicorn logs (Django backend)
sudo journalctl -u gunicorn -f

# Press Ctrl+C to stop viewing

# View last 50 lines
sudo journalctl -u gunicorn -n 50

# View errors only
sudo journalctl -u gunicorn -p err
```

### **View Nginx Logs:**

```bash
# Location: EC2 Instance

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### **Restart Services:**

```bash
# Location: EC2 Instance

# Restart backend (Django)
sudo systemctl restart gunicorn

# Restart nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status gunicorn
sudo systemctl status nginx
```

---

## 📋 **PHASE 10: DISCONNECT & CELEBRATE!** 🎉

### **Exit EC2:**

```bash
# Location: EC2 Instance
# Type to exit SSH:
exit

# Or press Ctrl+D
```

**✅ You're back in your Windows terminal**

---

## 🎉 **DEPLOYMENT COMPLETE!**

### **Your Site is Live:**
- 🌐 **Website:** https://connectandinspire.in
- 🔐 **Admin:** https://connectandinspire.in/admin
- 📡 **API:** https://connectandinspire.in/api/

### **Features Working:**
- ✅ Host signup/login with email OTP
- ✅ Speaker signup/login with email OTP
- ✅ Event booking system
- ✅ Messaging between hosts & speakers
- ✅ Payment tracking
- ✅ Availability calendar
- ✅ Rating system
- ✅ HTTPS/SSL security

---

## 📊 **QUICK REFERENCE SUMMARY**

| Phase | Location | Duration | Command |
|-------|----------|----------|---------|
| 1. Push to GitHub | Windows WSL | 2 min | `git add . && git commit -m "..." && git push` |
| 2. Configure DNS | Domain Registrar | 5 min + wait | Add A records in web UI |
| 3. Security Groups | AWS Console | 2 min | Add ports 22, 80, 443 |
| 4. Upload to EC2 | Windows WSL | 3 min | `scp -i key.pem -r cndilocal ubuntu@IP:/home/ubuntu/` |
| 5. Deploy | EC2 SSH | 10 min | `./deploy.sh` |
| 6. SSL Setup | EC2 SSH | 2 min | `./setup_ssl.sh` |
| 7. Create Admin | EC2 SSH | 1 min | `python manage.py createsuperuser` |
| 8. Test | Browser | 5 min | Visit https://connectandinspire.in |

**Total Time: ~30-40 minutes** (excluding DNS propagation wait time)

---

## 🆘 **HELP! Something Went Wrong!**

### **Common Issues:**

**1. Can't connect to EC2:**
```bash
# Windows WSL
# Check EC2 is running in AWS Console
# Check security group allows port 22
# Check key file permissions
chmod 400 /mnt/c/Users/Lenovo/Downloads/ec2forcni.pem
```

**2. DNS not working:**
```
Wait longer (DNS can take up to 2 hours)
Clear your browser cache
Try from different device/network
```

**3. Website shows 502 Bad Gateway:**
```bash
# EC2 SSH
# Check if Gunicorn is running
sudo systemctl status gunicorn
# Restart if needed
sudo systemctl restart gunicorn
```

**4. Static files (CSS/JS) not loading:**
```bash
# EC2 SSH
cd /home/ubuntu/cndilocal/backend
source venv/bin/activate
python manage.py collectstatic --noinput
sudo systemctl restart nginx
```

**5. Email OTP not working:**
```bash
# Check spam folder
# Check email settings in backend/.env
cat /home/ubuntu/cndilocal/backend/.env
# Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
```

---

## 📝 **SAVE THESE COMMANDS:**

### **Quick SSH to EC2:**
```bash
# Windows WSL
ssh -i /mnt/c/Users/Lenovo/Downloads/ec2forcni.pem ubuntu@13.53.36.126
```

### **Restart Everything:**
```bash
# EC2 SSH
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

### **View Logs:**
```bash
# EC2 SSH
sudo journalctl -u gunicorn -f
```

### **Update Code Later:**
```bash
# EC2 SSH
cd /home/ubuntu/cndilocal
./update_deployment.sh
```

---

**🎉 CONGRATULATIONS! Your Connect & Inspire platform is now LIVE! 🎉**
