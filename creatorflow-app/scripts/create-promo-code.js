import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createPromoCode() {
  try {
    console.log('Creating promo code for first 100 users campaign...');

    const promoCode = await prisma.promoCode.create({
      data: {
        code: 'EARLYBIRD100',
        name: 'Early Bird Campaign',
        description: 'First 100 users get 2 weeks of Pro access',
        type: 'TRIAL',
        value: 14, // 14 days trial
        maxUses: 100,
        usedCount: 0,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    console.log('✅ Promo code created successfully!');
    console.log('Code:', promoCode.code);
    console.log('Max Uses:', promoCode.maxUses);
    console.log('Trial Days:', promoCode.value);
    console.log('Valid Until:', promoCode.validUntil);
    console.log('');
    console.log('Users can now use this code to get 2 weeks of Pro access!');

  } catch (error) {
    console.error('❌ Error creating promo code:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPromoCode(); 