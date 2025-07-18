"use client";
import Link from "next/link";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createPortalSession } from './actions';
import { ArrowRight, CreditCard, History, TrendingUp, BarChart3, Users, Zap, Download, FileText, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Payment successful!</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Your subscription has been activated. You can now access all premium features.</p>
            </div>
            <div className="mt-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (searchParams?.canceled) {
    console.log("BillingClientComponent: Rendering canceled message");
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Payment canceled</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Your payment was canceled. You can try again or choose a different plan.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("BillingClientComponent: Rendering main component");
  
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>
      <p>Debug: Main component rendering</p>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan Section */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your current subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Plan</p>
                    <p className="text-2xl font-bold">{user?.plan || 'Free'}</p>
                  </div>
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
                      variant="outline"
                    >
                      Manage Subscription
                    </Button>
                  )}
                </div>
                {user?.stripeCurrentPeriodEnd && (
                  <div>
                    <p className="text-sm font-medium">Next Billing Date</p>
                    <p className="text-lg">
                      {format(new Date(user.stripeCurrentPeriodEnd), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Your current usage and limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">Scheduled Posts</p>
                  </div>
                  <p className="text-2xl font-bold">{user?._count.posts || 0}</p>
                  <Progress value={postUsage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {user?.plan === 'Free' ? 'Limited to 5 posts' : 'Unlimited posts'}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">Connected Accounts</p>
                  </div>
                  <p className="text-2xl font-bold">{user?._count.socialAccounts || 0}</p>
                  <Progress value={accountUsage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {user?.plan === 'Free' ? 'Limited to 2 accounts' : 'Unlimited accounts'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Charges */}
          {upcomingCharges && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Charges</CardTitle>
                <CardDescription>Your next billing details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingCharges.map((charge: any) => (
                    <div key={charge.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{charge.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(charge.date * 1000), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <p className="font-medium">${(charge.amount / 100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          {paymentHistory && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your recent transactions</CardDescription>
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
                          variant="ghost"
                          size="sm"
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
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Usage Analytics</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <FileText className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
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
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Track your content engagement and reach</CardDescription>
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
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Subscription Plans</h2>
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
            {tiers.map((tier) => (
              <Card key={tier.id} className={tier.mostPopular ? 'border-primary' : ''}>
                {tier.mostPopular && (
                  <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}