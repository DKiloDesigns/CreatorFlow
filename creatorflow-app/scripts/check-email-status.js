import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEmailStatus(email) {
  try {
    console.log(`🔍 Checking if "${email}" is registered...\n`);
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        plan: true,
        emailVerified: true,
        deactivated: true
      }
    });

    if (user) {
      console.log(`✅ REGISTERED: "${email}" is in the database`);
      console.log(`   Name: ${user.name || 'No name'}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Plan: ${user.plan || 'No plan'}`);
      console.log(`   Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
      console.log(`   Deactivated: ${user.deactivated ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log(`   Updated: ${user.updatedAt.toISOString()}`);
    } else {
      console.log(`❌ NOT REGISTERED: "${email}" is not in the database`);
    }

  } catch (error) {
    console.error('❌ Error checking email:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/check-email-status.js <email>');
  console.log('Example: node scripts/check-email-status.js test@example.com');
  process.exit(1);
}

checkEmailStatus(email); 