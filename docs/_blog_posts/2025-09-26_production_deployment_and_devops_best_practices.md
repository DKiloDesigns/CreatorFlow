# Production Deployment and DevOps Best Practices

**A comprehensive guide to deploying Next.js applications to production with modern DevOps practices, featuring real-world deployment strategies from CreatorFlow's production environment.**

*Published: September 26, 2025*
*Author: Lloyd Alexander (CreatorFlow Agent)*
*Tags: DevOps, Deployment, Next.js, Docker, CI/CD, Production, Monitoring, Infrastructure, CreatorFlow*

## Introduction

Deploying applications to production requires careful planning, robust infrastructure, and comprehensive monitoring. In this comprehensive guide, we'll explore modern DevOps practices for deploying Next.js applications, covering containerization, CI/CD pipelines, infrastructure as code, and production monitoring, drawing from our experience deploying CreatorFlow to production and providing best practices for CreatorFlow.

## Table of Contents

1. [DevOps Philosophy and Principles](#devops-philosophy-and-principles)
2. [Containerization with Docker](#containerization-with-docker)
3. [Infrastructure as Code](#infrastructure-as-code)
4. [CI/CD Pipeline Implementation](#cicd-pipeline-implementation)
5. [Environment Management](#environment-management)
6. [Database Migration Strategies](#database-migration-strategies)
7. [Security Best Practices](#security-best-practices)
8. [Monitoring and Observability](#monitoring-and-observability)
9. [Disaster Recovery and Backup](#disaster-recovery-and-backup)
10. [Performance Optimization](#performance-optimization)

## DevOps Philosophy and Principles

### Core DevOps Principles

1. **Automation**: Automate repetitive tasks and processes
2. **Collaboration**: Foster collaboration between development and operations
3. **Continuous Integration**: Integrate code changes frequently
4. **Continuous Deployment**: Deploy changes automatically and safely
5. **Monitoring**: Monitor everything, measure performance
6. **Feedback Loops**: Short feedback cycles for faster iteration

### DevOps Culture

- **Shared Responsibility**: Everyone owns the entire system
- **Fail Fast**: Detect and fix issues quickly
- **Continuous Learning**: Learn from failures and successes
- **Tooling**: Use the right tools for the job
- **Documentation**: Document processes and decisions

## Containerization with Docker

### Multi-Stage Dockerfile

```dockerfile
# Dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose for Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/creatorflow_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=creatorflow_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    restart: unless-stopped
    depends_on:
      - db
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    restart: unless-stopped
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

## Infrastructure as Code

### Terraform Configuration

```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = var.availability_zones[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.project_name}-private-${count.index + 1}"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.app_cpu
  memory                   = var.app_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.project_name}:latest"
      
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}"
        },
        {
          name  = "REDIS_URL"
          value = "redis://${aws_elasticache_replication_group.main.primary_endpoint_address}:6379"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db"
  
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "${var.project_name}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  
  tags = {
    Name = "${var.project_name}-database"
  }
}
```

### Kubernetes Configuration

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: creatorflow
  labels:
    name: creatorflow

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: creatorflow
data:
  NODE_ENV: "production"
  PORT: "3000"
  HOSTNAME: "0.0.0.0"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: creatorflow
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  REDIS_URL: <base64-encoded-redis-url>
  NEXTAUTH_SECRET: <base64-encoded-nextauth-secret>

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: creatorflow-app
  namespace: creatorflow
spec:
  replicas: 3
  selector:
    matchLabels:
      app: creatorflow-app
  template:
    metadata:
      labels:
        app: creatorflow-app
    spec:
      containers:
      - name: app
        image: creatorflow:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: creatorflow-service
  namespace: creatorflow
spec:
  selector:
    app: creatorflow-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: creatorflow-ingress
  namespace: creatorflow
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - creatorflow.com
    - www.creatorflow.com
    secretName: creatorflow-tls
  rules:
  - host: creatorflow.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: creatorflow-service
            port:
              number: 80
```

## CI/CD Pipeline Implementation

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

env:
  AWS_REGION: us-west-2
  ECR_REPOSITORY: creatorflow
  ECS_SERVICE: creatorflow-service
  ECS_CLUSTER: creatorflow-cluster
  ECS_TASK_DEFINITION: creatorflow-app

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js 18
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build, tag, and push image to Amazon ECR
      id: build-image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Download task definition
      run: |
        aws ecs describe-task-definition \
          --task-definition $ECS_TASK_DEFINITION \
          --query taskDefinition > task-definition.json
    
    - name: Fill in the new image ID in the Amazon ECS task definition
      id: task-def
      uses: aws-actions/amazon-ecs-render-task-definition@v1
      with:
        task-definition: task-definition.json
        container-name: app
        image: ${{ needs.build.outputs.image }}
    
    - name: Deploy Amazon ECS task definition
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: ${{ steps.task-def.outputs.task-definition }}
        service: $ECS_SERVICE
        cluster: $ECS_CLUSTER
        wait-for-service-stability: true

  notify:
    needs: [test, build, deploy]
    runs-on: ubuntu-latest
    if: always()
    steps:
    - name: Notify deployment status
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### GitLab CI/CD Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

test:
  stage: test
  image: node:18-alpine
  before_script:
    - npm ci
  script:
    - npm run test:ci
    - npm run lint
    - npm run type-check
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main

deploy_staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST $STAGING_WEBHOOK_URL
  environment:
    name: staging
    url: https://staging.creatorflow.com
  only:
    - develop

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST $PRODUCTION_WEBHOOK_URL
  environment:
    name: production
    url: https://creatorflow.com
  when: manual
  only:
    - main
```

## Environment Management

### Environment Configuration

```typescript
// lib/config/environment.ts
import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.string().default('3000'),
  HOSTNAME: z.string().default('0.0.0.0'),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // Redis
  REDIS_URL: z.string().url(),
  
  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  
  // External APIs
  OPENAI_API_KEY: z.string().min(1),
  SOCIAL_MEDIA_API_KEY: z.string().min(1),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Feature Flags
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_WEBSOCKET: z.string().transform(val => val === 'true').default('true'),
});

export const env = environmentSchema.parse(process.env);

export type Environment = z.infer<typeof environmentSchema>;
```

### Environment-Specific Configurations

```typescript
// config/environments/development.ts
export const developmentConfig = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/creatorflow_dev',
    ssl: false,
    logging: true,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  auth: {
    providers: ['credentials', 'google'],
    session: {
      maxAge: 24 * 60 * 60, // 24 hours
    },
  },
  monitoring: {
    enabled: false,
    logLevel: 'debug',
  },
  features: {
    analytics: true,
    websocket: true,
    realTimeNotifications: true,
  },
};

// config/environments/production.ts
export const productionConfig = {
  database: {
    url: process.env.DATABASE_URL!,
    ssl: true,
    logging: false,
    pool: {
      min: 2,
      max: 10,
    },
  },
  redis: {
    url: process.env.REDIS_URL!,
    tls: true,
  },
  auth: {
    providers: ['credentials', 'google', 'github'],
    session: {
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
  },
  monitoring: {
    enabled: true,
    logLevel: 'info',
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
  },
  features: {
    analytics: process.env.ENABLE_ANALYTICS === 'true',
    websocket: process.env.ENABLE_WEBSOCKET === 'true',
    realTimeNotifications: true,
  },
};
```

## Database Migration Strategies

### Zero-Downtime Migrations

```typescript
// scripts/migrate-zero-downtime.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function zeroDowntimeMigration() {
  console.log('Starting zero-downtime migration...');
  
  try {
    // Step 1: Add new column with default value
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN "newField" TEXT DEFAULT 'default_value'
    `;
    console.log('✅ Added new column with default value');
    
    // Step 2: Populate new column with data from old column
    await prisma.$executeRaw`
      UPDATE "User" 
      SET "newField" = "oldField" 
      WHERE "oldField" IS NOT NULL
    `;
    console.log('✅ Populated new column with existing data');
    
    // Step 3: Add NOT NULL constraint
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ALTER COLUMN "newField" SET NOT NULL
    `;
    console.log('✅ Added NOT NULL constraint');
    
    // Step 4: Drop old column
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      DROP COLUMN "oldField"
    `;
    console.log('✅ Dropped old column');
    
    console.log('🎉 Zero-downtime migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

zeroDowntimeMigration();
```

### Blue-Green Deployment for Database

```typescript
// scripts/blue-green-db-migration.ts
import { PrismaClient } from '@prisma/client';

const blueDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.BLUE_DATABASE_URL
    }
  }
});

const greenDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.GREEN_DATABASE_URL
    }
  }
});

async function blueGreenMigration() {
  console.log('Starting blue-green database migration...');
  
  try {
    // Step 1: Set up green database
    console.log('Setting up green database...');
    await greenDb.$executeRaw`CREATE SCHEMA IF NOT EXISTS public`;
    
    // Step 2: Run migrations on green database
    console.log('Running migrations on green database...');
    // Run your migration scripts here
    
    // Step 3: Sync data from blue to green
    console.log('Syncing data from blue to green...');
    const users = await blueDb.user.findMany();
    await greenDb.user.createMany({
      data: users,
      skipDuplicates: true
    });
    
    // Step 4: Verify green database
    console.log('Verifying green database...');
    const greenUserCount = await greenDb.user.count();
    const blueUserCount = await blueDb.user.count();
    
    if (greenUserCount !== blueUserCount) {
      throw new Error('Data sync verification failed');
    }
    
    // Step 5: Switch traffic to green database
    console.log('Switching traffic to green database...');
    // Update your application configuration to use green database
    
    // Step 6: Decommission blue database
    console.log('Decommissioning blue database...');
    // Clean up blue database resources
    
    console.log('🎉 Blue-green migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Blue-green migration failed:', error);
    throw error;
  } finally {
    await blueDb.$disconnect();
    await greenDb.$disconnect();
  }
}

blueGreenMigration();
```

## Security Best Practices

### Security Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.openai.com",
    "frame-ancestors 'none'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // HSTS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Environment Variable Security

```typescript
// lib/security/env-validation.ts
import { z } from 'zod';
import { createHash } from 'crypto';

const sensitiveFields = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN'];

function validateSensitiveFields(env: Record<string, string>) {
  const issues: string[] = [];
  
  for (const [key, value] of Object.entries(env)) {
    const isSensitive = sensitiveFields.some(field => 
      key.toUpperCase().includes(field)
    );
    
    if (isSensitive) {
      // Check for common insecure values
      if (value === 'password' || value === 'secret' || value === 'key') {
        issues.push(`${key} appears to have a default/insecure value`);
      }
      
      // Check for weak secrets
      if (key.includes('SECRET') && value.length < 32) {
        issues.push(`${key} is too short for a secret (minimum 32 characters)`);
      }
      
      // Check for exposed secrets
      if (value.includes(' ') || value.includes('\n')) {
        issues.push(`${key} contains whitespace, which may indicate improper handling`);
      }
    }
  }
  
  if (issues.length > 0) {
    throw new Error(`Security issues found:\n${issues.join('\n')}`);
  }
}

export function validateEnvironmentSecurity(env: Record<string, string>) {
  validateSensitiveFields(env);
  
  // Additional security checks
  if (env.NODE_ENV === 'production') {
    if (!env.NEXTAUTH_SECRET || env.NEXTAUTH_SECRET.length < 32) {
      throw new Error('NEXTAUTH_SECRET must be at least 32 characters in production');
    }
    
    if (env.DATABASE_URL && !env.DATABASE_URL.startsWith('postgresql://')) {
      throw new Error('DATABASE_URL must use PostgreSQL in production');
    }
  }
}
```

## Monitoring and Observability

### Application Monitoring

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});

export { Sentry };
```

### Custom Metrics

```typescript
// lib/monitoring/metrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Custom metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const activeConnections = new Gauge({
  name: 'websocket_active_connections',
  help: 'Number of active WebSocket connections',
});

export const databaseConnections = new Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections',
});

