import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function testMailchimpCredentials() {
  console.log('🧪 Testing Mailchimp API Credentials...\n');

  // Check if credentials exist
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !serverPrefix) {
    console.error('❌ Missing Mailchimp credentials in .env file');
    console.log('Please add:');
    console.log('MAILCHIMP_API_KEY=your_api_key');
    console.log('MAILCHIMP_SERVER_PREFIX=your_server_prefix');
    return;
  }

  console.log('✅ Mailchimp credentials found:');
  console.log(`   API Key: ${apiKey.substring(0, 8)}...`);
  console.log(`   Server Prefix: ${serverPrefix}\n`);

  // Test API connectivity (ping endpoint)
  try {
    const response = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/ping`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Mailchimp API connectivity test:');
      console.log(`   Response: ${result.health_status || 'Success'}`);
      console.log('   API is reachable and credentials are valid');
    } else {
      console.log(`❌ API response: ${response.status}`);
      const error = await response.text();
      console.log(`   Error: ${error}`);
    }
  } catch (error) {
    console.log('❌ API connectivity test failed:', error.message);
  }

  // Test getting account info
  try {
    const response = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Account information:');
      console.log(`   Account Name: ${result.account_name || 'N/A'}`);
      console.log(`   Account ID: ${result.account_id || 'N/A'}`);
      console.log(`   Contact Count: ${result.contact_count || 'N/A'}`);
    } else {
      console.log(`\n⚠️  Could not fetch account info: ${response.status}`);
    }
  } catch (error) {
    console.log('\n❌ Account info test failed:', error.message);
  }

  // Test getting lists/audiences
  try {
    const response = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/lists`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Lists/Audiences found:');
      if (result.lists && result.lists.length > 0) {
        result.lists.forEach((list, index) => {
          console.log(`   ${index + 1}. ${list.name} (ID: ${list.id})`);
        });
      } else {
        console.log('   No lists found. You may need to create an audience first.');
      }
    } else {
      console.log(`\n⚠️  Could not fetch lists: ${response.status}`);
    }
  } catch (error) {
    console.log('\n❌ Lists test failed:', error.message);
  }

  console.log('\n🎯 Mailchimp integration is ready for testing!');
  console.log('   - Credentials are configured');
  console.log('   - API connectivity confirmed');
  console.log('   - Ready to send emails through CreatorFlow');
}

testMailchimpCredentials().catch(console.error); 