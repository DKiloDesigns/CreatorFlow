# CreatorFlow Deployment Guide

## Overview

This guide covers deploying CreatorFlow to various environments including development, staging, and production.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis (for caching)
- SMTP service (for emails)
- OAuth provider credentials
- Stripe account (for billing)

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/creatorflow"

# Authentication
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Redis
REDIS_URL="redis://localhost:6379"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
LOGROCKET_APP_ID="your-logrocket-app-id"

# File Storage
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: creatorflow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed database (optional)
docker-compose exec app npx prisma db seed
```

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configure Environment Variables

In the Vercel dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add all required environment variables

### 4. Set Up Database

For production, use a managed PostgreSQL service:

```bash
# Add database URL to Vercel environment variables
vercel env add DATABASE_URL

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

## AWS Deployment

### 1. Create ECS Task Definition

```json
{
  "family": "creatorflow",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "creatorflow",
      "image": "your-ecr-repo/creatorflow:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:creatorflow/database"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/creatorflow",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 2. Set Up RDS Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier creatorflow-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password your-password \
  --allocated-storage 20
```

### 3. Deploy to ECS

```bash
# Build and push Docker image
docker build -t creatorflow .
docker tag creatorflow:latest your-ecr-repo/creatorflow:latest
docker push your-ecr-repo/creatorflow:latest

# Create ECS service
aws ecs create-service \
  --cluster your-cluster \
  --service-name creatorflow \
  --task-definition creatorflow:1 \
  --desired-count 2
```

## Monitoring & Health Checks

### 1. Health Check Endpoint

The application includes a health check endpoint at `/api/health`:

```bash
curl https://your-domain.com/api/health
```

### 2. Set Up Monitoring

#### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.js`:

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

#### LogRocket (Session Replay)

```bash
npm install logrocket
```

### 3. Set Up Alerts

Configure alerts for:
- High error rates
- Slow response times
- Database connection issues
- Disk space usage

## SSL/TLS Configuration

### 1. Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Backup Strategy

### 1. Database Backups

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
gzip backup_$DATE.sql
aws s3 cp backup_$DATE.sql.gz s3://your-backup-bucket/
```

### 2. File Backups

```bash
# Backup uploaded files
aws s3 sync /app/uploads s3://your-backup-bucket/uploads/
```

### 3. Automated Backups

```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## Performance Optimization

### 1. Enable Caching

```bash
# Install Redis
sudo apt-get install redis-server

# Configure Next.js caching
# Add to next.config.js
module.exports = {
  experimental: {
    isrMemoryCacheSize: 0,
  },
}
```

### 2. CDN Configuration

```bash
# Set up CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### 3. Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify network connectivity
   - Check firewall rules

2. **OAuth Issues**
   - Verify callback URLs
   - Check client ID/secret
   - Ensure HTTPS in production

3. **File Upload Issues**
   - Check file size limits
   - Verify storage permissions
   - Check CORS configuration

### Debug Commands

```bash
# Check application logs
docker-compose logs app

# Check database connection
npx prisma db pull

# Test health endpoint
curl http://localhost:3000/api/health

# Monitor performance
npm run analyze
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitoring and alerting configured 