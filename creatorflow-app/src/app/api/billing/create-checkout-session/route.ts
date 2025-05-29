import { NextResponse } from 'next/server';
import { getSession } from "@/auth";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
});

const PRICE_IDS = {
    [process.env.STRIPE_PRICE_BASIC!]: 'basic',
    [process.env.STRIPE_PRICE_PRO!]: 'pro',
    [process.env.STRIPE_PRICE_ENTERPRISE!]: 'enterprise',
};

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { priceId } = await req.json();
        if (!priceId || !PRICE_IDS[priceId]) {
            return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
        }

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
            customer_email: session.user.email!,
            metadata: {
                userId: session.user.id,
                tier: PRICE_IDS[priceId],
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: 'Error creating checkout session' },
            { status: 500 }
        );
    }
} 