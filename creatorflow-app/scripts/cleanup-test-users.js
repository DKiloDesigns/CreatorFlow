import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupTestUsers() {
  try {
    console.log('🧹 Cleaning up test users...\n');
    
    // First, let's see what we have
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        role: true,
        plan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Found ${allUsers.length} total users:\n`);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (${user.email}) - ${user.plan} plan`);
    });

    // Identify users to keep (test@example.com)
    const keepEmail = 'test@example.com';
    const userToKeep = allUsers.find(user => user.email === keepEmail);

    if (!userToKeep) {
      console.log(`\n❌ ERROR: Cannot find ${keepEmail} to keep!`);
      return;
    }

    console.log(`\n✅ Keeping: ${userToKeep.name} (${userToKeep.email}) - ${userToKeep.plan} plan`);

    // Identify users to delete (all except test@example.com)
    const usersToDelete = allUsers.filter(user => user.email !== keepEmail);

    if (usersToDelete.length === 0) {
      console.log('\n✅ No users to delete - database is already clean!');
      return;
    }

    console.log(`\n🗑️  Users to delete (${usersToDelete.length}):`);
    usersToDelete.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (${user.email})`);
    });

    // Confirm deletion
    console.log('\n⚠️  WARNING: This will permanently delete the above users!');
    console.log('Type "DELETE" to confirm:');
    
    // For safety, we'll use a simple confirmation
    const shouldDelete = process.argv.includes('--confirm');
    
    if (!shouldDelete) {
      console.log('\n❌ Deletion cancelled. Run with --confirm flag to actually delete.');
      console.log('Example: node scripts/cleanup-test-users.js --confirm');
      return;
    }

    // Delete users
    console.log('\n🗑️  Deleting users...');
    
    for (const user of usersToDelete) {
      try {
        await prisma.user.delete({
          where: { id: user.id }
        });
        console.log(`✅ Deleted: ${user.name || 'No name'} (${user.email})`);
      } catch (error) {
        console.log(`❌ Failed to delete ${user.email}: ${error.message}`);
      }
    }

    // Verify final state
    const remainingUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        role: true,
        plan: true
      }
    });

    console.log(`\n✅ Cleanup complete! ${remainingUsers.length} user(s) remaining:`);
    remainingUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'No name'} (${user.email}) - ${user.plan} plan`);
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestUsers(); 