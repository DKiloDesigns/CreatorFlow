'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
  Button,
  Chip,
  Box,
  Alert,
} from '@mui/material';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  Zap, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getPricingTier, formatPrice } from '@/lib/pricing';
import { toast } from 'sonner';

interface UserSubscription {
  plan: string;
  stripeSubscriptionId?: string;
  stripeCurrentPeriodEnd?: string;
  stripePriceId?: string;
  paymentRetryCount?: number;
  paymentRetryDate?: string;
}

interface SubscriptionStatusProps {
  className?: string;
  showUpgrade?: boolean;
}

export default function SubscriptionStatus({ 
  className = '', 
  showUpgrade = true 
}: SubscriptionStatusProps) {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscription();
    }
  }, [session]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const user = await response.json();
        setSubscription({
          plan: user.plan,
          stripeSubscriptionId: user.stripeSubscriptionId,
          stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
          stripePriceId: user.stripePriceId,
          paymentRetryCount: user.paymentRetryCount,
          paymentRetryDate: user.paymentRetryDate,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/billing/customer-portal', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to open customer portal');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open customer portal');
    }
  };

  if (loading) {
    return (
      <Card sx={{ ...(className && { className }) }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
            <Box sx={{ width: '60%', height: 16, bgcolor: 'grey.300', borderRadius: 1 }} />
          </Box>
          <Box sx={{ width: '40%', height: 12, bgcolor: 'grey.300', borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return null;
  }

  const currentTier = getPricingTier(subscription.plan.toLowerCase());
  const isPaymentFailed = subscription.paymentRetryCount && subscription.paymentRetryCount > 0;
  const isTrial = subscription.plan === 'FREE' && subscription.stripeSubscriptionId;

  const getStatusColor = () => {
    if (isPaymentFailed) return 'error';
    if (subscription.plan === 'FREE') return 'default';
    if (subscription.plan === 'PRO') return 'primary';
    if (subscription.plan === 'ENTERPRISE') return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isPaymentFailed) return <XCircle size={16} />;
    if (subscription.plan === 'FREE') return <Shield size={16} />;
    if (subscription.plan === 'PRO') return <Zap size={16} />;
    if (subscription.plan === 'ENTERPRISE') return <Users size={16} />;
    return <Shield size={16} />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilRenewal = () => {
    if (!subscription.stripeCurrentPeriodEnd) return null;
    const endDate = new Date(subscription.stripeCurrentPeriodEnd);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilRenewal = getDaysUntilRenewal();

  return (
    <Card sx={{ ...(className && { className }) }}>
      <CardHeader sx={{ pb: 1 }}>
        <CardTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem' }}>
          <CreditCard size={16} />
          Subscription Status
        </CardTitle>
      </CardHeader>
      <CardContent sx={{ '& > * + *': { mt: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon()}
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {currentTier?.name || subscription.plan}
            </Typography>
            <Chip 
              label={isPaymentFailed ? 'Payment Failed' : 
                     isTrial ? 'Trial' : 
                     subscription.plan === 'FREE' ? 'Free' : 'Active'}
              color={getStatusColor() as any}
              size="small"
            />
          </Box>
          {currentTier && (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatPrice(currentTier.price.monthly)}
              <Typography component="span" variant="caption" color="text.secondary">
                /mo
              </Typography>
            </Typography>
          )}
        </Box>

        {subscription.stripeCurrentPeriodEnd && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} />
            <Typography variant="caption" color="text.secondary">
              {daysUntilRenewal && daysUntilRenewal > 0 ? (
                `Renews in ${daysUntilRenewal} day${daysUntilRenewal !== 1 ? 's' : ''}`
              ) : (
                `Renews ${formatDate(subscription.stripeCurrentPeriodEnd)}`
              )}
            </Typography>
          </Box>
        )}

        {isPaymentFailed && (
          <Alert severity="error" sx={{ py: 0.5 }}>
            <Typography variant="caption">
              Payment failed. Please update your payment method.
            </Typography>
          </Alert>
        )}

        {showUpgrade && subscription.plan === 'FREE' && (
          <Button 
            size="small" 
            fullWidth
            onClick={() => window.location.href = '/dashboard/billing'}
          >
            Upgrade Plan
          </Button>
        )}

        {subscription.stripeSubscriptionId && (
          <Button 
            variant="outlined" 
            size="small" 
            fullWidth
            onClick={handleManageSubscription}
          >
            Manage Billing
          </Button>
        )}

        {/* Feature Limits Preview */}
        {currentTier && (
          <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Current limits:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Users size={12} />
                <Typography variant="caption">
                  {currentTier.limits.socialAccounts === -1 ? '∞' : currentTier.limits.socialAccounts} accounts
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Zap size={12} />
                <Typography variant="caption">
                  {currentTier.limits.postsPerMonth === -1 ? '∞' : currentTier.limits.postsPerMonth} posts/mo
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}