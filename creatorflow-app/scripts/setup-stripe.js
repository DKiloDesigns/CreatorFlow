#!/usr/bin/env node

/**
 * Setup Stripe Products and Prices
 * 
 * This script creates the necessary products and prices in Stripe
 * for CreatorFlow's subscription tiers.
 * 
 * Run with: node scripts/setup-stripe.js
 */

const { createStripeProducts } = require('../src/lib/stripe');

async function main() {
  try {
    console.log('🚀 Setting up Stripe products and prices...');
    
    const result = await createStripeProducts();
    
    console.log('\n✅ Stripe setup complete!');
    console.log('\n📋 Update your environment variables with these price IDs:');
    console.log(`PRO_MONTHLY=${result.proMonthlyPrice}`);
    console.log(`PRO_YEARLY=${result.proYearlyPrice}`);
    console.log(`ENTERPRISE_MONTHLY=${result.enterpriseMonthlyPrice}`);
    console.log(`ENTERPRISE_YEARLY=${result.enterpriseYearlyPrice}`);
    
    console.log('\n🔧 Next steps:');
    console.log('1. Update your .env.local file with the price IDs above');
    console.log('2. Update src/lib/pricing.ts with the actual price IDs');
    console.log('3. Set up webhook endpoint in Stripe Dashboard');
    console.log('4. Test the subscription flow');
    
  } catch (error) {
    console.error('❌ Error setting up Stripe:', error.message);
    process.exit(1);
  }
}

main();
