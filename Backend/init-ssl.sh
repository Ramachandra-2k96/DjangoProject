#!/bin/bash

domains=(yourdomain.com www.yourdomain.com)
email="your-email@example.com"
staging=0

# Create necessary directories
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Stop any running containers
docker-compose down

# Get SSL certificate
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $email \
    --domains "${domains[@]}" \
    --agree-tos \
    --no-eff-email \
    $([ $staging != "0" ] && echo "--staging")

# Start services
docker-compose up -d 