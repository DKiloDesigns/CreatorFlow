import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testCompleteFlow() {
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
    console.log('✅ User created successfully:', signupData.user.email);

    // Step 3: Test signin with correct credentials
    console.log('\n3. Testing signin with correct credentials...');
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
    console.log('Signin response headers:', Object.fromEntries(signinResponse.headers.entries()));
    
    // Get cookies from response
    const setCookieHeader = signinResponse.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);
    
    if (signinResponse.ok) {
      const signinData = await signinResponse.json();
      console.log('✅ Signin successful:', signinData);
      
      // Step 4: Check session after signin (with cookies)
      console.log('\n4. Checking session after signin...');
      const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
        headers: {
          'Cookie': setCookieHeader || ''
        }
      });
      console.log('Session response status:', sessionResponse.status);
      
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        console.log('✅ Session data:', sessionData);
        
        if (sessionData.user) {
          console.log('✅ User is authenticated:', sessionData.user.email);
        } else {
          console.log('❌ User is not authenticated in session');
        }
      } else {
        console.log('❌ Session check failed');
      }
      
      // Step 5: Check user API endpoint (with cookies)
      console.log('\n5. Checking user API endpoint...');
      const userResponse = await fetch(`${BASE_URL}/api/user`, {
        headers: {
          'Cookie': setCookieHeader || ''
        }
      });
      console.log('User API response status:', userResponse.status);
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('✅ User API data:', userData);
      } else {
        console.log('❌ User API failed');
      }
      
    } else {
      const errorData = await signinResponse.text();
      console.log('❌ Signin failed:', errorData.substring(0, 200) + '...');
    }

    console.log('✅ Complete flow test finished!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteFlow(); 