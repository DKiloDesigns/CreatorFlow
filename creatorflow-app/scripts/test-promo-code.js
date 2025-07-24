import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPromoCode() {
  try {
    console.log('🧪 Testing promo code system...\n');

    // Test 1: Check if promo code exists
    console.log('1. Checking promo code in database...');
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: 'EARLYBIRD100' },
    });

    if (promoCode) {
      console.log('✅ Promo code found!');
      console.log(`   Code: ${promoCode.code}`);
      console.log(`   Name: ${promoCode.name}`);
      console.log(`   Type: ${promoCode.type}`);
      console.log(`   Value: ${promoCode.value} days`);
      console.log(`   Max Uses: ${promoCode.maxUses}`);
      console.log(`   Used Count: ${promoCode.usedCount}`);
      console.log(`   Is Active: ${promoCode.isActive}`);
      console.log(`   Valid From: ${promoCode.validFrom}`);
      console.log(`   Valid Until: ${promoCode.validUntil}`);
    } else {
      console.log('❌ Promo code not found!');
      return;
    }

    // Test 2: Check API endpoint
    console.log('\n2. Testing API endpoint...');
    try {
      const response = await fetch('http://localhost:3001/api/promo-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode: 'EARLYBIRD100' }),
      });

      if (response.status === 401) {
        console.log('✅ API endpoint exists (requires authentication)');
      } else {
        console.log(`⚠️  API response: ${response.status}`);
      }
    } catch (error) {
      console.log('❌ API endpoint test failed:', error.message);
    }

    // Test 3: Check database schema
    console.log('\n3. Checking database schema...');
    const userCount = await prisma.user.count();
    console.log(`   Total users: ${userCount}`);

    const trialUsers = await prisma.user.count({
      where: { isTrialUser: true },
    });
    console.log(`   Trial users: ${trialUsers}`);

    const usersWithPromoCodes = await prisma.user.count({
      where: { promoCodeUsed: { not: null } },
    });
    console.log(`   Users with promo codes: ${usersWithPromoCodes}`);

    console.log('\n🎉 Promo code system test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit http://localhost:3001/dashboard/billing');
    console.log('2. Look for the "Have a Promo Code?" section');
    console.log('3. Enter "EARLYBIRD100" to test the trial activation');
    console.log('4. Check that the trial status updates correctly');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPromoCode(); 