// Register metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(databaseConnections);
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      external_apis: 'unknown',
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'unhealthy';
  }

  try {
    // Check Redis
    await redis.ping();
    health.services.redis = 'healthy';
  } catch (error) {
    health.services.redis = 'unhealthy';
    health.status = 'unhealthy';
  }

  try {
    // Check external APIs
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    health.services.external_apis = response.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    health.services.external_apis = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  
  return NextResponse.json(health, { status: statusCode });
}
```

## Disaster Recovery and Backup

### Database Backup Strategy

```typescript
// scripts/backup-database.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';

const execAsync = promisify(exec);
const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `creatorflow-backup-${timestamp}.sql`;
  const backupPath = `/tmp/${backupFileName}`;
  
  try {
    console.log('Starting database backup...');
    
    // Create database dump
    const dumpCommand = `pg_dump ${process.env.DATABASE_URL} > ${backupPath}`;
    await execAsync(dumpCommand);
    
    console.log('Database dump created successfully');
    
    // Compress backup
    const compressedFileName = `${backupFileName}.gz`;
    const compressedPath = `/tmp/${compressedFileName}`;
    const compressCommand = `gzip -c ${backupPath} > ${compressedPath}`;
    await execAsync(compressCommand);
    
    console.log('Backup compressed successfully');
    
    // Upload to S3
    const fileStream = createReadStream(compressedPath);
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BACKUP_BUCKET,
      Key: `database-backups/${compressedFileName}`,
      Body: fileStream,
      ServerSideEncryption: 'AES256',
    });
    
    await s3Client.send(uploadCommand);
    console.log('Backup uploaded to S3 successfully');
    
    // Clean up local files
    await unlink(backupPath);
    await unlink(compressedPath);
    
    console.log('✅ Database backup completed successfully');
    
  } catch (error) {
    console.error('❌ Database backup failed:', error);
    throw error;
  }
}

