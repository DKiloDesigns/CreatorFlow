const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { password: 'testpassword' }, // In production, hash passwords!
    create: {
      email: 'test@example.com',
      password: 'testpassword', // In production, hash passwords!
      // Add any other required fields if your model requires them
    },
  });
}

main().finally(() => prisma.$disconnect()); 