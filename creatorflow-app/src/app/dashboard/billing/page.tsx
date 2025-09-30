'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import { Check, X, CreditCard, Calendar, Users, Zap, Shield, Star } from 'lucide-react';
import { PRICING_TIERS, formatPrice, calculateYearlySavings } from '@/lib/pricing';
import { toast } from 'sonner';

interface UserSubscription {
  plan: string;
  stripeSubscriptionId?: string;
  stripeCurrentPeriodEnd?: string;
  stripePriceId?: string;
}

function BillingContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth');
      return;
    }

    fetchUserSubscription();
  }, [session, status]);

  useEffect(() => {
    // Handle success/cancel from Stripe
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success) {
      toast.success('Subscription updated successfully!');
      fetchUserSubscription();
    } else if (canceled) {
      toast.error('Subscription update canceled');
    }
  }, [searchParams]);

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const user = await response.json();
        setUserSubscription({
          plan: user.plan,
          stripeSubscriptionId: user.stripeSubscriptionId,
          stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
          stripePriceId: user.stripePriceId,
        });
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierId: string, billingPeriod: 'monthly' | 'yearly') => {
    if (!session?.user?.id) return;

    setUpgrading(tierId);
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: `${tierId}_${billingPeriod}`,
          billingPeriod,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setUpgrading(null);
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

  const getCurrentTier = () => {
    return PRICING_TIERS.find(tier => tier.id === userSubscription?.plan?.toLowerCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  const currentTier = getCurrentTier();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Billing & Subscription
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your CreatorFlow subscription and billing
        </Typography>
      </Box>

      {/* Current Plan */}
      {currentTier && (
        <Card sx={{ mb: 4 }}>
          <CardHeader>
            <CardTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard size={20} />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">{currentTier.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentTier.description}
                </Typography>
                {userSubscription?.stripeCurrentPeriodEnd && (
                  <Typography variant="caption" color="text.secondary">
                    Next billing: {formatDate(userSubscription.stripeCurrentPeriodEnd)}
                  </Typography>
                )}
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(currentTier.price.monthly)}
                  <Typography component="span" variant="body2" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                {userSubscription?.stripeSubscriptionId && (
                  <Button
                    variant="outlined"
                    onClick={handleManageSubscription}
                    sx={{ mt: 1 }}
                  >
                    Manage Subscription
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Pricing Tiers */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Choose Your Plan
        </Typography>
        <Grid container spacing={3}>
          {PRICING_TIERS.map((tier) => {
            const isCurrentPlan = tier.id === userSubscription?.plan?.toLowerCase();
            const isUpgrading = upgrading === tier.id;

            return (
              <Grid item xs={12} md={4} key={tier.id}>
                <Card
                  sx={{
                    height: '100%',
                    maxWidth: 400,
                    mx: 'auto',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    ...(tier.popular && {
                      border: 2,
                      borderColor: 'primary.main',
                      boxShadow: 3,
                    }),
                    ...(isCurrentPlan && {
                      bgcolor: 'primary.50',
                    }),
                  }}
                >
                  {tier.popular && (
                    <Chip
                      label="Most Popular"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                      }}
                    />
                  )}

                  <CardHeader
                    sx={{
                      pt: tier.popular ? 3 : 2,
                      pb: 1,
                    }}
                  >
                    <CardTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{tier.name}</Typography>
                      {isCurrentPlan && (
                        <Chip label="Current Plan" color="primary" size="small" />
                      )}
                    </CardTitle>
                    <Typography variant="body2" color="text.secondary">
                      {tier.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(tier.price.monthly)}
                        <Typography component="span" variant="body2" color="text.secondary">
                          /month
                        </Typography>
                      </Typography>
                      {tier.price.yearly > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          or {formatPrice(tier.price.yearly)}/year
                          <Typography component="span" color="success.main" sx={{ ml: 1 }}>
                            (Save {calculateYearlySavings(tier.price.monthly)})
                          </Typography>
                        </Typography>
                      )}
                    </Box>
                  </CardHeader>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 2 }}>
                    <List dense sx={{ mb: 2, flexGrow: 1 }}>
                      {tier.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Check size={16} color="green" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: { 
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                lineHeight: 1.3
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
                      {!isCurrentPlan ? (
                        <>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleUpgrade(tier.id, 'monthly')}
                            disabled={isUpgrading}
                          >
                            {isUpgrading ? 'Processing...' : `Upgrade to ${tier.name}`}
                          </Button>
                          {tier.price.yearly > 0 && (
                            <Button
                              variant="outlined"
                              fullWidth
                              onClick={() => handleUpgrade(tier.id, 'yearly')}
                              disabled={isUpgrading}
                            >
                              Save with Yearly
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button fullWidth disabled>
                          Current Plan
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>Feature Comparison</CardTitle>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            Compare features across all plans
          </Typography>
        </CardHeader>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Box sx={{ minWidth: 600 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    Features
                  </Typography>
                </Grid>
                {PRICING_TIERS.map((tier) => (
                  <Grid item xs={2.67} key={tier.id}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {tier.name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>Social Media Accounts</Typography>
                </Grid>
                {PRICING_TIERS.map((tier) => (
                  <Grid item xs={2.67} key={tier.id}>
                    <Typography variant="body2" sx={{ textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {tier.limits.socialAccounts === -1 ? 'Unlimited' : tier.limits.socialAccounts}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>Posts per Month</Typography>
                </Grid>
                {PRICING_TIERS.map((tier) => (
                  <Grid item xs={2.67} key={tier.id}>
                    <Typography variant="body2" sx={{ textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {tier.limits.postsPerMonth === -1 ? 'Unlimited' : tier.limits.postsPerMonth}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>Team Members</Typography>
                </Grid>
                {PRICING_TIERS.map((tier) => (
                  <Grid item xs={2.67} key={tier.id}>
                    <Typography variant="body2" sx={{ textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {tier.limits.teamMembers === -1 ? 'Unlimited' : tier.limits.teamMembers}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>AI Content Generation</Typography>
                </Grid>
                {PRICING_TIERS.map((tier) => (
                  <Grid item xs={2.67} key={tier.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {tier.limits.aiContentGeneration ? (
                        <Check size={16} color="green" />
                      ) : (
                        <X size={16} color="gray" />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>White-Label</Typography>
                </Grid>
                {PRICING_TIERS.map((tier) => (
                  <Grid item xs={2.67} key={tier.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {tier.limits.whiteLabel ? (
                        <Check size={16} color="green" />
                      ) : (
                        <X size={16} color="gray" />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>Priority Support</Typography>
                </Grid>
                {PRICING_TIERS.map((tier) => (
                  <Grid item xs={2.67} key={tier.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      {tier.limits.prioritySupport ? (
                        <Check size={16} color="green" />
                      ) : (
                        <X size={16} color="gray" />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingContent />
    </Suspense>
  );
} 