import { NextResponse } from 'next/server';
import { getSession } from "@/auth";
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Error: STRIPE_SECRET_KEY environment variable is not set.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-05-28.basil',
});

export async function POST(req: Request) {
    try {
        const session = await getSession(req);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user from the database to get their Stripe customer ID
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { stripeCustomerId: true },
        });

        if (!user?.stripeCustomerId) {
            return NextResponse.json(
                { error: 'No subscription found' },
                { status: 400 }
            );
        }

        // Create a Stripe customer portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        return NextResponse.json(
            { error: 'Error creating portal session' },
            { status: 500 }
        );
    }
} 