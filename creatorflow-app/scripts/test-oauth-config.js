#!/usr/bin/env node

/**
 * OAuth Configuration Test Script
 * 
 * This script tests the OAuth configuration by:
 * 1. Checking environment variables
 * 2. Verifying callback URLs
 * 3. Testing database connection
 */

import 'dotenv/config';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

// ANSI color codes for output formatting
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  section: (title) => console.log(`\n${colors.cyan}=== ${title} ===${colors.reset}`),
};

// Check if a port is in use
function isPortInUse(port) {
  try {
    execSync(`lsof -i:${port} -P -n -t`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Main function
async function main() {
  log.section('OAuth Configuration Test');
  
  // 1. Check environment variables
  log.section('Environment Variables');
  
  const requiredVars = [
    'DATABASE_URL',
    'AUTH_SECRET',
    'NEXTAUTH_URL',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ];
  
  let missingVars = 0;
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      log.error(`Missing ${varName}`);
      missingVars++;
    } else {
      log.success(`${varName} is set`);
    }
  }
  
  if (missingVars > 0) {
    log.error(`${missingVars} required environment variables are missing`);
  } else {
    log.success('All required environment variables are set');
  }
  
  // 2. Check NEXTAUTH_URL format
  log.section('NextAuth URL Configuration');
  
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl) {
    try {
      const url = new URL(nextAuthUrl);
      log.info(`NEXTAUTH_URL: ${url.toString()}`);
      
      // Check if the port is in use
      const port = url.port || (url.protocol === 'https:' ? 443 : 80);
      if (isPortInUse(port)) {
        log.success(`Port ${port} is in use (server is running)`);
      } else {
        log.warning(`Port ${port} is not in use (server might not be running)`);
      }
      
      // Check localhost vs IP address
      if (url.hostname === 'localhost') {
        log.info('Using localhost as hostname (this is fine for development)');
      } else if (/^127\.\d+\.\d+\.\d+$/.test(url.hostname)) {
        log.info('Using IP address as hostname');
      } else {
        log.info(`Using hostname: ${url.hostname}`);
      }
    } catch (e) {
      log.error(`Invalid NEXTAUTH_URL: ${nextAuthUrl}`);
    }
  }
  
  // 3. Test database connection
  log.section('Database Connection');
  
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    log.success('Database connection successful');
    
    // Check if tables exist
    try {
      const userCount = await prisma.user.count();
      log.info(`User table exists with ${userCount} records`);
      
      const accountCount = await prisma.account.count();
      log.info(`Account table exists with ${accountCount} records`);
      
      const sessionCount = await prisma.session.count();
      log.info(`Session table exists with ${sessionCount} records`);
    } catch (e) {
      log.error(`Error checking tables: ${e.message}`);
    }
  } catch (e) {
    log.error(`Database connection failed: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
  
  // 4. Summary
  log.section('Summary');
  
  if (missingVars > 0) {
    log.error('Configuration issues found. Please fix the missing environment variables.');
  } else {
    log.success('Basic configuration looks good!');
    log.info('Next steps:');
    log.info('1. Ensure your OAuth provider (GitHub/Google) has the correct callback URL:');
    log.info(`   - ${process.env.NEXTAUTH_URL}/api/auth/callback/github`);
    log.info(`   - ${process.env.NEXTAUTH_URL}/api/auth/callback/google`);
    log.info('2. Make sure your email is public and verified in your GitHub settings');
    log.info('3. Check that your database schema is up to date (npx prisma db push)');
    log.info('4. Restart your server and try signing in again');
  }
}

// Run the main function
main().catch((e) => {
  log.error(`Unhandled error: ${e.message}`);
  process.exit(1);
});