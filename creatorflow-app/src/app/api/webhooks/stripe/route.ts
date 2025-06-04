import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { emailTemplates } from '@/lib/email-templates'

// @ts-ignore - Ignore the apiVersion type error
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any, // Use a valid API version
});

const resend = new Resend(process.env.RESEND_API_KEY)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body, so we need to configure the route
export const config = {
    runtime: 'nodejs',
    unstable_allowDynamic: [
        '/node_modules/stripe/**',
        '/node_modules/resend/**',
    ],
};

async function buffer(readable: ReadableStream<Uint8Array> | null): Promise<Buffer> {
    if (!readable) {
        throw new Error("Request body is null");
    }
    
    const chunks = [];
    const reader = readable.getReader();
    
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(Buffer.from(value));
        }
        return Buffer.concat(chunks);
    } finally {
        reader.releaseLock();
    }
}

async function sendNotification(email: string, template: keyof typeof emailTemplates, data: any) {
    try {
        const { subject, html } = emailTemplates[template]
        await resend.emails.send({
            from: 'CreatorFlow <billing@creatorflow.app>',
            to: email,
            subject,
            html: html(data),
        })
    } catch (error) {
        console.error('Failed to send email notification:', error)
    }
}

async function handleFailedPayment(invoice: Stripe.Invoice & { payment_intent?: string }) {
    try {
        const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
        const userEmail = customer.email;
        
        if (!userEmail) {
            console.error('No email found for customer:', invoice.customer);
            return;
        }

        // Get user's payment retry count and date
        const user = await prisma.user.findFirst({
            where: { email: userEmail },
            select: {
                id: true,
                paymentRetryCount: true,
                paymentRetryDate: true,
                stripeCustomerId: true,
            },
        });

        if (!user) {
            console.error('No user found for email:', userEmail);
            return;
        }

        // Get the payment intent from the invoice
        const paymentIntentId = invoice.payment_intent;
        if (!paymentIntentId || typeof paymentIntentId !== 'string') {
            console.error('No payment intent found for invoice:', invoice.id);
            return;
        }

        // Get the payment method that failed
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const paymentMethodId = typeof paymentIntent.payment_method === 'string'
            ? paymentIntent.payment_method
            : paymentIntent.payment_method?.id;

        if (!paymentMethodId) {
            console.error('No payment method found for payment intent:', paymentIntentId);
            return;
        }

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        // Check for other payment methods
        const paymentMethods = await stripe.paymentMethods.list({
            customer: invoice.customer as string,
            type: 'card',
        });

        const otherPaymentMethods = paymentMethods.data.filter(
            pm => pm.id !== paymentMethod.id
        );

        if (otherPaymentMethods.length > 0) {
            // Try with another payment method
            const newPaymentMethod = otherPaymentMethods[0];
            
            // Update default payment method
            await stripe.customers.update(invoice.customer as string, {
                invoice_settings: {
                    default_payment_method: newPaymentMethod.id,
                },
            });

            // Retry the payment
            try {
                if (!invoice.id) {
                    throw new Error('Invoice ID is required');
                }

                const retryResult = await stripe.invoices.pay(invoice.id, {
                    payment_method: newPaymentMethod.id,
                });

                if (retryResult.status === 'paid') {
                    // Reset retry count on success
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            paymentRetryCount: 0,
                            paymentRetryDate: null,
                        },
                    });

                    // Send success notification
                    await sendNotification(userEmail, 'paymentSucceeded', {
                        amount: invoice.amount_due,
                        date: new Date().toLocaleDateString(),
                        invoiceUrl: invoice.hosted_invoice_url,
                    });
                    return;
                }
            } catch (retryError) {
                console.error('Failed to retry payment with alternative method:', retryError);
            }
        }

        // Calculate next retry date with exponential backoff
        const retryCount = (user.paymentRetryCount || 0) + 1;
        const retryIntervals = [3, 7, 14, 30]; // Days between retries
        const nextRetryDate = new Date();
        nextRetryDate.setDate(nextRetryDate.getDate() + (retryIntervals[Math.min(retryCount - 1, retryIntervals.length - 1)]));

        // Update user's retry count and date
        await prisma.user.update({
            where: { id: user.id },
            data: {
                paymentRetryCount: retryCount,
                paymentRetryDate: nextRetryDate,
            },
        });

        // Create a new payment intent for manual retry
        const newPaymentIntent = await stripe.paymentIntents.create({
            amount: invoice.amount_due,
            currency: invoice.currency,
            customer: invoice.customer as string,
            payment_method_types: ['card'],
            metadata: {
                invoice_id: invoice.id || '',
                retry_count: retryCount.toString(),
            },
        });

        // Send notification with retry information
        await sendNotification(userEmail, 'paymentFailed', {
            amount: invoice.amount_due,
            retryDate: nextRetryDate.toLocaleDateString(),
            retryCount,
            paymentIntentId: newPaymentIntent.id,
            maxRetries: retryIntervals.length,
            daysUntilNextRetry: retryIntervals[Math.min(retryCount - 1, retryIntervals.length - 1)],
        });

    } catch (error) {
        console.error('Error handling failed payment:', error);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature')!;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        switch (event.type) {
            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription & {
                    current_period_end: number;
                    items: {
                        data: Array<{
                            price: {
                                nickname?: string;
                            };
                        }>;
                    };
                };
                const user = await prisma.user.findFirst({
                    where: { stripeSubscriptionId: subscription.id },
                    select: { email: true },
                });

                if (user?.email) {
                    await sendNotification(
                        user.email,
                        'subscriptionCreated',
                        {
                            plan: subscription.items.data[0]?.price.nickname || 'Pro',
                            nextBillingDate: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
                        }
                    );
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription & {
                    current_period_end: number;
                    items: {
                        data: Array<{
                            price: {
                                nickname?: string;
                            };
                        }>;
                    };
                };
                const user = await prisma.user.findFirst({
                    where: { stripeSubscriptionId: subscription.id },
                    select: { email: true },
                });

                if (user?.email) {
                    const changes = []
                    if (subscription.cancel_at_period_end) {
                        changes.push('Subscription will be cancelled at the end of the billing period')
                    }
                    if (subscription.status === 'active') {
                        changes.push('Subscription is now active')
                    }

                    await sendNotification(
                        user.email,
                        'subscriptionUpdated',
                        {
                            plan: subscription.items.data[0]?.price.nickname || 'Pro',
                            nextBillingDate: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
                            changes,
                        }
                    );
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription & {
                    current_period_end: number;
                    items: {
                        data: Array<{
                            price: {
                                nickname?: string;
                            };
                        }>;
                    };
                };
                const user = await prisma.user.findFirst({
                    where: { stripeSubscriptionId: subscription.id },
                    select: { email: true },
                });

                if (user?.email) {
                    await sendNotification(
                        user.email,
                        'subscriptionCancelled',
                        {
                            plan: subscription.items.data[0]?.price.nickname || 'Pro',
                            endDate: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
                        }
                    );
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: invoice.customer as string },
                    select: { email: true },
                });

                if (user?.email) {
                    await sendNotification(
                        user.email,
                        'paymentSucceeded',
                        {
                            amount: invoice.amount_paid,
                            date: new Date(invoice.created * 1000).toLocaleDateString(),
                            invoiceUrl: invoice.hosted_invoice_url || '',
                        }
                    );
                }

                // Clear any pending retry dates
                const userToUpdate = await prisma.user.findFirst({
                    where: { stripeCustomerId: invoice.customer as string },
                });
                if (userToUpdate) {
                    await prisma.user.update({
                        where: { stripeCustomerId: invoice.customer as string },
                        data: {
                            paymentRetryDate: null,
                        },
                    });
                } else {
                    console.warn('No user found for stripeCustomerId:', invoice.customer);
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                await handleFailedPayment(invoice);
                break;
            }

            case 'payment_method.attached': {
                const paymentMethod = event.data.object as Stripe.PaymentMethod;
                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: paymentMethod.customer as string },
                    select: { 
                        email: true, 
                        paymentRetryDate: true,
                        paymentRetryCount: true,
                    },
                });

                if (user?.email && user.paymentRetryDate) {
                    // If there's a pending retry, try to pay the latest invoice
                    const customer = await stripe.customers.retrieve(paymentMethod.customer as string);
                    const latestInvoice = await stripe.invoices.list({
                        customer: paymentMethod.customer as string,
                        limit: 1,
                        status: 'open',
                    });

                    if (latestInvoice.data.length > 0 && latestInvoice.data[0].id) {
                        try {
                            await stripe.invoices.pay(latestInvoice.data[0].id, {
                                payment_method: paymentMethod.id,
                            });

                            // Reset retry count on success
                            await prisma.user.update({
                                where: { stripeCustomerId: paymentMethod.customer as string },
                                data: {
                                    paymentRetryCount: 0,
                                    paymentRetryDate: null,
                                },
                            });

                            await sendNotification(
                                user.email,
                                'paymentSucceeded',
                                {
                                    amount: latestInvoice.data[0].amount_due,
                                    date: new Date().toLocaleDateString(),
                                    invoiceUrl: latestInvoice.data[0].hosted_invoice_url || '',
                                }
                            );
                        } catch (error) {
                            console.error('Failed to retry payment with new method:', error);
                        }
                    }
                }
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
} 