// Run backup
backupDatabase();
```

### Automated Backup Schedule

```yaml
# k8s/backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
  namespace: creatorflow
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            command:
            - /bin/sh
            - -c
            - |
              pg_dump $DATABASE_URL | gzip > /backup/backup-$(date +%Y%m%d-%H%M%S).sql.gz
              aws s3 cp /backup/backup-*.sql.gz s3://$S3_BACKUP_BUCKET/database-backups/
              rm /backup/backup-*.sql.gz
            env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: DATABASE_URL
            - name: AWS_ACCESS_KEY_ID
              valueFrom:
                secretKeyRef:
                  name: aws-credentials
                  key: access-key-id
            - name: AWS_SECRET_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name: aws-credentials
                  key: secret-access-key
            - name: S3_BACKUP_BUCKET
              value: "creatorflow-backups"
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            emptyDir: {}
          restartPolicy: OnFailure
```

## Performance Optimization

### CDN Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
    {
      source: '/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
```

### Caching Strategy

```typescript
// lib/cache/redis-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export class RedisCache {
  private static instance: RedisCache;
  private redis: Redis;

  private constructor() {
    this.redis = redis;
  }

  static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache pattern invalidation error:', error);
    }
  }
}
```

## Best Practices and Tips

### 1. Infrastructure
- Use Infrastructure as Code (Terraform, CloudFormation)
- Implement proper monitoring and alerting
- Use managed services when possible
- Plan for disaster recovery

### 2. Security
- Implement proper authentication and authorization
- Use HTTPS everywhere
- Regular security audits and updates
- Implement proper secret management

### 3. Performance
- Use CDNs for static assets
- Implement proper caching strategies
- Monitor performance metrics
- Optimize database queries

### 4. Monitoring
- Set up comprehensive logging
- Implement health checks
- Use APM tools
- Monitor business metrics

### 5. Deployment
- Use blue-green or canary deployments
- Implement proper rollback strategies
- Test in staging environments
- Automate deployment processes

## Conclusion

Production deployment and DevOps best practices are essential for building reliable, scalable, and maintainable applications. By implementing proper containerization, CI/CD pipelines, monitoring, and security measures, you can ensure your Next.js application runs smoothly in production within the CreatorFlow ecosystem.

The key to successful DevOps is automation, monitoring, and continuous improvement. Start with the basics and gradually implement more advanced practices as your CreatorFlow application grows.

---

**Ready to deploy your Next.js application to production? Start with containerization and gradually implement the full DevOps pipeline as your CreatorFlow needs grow.**
