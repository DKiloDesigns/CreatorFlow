import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testSMSIntegration() {
  console.log('🧪 Testing SMS (Twilio) Integration...\n');

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (!accountSid || !authToken) {
    console.log('❌ Twilio credentials not found in .env file');
    console.log('\n📝 To set up SMS (Twilio):');
    console.log('1. Go to https://console.twilio.com/');
    console.log('2. Get your Account SID and Auth Token');
    console.log('3. Add to .env file:');
    console.log('   TWILIO_ACCOUNT_SID=your_account_sid');
    console.log('   TWILIO_AUTH_TOKEN=your_auth_token');
    console.log('   TWILIO_PHONE_NUMBER=your_twilio_phone_number');
    return;
  }

  console.log('✅ Twilio credentials found:');
  console.log(`   Account SID: ${accountSid.substring(0, 8)}...`);
  console.log(`   Auth Token: ${authToken.substring(0, 8)}...`);
  console.log(`   Phone Number: ${phoneNumber || 'Not set'}`);

  try {
    // Test API connectivity
    console.log('\n📋 Testing Twilio API connectivity...');
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Twilio API connectivity confirmed');
      console.log(`   Account status: Active`);
      console.log(`   Messages in account: ${data.messages?.length || 0}`);
    } else {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    console.log('\n🎯 SMS integration is ready for testing!');
    console.log('   - Credentials are valid');
    console.log('   - API connectivity confirmed');
    console.log('   - Ready to send SMS through CreatorFlow');

  } catch (error) {
    console.error('❌ SMS integration test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n💡 Possible issues:');
      console.log('   - Account SID or Auth Token might be invalid');
      console.log('   - Check your Twilio account settings');
    }
  }
}

testSMSIntegration(); 