#!/bin/bash

# SSL Setup Script using Let's Encrypt
# Run this AFTER your domain DNS is pointing to your server

set -e

DOMAIN_NAME="connectandinspire.in"

echo "🔒 Setting up SSL certificate for $DOMAIN_NAME..."

# Install certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos --email vallapusumasri@gmail.com

# Test auto-renewal
sudo certbot renew --dry-run

echo "✅ SSL certificate installed successfully!"
echo "🔒 Your site is now accessible at https://$DOMAIN_NAME"
