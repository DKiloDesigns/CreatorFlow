import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToAdmin(email) {
  try {
    console.log(`Looking for user with email: ${email}`);
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      console.error('❌ User not found with email:', email);
      return;
    }

    if (user.role === 'ADMIN') {
      console.log('✅ User is already an admin:', user.name, user.email);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
      select: { id: true, name: true, email: true, role: true }
    });

    console.log('🎉 User promoted to admin successfully!');
    console.log('User details:', updatedUser);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_PROMOTED_TO_ADMIN',
        actorId: user.id, // Self-promotion
        targetId: user.id,
        details: {
          previousRole: 'USER',
          newRole: 'ADMIN',
          promotedBy: 'script'
        }
      }
    });

    console.log('📝 Audit log created');

  } catch (error) {
    console.error('❌ Error promoting user to admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node promote-to-admin.js <email>');
  process.exit(1);
}

promoteToAdmin(email);
