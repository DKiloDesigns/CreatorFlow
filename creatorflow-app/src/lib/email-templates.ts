import { EmailTemplate, EmailTemplateData, SubscriptionCreatedData, SubscriptionUpdatedData, SubscriptionCancelledData, PaymentSucceededData, PaymentFailedData } from '@/types/email'

const baseStyles = {
    container: 'max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm',
    header: 'text-center mb-8',
    title: 'text-2xl font-bold text-gray-900 mb-2',
    subtitle: 'text-gray-600',
    content: 'text-gray-700 leading-relaxed',
    button: 'inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors',
    footer: 'mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500',
    highlight: 'text-blue-600 font-semibold',
    warning: 'text-red-600 font-semibold',
    success: 'text-green-600 font-semibold',
}

export const emailTemplates = {
    subscriptionCreated: {
        subject: 'Welcome to CreatorFlow! 🎉',
        html: (data: SubscriptionCreatedData) => `
            <div style="${baseStyles.container}">
                <div style="${baseStyles.header}">
                    <h1 style="${baseStyles.title}">Welcome to CreatorFlow!</h1>
                    <p style="${baseStyles.subtitle}">Your journey to better content creation starts now</p>
                </div>
                <div style="${baseStyles.content}">
                    <p>Hi there,</p>
                    <p>Thank you for subscribing to CreatorFlow! We're excited to have you on board.</p>
                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="font-semibold mb-2">Your Subscription Details:</h3>
                        <ul class="space-y-2">
                            <li>Plan: <span style="${baseStyles.highlight}">${data.plan}</span></li>
                            <li>Next billing date: ${data.nextBillingDate}</li>
                        </ul>
                    </div>
                    <div class="mt-6">
                        <h3 class="font-semibold mb-2">What's Next?</h3>
                        <ul class="space-y-2">
                            <li>Connect your social media accounts</li>
                            <li>Create your first content calendar</li>
                            <li>Explore our AI-powered content suggestions</li>
                        </ul>
                    </div>
                    <div class="mt-8 text-center">
                        <a href="${data.dashboardUrl || 'https://app.creatorflow.com/dashboard'}" style="${baseStyles.button}">
                            Go to Dashboard
                        </a>
                    </div>
                </div>
                <div style="${baseStyles.footer}">
                    <p>If you have any questions, please contact our support team.</p>
                    <p>© ${new Date().getFullYear()} CreatorFlow. All rights reserved.</p>
                </div>
            </div>
        `,
    },
    subscriptionUpdated: {
        subject: 'Your CreatorFlow Subscription Has Been Updated',
        html: (data: SubscriptionUpdatedData) => `
            <div style="${baseStyles.container}">
                <div style="${baseStyles.header}">
                    <h1 style="${baseStyles.title}">Subscription Updated</h1>
                    <p style="${baseStyles.subtitle}">Your CreatorFlow subscription has been updated</p>
                </div>
                <div style="${baseStyles.content}">
                    <p>Hi there,</p>
                    <p>Your CreatorFlow subscription has been updated. Here are the details:</p>
                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="font-semibold mb-2">Updated Subscription Details:</h3>
                        <ul class="space-y-2">
                            <li>Plan: <span style="${baseStyles.highlight}">${data.plan}</span></li>
                            <li>Next billing date: ${data.nextBillingDate}</li>
                            <li>Changes: 
                                <ul>
                                    ${data.changes.map(change => `<li>${change}</li>`).join('')}
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="mt-8 text-center">
                        <a href="${data.dashboardUrl || 'https://app.creatorflow.com/dashboard/billing'}" style="${baseStyles.button}">
                            View Billing Details
                        </a>
                    </div>
                </div>
                <div style="${baseStyles.footer}">
                    <p>If you have any questions, please contact our support team.</p>
                    <p>© ${new Date().getFullYear()} CreatorFlow. All rights reserved.</p>
                </div>
            </div>
        `,
    },
    subscriptionCancelled: {
        subject: 'Your CreatorFlow Subscription Has Been Cancelled',
        html: (data: SubscriptionCancelledData) => `
            <div style="${baseStyles.container}">
                <div style="${baseStyles.header}">
                    <h1 style="${baseStyles.title}">Subscription Cancelled</h1>
                    <p style="${baseStyles.subtitle}">We're sorry to see you go</p>
                </div>
                <div style="${baseStyles.content}">
                    <p>Hi there,</p>
                    <p>Your CreatorFlow subscription has been cancelled. Your access will remain active until the end of your current billing period.</p>
                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="font-semibold mb-2">Subscription Details:</h3>
                        <ul class="space-y-2">
                            <li>Plan: <span style="${baseStyles.highlight}">${data.plan}</span></li>
                            <li>Access until: ${data.endDate}</li>
                        </ul>
                    </div>
                    <p class="mt-6">We'd love to know why you decided to cancel. Your feedback helps us improve our service.</p>
                    <div class="mt-8 text-center">
                        <a href="${data.feedbackUrl || 'https://app.creatorflow.com/feedback'}" style="${baseStyles.button}">
                            Share Your Feedback
                        </a>
                    </div>
                    <p class="mt-6">If you change your mind, you can resubscribe anytime from your dashboard.</p>
                </div>
                <div style="${baseStyles.footer}">
                    <p>If you have any questions, please contact our support team.</p>
                    <p>© ${new Date().getFullYear()} CreatorFlow. All rights reserved.</p>
                </div>
            </div>
        `,
    },
    paymentSucceeded: {
        subject: 'Payment Successful - CreatorFlow',
        html: (data: PaymentSucceededData) => `
            <div style="${baseStyles.container}">
                <div style="${baseStyles.header}">
                    <h1 style="${baseStyles.title}">Payment Successful</h1>
                    <p style="${baseStyles.subtitle}">Thank you for your payment</p>
                </div>
                <div style="${baseStyles.content}">
                    <p>Hi there,</p>
                    <p>We've received your payment for CreatorFlow. Here's a summary:</p>
                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="font-semibold mb-2">Payment Details:</h3>
                        <ul class="space-y-2">
                            <li>Amount: <span style="${baseStyles.highlight}">$${(data.amount / 100).toFixed(2)}</span></li>
                            <li>Date: ${data.date}</li>
                        </ul>
                    </div>
                    <div class="mt-8 text-center">
                        <a href="${data.invoiceUrl}" style="${baseStyles.button}">
                            View Invoice
                        </a>
                    </div>
                </div>
                <div style="${baseStyles.footer}">
                    <p>If you have any questions, please contact our support team.</p>
                    <p>© ${new Date().getFullYear()} CreatorFlow. All rights reserved.</p>
                </div>
            </div>
        `,
    },
    paymentFailed: {
        subject: 'Action Required: Payment Failed - CreatorFlow',
        html: (data: PaymentFailedData) => `
            <div style="${baseStyles.container}">
                <div style="${baseStyles.header}">
                    <h1 style="${baseStyles.title}">Payment Failed</h1>
                    <p style="${baseStyles.subtitle}">Action required to maintain your subscription</p>
                </div>
                <div style="${baseStyles.content}">
                    <p>Hi there,</p>
                    <p>We were unable to process your payment for CreatorFlow. Here's what you need to know:</p>
                    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 class="font-semibold mb-2">Payment Details:</h3>
                        <ul class="space-y-2">
                            <li>Amount: <span style="${baseStyles.warning}">$${(data.amount / 100).toFixed(2)}</span></li>
                            <li>Next retry: ${data.retryDate}</li>
                            <li>Retry attempt: ${data.retryCount} of ${data.maxRetries}</li>
                        </ul>
                    </div>
                    <p class="mt-6">To ensure uninterrupted access to CreatorFlow, please update your payment method or ensure your current method has sufficient funds.</p>
                    <div class="mt-8 text-center">
                        <a href="https://app.creatorflow.com/dashboard/billing" style="${baseStyles.button}">
                            Update Payment Method
                        </a>
                    </div>
                    <p class="mt-6">If you don't take action, we'll automatically retry the payment in ${data.daysUntilNextRetry} days.</p>
                </div>
                <div style="${baseStyles.footer}">
                    <p>If you have any questions, please contact our support team.</p>
                    <p>© ${new Date().getFullYear()} CreatorFlow. All rights reserved.</p>
                </div>
            </div>
        `,
    },
}