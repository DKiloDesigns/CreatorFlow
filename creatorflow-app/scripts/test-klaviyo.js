import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testKlaviyoIntegration() {
  console.log('🧪 Testing Klaviyo Integration...\n');

  const apiKey = process.env.KLAVYO_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Klaviyo API key not found in .env file');
    console.log('\n📝 To set up Klaviyo:');
    console.log('1. Go to https://www.klaviyo.com/account#api-keys-tab');
    console.log('2. Create a new API key');
    console.log('3. Add to .env file:');
    console.log('   KLAVYO_API_KEY=your_api_key');
    return;
  }

  console.log('✅ Klaviyo API key found:');
  console.log(`   API Key: ${apiKey.substring(0, 8)}...`);

  try {
    // Test API connectivity
    console.log('\n📋 Testing API connectivity...');
    const response = await fetch('https://a.klaviyo.com/api/v2/lists', {
      headers: {
        'Authorization': `Klaviyo-API-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Klaviyo API connectivity confirmed');
      console.log(`   Found ${data.length} lists`);
      
      if (data.length > 0) {
        console.log('Available lists:');
        data.forEach((list, index) => {
          console.log(`   ${index + 1}. ${list.name} (ID: ${list.id})`);
        });
      }
    } else {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    console.log('\n🎯 Klaviyo integration is ready for testing!');
    console.log('   - API key is valid');
    console.log('   - Can access lists');
    console.log('   - Ready to send emails through CreatorFlow');

  } catch (error) {
    console.error('❌ Klaviyo integration test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n💡 Possible issues:');
      console.log('   - API key might be invalid');
      console.log('   - Check your Klaviyo account settings');
    }
  }
}

testKlaviyoIntegration(); 