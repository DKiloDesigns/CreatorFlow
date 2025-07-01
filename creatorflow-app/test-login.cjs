const axios = require('axios').default;
const tough = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

async function testLogin() {
  try {
    console.log('Testing login flow with cookie management...');
    // Step 1: Get CSRF token
    const csrfRes = await client.get('http://localhost:3001/api/auth/csrf');
    const csrfToken = csrfRes.data.csrfToken;
    console.log('CSRF token:', csrfToken);

    // Step 2: Login
    const loginRes = await client.post('http://localhost:3001/api/auth/callback/credentials',
      new URLSearchParams({
        email: 'test@example.com',
        password: 'testpassword',
        csrfToken,
        callbackUrl: 'http://localhost:3001/dashboard',
        json: 'true'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('Login response:', loginRes.status, loginRes.data);

    // Step 3: Check session
    const sessionRes = await client.get('http://localhost:3001/api/auth/session');
    console.log('Session data:', sessionRes.data);

    // Step 4: Fetch billing page
    const billingRes = await client.get('http://localhost:3001/dashboard/billing');
    console.log('Billing page HTML (truncated):', billingRes.data.slice(0, 500));
  } catch (err) {
    console.error('Test failed:', err.response ? err.response.data : err);
  }
}

testLogin(); 