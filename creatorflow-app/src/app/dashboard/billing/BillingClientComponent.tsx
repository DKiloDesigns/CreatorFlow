"use client";
import Link from "next/link";
import { format } from 'date-fns';
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Box, Container, Grid, Alert, AlertTitle, Chip, Tabs, Tab } from '@mui/material';
import { createPortalSession } from './actions';
import { ArrowRight, CreditCard, History, TrendingUp, BarChart3, Users, Zap, Download, FileText, BarChart2 } from 'lucide-react';
import { LinearProgress } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const tiers = [
  {
    name: 'Basic',
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC!,
    price: '$9',
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

type BillingClientComponentProps = {
  user: {
    id: string;
    stripeCustomerId: string | null;
    plan: string | null;
    stripeSubscriptionId: string | null;
    stripeCurrentPeriodEnd: string | null;
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

export default function BillingClientComponent({ user, searchParams, upcomingCharges, paymentHistory }: BillingClientComponentProps) {
  console.log("BillingClientComponent: Component rendering", { 
    userExists: !!user, 
    searchParamsExists: !!searchParams,
    upcomingChargesExists: !!upcomingCharges,
    paymentHistoryExists: !!paymentHistory
  });

  const [billingFrequency, setBillingFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  
  console.log("BillingClientComponent: Hooks initialized");

  // Calculate usage percentages
  const postLimit = user?.plan === 'Free' ? 5 : user?.plan === 'Basic' ? 10 : Infinity;
  const accountLimit = user?.plan === 'Free' ? 2 : user?.plan === 'Basic' ? 5 : Infinity;
  const postUsage = Math.min((user?._count.posts || 0) / postLimit * 100, 100);
  const accountUsage = Math.min((user?._count.socialAccounts || 0) / accountLimit * 100, 100);
  
  console.log("BillingClientComponent: Usage calculated");

  console.log("BillingClientComponent: Checking searchParams", searchParams);
  
  if (searchParams?.success) {
    console.log("BillingClientComponent: Rendering success message");
    return (
      <Alert severity="success" sx={{ borderRadius: 2, p: 2 }}>
        <AlertTitle sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'success.dark' }}>
          Payment successful!
        </AlertTitle>
        <Typography sx={{ mt: 1, color: 'success.dark' }}>
          Your subscription has been activated. You can now access all premium features.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link
            href="/dashboard"
            style={{ 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              color: 'success.main',
              textDecoration: 'none'
            }}
          >
            Go to Dashboard →
          </Link>
        </Box>
      </Alert>
    );
  }

  if (searchParams?.canceled) {
    console.log("BillingClientComponent: Rendering canceled message");
    return (
      <Alert severity="warning" sx={{ borderRadius: 2, p: 2 }}>
        <AlertTitle sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'warning.dark' }}>
          Payment canceled
        </AlertTitle>
        <Typography sx={{ mt: 1, color: 'warning.dark' }}>
          Your payment was canceled. You can try again or choose a different plan.
        </Typography>
      </Alert>
    );
  }

  console.log("BillingClientComponent: Rendering main component");
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Billing & Subscription
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>Debug: Main component rendering</Typography>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Overview" />
        <Tab label="Usage" />
        <Tab label="Plans" />
      </Tabs>
      
      {activeTab === 0 && (
        <Box className="space-y-6">
          {/* Current Plan Section */}
          <Card>
            <CardHeader>
              <Typography variant="h5">Current Plan</Typography>
              <Typography variant="body2" color="text.secondary">Your current subscription details</Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Plan</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{user?.plan || 'Free'}</Typography>
                  </Box>
                  {user?.stripeCustomerId && (
                    <Button
                      onClick={async () => {
                        const response = await fetch('/api/billing/create-portal-session', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                        });
                        const { url } = await response.json();
                        if (url) window.location.href = url;
                      }}
                      variant="outlined"
                    >
                      Manage Subscription
                    </Button>
                  )}
                </Box>
                {user?.stripeCurrentPeriodEnd && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Next Billing Date</Typography>
                    <Typography variant="h6">
                      {format(new Date(user.stripeCurrentPeriodEnd), 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <Typography variant="h5">Usage Statistics</Typography>
              <Typography variant="body2" color="text.secondary">Your current usage and limits</Typography>
            </CardHeader>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp style={{ height: 20, width: 20, color: 'var(--mui-palette-text-secondary)' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Scheduled Posts</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{user?._count.posts || 0}</Typography>
                    <LinearProgress variant="determinate" value={postUsage} sx={{ height: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      {user?.plan === 'Free' ? 'Limited to 5 posts' : 'Unlimited posts'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCard style={{ height: 20, width: 20, color: 'var(--mui-palette-text-secondary)' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Connected Accounts</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{user?._count.socialAccounts || 0}</Typography>
                    <LinearProgress variant="determinate" value={accountUsage} sx={{ height: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      {user?.plan === 'Free' ? 'Limited to 2 accounts' : 'Unlimited accounts'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Upcoming Charges */}
          {upcomingCharges && (
            <Card>
              <CardHeader>
                <Typography variant="h5">Upcoming Charges</Typography>
                <Typography variant="body2" color="text.secondary">Your next billing details</Typography>
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {upcomingCharges.map((charge: any) => (
                    <Box key={charge.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{charge.description}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(charge.date * 1000), 'MMMM d, yyyy')}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>${(charge.amount / 100).toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          {paymentHistory && (
            <Card>
              <CardHeader>
                <Typography variant="h5">Payment History</Typography>
                <Typography variant="body2" color="text.secondary">Your recent transactions</Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(payment.date * 1000), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className={`font-medium ${payment.status === 'succeeded' ? 'text-green-600' : 'text-red-600'}`}>
                          ${(payment.amount / 100).toFixed(2)}
                        </p>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => window.open(payment.invoice_pdf, '_blank')}
                        >
                          <History className="h-4 w-4 mr-2" />
                          View Invoice
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h4">Usage Analytics</Typography>
            <div className="flex gap-2">
              <Button variant="outlined" size="small" onClick={() => window.print()}>
                <FileText className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outlined" size="small" onClick={() => {
                const data = {
                  posts: user?._count.posts || 0,
                  accounts: user?._count.socialAccounts || 0,
                  plan: user?.plan || 'Free',
                  usage: {
                    posts: postUsage,
                    accounts: accountUsage,
                  },
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `usage-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <Typography variant="h5">Content Performance</Typography>
              <Typography variant="body2" color="text.secondary">Track your content engagement and reach</Typography>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">Engagement Rate</p>
                  </div>
                  <div className="h-[200px] bg-muted bg-opacity-20 rounded-lg p-4">
                    <div className="h-full flex items-end gap-2">
                      {[30, 45, 60, 75, 90, 85, 70].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-primary bg-opacity-20 hover:bg-primary hover:bg-opacity-30 transition-colors rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">Reach</p>
                  </div>
                  <div className="h-[200px] bg-muted bg-opacity-20 rounded-lg p-4">
                    <div className="h-full flex items-end gap-2">
                      {[40, 55, 70, 85, 95, 80, 65].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-blue-500 bg-opacity-20 hover:bg-blue-500 hover:bg-opacity-30 transition-colors rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">Follower Growth</p>
                  </div>
                  <div className="h-[200px] bg-muted bg-opacity-20 rounded-lg p-4">
                    <div className="h-full flex items-end gap-2">
                      {[20, 35, 50, 65, 80, 95, 90].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-green-500 bg-opacity-20 hover:bg-green-500 hover:bg-opacity-30 transition-colors rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 2 && (
          <Box className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h4">Subscription Plans</Typography>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Billing:</span>
              <div className="flex items-center space-x-2 bg-muted p-1 rounded-md">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${billingFrequency === 'monthly' ? 'bg-white shadow' : ''}`}
                  onClick={() => setBillingFrequency('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${billingFrequency === 'yearly' ? 'bg-white shadow' : ''}`}
                  onClick={() => setBillingFrequency('yearly')}
                >
                  Yearly <span className="text-xs text-green-600">Save 20%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <Card key={`${tier.name}-${index}`} className={tier.mostPopular ? 'border-primary' : ''}>
                {tier.mostPopular && (
                  <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <Typography variant="h5">{tier.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{tier.description}</Typography>
                  <div className="mt-4">
                    <p className="text-3xl font-bold">
                      {billingFrequency === 'monthly' ? tier.price : tier.yearlyPrice || tier.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{billingFrequency === 'monthly' ? 'month' : 'year'}
                      </span>
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
                    onClick={async () => {
                      const priceId = billingFrequency === 'monthly' ? tier.id : tier.yearlyId;
                      try {
                        const response = await fetch('/api/billing/create-checkout-session', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ priceId }),
                        });
                        const data = await response.json();
                        if (data.url) {
                          window.location.href = data.url;
                        } else {
                          alert('Failed to create checkout session.');
                        }
                      } catch (err) {
                        alert('An error occurred while starting checkout.');
                      }
                    }}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          </Box>
        )}
    </Container>
  );
}