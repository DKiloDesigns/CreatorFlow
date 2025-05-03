import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { PrismaClient } from '@/generated/prisma';
import Stripe from 'stripe';

const prisma = new PrismaClient();

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Error: STRIPE_SECRET_KEY environment variable is not set.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        const appBaseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

        // Find user to get their Stripe Customer ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { stripeCustomerId: true }, // Only select the ID we need
        });

        if (!user || !user.stripeCustomerId) {
            console.log(`User ${userId} tried to access billing portal without Stripe Customer ID.`);
            // Optionally redirect to start a checkout first, or show an error
            return NextResponse.json({ error: 'Stripe customer ID not found for user' }, { status: 400 });
        }

        // Create a Stripe Billing Portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${appBaseUrl}/dashboard/billing`, // URL to return to after portal visit
        });

        if (!portalSession.url) {
            throw new Error('Failed to create Stripe Billing Portal session');
        }

        // Return the portal session URL
        return NextResponse.json({ url: portalSession.url });

    } catch (error) {
        console.error('Error creating Stripe Portal session:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 