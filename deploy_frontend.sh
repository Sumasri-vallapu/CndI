#!/bin/bash

# Frontend Deployment Script for Connect & Inspire Platform
# This script builds and deploys the React frontend

set -e  # Exit on any error

echo "======================================"
echo "  Frontend Deployment Started"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to frontend directory
cd frontend

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please create .env.production file from .env.example"
    exit 1
fi

echo -e "${YELLOW}[1/5] Pulling latest code...${NC}"
git pull origin main

echo -e "${YELLOW}[2/5] Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}[3/5] Building production bundle...${NC}"
npm run build

echo -e "${YELLOW}[4/5] Checking build output...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed! dist directory not found${NC}"
    exit 1
fi

echo -e "${YELLOW}[5/5] Deployment files ready in dist/...${NC}"
ls -lh dist/

echo -e "${GREEN}======================================"
echo "  Frontend Build Completed!"
echo "======================================${NC}"

echo ""
echo "Build output is in: frontend/dist/"
echo "Next steps:"
echo "1. Copy dist/ contents to your web server"
echo "2. Or use: cp -r dist/* /var/www/yourdomain.com/"
echo "3. Restart nginx: sudo systemctl restart nginx"
