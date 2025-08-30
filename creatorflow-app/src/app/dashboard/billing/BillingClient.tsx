'use client';

import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import { createPortalSession } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const tiers = [
  {
    name: 'Basic',
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC!,
    yearlyId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY!,
    price: '$9',
    yearlyPrice: '$108',
    description: 'Perfect for getting started',
    features: [
      'Up to 10 posts per month',
      '2 social media accounts',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start with Basic',
    mostPopular: false,
  },
  {
    name: 'Pro',
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
    yearlyId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY!,
    price: '$75',
    yearlyPrice: '$900',
    description: 'For growing creators and small teams',
    features: [
      'Up to 10 social accounts',
      'Advanced analytics',
      'Priority support',
      'Unlimited posts',
      'AI content suggestions',
    ],
    cta: 'Get Pro',
    mostPopular: true,
  },
  {
    name: 'Business Suite',
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS!,
    yearlyId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY!,
    price: '$175',
    yearlyPrice: '$2,100',
    description: 'Empower your team to manage, schedule, and analyze content across up to 25 social media accounts. Unlock advanced collaboration, in-depth analytics, client management, and premium support.',
    features: [
      'Up to 25 social accounts',
      'Team collaboration',
      'Client management',
      'Premium support',
      'Everything in Pro',
      'Custom templates',
      'API access',
    ],
    cta: 'Upgrade to Business Suite',
    mostPopular: false,
  },
];

type BillingClientProps = {
  user: {
    id: string;
    stripeCustomerId: string | null;
    plan: string | null;
    stripeSubscriptionId: string | null;
    stripeCurrentPeriodEnd: string | null;
    isTrialUser?: boolean;
    trialStartDate?: Date | null;
    trialEndDate?: Date | null;
    promoCodeUsed?: string | null;
    _count: {
      posts: number;
      socialAccounts: number;
    };
  };
  searchParams: { [key: string]: string | string[] | undefined };
  upcomingCharges: Array<{
    id: string;
    description: string;
    date: number;
    amount: number;
  }> | null;
  paymentHistory: Array<{
    id: string;
    description: string;
    date: number;
    amount: number;
    status: string;
    invoice_pdf: string;
  }> | null;
}

export default function BillingClient({ user, searchParams, upcomingCharges, paymentHistory }: BillingClientProps) {
  const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const router = useRouter();

  if (searchParams.success) {
    return (
      <Card sx={{ bgcolor: 'success.50', border: '2px solid', borderColor: 'success.main' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="success.main" gutterBottom>
            Payment successful!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your subscription has been activated. You can now access all premium features.
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (searchParams.canceled) {
    return (
      <Card sx={{ bgcolor: 'warning.50', border: '2px solid', borderColor: 'warning.main' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            Payment canceled
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your payment was canceled. You can try again or choose a different plan.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Billing & Subscription
      </Typography>
      
          {/* Current Plan Section */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Current Plan" />
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6} component="div">
              <Typography variant="h5" gutterBottom>
                {user?.plan || 'Free'}
              </Typography>
              {user?.stripeCurrentPeriodEnd && (
                <Typography variant="body2" color="text.secondary">
                  Next billing: {format(new Date(user.stripeCurrentPeriodEnd), 'MMMM d, yyyy')}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }} component="div">
                {user?.stripeCustomerId && (
                  <Button
                  variant="contained"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/billing/create-portal-session', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                        });
                        const { url } = await response.json();
                        if (url) {
                          toast.success('Opening Stripe portal...');
                          window.location.href = url;
                        } else {
                          toast.error('Failed to open Stripe portal.');
                        }
                      } catch (err) {
                        toast.error('An error occurred while opening the Stripe portal.');
                      }
                    }}
                  >
                    Manage Subscription
                  </Button>
                )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

          {/* Upcoming Charges */}
      {upcomingCharges && upcomingCharges.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Upcoming Charges" />
          <CardContent>
            <Grid container spacing={2}>
              {upcomingCharges.map((charge) => (
                <Grid item xs={12} key={charge.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {charge.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(charge.date * 1000), 'MMMM d, yyyy')}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary.main">
                      ${charge.amount / 100}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
          )}

          {/* Payment History */}
      {paymentHistory && paymentHistory.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Payment History" />
          <CardContent>
            <Grid container spacing={2}>
              {paymentHistory.map((payment) => (
                <Grid item xs={12} key={payment.id} component="div">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {payment.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(payment.date * 1000), 'MMMM d, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary.main">
                        ${payment.amount / 100}
                      </Typography>
                      <Chip 
                        label={payment.status} 
                        color={payment.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <Card>
        <CardHeader title="Available Plans" />
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant={billingFrequency === 'monthly' ? 'contained' : 'outlined'}
              onClick={() => setBillingFrequency('monthly')}
              sx={{ mr: 1 }}
            >
              Monthly
            </Button>
            <Button
              variant={billingFrequency === 'yearly' ? 'contained' : 'outlined'}
              onClick={() => setBillingFrequency('yearly')}
            >
              Yearly (Save 10%)
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {tiers.map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: tier.mostPopular ? '2px solid' : '1px solid',
                    borderColor: tier.mostPopular ? 'primary.main' : 'divider',
                    position: 'relative'
                  }}
                >
                  {tier.mostPopular && (
                    <Chip
                      label="Most Popular"
                      color="primary"
                      sx={{ position: 'absolute', top: 16, right: 16 }}
                    />
                  )}
                  <CardHeader
                    title={tier.name}
                    subheader={tier.description}
                    titleTypographyProps={{ variant: 'h6' }}
                  />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" component="div" gutterBottom>
                      {billingFrequency === 'monthly' ? tier.price : tier.yearlyPrice}
                      <Typography variant="body2" component="span" color="text.secondary">
                        /{billingFrequency === 'monthly' ? 'month' : 'year'}
                      </Typography>
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                      {tier.features.map((feature, featureIndex) => (
                        <Typography component="li" key={featureIndex} variant="body2" sx={{ mb: 1 }}>
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                    
                  <Button
                      variant="contained"
                      fullWidth
                      href={`/api/billing/create-checkout-session?priceId=${billingFrequency === 'monthly' ? tier.id : tier.yearlyId}`}
                      sx={{ mt: 'auto' }}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Spacer to Clear Bottom Navigation */}
      <Box sx={{ 
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
} 