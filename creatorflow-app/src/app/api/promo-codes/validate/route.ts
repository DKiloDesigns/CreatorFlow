import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { promoCode } = await request.json();

    if (!promoCode) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    // Find the promo code
    const promoCodeRecord = await prisma.promoCode.findUnique({
      where: { code: promoCode.toUpperCase() },
    });

    if (!promoCodeRecord) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
    }

    // Check if promo code is active
    if (!promoCodeRecord.isActive) {
      return NextResponse.json({ error: 'Promo code is inactive' }, { status: 400 });
    }

    // Check if promo code is within valid date range
    const now = new Date();
    if (now < promoCodeRecord.validFrom || (promoCodeRecord.validUntil && now > promoCodeRecord.validUntil)) {
      return NextResponse.json({ error: 'Promo code is not valid at this time' }, { status: 400 });
    }

    // Check if promo code has reached max uses
    if (promoCodeRecord.maxUses && promoCodeRecord.usedCount >= promoCodeRecord.maxUses) {
      return NextResponse.json({ error: 'Promo code has reached maximum uses' }, { status: 400 });
    }

    // Check if user has already used a promo code
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.promoCodeUsed) {
      return NextResponse.json({ error: 'You have already used a promo code' }, { status: 400 });
    }

    if (user?.isTrialUser) {
      return NextResponse.json({ error: 'You are already on a trial' }, { status: 400 });
    }

    // Create Stripe trial subscription
    let stripeCustomerId = user?.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name!,
        metadata: {
          userId: session.user.id,
        },
      });
      stripeCustomerId = customer.id;
    }

    // Create trial subscription
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + promoCodeRecord.value);

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: process.env.STRIPE_PRICE_TRIAL! }],
      trial_period_days: promoCodeRecord.value,
      metadata: {
        userId: session.user.id,
        promoCode: promoCodeRecord.code,
        trialType: 'PROMO_CODE',
      },
    });

    // Update user with trial information
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isTrialUser: true,
        trialStartDate: new Date(),
        trialEndDate: trialEndDate,
        promoCodeUsed: promoCodeRecord.code,
        promoCodeUsedAt: new Date(),
        plan: 'PRO',
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    });

    // Update promo code usage count
    await prisma.promoCode.update({
      where: { id: promoCodeRecord.id },
      data: {
        usedCount: promoCodeRecord.usedCount + 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Trial activated for ${promoCodeRecord.value} days!`,
      trialEndDate: trialEndDate,
      promoCode: promoCodeRecord.code,
    });

  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
} 