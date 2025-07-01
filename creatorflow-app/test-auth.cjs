const { PrismaClient } = require('@prisma/client');

async function testAuth() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection and user lookup...');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful');
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (user) {
      console.log('✅ User found in database:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name: ${user.name}`);
      
      // Test password comparison
      const testPassword = 'testpassword';
      if (user.password === testPassword) {
        console.log('✅ Password comparison successful');
      } else {
        console.log('❌ Password comparison failed');
        console.log(`   Expected: ${testPassword}`);
        console.log(`   Actual: ${user.password}`);
      }
    } else {
      console.log('❌ User not found in database');
      
      // List all users
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, name: true }
      });
      console.log('📋 All users in database:');
      allUsers.forEach(u => console.log(`   - ${u.email} (${u.name})`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth(); 