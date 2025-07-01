const { PrismaClient } = require('@prisma/client');

async function testAuthConfig() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing NextAuth configuration...');
    
    // Test the exact authorize function from src/auth.ts
    const credentials = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    console.log('📧 Testing credentials:', credentials);
    
    // Simulate the exact authorize function
    if (!credentials?.email || !credentials?.password) {
      console.log('❌ Missing credentials');
      return null;
    }
    
    console.log('✅ Credentials validation passed');
    
    try {
      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      });
      
      console.log('🔍 User lookup result:', user ? 'Found' : 'Not found');
      
      if (user && user.password === credentials.password) {
        console.log('✅ Password comparison successful');
        const result = {
          id: user.id,
          name: user.name || "Test User",
          email: user.email,
        };
        console.log('✅ NextAuth authorize would return:', result);
        return result;
      } else {
        console.log('❌ Password comparison failed');
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
      console.error('❌ Error during authorization:', error);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

testAuthConfig(); 