# ⚡ Quick Deployment Reference

## 🎯 What You Need RIGHT NOW

1. **Your EC2 IP**: `_____________`
2. **Your Domain**: `_____________`
3. **Your SSH Key**: `/path/to/your-key.pem`

---

## 📝 Pre-Deployment (5 minutes)

### 1. Generate SECRET_KEY
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```
Copy the output ⬆️

### 2. Update `backend/.env.production`
```bash
SECRET_KEY=<paste the key from step 1>
DOMAIN_NAME=<your-domain.com>
ALLOWED_HOSTS=<your-domain.com>,www.<your-domain.com>,<YOUR_EC2_IP>
```

### 3. Update scripts
- In `deploy.sh` line 12: `DOMAIN_NAME="your-domain.com"`
- In `setup_ssl.sh` line 6: `DOMAIN_NAME="your-domain.com"`

### 4. Build frontend
```bash
cd frontend
npm install
npm run build
```

---

## 🚀 Deployment (3 commands)

### 1. Upload to EC2
```bash
cd /mnt/c/Users/Lenovo
scp -i /path/to/your-key.pem -r cndilocal ubuntu@YOUR_EC2_IP:/home/ubuntu/
```

### 2. Deploy
```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_IP
cd /home/ubuntu/cndilocal
cp backend/.env.production backend/.env
nano backend/.env  # Verify values
chmod +x deploy.sh setup_ssl.sh
./deploy.sh
```

### 3. Setup SSL (after DNS is ready)
```bash
./setup_ssl.sh
```

---

## ✅ Verify It Works

```bash
# Test HTTPS
curl -I https://your-domain.com

# Test API
curl https://your-domain.com/api/

# Browser
https://your-domain.com
https://your-domain.com/admin
```

---

## 🔧 Common Commands

```bash
# View logs
sudo journalctl -u gunicorn -f

# Restart backend
sudo systemctl restart gunicorn

# Restart nginx
sudo systemctl restart nginx

# Create admin user
cd /home/ubuntu/cndilocal/backend
source venv/bin/activate
python manage.py createsuperuser
```

---

## 🆘 If Something Breaks

```bash
# Check status
sudo systemctl status gunicorn
sudo systemctl status nginx

# View errors
sudo journalctl -u gunicorn -n 50
sudo tail -f /var/log/nginx/error.log
```

---

## 🎉 That's It!

Your site should be live at: **https://your-domain.com**

Full guide: See `DEPLOYMENT_STEPS.md` for detailed instructions.
