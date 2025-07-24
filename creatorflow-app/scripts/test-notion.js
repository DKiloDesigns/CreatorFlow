import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testNotionIntegration() {
  console.log('🧪 Testing Notion Integration...\n');

  const token = process.env.NOTION_INTEGRATION_TOKEN;
  
  if (!token) {
    console.error('❌ NOTION_INTEGRATION_TOKEN not found in .env file');
    return;
  }

  console.log('✅ Token found in .env file');
  console.log(`Token starts with: ${token.substring(0, 10)}...`);

  try {
    // Test 1: Search for databases
    console.log('\n📋 Testing database search...');
    const searchResponse = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'object',
          value: 'database',
        },
      }),
    });

    if (!searchResponse.ok) {
      const error = await searchResponse.text();
      throw new Error(`Search API error: ${searchResponse.status} - ${error}`);
    }

    const searchData = await searchResponse.json();
    console.log(`✅ Found ${searchData.results.length} databases`);
    
    if (searchData.results.length > 0) {
      console.log('Available databases:');
      searchData.results.forEach((db, index) => {
        const title = db.title?.[0]?.plain_text || 'Untitled';
        console.log(`  ${index + 1}. ${title} (${db.id})`);
      });
    }

    // Test 2: Get user info
    console.log('\n👤 Testing user info...');
    const userResponse = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!userResponse.ok) {
      const error = await userResponse.text();
      throw new Error(`User API error: ${userResponse.status} - ${error}`);
    }

    const userData = await userResponse.json();
    console.log(`✅ Connected as: ${userData.name || userData.person?.email || 'Unknown'}`);

    console.log('\n🎉 Notion integration test successful!');
    console.log('✅ Token is valid');
    console.log('✅ Can access databases');
    console.log('✅ Can read user info');

  } catch (error) {
    console.error('❌ Notion integration test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('\n💡 Possible issues:');
      console.log('   - Token might be invalid');
      console.log('   - Integration might not be properly set up');
      console.log('   - Check your Notion integration settings');
    }
  }
}

testNotionIntegration(); 