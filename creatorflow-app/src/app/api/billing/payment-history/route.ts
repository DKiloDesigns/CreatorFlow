import { NextResponse } from 'next/server'
import { getSession } from '@/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function GET(request: Request) {
  try {
    const session = await getSession(request)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 })
    }

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 10,
      status: 'paid',
    })

    return NextResponse.json(
      invoices.data.map((invoice) => ({
        id: invoice.id,
        amount: invoice.amount_paid,
        date: invoice.created,
        status: invoice.status,
        description: invoice.description || 'Subscription payment',
        invoice_pdf: invoice.invoice_pdf,
      }))
    )
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 })
  }
} 