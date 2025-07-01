const { PrismaClient } = require('@prisma/client');

async function testClientAuth() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing client-side authentication flow...');
    
    // Simulate the exact flow from the sign-in page
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    console.log('📧 Testing credentials:', credentials);
    
    // First, test the authorize function directly
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });
    
    if (user && user.password === credentials.password) {
      console.log('✅ Credentials are valid');
      console.log('👤 User would be authenticated:', {
        id: user.id,
        email: user.email,
        name: user.name
      });
      
      // Now let's test if we can create a session manually
      console.log('🔐 Testing session creation...');
      
      // This simulates what NextAuth would do internally
      const sessionData = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      console.log('✅ Session data would be:', sessionData);
      
    } else {
      console.log('❌ Credentials are invalid');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testClientAuth(); 