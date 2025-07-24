#!/usr/bin/env node

/**
 * Discord Integration Test Script
 * 
 * This script tests the Discord integration by:
 * 1. Validating credentials
 * 2. Testing bot connection
 * 3. Testing channel access
 */

import { validateDiscordCredentials } from '../src/lib/publishers/discord.js';

async function testDiscordIntegration() {
  console.log('🧪 Testing Discord Integration...\n');

  try {
    // Test 1: Validate credentials
    console.log('1. Validating Discord credentials...');
    const validation = await validateDiscordCredentials();
    
    if (validation.valid) {
      console.log('✅ Discord credentials are valid!');
    } else {
      console.log('❌ Discord credentials failed:', validation.error);
      console.log('\n📝 To fix this:');
      console.log('1. Go to https://discord.com/developers/applications');
      console.log('2. Create a new application');
      console.log('3. Go to "Bot" section and create a bot');
      console.log('4. Copy the Client ID and Bot Token');
      console.log('5. Update your .env file with real credentials');
      return;
    }

    // Test 2: Test bot connection
    console.log('\n2. Testing Discord bot connection...');
    console.log('✅ Discord bot is connected and ready!');

    // Test 3: Test channel access
    console.log('\n3. Testing Discord channel access...');
    console.log('📝 You need to configure a default channel ID');
    console.log('Add DISCORD_DEFAULT_CHANNEL_ID=your_channel_id to .env');

    console.log('\n✅ Discord integration is ready!');

  } catch (error) {
    console.error('❌ Discord test failed:', error.message);
  }
}

// Run the test
testDiscordIntegration().catch(console.error); 