import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';
import { prisma } from '@/lib/prisma';

// ... existing code ...

type WebhookEvent = Stripe.Event & {
  data: {
    object: Stripe.Subscription;
  };
};

type WebhookResponse = {
  success: boolean;
  message?: string;
};

export async function POST(request: Request) {
  const _headers = headers();
  const _buffer = await request.text();
  
  try {
    // ... existing code ...
    const _customer: Stripe.Customer = await stripe.customers.retrieve(
      subscription.customer as string
    );
    
    return NextResponse.json<WebhookResponse>({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    return NextResponse.json<WebhookResponse>({
      success: false,
      message: 'Failed to process webhook'
    }, { status: 500 });
  }
} 