import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testSigninFlow() {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const testName = 'Test User';

  console.log('🧪 Testing signin flow...');
  console.log(`Email: ${testEmail}`);

  try {
    // Step 1: Create a test user
    console.log('\n1. Creating test user...');
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName
      }),
    });

    if (!signupResponse.ok) {
      const errorData = await signupResponse.json();
      throw new Error(`Signup failed: ${errorData.error || signupResponse.status}`);
    }

    const signupData = await signupResponse.json();
    console.log('✅ User created:', signupData.user.email);

    // Step 2: Test signin with correct credentials
    console.log('\n2. Testing signin with correct credentials...');
    const signinResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        csrfToken: 'test', // This will be handled by NextAuth
        json: true
      }),
    });

    console.log('Signin response status:', signinResponse.status);
    
    if (signinResponse.ok) {
      const signinData = await signinResponse.json();
      console.log('✅ Signin successful:', signinData);
    } else {
      const errorData = await signinResponse.text();
      console.log('❌ Signin failed:', errorData);
    }

    // Step 3: Test signin with wrong password
    console.log('\n3. Testing signin with wrong password...');
    const wrongPasswordResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongpassword',
        csrfToken: 'test',
        json: true
      }),
    });

    console.log('Wrong password response status:', wrongPasswordResponse.status);
    
    if (wrongPasswordResponse.status === 401) {
      console.log('✅ Correctly rejected wrong password');
    } else {
      console.log('❌ Should have rejected wrong password');
    }

    console.log('✅ Signin flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSigninFlow(); 