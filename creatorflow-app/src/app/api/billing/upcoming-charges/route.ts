import { NextResponse } from 'next/server'
import { getSession } from '@/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// @ts-ignore - Ignore the apiVersion type error
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeSubscriptionId: true },
    })

    if (!user?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    // @ts-ignore - Ignore type errors for Stripe API
    const subscriptionResponse = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    const subscription = {
      ...subscriptionResponse,
      current_period_end: (subscriptionResponse as any).current_period_end
    }
    
    // @ts-ignore - Ignore type errors for Stripe API
    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      subscription: user.stripeSubscriptionId,
    }) as Stripe.Invoice & {
      next_payment_attempt: number | null
    }

    return NextResponse.json([
      {
        id: upcomingInvoice.id,
        amount: upcomingInvoice.amount_due,
        date: upcomingInvoice.next_payment_attempt || subscription.current_period_end,
        description: 'Next billing cycle',
      },
    ])
  } catch (error) {
    console.error('Error fetching upcoming charges:', error)
    return NextResponse.json({ error: 'Failed to fetch upcoming charges' }, { status: 500 })
  }
} 