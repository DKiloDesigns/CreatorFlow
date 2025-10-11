import { prisma } from './src/lib/prisma';

async function checkEmailVerified() {
  const userEmail = 'dkilodesigns@gmail.com'; // Replace with the actual email
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { emailVerified: true },
    });

    if (user) {
      console.log(`Email verified status for ${userEmail}:`, user.emailVerified);
    } else {
      console.log(`User with email ${userEmail} not found.`);
    }
  } catch (error) {
    console.error('Error checking email verified status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmailVerified();
