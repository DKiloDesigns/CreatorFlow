# floai.studio Monetization Setup Guide

## 🎯 Overview

floai.studio now has a complete monetization system with three pricing tiers:
- **Free**: 3 accounts, 10 posts/month, basic features
- **Pro**: 10 accounts, unlimited posts, AI features, $29/month
- **Enterprise**: Unlimited everything, white-label, $99/month

## 🚀 Quick Start

### 1. Environment Setup

Add these environment variables to your `.env.local`:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://floai.studio
```

### 2. Set Up Stripe Products

Run the setup script to create products and prices in Stripe:

```bash
cd creatorflow-app
node scripts/setup-stripe.js
```

This will create:
- Pro Plan (Monthly: $29, Yearly: $290)
- Enterprise Plan (Monthly: $99, Yearly: $990)

### 3. Update Price IDs

After running the script, update `src/lib/pricing.ts` with the actual Stripe price IDs:

```typescript
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: 'price_1234567890', // Replace with actual ID
  PRO_YEARLY: 'price_1234567891',  // Replace with actual ID
  ENTERPRISE_MONTHLY: 'price_1234567892', // Replace with actual ID
  ENTERPRISE_YEARLY: 'price_1234567893',  // Replace with actual ID
};
```

### 4. Set Up Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## 📁 File Structure

```
src/
├── lib/
│   ├── pricing.ts          # Pricing tiers and configuration
│   └── stripe.ts           # Stripe API integration
├── app/api/billing/
│   ├── create-checkout/    # Create checkout sessions
│   ├── customer-portal/    # Manage subscriptions
│   └── webhook/           # Handle Stripe webhooks
├── app/dashboard/billing/  # Billing dashboard page
└── components/
    └── SubscriptionStatus.tsx  # Subscription status component
```

## 💰 Pricing Tiers

### Free Plan
- **Price**: $0/month
- **Features**:
  - 3 Social Media Accounts
  - 10 Posts per Month
  - Basic Analytics
  - Content Calendar
  - Free Tools Suite
  - Mobile App Access
  - Email Support

### Pro Plan
- **Price**: $29/month or $290/year (2 months free)
- **Features**:
  - 10 Social Media Accounts
  - Unlimited Posts
  - Advanced Analytics
  - AI Content Generation
  - Team Collaboration (5 members)
  - Priority Support
  - Custom Branding
  - API Access
  - Advanced Scheduling
  - Content Templates
  - Performance Insights

### Enterprise Plan
- **Price**: $99/month or $990/year (2 months free)
- **Features**:
  - Unlimited Social Media Accounts
  - Unlimited Posts
  - White-Label Solution
  - Custom Integrations
  - Unlimited Team Members
  - Dedicated Account Manager
  - Custom Analytics
  - Advanced AI Features
  - SSO Integration
  - Custom Workflows
  - 24/7 Phone Support
  - SLA Guarantee

## 🔧 API Endpoints

### Create Checkout Session
```http
POST /api/billing/create-checkout
Content-Type: application/json

{
  "priceId": "price_pro_monthly",
  "billingPeriod": "monthly"
}
```

### Open Customer Portal
```http
POST /api/billing/customer-portal
```

### Webhook Handler
```http
POST /api/billing/webhook
Stripe-Signature: whsec_...
```

## 🎨 UI Components

### SubscriptionStatus Component
Displays current subscription status with:
- Plan name and price
- Renewal date
- Payment status
- Feature limits
- Upgrade/manage buttons

### Billing Dashboard
Full billing management page with:
- Current plan details
- Pricing comparison
- Feature comparison table
- Upgrade options
- Subscription management

## 🔒 Security Features

- **Webhook Verification**: All webhooks are verified using Stripe signatures
- **User Authentication**: All billing endpoints require authentication
- **Data Validation**: Input validation on all API endpoints
- **Error Handling**: Comprehensive error handling and logging

## 📊 Database Schema

The User model includes these Stripe-related fields:
```prisma
model User {
  plan                    String    @default("FREE")
  stripeCustomerId        String?   @unique
  stripeSubscriptionId    String?   @unique
  stripePriceId           String?
  stripeCurrentPeriodEnd  DateTime?
  paymentRetryCount       Int?      @default(0)
  paymentRetryDate        DateTime?
  // ... other fields
}
```

## 🧪 Testing

### Test Cards
Use these Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

### Test Scenarios
1. **Successful Subscription**: Use success test card
2. **Payment Failure**: Use decline test card
3. **Subscription Update**: Change from Pro to Enterprise
4. **Subscription Cancellation**: Cancel via customer portal
5. **Webhook Processing**: Verify webhook events are handled

## 🚀 Deployment

### Production Setup
1. **Stripe Live Mode**: Switch to live API keys
2. **Webhook URL**: Update to production domain
3. **Environment Variables**: Set production values
4. **SSL Certificate**: Ensure HTTPS for webhooks
5. **Monitoring**: Set up error monitoring

### Environment Variables
```bash
# Production
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://floai.studio
```

## 📈 Analytics & Monitoring

### Key Metrics to Track
- **Conversion Rate**: Free → Pro → Enterprise
- **Churn Rate**: Monthly subscription cancellations
- **MRR**: Monthly Recurring Revenue
- **ARPU**: Average Revenue Per User
- **LTV**: Customer Lifetime Value

### Stripe Dashboard
Monitor these in Stripe Dashboard:
- Revenue trends
- Subscription metrics
- Failed payments
- Webhook delivery status
- Customer portal usage

## 🔧 Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events**
   - Check webhook URL is accessible
   - Verify webhook secret is correct
   - Check Stripe webhook logs

2. **Payment Failures**
   - Check payment method is valid
   - Verify customer has sufficient funds
   - Check for 3D Secure requirements

3. **Subscription Not Updating**
   - Check webhook is processing events
   - Verify database connection
   - Check for errors in logs

### Debug Mode
Enable debug logging in `src/lib/stripe.ts`:
```typescript
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  // Add this for debugging
  // telemetry: false,
});
```

## 📞 Support

For issues with the monetization system:
1. Check Stripe Dashboard for payment status
2. Review application logs for errors
3. Test with Stripe test cards
4. Verify webhook configuration

## 🎉 Success!

Your floai.studio monetization system is now ready! Users can:
- View pricing plans
- Subscribe to Pro/Enterprise
- Manage their billing
- Upgrade/downgrade plans
- Access plan-specific features

The system handles all subscription lifecycle events automatically and provides a seamless billing experience for your users.
