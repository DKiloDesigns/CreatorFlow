import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testAuthFlow() {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const testName = 'Test User';

  console.log('🧪 Testing complete auth flow...');
  console.log(`Email: ${testEmail}`);

  try {
    // Step 1: Get CSRF token
    console.log('\n1. Getting CSRF token...');
    const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
    if (!csrfResponse.ok) {
      throw new Error(`CSRF request failed: ${csrfResponse.status}`);
    }
    const csrfData = await csrfResponse.json();
    console.log('✅ CSRF token obtained');

    // Step 2: Check if email exists (should be false for new email)
    console.log('\n2. Checking if email exists...');
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

    // Step 3: Create user account
    console.log('\n3. Creating user account...');
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
    console.log('✅ User created successfully:', signupData.user.email);

    // Step 4: Verify email now exists
    console.log('\n4. Verifying email now exists...');
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

    // Step 5: Test signin with correct credentials
    console.log('\n5. Testing signin with correct credentials...');
    const signinResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `next-auth.csrf-token=${csrfData.csrfToken}`
      },
      body: new URLSearchParams({
        email: testEmail,
        password: testPassword,
        csrfToken: csrfData.csrfToken,
        json: 'true'
      }),
    });

    console.log('Signin response status:', signinResponse.status);
    
    if (signinResponse.ok) {
      const signinData = await signinResponse.json();
      console.log('✅ Signin successful:', signinData);
    } else {
      const errorData = await signinResponse.text();
      console.log('❌ Signin failed:', errorData.substring(0, 200) + '...');
    }

    console.log('✅ Auth flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthFlow(); 