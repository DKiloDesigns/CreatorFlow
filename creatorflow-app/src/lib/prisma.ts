"use strict";
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'], // Enable query logging
  });
};

declare global {
  // This is needed to prevent the global prisma instance from being re-initialized
  // when hot-reloading in development.
  // See https://github.com/prisma/prisma-client-js/issues/1000
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client with logging in development
export const prisma = global.prisma ?? prismaClientSingleton();

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Test database connection on startup
async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("✅ Prisma connected before NextAuth initialization");
    return true;
  } catch (e) {
    console.error("❌ Prisma failed to connect before NextAuth initialization", e);
    return false;
  }
}

// Run the test but don't block initialization
testConnection().catch(console.error);
