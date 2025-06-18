import { getSession } from "@/auth";
import { prisma } from '@/lib/prisma';
import BillingClient from './BillingClient';
import { Metadata } from "next";

type BillingPageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: "Billing & Subscription",
  description: "Manage your billing and subscription details",
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const session = await getSession();
  
  if (!session?.user) {
    return <div className="p-8 text-center">Please sign in to view billing information.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
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
  });

  if (!user) {
    return <div className="p-8 text-center text-red-600">User not found. Please contact support.</div>;
  }

  // Fetch upcoming charges
  let upcomingCharges = null;
  if (user?.stripeSubscriptionId) {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/billing/upcoming-charges`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      upcomingCharges = await res.json();
    } catch (e) {
      upcomingCharges = null;
    }
  }

  // Fetch payment history
  let paymentHistory = null;
  if (user?.stripeCustomerId) {
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/billing/payment-history`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      paymentHistory = await res.json();
    } catch (e) {
      paymentHistory = null;
    }
  }

  // Serialize the data to avoid "cannot be serialized as JSON" errors
  const serializedData = {
    user: {
      ...user,
      stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd ? user.stripeCurrentPeriodEnd.toISOString() : null,
    },
    searchParams,
    upcomingCharges,
    paymentHistory,
  };

  return (
    <div>
      <BillingClient {...serializedData} />
    </div>
  );
} 