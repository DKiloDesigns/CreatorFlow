import { getSession } from "@/auth";
import { prisma } from '@/lib/prisma';
import BillingClient from './BillingClient';
import { Metadata } from "next";
import { Box, Typography, Container } from '@mui/material';

type BillingPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
  title: "Billing & Subscription",
  description: "Manage your billing and subscription details",
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const session = await getSession();
  // Await searchParams for Next.js 15 compatibility
  const resolvedSearchParams = await searchParams;
  
  if (!session?.user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography>Please sign in to view billing information.</Typography>
        </Box>
      </Container>
    );
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
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error">User not found. Please contact support.</Typography>
        </Box>
      </Container>
    );
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
    searchParams: resolvedSearchParams,
    upcomingCharges,
    paymentHistory,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: { xs: 20, sm: 8 } }}>
      <BillingClient {...serializedData} />
    </Container>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 