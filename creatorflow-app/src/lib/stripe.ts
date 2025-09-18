import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export const STRIPE_CONFIG = {
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
};

// Stripe Price IDs - Using existing Stripe setup
export const STRIPE_PRICE_IDS = {
  // Pro Plan (using existing price IDs from .env)
  PRO_MONTHLY: 'price_1RVNbpFRpVaglkHnlxpaqpsh',
  PRO_YEARLY: 'price_1RVO1UFRpVaglkHnchzxF4jM',
  
  // Enterprise Plan (using existing business price IDs)
  ENTERPRISE_MONTHLY: 'price_1RVP48FRpVaglkHnAv9qKnGI',
  ENTERPRISE_YEARLY: 'price_1RVP48FRpVaglkHnAv9qKnGI',
};

// Create Stripe products and prices (run once to set up)
export const createStripeProducts = async () => {
  try {
    // Create Pro Plan Product
    const proProduct = await stripe.products.create({
      name: 'CreatorFlow Pro',
      description: 'For growing creators and small businesses',
      metadata: {
        tier: 'pro',
      },
    });

    // Create Pro Monthly Price
    const proMonthlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 2900, // $29.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'pro',
        billing: 'monthly',
      },
    });

    // Create Pro Yearly Price
    const proYearlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 29000, // $290.00 (2 months free)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        tier: 'pro',
        billing: 'yearly',
      },
    });

    // Create Enterprise Plan Product
    const enterpriseProduct = await stripe.products.create({
      name: 'CreatorFlow Enterprise',
      description: 'For agencies and large organizations',
      metadata: {
        tier: 'enterprise',
      },
    });

    // Create Enterprise Monthly Price
    const enterpriseMonthlyPrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'enterprise',
        billing: 'monthly',
      },
    });

    // Create Enterprise Yearly Price
    const enterpriseYearlyPrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 99000, // $990.00 (2 months free)
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        tier: 'enterprise',
        billing: 'yearly',
      },
    });

    console.log('Stripe products and prices created:');
    console.log('Pro Monthly:', proMonthlyPrice.id);
    console.log('Pro Yearly:', proYearlyPrice.id);
    console.log('Enterprise Monthly:', enterpriseMonthlyPrice.id);
    console.log('Enterprise Yearly:', enterpriseYearlyPrice.id);

    return {
      proMonthlyPrice: proMonthlyPrice.id,
      proYearlyPrice: proYearlyPrice.id,
      enterpriseMonthlyPrice: enterpriseMonthlyPrice.id,
      enterpriseYearlyPrice: enterpriseYearlyPrice.id,
    };
  } catch (error) {
    console.error('Error creating Stripe products:', error);
    throw error;
  }
};

// Create checkout session
export const createCheckoutSession = async (
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
    metadata: {
      priceId,
    },
  });

  return session;
};

// Create customer portal session
export const createCustomerPortalSession = async (
  customerId: string,
  returnUrl?: string
) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return session;
};

// Get subscription details
export const getSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.retrieve(subscriptionId);
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.cancel(subscriptionId);
};

// Update subscription
export const updateSubscription = async (
  subscriptionId: string,
  newPriceId: string
) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
};
