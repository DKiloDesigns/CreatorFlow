import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'testpassword', // In production, hash passwords!
    },
  });
}

main().finally(() => prisma.$disconnect()); 