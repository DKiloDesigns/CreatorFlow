import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testNotionPosting() {
  console.log('🧪 Testing Notion Posting...\n');

  const token = process.env.NOTION_INTEGRATION_TOKEN;
  
  if (!token) {
    console.error('❌ NOTION_INTEGRATION_TOKEN not found in .env file');
    return;
  }

  console.log('✅ Token found in .env file');

  try {
    // First, let's search for available databases
    console.log('\n📋 Searching for available databases...');
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
    console.log(`Found ${searchData.results.length} databases`);

    if (searchData.results.length === 0) {
      console.log('\n❌ No databases found!');
      console.log('\n📝 To test Notion posting, you need to:');
      console.log('1. Go to any Notion database in your workspace');
      console.log('2. Click "..." (three dots) in the top right');
      console.log('3. Select "Add connections"');
      console.log('4. Find "CreatorFlow" and add it');
      console.log('5. Run this test again');
      return;
    }

    // Use the first available database
    const database = searchData.results[0];
    console.log(`\n🎯 Using database: ${database.title?.[0]?.plain_text || 'Untitled'} (${database.id})`);

    // Create a test page
    console.log('\n📝 Creating test page...');
    const pageData = {
      parent: { database_id: database.id },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: 'CreatorFlow Test Post',
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'This is a test post from CreatorFlow! 🚀\n\nPosted at: ' + new Date().toISOString(),
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'If you can see this, your Notion integration is working perfectly! ✅',
                },
              },
            ],
          },
        },
      ],
    };

    const createResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Create page error: ${createResponse.status} - ${error}`);
    }

    const createdPage = await createResponse.json();
    console.log('✅ Test page created successfully!');
    console.log(`📄 Page URL: ${createdPage.url}`);
    console.log(`🆔 Page ID: ${createdPage.id}`);

    console.log('\n🎉 Notion posting test successful!');
    console.log('✅ Integration can create pages');
    console.log('✅ Integration can add content');
    console.log('✅ Ready for CreatorFlow posts');

  } catch (error) {
    console.error('❌ Notion posting test failed:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 This usually means:');
      console.log('   - Database is not shared with your integration');
      console.log('   - Integration lacks proper permissions');
      console.log('\n📝 To fix this:');
      console.log('1. Go to your Notion database');
      console.log('2. Click "..." (three dots) in the top right');
      console.log('3. Select "Add connections"');
      console.log('4. Find "CreatorFlow" and add it');
      console.log('5. Run this test again');
    }
  }
}

testNotionPosting(); 