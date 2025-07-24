import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testProductHuntIntegration() {
  console.log('🧪 Testing Product Hunt Integration...\n');

  const clientId = process.env.PRODUCTHUNT_CLIENT_ID;
  const clientSecret = process.env.PRODUCTHUNT_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.log('❌ Product Hunt credentials not found in .env file');
    console.log('\n📝 To set up Product Hunt:');
    console.log('1. Go to https://api.producthunt.com/v2/oauth/applications');
    console.log('2. Create a new application');
    console.log('3. Add credentials to .env file:');
    console.log('   PRODUCTHUNT_CLIENT_ID=your_client_id');
    console.log('   PRODUCTHUNT_CLIENT_SECRET=your_client_secret');
    return;
  }

  console.log('✅ Product Hunt credentials found:');
  console.log(`   Client ID: ${clientId.substring(0, 8)}...`);
  console.log(`   Client Secret: ${clientSecret.substring(0, 8)}...`);

  // Generate OAuth URL
  const redirectUri = 'http://localhost:3001/api/accounts/callback/producthunt';
  const scope = 'public';
  const state = 'test_state';
  
  const oauthUrl = `https://api.producthunt.com/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

  console.log('\n🔗 OAuth URL generated:');
  console.log(oauthUrl);

  console.log('\n📋 Next steps:');
  console.log('1. Visit the OAuth URL above');
  console.log('2. Authorize the application');
  console.log('3. You\'ll be redirected with an authorization code');
  console.log('4. The code can be exchanged for an access token');

  console.log('\n🎯 Product Hunt integration is ready for testing!');
  console.log('   - Credentials are configured');
  console.log('   - OAuth flow is set up');
  console.log('   - Ready to connect accounts in CreatorFlow');
}

testProductHuntIntegration(); 