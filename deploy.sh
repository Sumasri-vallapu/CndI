#!/bin/bash

# Deployment Script for Connect & Inspire Platform
# This script will be run on your EC2 instance

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration - connectandinspire.in
DOMAIN_NAME="connectandinspire.in"
APP_DIR="/home/ubuntu/cndilocal"
VENV_DIR="$APP_DIR/backend/venv"

echo -e "${YELLOW}📦 Step 1: Installing system dependencies...${NC}"
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv nginx git

echo -e "${GREEN}✅ System dependencies installed${NC}"

echo -e "${YELLOW}📁 Step 2: Setting up project directory...${NC}"
# Project will be uploaded separately
mkdir -p $APP_DIR

echo -e "${YELLOW}🐍 Step 3: Setting up Python virtual environment...${NC}"
cd $APP_DIR/backend
python3 -m venv venv
source venv/bin/activate

echo -e "${YELLOW}📚 Step 4: Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
pip install python-dotenv gunicorn

echo -e "${GREEN}✅ Python dependencies installed${NC}"

echo -e "${YELLOW}🗄️  Step 5: Setting up database...${NC}"
python manage.py migrate --noinput

echo -e "${YELLOW}📁 Step 6: Collecting static files...${NC}"
python manage.py collectstatic --noinput

echo -e "${GREEN}✅ Database and static files ready${NC}"

echo -e "${YELLOW}🔧 Step 7: Setting up Gunicorn service...${NC}"
sudo tee /etc/systemd/system/gunicorn.service > /dev/null <<EOF
[Unit]
Description=Gunicorn daemon for Connect & Inspire
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=$APP_DIR/backend
Environment="PATH=$VENV_DIR/bin"
EnvironmentFile=$APP_DIR/backend/.env
ExecStart=$VENV_DIR/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 backend.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✅ Gunicorn service configured${NC}"

echo -e "${YELLOW}🌐 Step 8: Setting up Nginx...${NC}"
sudo tee /etc/nginx/sites-available/cndilocal > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    # Frontend - React build
    location / {
        root $APP_DIR/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files
    location /static/ {
        alias $APP_DIR/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files (if not using S3)
    location /media/ {
        alias $APP_DIR/backend/media/;
        expires 30d;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/cndilocal /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo -e "${GREEN}✅ Nginx configured${NC}"

echo -e "${YELLOW}🔄 Step 9: Starting services...${NC}"
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl restart nginx

echo -e "${GREEN}✅ Services started${NC}"

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Point your domain DNS to this server's IP"
echo "2. Run SSL setup: sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
echo "3. Create Django superuser: cd $APP_DIR/backend && source venv/bin/activate && python manage.py createsuperuser"
echo ""
echo -e "${GREEN}Your application should now be accessible at http://$DOMAIN_NAME${NC}"
