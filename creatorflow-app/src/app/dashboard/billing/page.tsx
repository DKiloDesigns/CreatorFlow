import { getSession } from "@/auth"
import Link from "next/link"
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createPortalSession } from './actions'
import { ArrowRight, CreditCard, History, TrendingUp, BarChart3, Users, Zap, Download, FileText, BarChart2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

const tiers = [
  {
    name: 'Basic',
    id: process.env.STRIPE_PRICE_BASIC!,
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
    id: process.env.STRIPE_PRICE_PRO!,
    price: '$29',
    description: 'Best for growing creators',
    features: [
      'Unlimited posts',
      '5 social media accounts',
      'Advanced analytics',
      'AI content suggestions',
      'Priority support',
    ],
    cta: 'Get Pro',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: process.env.STRIPE_PRICE_ENTERPRISE!,
    price: '$99',
    description: 'For professional content teams',
    features: [
      'Everything in Pro',
      'Unlimited social accounts',
      'Team collaboration',
      'Custom templates',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    mostPopular: false,
  },
]

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string }
}) {
  const session = await getSession()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      stripeCustomerId: true,
      plan: true,
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      _count: {
        select: {
          posts: true,
          socialAccounts: true,
        },
      },
    },
  })

  // Get upcoming charges
  const upcomingCharges = user?.stripeSubscriptionId ? await fetch(`${process.env.NEXTAUTH_URL}/api/billing/upcoming-charges`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()) : null

  // Get payment history
  const paymentHistory = user?.stripeCustomerId ? await fetch(`${process.env.NEXTAUTH_URL}/api/billing/payment-history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()) : null

  // Calculate usage percentages
  const postLimit = user?.plan === 'Free' ? 5 : user?.plan === 'Basic' ? 10 : Infinity
  const accountLimit = user?.plan === 'Free' ? 2 : user?.plan === 'Basic' ? 5 : Infinity
  const postUsage = Math.min((user?._count.posts || 0) / postLimit * 100, 100)
  const accountUsage = Math.min((user?._count.socialAccounts || 0) / accountLimit * 100, 100)

  // Show success/cancel messages
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
    )
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
    )
  }

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

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
                        'use server'
                        const { url } = await createPortalSession()
                        if (url) window.location.href = url
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
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `usage-report-${format(new Date(), 'yyyy-MM-dd')}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
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
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
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
                  <div className="h-[200px] bg-muted bg-opacity-20 rounded-lg p-4">
                    <div className="h-full flex items-end gap-2">
                      {[20, 35, 50, 65, 80, 95, 110].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-green-500 bg-opacity-20 hover:bg-green-500 hover:bg-opacity-30 transition-colors rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
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
                  <div className="h-[200px] bg-muted bg-opacity-20 rounded-lg p-4">
                    <div className="h-full flex items-end gap-2">
                      {[15, 25, 35, 45, 55, 65, 75].map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-blue-500 bg-opacity-20 hover:bg-blue-500 hover:bg-opacity-30 transition-colors rounded-t"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    New followers: 245 (+8% this week)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Performance optimization suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Content Optimization</p>
                    <span className="text-green-500">+15%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Suggested improvements for your content strategy
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Best Posting Times</p>
                    <span className="text-green-500">+25%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Optimized schedule for maximum engagement
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Hashtag Performance</p>
                    <span className="text-green-500">+10%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Trending hashtags in your niche
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card key={tier.id} className={tier.mostPopular ? 'border-primary' : ''}>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  {tier.mostPopular && (
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-primary bg-opacity-10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Most Popular
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <p className="text-4xl font-bold">{tier.price}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <form action={async () => {
                    'use server'
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/billing/create-checkout-session`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        priceId: tier.id,
                      }),
                    })

                    const { url } = await response.json()
                    if (url) {
                      redirect(url)
                    }
                  }}>
                    <Button
                      type="submit"
                      className="w-full mt-6"
                      variant={tier.mostPopular ? 'default' : 'outline'}
                    >
                      {tier.cta}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 