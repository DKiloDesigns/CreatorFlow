import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testSignupFlow() {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const testName = 'Test User';

  console.log('🧪 Testing signup flow...');
  console.log(`Email: ${testEmail}`);

  try {
    // Step 1: Check if email exists (should return false for new email)
    console.log('\n1. Checking if email exists...');
    const checkResponse = await fetch(`${BASE_URL}/api/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });

    if (!checkResponse.ok) {
      throw new Error(`Email check failed: ${checkResponse.status}`);
    }

    const checkData = await checkResponse.json();
    console.log('Email check result:', checkData);

    if (checkData.exists) {
      console.log('❌ Email already exists, this should not happen for a new email');
      return;
    }

    // Step 2: Create user account
    console.log('\n2. Creating user account...');
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
    console.log('✅ User created successfully:', signupData);

    // Step 3: Verify email now exists
    console.log('\n3. Verifying email now exists...');
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });

    if (!verifyResponse.ok) {
      throw new Error(`Email verification failed: ${verifyResponse.status}`);
    }

    const verifyData = await verifyResponse.json();
    console.log('Email verification result:', verifyData);

    if (!verifyData.exists) {
      console.log('❌ Email should exist after signup');
      return;
    }

    console.log('✅ Signup flow test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSignupFlow(); 