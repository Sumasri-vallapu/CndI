#!/bin/bash

# Quick Update Script for Code Changes
# Run this on EC2 after pushing new code

set -e

echo "🔄 Updating deployment..."

APP_DIR="/home/ubuntu/cndilocal"
VENV_DIR="$APP_DIR/backend/venv"

cd $APP_DIR

# Pull latest code (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest code from git..."
    git pull origin main
fi

# Update backend
echo "🐍 Updating backend..."
cd backend
source venv/bin/activate

# Install any new dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart gunicorn
sudo systemctl restart nginx

echo "✅ Deployment updated successfully!"
echo "🌐 Check your site: https://connectandinspire.in"

# Show service status
echo ""
echo "Service Status:"
sudo systemctl status gunicorn --no-pager -l
