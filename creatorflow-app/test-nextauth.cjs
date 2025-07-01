const { PrismaClient } = require('@prisma/client');

async function testNextAuthAuthorize() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing NextAuth authorize function...');
    
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    console.log('📧 Credentials:', credentials);
    
    // Simulate the exact NextAuth authorize logic
    if (!credentials || !credentials.email || !credentials.password) {
      console.log('❌ Missing credentials');
      return null;
    }
    
    console.log('✅ Credentials validation passed');
    
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });
    
    console.log('🔍 User lookup result:', user ? 'Found' : 'Not found');
    
    if (user && user.password === credentials.password) {
      console.log('✅ NextAuth authorize would return user:', {
        id: user.id,
        email: user.email,
        name: user.name
      });
      return user;
    } else {
      console.log('❌ NextAuth authorize would return null');
      if (!user) {
        console.log('   Reason: User not found');
      } else {
        console.log('   Reason: Password mismatch');
        console.log(`   Expected: ${credentials.password}`);
        console.log(`   Actual: ${user.password}`);
      }
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

testNextAuthAuthorize(); 