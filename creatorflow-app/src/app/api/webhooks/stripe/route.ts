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
        // TODO: Add subscriptionStatus field to User model
        // subscriptionStatus: 'active',
        // TODO: Add subscriptionTier field to User model
        // subscriptionTier: getSubscriptionTier(paymentIntent.amount),
        // TODO: Add lastPaymentAt field to User model
        // lastPaymentAt: new Date(),
      },
    });

    // Log payment event
    const userId = await getUserIdByStripeCustomer(paymentIntent.customer);
    if (userId) {
      await prisma.analyticsAggregation.create({
        data: {
          userId,
          type: 'PAYMENT_SUCCEEDED',
          platform: 'stripe',
          startDate: new Date(),
          endDate: new Date(),
          data: {
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentIntentId: paymentIntent.id,
          },
        },
      });
    }

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
        // TODO: Add subscriptionStatus field to User model
        // subscriptionStatus: 'past_due',
        // TODO: Add lastPaymentFailedAt field to User model
        // lastPaymentFailedAt: new Date(),
      },
    });

    // Log payment failure
    const userId = await getUserIdByStripeCustomer(paymentIntent.customer);
    if (userId) {
      await prisma.analyticsAggregation.create({
        data: {
          userId,
          type: 'PAYMENT_FAILED',
          platform: 'stripe',
          startDate: new Date(),
          endDate: new Date(),
          data: {
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentIntentId: paymentIntent.id,
            failureReason: paymentIntent.last_payment_error?.message,
          },
        },
      });
    }

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
        // TODO: Add subscriptionId field to User model
        // subscriptionId: subscription.id,
        // TODO: Add subscriptionStatus field to User model
        // subscriptionStatus: subscription.status,
        // TODO: Add subscriptionTier field to User model
        // subscriptionTier: getSubscriptionTier(subscription.items.data[0].price.unit_amount),
        // TODO: Add subscriptionStartDate field to User model
        // subscriptionStartDate: new Date(subscription.current_period_start * 1000),
        // TODO: Add subscriptionEndDate field to User model
        // subscriptionEndDate: new Date(subscription.current_period_end * 1000),
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
        // TODO: Add subscriptionStatus field to User model
        // subscriptionStatus: subscription.status,
        // TODO: Add subscriptionTier field to User model
        // subscriptionTier: getSubscriptionTier(subscription.items.data[0].price.unit_amount),
        // TODO: Add subscriptionEndDate field to User model
        // subscriptionEndDate: new Date(subscription.current_period_end * 1000),
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
        // TODO: Add subscriptionStatus field to User model
        // subscriptionStatus: 'canceled',
        // TODO: Add subscriptionEndDate field to User model
        // subscriptionEndDate: new Date(subscription.canceled_at * 1000),
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
    const userId = await getUserIdByStripeCustomer(invoice.customer);
    if (userId) {
      await prisma.analyticsAggregation.create({
        data: {
          userId,
          type: 'INVOICE_PAYMENT_SUCCEEDED',
          platform: 'stripe',
          startDate: new Date(),
          endDate: new Date(),
          data: {
            invoiceId: invoice.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
          },
        },
      });
    }

    console.log(`Invoice payment succeeded: ${invoice.id}`);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(event: any) {
  try {
    const invoice = event.data.object;
    
    // Log failed invoice payment
    const userId = await getUserIdByStripeCustomer(invoice.customer);
    if (userId) {
      await prisma.analyticsAggregation.create({
        data: {
          userId,
          type: 'INVOICE_PAYMENT_FAILED',
          platform: 'stripe',
          startDate: new Date(),
          endDate: new Date(),
          data: {
            invoiceId: invoice.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
          },
        },
      });
    }

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