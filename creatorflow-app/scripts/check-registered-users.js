import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRegisteredUsers() {
  try {
    console.log('🔍 Checking registered users in database...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Found ${users.length} registered user(s):\n`);

    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Plan: ${user.plan || 'No plan'}`);
      console.log(`   Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
      console.log(`   Deactivated: ${user.deactivated ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log(`   Updated: ${user.updatedAt.toISOString()}`);
      console.log('');
    });

    // Check for specific test emails
    const testEmails = [
      'test@example.com',
      'test1751584711605@example.com',
      'test1751584743824@example.com'
    ];

    console.log('🔍 Checking for specific test emails:');
    for (const email of testEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, createdAt: true }
      });
      
      if (user) {
        console.log(`✅ ${email} - FOUND (ID: ${user.id}, Created: ${user.createdAt.toISOString()})`);
      } else {
        console.log(`❌ ${email} - NOT FOUND`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRegisteredUsers(); 