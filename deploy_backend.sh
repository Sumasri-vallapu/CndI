#!/bin/bash

# Backend Deployment Script for Connect & Inspire Platform
# This script deploys the Django backend to production

set -e  # Exit on any error

echo "======================================"
echo "  Backend Deployment Started"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to backend directory
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

echo -e "${YELLOW}[1/8] Pulling latest code...${NC}"
git pull origin main

echo -e "${YELLOW}[2/8] Creating virtual environment (if not exists)...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

echo -e "${YELLOW}[3/8] Activating virtual environment...${NC}"
source venv/bin/activate

echo -e "${YELLOW}[4/8] Installing/updating dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

echo -e "${YELLOW}[5/8] Running database migrations...${NC}"
python manage.py migrate --no-input

echo -e "${YELLOW}[6/8] Generating usernames for existing users...${NC}"
python manage.py generate_usernames

echo -e "${YELLOW}[7/8] Collecting static files...${NC}"
python manage.py collectstatic --no-input --clear

echo -e "${YELLOW}[8/8] Creating logs directory...${NC}"
mkdir -p logs

echo -e "${GREEN}======================================"
echo "  Backend Deployment Completed!"
echo "======================================${NC}"

echo ""
echo "Next steps:"
echo "1. Restart gunicorn: sudo systemctl restart gunicorn"
echo "2. Restart nginx: sudo systemctl restart nginx"
echo "3. Check logs: tail -f logs/django.log"

