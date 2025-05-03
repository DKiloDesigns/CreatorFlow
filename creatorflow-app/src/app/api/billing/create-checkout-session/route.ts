import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { PrismaClient } from '@/generated/prisma';
import Stripe from 'stripe';

const prisma = new PrismaClient();

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Error: STRIPE_SECRET_KEY environment variable is not set.');
    // Throw error or handle appropriately in a real app
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // apiVersion: '2024-06-20', // Removed to fix type mismatch
    typescript: true,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id || !session.user.email) {
            return NextResponse.json({ error: 'Unauthorized: User not logged in or email missing' }, { status: 401 });
        }
        const userId = session.user.id;
        const userEmail = session.user.email;

        const { priceId, quantity = 1 } = await req.json();

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
        }

        const appBaseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        // Find user in our database to get/create Stripe Customer ID
        let user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
             return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let stripeCustomerId = user.stripeCustomerId;

        // If user doesn't have a Stripe Customer ID, create one
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: userEmail,
                name: session.user.name || undefined, // Optional: Add user's name
                metadata: {
                    userId: userId, // Link Stripe Customer to our User ID
                },
            });
            stripeCustomerId = customer.id;

            // Update our user record with the new Stripe Customer ID
            await prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId: stripeCustomerId },
            });
        }

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription', // For recurring payments
            customer: stripeCustomerId,
            line_items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            // Define success and cancel URLs
            success_url: `${appBaseUrl}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appBaseUrl}/dashboard/billing?canceled=true`,
            // Pass metadata if needed (e.g., userId, though customer mapping is better)
            // metadata: {
            //     userId: userId,
            // },
            // Optionally allow promotion codes
            // allow_promotion_codes: true,
        });

        if (!checkoutSession.id) {
            throw new Error('Failed to create Stripe Checkout session');
        }

        return NextResponse.json({ sessionId: checkoutSession.id });

    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 