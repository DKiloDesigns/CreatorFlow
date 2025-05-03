import { NextResponse } from 'next/server';
import { headers } from 'next/headers'; // To read webhook signature
import { PrismaClient } from '@/generated/prisma';
import Stripe from 'stripe';

const prisma = new PrismaClient();

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('ERROR: STRIPE_SECRET_KEY is not set.');
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('ERROR: STRIPE_WEBHOOK_SECRET is not set.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body, so we disable Next.js body parsing for this route
export const config = {
    api: {
        bodyParser: false,
    },
};

async function buffer(readable: ReadableStream<Uint8Array> | null): Promise<Buffer> {
    if (!readable) {
        throw new Error("Request body is null");
    }
    const chunks = [];
    const reader = readable.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(typeof value === "string" ? Buffer.from(value) : value);
    }
    return Buffer.concat(chunks);
}

export async function POST(req: Request) {
    const buf = await buffer(req.body);
    const headersList = await headers(); // Explicitly await (though likely unnecessary)
    const sig = headersList.get('stripe-signature');

    if (!sig) {
         return NextResponse.json({ error: 'Webhook Error: Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`❌ Error message: ${errorMessage}`);
        return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
    }

    console.log('✅ Stripe Webhook Received:', event.type);

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('--- Received checkout.session.completed ---');
                console.log(JSON.stringify(session, null, 2)); // Log the session object
                console.log('--- End checkout.session.completed ---');
                
                if (session.mode !== 'subscription' || typeof session.customer !== 'string' || typeof session.subscription !== 'string') {
                     console.error('Webhook Error: Invalid checkout session data.');
                     break;
                }
                
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                console.log('--- Retrieved subscription object ---');
                console.log(JSON.stringify(subscription, null, 2)); // Log the retrieved subscription
                console.log('--- End retrieved subscription object ---');

                await prisma.user.update({
                    where: {
                        stripeCustomerId: session.customer,
                    },
                    data: {
                        stripeSubscriptionId: subscription.id, // Use ID from retrieved subscription
                        stripePriceId: subscription.items.data[0]?.price.id, // Use price ID from retrieved subscription
                        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        plan: 'PRO',
                    },
                });
                console.log(`Updated user record for customer: ${session.customer}`);
                break;
            }
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                console.log('--- Received invoice.payment_succeeded ---');
                console.log(JSON.stringify(invoice, null, 2)); // Log the invoice object
                console.log('--- End invoice.payment_succeeded ---');
                
                const subscriptionId = invoice.subscription;
                const customerId = invoice.customer;

                if (typeof subscriptionId !== 'string' || typeof customerId !== 'string') {
                    console.log('Skipping invoice.payment_succeeded: Not related to a subscription or customer missing.');
                    break; 
                }
                
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                console.log('--- Retrieved subscription object ---');
                console.log(JSON.stringify(subscription, null, 2)); // Log the retrieved subscription
                console.log('--- End retrieved subscription object ---');

                 await prisma.user.update({
                    where: { 
                         stripeCustomerId: customerId, 
                    },
                    data: {
                        stripeSubscriptionId: subscription.id,
                        stripePriceId: subscription.items.data[0]?.price.id,
                        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        plan: 'PRO',
                    },
                });
                 console.log(`Updated subscription period for customer: ${customerId}`);
                break;
            }
             case 'customer.subscription.deleted':
             case 'customer.subscription.updated': { 
                const subscription = event.data.object as Stripe.Subscription;
                console.log('--- Received customer.subscription.updated/deleted ---');
                console.log(JSON.stringify(subscription, null, 2)); // Log the subscription object from event
                console.log('--- End customer.subscription.updated/deleted ---');

                 if (!subscription.customer || typeof subscription.customer !== 'string') {
                     console.error('Webhook Error: Missing or invalid customer ID');
                     break;
                 }
                 
                 const user = await prisma.user.findUnique({
                     where: { stripeCustomerId: subscription.customer },
                 });

                 if (user) {
                     const isActive = subscription.status === 'active' || subscription.status === 'trialing';
                     await prisma.user.update({
                         where: { id: user.id },
                         data: {
                             stripeSubscriptionId: isActive ? subscription.id : null,
                             stripePriceId: isActive ? subscription.items.data[0]?.price.id : null,
                             // Use current_period_end from the *webhook event* object for updates/deletes
                             stripeCurrentPeriodEnd: isActive ? new Date(subscription.current_period_end * 1000) : null,
                             plan: isActive ? 'PRO' : 'FREE', 
                         }
                     });
                     console.log(`Updated user plan status for customer: ${subscription.customer}`);
                 } else {
                     console.error(`Webhook Error: User not found for Stripe customer ID: ${subscription.customer}`);
                 }
                 break;
            }
            // ... handle other event types as needed (e.g., payment failures)
            default:
                console.log(`Unhandled Stripe event type: ${event.type}`);
        }
    } catch (error) {
        console.error('Error handling webhook event:', error);
        // Return 500 but don't block Stripe from sending other events
         return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
} 