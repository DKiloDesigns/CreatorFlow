import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!customerId || !subscriptionId) return;

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0].price.id;

  // Determine plan based on price ID
  let plan = 'FREE';
  if (priceId === 'price_1RVNbpFRpVaglkHnlxpaqpsh' || priceId === 'price_1RVO1UFRpVaglkHnchzxF4jM') {
    plan = 'PRO';
  } else if (priceId === 'price_1RVP48FRpVaglkHnAv9qKnGI') {
    plan = 'ENTERPRISE';
  }

  // Update user subscription
  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      plan,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`User subscription updated: ${customerId} -> ${plan}`);
}

async function handleSubscriptionCreated(subscription: any) {
  const customerId = subscription.customer;
  const priceId = subscription.items.data[0].price.id;

  // Determine plan based on price ID
  let plan = 'FREE';
  if (priceId === 'price_1RVNbpFRpVaglkHnlxpaqpsh' || priceId === 'price_1RVO1UFRpVaglkHnchzxF4jM') {
    plan = 'PRO';
  } else if (priceId === 'price_1RVP48FRpVaglkHnAv9qKnGI') {
    plan = 'ENTERPRISE';
  }

  // Update user subscription
  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      plan,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`Subscription created: ${customerId} -> ${plan}`);
}

async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer;
  const priceId = subscription.items.data[0].price.id;

  // Determine plan based on price ID
  let plan = 'FREE';
  if (priceId === 'price_1RVNbpFRpVaglkHnlxpaqpsh' || priceId === 'price_1RVO1UFRpVaglkHnchzxF4jM') {
    plan = 'PRO';
  } else if (priceId === 'price_1RVP48FRpVaglkHnAv9qKnGI') {
    plan = 'ENTERPRISE';
  }

  // Update user subscription
  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      plan,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`Subscription updated: ${customerId} -> ${plan}`);
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer;

  // Downgrade user to free plan
  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      plan: 'FREE',
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
    },
  });

  console.log(`Subscription deleted: ${customerId} -> FREE`);
}

async function handlePaymentSucceeded(invoice: any) {
  const customerId = invoice.customer;
  const subscriptionId = invoice.subscription;

  if (!subscriptionId) return;

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0].price.id;

  // Determine plan based on price ID
  let plan = 'FREE';
  if (priceId === 'price_1RVNbpFRpVaglkHnlxpaqpsh' || priceId === 'price_1RVO1UFRpVaglkHnchzxF4jM') {
    plan = 'PRO';
  } else if (priceId === 'price_1RVP48FRpVaglkHnAv9qKnGI') {
    plan = 'ENTERPRISE';
  }

  // Update user subscription
  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      plan,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      paymentRetryCount: 0,
      paymentRetryDate: null,
    },
  });

  console.log(`Payment succeeded: ${customerId} -> ${plan}`);
}

async function handlePaymentFailed(invoice: any) {
  const customerId = invoice.customer;

  // Increment payment retry count
  await prisma.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      paymentRetryCount: { increment: 1 },
      paymentRetryDate: new Date(),
    },
  });

  console.log(`Payment failed: ${customerId}`);
}
