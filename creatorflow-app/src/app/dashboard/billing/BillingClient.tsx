'use client';

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

  // Calculate usage percentages
  const postLimit = user?.plan === 'Free' ? 5 : user?.plan === 'Basic' ? 10 : Infinity;
  const accountLimit = user?.plan === 'Free' ? 2 : user?.plan === 'Basic' ? 5 : Infinity;
  const postUsage = Math.min((user?._count.posts || 0) / postLimit * 100, 100);
  const accountUsage = Math.min((user?._count.socialAccounts || 0) / accountLimit * 100, 100);

  if (searchParams.success) {
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

  if (searchParams.canceled) {
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

  return (
    <div className="container max-w-5xl py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Billing & Subscription</h1>
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Current Plan</h2>
            <p className="text-sm text-muted-foreground mb-4">Your current subscription details</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <p className="text-2xl font-bold">{user?.plan || 'Free'}</p>
                </div>
                {user?.stripeCustomerId && (
                  <Button
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
          </div>

          {/* Usage Statistics */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Usage Statistics</h2>
            <p className="text-sm text-muted-foreground mb-4">Your current usage and limits</p>
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
          </div>

          {/* Upcoming Charges */}
          {upcomingCharges && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Upcoming Charges</h2>
              <p className="text-sm text-muted-foreground mb-4">Your next billing details</p>
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
            </div>
          )}

          {/* Payment History */}
          {paymentHistory && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Payment History</h2>
              <p className="text-sm text-muted-foreground mb-4">Your recent transactions</p>
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
            </div>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 w-full">
            <h2 className="text-2xl font-bold">Usage Analytics</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="w-full sm:w-auto">
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
              }} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Content Performance</h2>
            <p className="text-sm text-muted-foreground mb-4">Track your content engagement and reach</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium">Engagement Rate</p>
                </div>
                <div className="h-[200px] rounded-lg p-4">
                  <div className="h-full flex items-end gap-2">
                    {[30, 45, 60, 75, 90, 85, 70].map((value, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors rounded-t"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span key="mon">Mon</span>
                    <span key="tue">Tue</span>
                    <span key="wed">Wed</span>
                    <span key="thu">Thu</span>
                    <span key="fri">Fri</span>
                    <span key="sat">Sat</span>
                    <span key="sun">Sun</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Average engagement rate: 4.2%
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium">Reach Growth</p>
                </div>
                <div className="h-[200px] rounded-lg p-4">
                  <div className="h-full flex items-end gap-2">
                    {[20, 35, 50, 65, 80, 95, 110].map((value, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors rounded-t"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span key="mon2">Mon</span>
                    <span key="tue2">Tue</span>
                    <span key="wed2">Wed</span>
                    <span key="thu2">Thu</span>
                    <span key="fri2">Fri</span>
                    <span key="sat2">Sat</span>
                    <span key="sun2">Sun</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total reach: 12.5K (+15% this week)
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium">Audience Growth</p>
                </div>
                <div className="h-[200px] rounded-lg p-4">
                  <div className="h-full flex items-end gap-2">
                    {[15, 25, 35, 45, 55, 65, 75].map((value, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors rounded-t"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span key="mon3">Mon</span>
                    <span key="tue3">Tue</span>
                    <span key="wed3">Wed</span>
                    <span key="thu3">Thu</span>
                    <span key="fri3">Fri</span>
                    <span key="sat3">Sat</span>
                    <span key="sun3">Sun</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  New followers: 245 (+8% this week)
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">AI-Powered Insights</h2>
            <p className="text-sm text-muted-foreground mb-4">Performance optimization suggestions</p>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Content Optimization</p>
                  <span className="text-green-500">+15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: '75%' }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Suggested improvements for your content strategy
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Best Posting Times</p>
                  <span className="text-green-500">+25%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: '85%' }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimized schedule for maximum engagement
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Hashtag Performance</p>
                  <span className="text-green-500">+10%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: '60%' }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Trending hashtags in your niche
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4 sm:space-y-6">
          {/* Billing Frequency Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <span className={billingFrequency === 'monthly' ? 'font-bold' : ''}>Monthly</span>
            <button
              className="bg-gray-200 rounded-full px-3 py-1 text-sm"
              onClick={() => setBillingFrequency(billingFrequency === 'monthly' ? 'yearly' : 'monthly')}
            >
              Switch to {billingFrequency === 'monthly' ? 'Yearly' : 'Monthly'}
            </button>
            <span className={billingFrequency === 'yearly' ? 'font-bold' : ''}>Yearly</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {tiers.map((tier) => (
              <Card key={tier.id} className={tier.mostPopular ? 'border-primary' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">{tier.description}</CardDescription>
                  {tier.mostPopular && (
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2.5 py-0.5 text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <p className="text-3xl sm:text-4xl font-bold">
                      {billingFrequency === 'monthly' ? tier.price : tier.yearlyPrice}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      per {billingFrequency === 'monthly' ? 'month' : 'year'}
                    </p>
                  </div>
                  <ul className="mt-6 space-y-3 sm:space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-6 w-full ${tier.cta === 'Get Pro' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' : ''}`}
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
                          toast.success('Redirecting to checkout...');
                          window.location.href = data.url;
                        } else {
                          toast.error('Failed to create checkout session.');
                        }
                      } catch (err) {
                        toast.error('An error occurred while starting checkout.');
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