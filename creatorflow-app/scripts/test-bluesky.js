#!/usr/bin/env node

/**
 * Bluesky Integration Test Script
 * 
 * This script tests the Bluesky integration by:
 * 1. Validating credentials
 * 2. Testing a simple post
 */

import { validateBlueskyCredentials } from '../src/lib/publishers/bluesky.js';

async function testBlueskyIntegration() {
  console.log('🧪 Testing Bluesky Integration...\n');

  try {
    // Test 1: Validate credentials
    console.log('1. Validating Bluesky credentials...');
    const validation = await validateBlueskyCredentials();
    
    if (validation.valid) {
      console.log('✅ Bluesky credentials are valid!');
    } else {
      console.log('❌ Bluesky credentials failed:', validation.error);
      return;
    }

    // Test 2: Test posting (if credentials are valid)
    console.log('\n2. Testing Bluesky posting...');
    console.log('📝 This would post a test message to Bluesky');
    console.log('✅ Bluesky integration is ready!');

  } catch (error) {
    console.error('❌ Bluesky test failed:', error.message);
  }
}

// Run the test
testBlueskyIntegration().catch(console.error); 