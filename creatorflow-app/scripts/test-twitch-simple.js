import dotenv from 'dotenv';

dotenv.config();

async function testTwitchSimple() {
  console.log('🔍 Testing Twitch Integration...\n');

  // Check if credentials are set
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const accessToken = process.env.TWITCH_ACCESS_TOKEN;
  const refreshToken = process.env.TWITCH_REFRESH_TOKEN;
  const defaultChannel = process.env.TWITCH_DEFAULT_CHANNEL;

  if (!clientId || clientId === 'your_twitch_client_id') {
    console.log('❌ Twitch Client ID not configured');
    console.log('Please add your Twitch Client ID to .env file');
    return;
  }

  if (!clientSecret || clientSecret === 'your_twitch_client_secret') {
    console.log('❌ Twitch Client Secret not configured');
    console.log('Please add your Twitch Client Secret to .env file');
    return;
  }

  if (!accessToken || accessToken === 'your_twitch_access_token') {
    console.log('❌ Twitch Access Token not configured');
    console.log('Please add your Twitch Access Token to .env file');
    return;
  }

  if (!refreshToken || refreshToken === 'your_twitch_refresh_token') {
    console.log('❌ Twitch Refresh Token not configured');
    console.log('Please add your Twitch Refresh Token to .env file');
    return;
  }

  console.log('✅ Twitch credentials found');
  console.log(`Client ID: ${clientId}`);
  console.log(`Access Token: ${accessToken.substring(0, 10)}...`);
  console.log(`Default Channel: ${defaultChannel || 'Not set'}`);

  // Test API call to validate credentials
  try {
    console.log('\n🔐 Testing Twitch API connection...');
    
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': clientId,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Twitch API connection successful');
      console.log(`User: ${data.data[0]?.display_name || 'Unknown'}`);
      console.log(`User ID: ${data.data[0]?.id || 'Unknown'}`);
    } else {
      console.log('❌ Twitch API connection failed');
      console.log(`Status: ${response.status}`);
      const errorData = await response.text();
      console.log(`Error: ${errorData}`);
    }

  } catch (error) {
    console.log('❌ Error testing Twitch integration:');
    console.log(error.message);
  }

  console.log('\n💡 Twitch integration setup complete!');
  console.log('Note: Twitch chat posting requires a chat bot implementation.');
  console.log('The API can be used for:');
  console.log('- Getting channel information');
  console.log('- Creating clips');
  console.log('- Updating stream titles');
  console.log('- Managing channel settings');
}

// Run the test
testTwitchSimple().catch(console.error); 