import { NextRequest, NextResponse } from 'next/server';
import { integrationManager } from '@/lib/integration-manager';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyStripeSignature(body, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.type;

    // Process webhook event
    const webhookEvent = await integrationManager.processWebhook(
      'stripe',
      eventType,
      event
    );

    // Handle specific event types
    switch (eventType) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;
      
      default:
        console.log(`Unhandled Stripe event type: ${eventType}`);
    }

    return NextResponse.json({
      success: true,
      webhookEvent: {
        id: webhookEvent.id,
        status: webhookEvent.status,
      },
    });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentSucceeded(event: any) {
  try {
    const paymentIntent = event.data.object;
    
    // Update user subscription status
    await prisma.user.updateMany({
      where: {
        stripeCustomerId: paymentIntent.customer,
      },
      data: {
        subscriptionStatus: 'active',
        subscriptionTier: getSubscriptionTier(paymentIntent.amount),
        lastPaymentAt: new Date(),
      },
    });

    // Log payment event
    await prisma.analyticsEvent.create({
      data: {
        userId: await getUserIdByStripeCustomer(paymentIntent.customer),
        eventType: 'PAYMENT_SUCCEEDED',
        eventData: JSON.stringify({
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentIntentId: paymentIntent.id,
        }),
        timestamp: new Date(),
      },
    });

    console.log(`Payment succeeded: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(event: any) {
  try {
    const paymentIntent = event.data.object;
    
    // Update user subscription status
    await prisma.user.updateMany({
      where: {
        stripeCustomerId: paymentIntent.customer,
      },
      data: {
        subscriptionStatus: 'past_due',
        lastPaymentFailedAt: new Date(),
      },
    });

    // Log payment failure
    await prisma.analyticsEvent.create({
      data: {
        userId: await getUserIdByStripeCustomer(paymentIntent.customer),
        eventType: 'PAYMENT_FAILED',
        eventData: JSON.stringify({
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentIntentId: paymentIntent.id,
          failureReason: paymentIntent.last_payment_error?.message,
        }),
        timestamp: new Date(),
      },
    });

    console.log(`Payment failed: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

async function handleSubscriptionCreated(event: any) {
  try {
    const subscription = event.data.object;
    
    // Update user subscription details
    await prisma.user.updateMany({
      where: {
        stripeCustomerId: subscription.customer,
      },
      data: {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionTier: getSubscriptionTier(subscription.items.data[0].price.unit_amount),
        subscriptionStartDate: new Date(subscription.current_period_start * 1000),
        subscriptionEndDate: new Date(subscription.current_period_end * 1000),
      },
    });

    console.log(`Subscription created: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(event: any) {
  try {
    const subscription = event.data.object;
    
    // Update user subscription details
    await prisma.user.updateMany({
      where: {
        stripeCustomerId: subscription.customer,
      },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionTier: getSubscriptionTier(subscription.items.data[0].price.unit_amount),
        subscriptionEndDate: new Date(subscription.current_period_end * 1000),
      },
    });

    console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(event: any) {
  try {
    const subscription = event.data.object;
    
    // Update user subscription status
    await prisma.user.updateMany({
      where: {
        stripeCustomerId: subscription.customer,
      },
      data: {
        subscriptionStatus: 'canceled',
        subscriptionEndDate: new Date(subscription.canceled_at * 1000),
      },
    });

    console.log(`Subscription deleted: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(event: any) {
  try {
    const invoice = event.data.object;
    
    // Log successful invoice payment
    await prisma.analyticsEvent.create({
      data: {
        userId: await getUserIdByStripeCustomer(invoice.customer),
        eventType: 'INVOICE_PAYMENT_SUCCEEDED',
        eventData: JSON.stringify({
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
        }),
        timestamp: new Date(),
      },
    });

    console.log(`Invoice payment succeeded: ${invoice.id}`);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(event: any) {
  try {
    const invoice = event.data.object;
    
    // Log failed invoice payment
    await prisma.analyticsEvent.create({
      data: {
        userId: await getUserIdByStripeCustomer(invoice.customer),
        eventType: 'INVOICE_PAYMENT_FAILED',
        eventData: JSON.stringify({
          invoiceId: invoice.id,
          amount: invoice.amount_due,
          currency: invoice.currency,
        }),
        timestamp: new Date(),
      },
    });

    console.log(`Invoice payment failed: ${invoice.id}`);
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

function verifyStripeSignature(payload: string, signature: string): boolean {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error verifying Stripe signature:', error);
    return false;
  }
}

function getSubscriptionTier(amount: number): string {
  // Convert amount from cents to dollars
  const amountInDollars = amount / 100;
  
  if (amountInDollars >= 29) return 'premium';
  if (amountInDollars >= 19) return 'pro';
  if (amountInDollars >= 9) return 'basic';
  return 'free';
}

async function getUserIdByStripeCustomer(stripeCustomerId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId },
      select: { id: true },
    });
    return user?.id || null;
  } catch (error) {
    console.error('Error getting user ID by Stripe customer:', error);
    return null;
  }
} 