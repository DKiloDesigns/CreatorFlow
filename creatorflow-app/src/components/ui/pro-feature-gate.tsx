'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Divider,
  Alert,
  AlertTitle,
  Grid
} from '@mui/material';
import {
  Lock as LockIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpwardIcon,
  CheckCircle as CheckCircleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { User极Plan, PLAN_FEATURES, PLAN_HIERARCHY } from '@/lib/plan-validation';

interface ProFeatureGateProps {
  featureId: string;
  userPlan: User极Plan;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  className?: string;
}

export function ProFeatureGate({
  featureId,
  userPlan,
  children,
  fallback,
  showUpgradePrompt = true,
  className = ''
}: ProFeatureGateProps) {
  const router = useRouter();
  const feature = PLAN_FEATURES[featureId];
  
  if (!feature) {
    console.warn(`Feature ${featureId} not found in PLAN_FEATURES`);
    return <>{children}</>;
  }

  const hasAccess = PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[feature.requiredPlan];

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <Box className={className}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Icon */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                mb: 2
              }}
            >
              {featureId === 'smart-workflow' ? (
                <AutoAwesomeIcon size={32} color="white" />
              ) : featureId === 'ai-content-generation' ? (
                <BoltIcon size={32} color="white" />
              ) : (
                <LockIcon size={32} color="white" />
              )}
            </Box>
          </Box>

          {/* Title */}
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            {feature.name}
          </Typography>

          {/* Description */}
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 500, mx: 'auto' }}>
            {feature.description}
          </Typography>

          {/* Plan Badge */}
          <Box sx={{ mb: 3 }}>
            <Chip
              icon={<StarIcon />}
              label={`${feature.requiredPlan} Feature`}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: 'white'
                }
              }}
            />
          </Box>

          {/* Upgrade CTA */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowUpwardIcon />}
              onClick={() => router.push('/dashboard/billing')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Upgrade to {feature.requiredPlan}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/pricing')}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              View Pricing
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Feature Benefits */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          What you'll get with {feature.requiredPlan}:
        </Typography>
        
        <Grid container spacing={2}>
          {getFeatureBenefits(featureId).map((benefit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <CheckCircleIcon size={24} color="#4caf50" />
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {benefit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function getFeatureBenefits(featureId: string): string[] {
  const benefits: Record<string, string[]> = {
    'smart-workflow': [
      'AI-Powered Content Ideation',
      'Smart Caption Generation',
      'Advanced Hashtag Research',
      'Content Performance Prediction',
      'Optimal Posting Time Analysis',
      'Unified Content Workflow'
    ],
    'ai-content-generation': [
      'Unlimited AI Content Generation',
      'Multi-Platform Optimization',
      'Brand Voice Consistency',
      'Content Performance Insights',
      'Advanced AI Models',
      'Custom AI Prompts'
    ],
    'advanced-analytics': [
      'Detailed Performance Metrics',
      'Cross-Platform Analytics',
      'Audience Insights',
      'Content Performance Trends',
      'ROI Tracking',
      'Custom Reports'
    ],
    'team-collaboration': [
      'Unlimited Team Members',
      'Role-Based Permissions',
      'Content Approval Workflows',
      'Team Performance Analytics',
      'Collaborative Content Planning',
      'Client Management'
    ]
  };

  return benefits[featureId] || [];
}
