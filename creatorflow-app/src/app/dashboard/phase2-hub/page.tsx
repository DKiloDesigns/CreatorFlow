"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  AlertTitle,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AutoAwesome,
  Brain,
  TrendingUp,
  ContentCopy,
  Schedule,
  Analytics,
  Rocket,
  Lightbulb,
  CheckCircle,
  Star
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { designTokens } from '@/lib/design-system';

// Phase 2 feature interface
interface Phase2Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  status: 'available' | 'coming-soon' | 'pro';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  aiPowered: boolean;
  proFeature: boolean;
}

export default function Phase2HubPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
  const [userOnboarding, setUserOnboarding] = useState<any>(null);

  // Phase 2 features
  const phase2Features: Phase2Feature[] = [
    {
      id: 'ai-content-creation',
      title: 'AI Content Creation',
      description: 'Create, optimize, and enhance content with AI assistance. Get performance predictions, engagement insights, and optimization recommendations.',
      icon: ContentCopy,
      route: '/dashboard/phase2-hub/ai-content-creation',
      status: 'available',
      difficulty: 'beginner',
      estimatedTime: '5-10 min',
      aiPowered: true,
      proFeature: false
    },
    {
      id: 'smart-scheduling',
      title: 'Smart Scheduling',
      description: 'AI-powered optimal timing recommendations and automated scheduling rules. Maximize engagement with data-driven posting strategies.',
      icon: Schedule,
      route: '/dashboard/phase2-hub/smart-scheduling',
      status: 'available',
      difficulty: 'intermediate',
      estimatedTime: '10-15 min',
      aiPowered: true,
      proFeature: false
    },
    {
      id: 'performance-tracking',
      title: 'Performance Tracking',
      description: 'Real-time analytics with AI insights and recommendations. Track content performance and get actionable optimization tips.',
      icon: Analytics,
      route: '/dashboard/phase2-hub/performance-tracking',
      status: 'available',
      difficulty: 'intermediate',
      estimatedTime: '8-12 min',
      aiPowered: true,
      proFeature: false
    },
    {
      id: 'ai-optimization-hub',
      title: 'AI Optimization Hub',
      description: 'Centralized AI-powered content optimization tools. Batch optimize content, A/B test variations, and improve performance.',
      icon: Brain,
      route: '/dashboard/phase2-hub/ai-optimization',
      status: 'coming-soon',
      difficulty: 'advanced',
      estimatedTime: '15-20 min',
      aiPowered: true,
      proFeature: true
    },
    {
      id: 'content-strategy-ai',
      title: 'Content Strategy AI',
      description: 'AI-powered content strategy planning and audience analysis. Get strategic recommendations for content themes and topics.',
      icon: TrendingUp,
      route: '/dashboard/phase2-hub/content-strategy',
      status: 'coming-soon',
      difficulty: 'intermediate',
      estimatedTime: '12-18 min',
      aiPowered: true,
      proFeature: true
    },
    {
      id: 'automated-workflows',
      title: 'Automated Workflows',
      description: 'Create intelligent content workflows with AI automation. Streamline your content creation and publishing process.',
      icon: Rocket,
      route: '/dashboard/phase2-hub/automated-workflows',
      status: 'coming-soon',
      difficulty: 'advanced',
      estimatedTime: '20-30 min',
      aiPowered: true,
      proFeature: true
    }
  ];

  useEffect(() => {
    // Simulate loading and fetch user onboarding status
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock user onboarding data
      setUserOnboarding({
        phase: 2,
        completedFeatures: ['ai-content-creation'],
        currentFeature: 'smart-scheduling',
        progress: 33,
        nextSteps: ['Complete Smart Scheduling setup', 'Test Performance Tracking', 'Explore AI Optimization']
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFeatureClick = (feature: Phase2Feature) => {
    if (feature.status === 'available') {
      router.push(feature.route);
    } else if (feature.status === 'pro') {
      // Handle Pro feature upgrade
      router.push('/dashboard/billing');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return designTokens.colors.success[500];
      case 'coming-soon':
        return designTokens.colors.warning[500];
      case 'pro':
        return designTokens.colors.ai[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return designTokens.colors.success[500];
      case 'intermediate':
        return designTokens.colors.warning[500];
      case 'advanced':
        return designTokens.colors.error[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid xs={12} md={6} lg={4} key={item}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.primary[600]
            }}
          >
            <AutoAwesome sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.bold,
                color: designTokens.colors.neutral[900],
                mb: 1
              }}
            >
              Phase 2: AI-Enhanced Content Creation
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Transform your content creation with AI-powered tools and insights
            </Typography>
          </Box>
        </Box>

        {/* Progress Indicator */}
        {userOnboarding && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                Your Progress: Phase 2
              </Typography>
              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                {userOnboarding.progress}% Complete
              </Typography>
            </Box>
            <Box sx={{ 
              width: '100%', 
              height: 8, 
              background: designTokens.colors.neutral[200], 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <Box 
                sx={{ 
                  width: `${userOnboarding.progress}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
                  transition: 'width 0.5s ease-in-out'
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mt: 1 }}>
              Next: {userOnboarding.nextSteps[0]}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Welcome Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.primary[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.primary[700] }}>
          🚀 Welcome to Phase 2!
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.primary[700] }}>
          You're now ready to experience AI-enhanced content creation. Start with AI Content Creation to get familiar with the new features, 
          then explore Smart Scheduling and Performance Tracking. Each tool is designed to work seamlessly with your existing workflow.
        </Typography>
      </Alert>

      {/* Features Grid */}
      <Grid container spacing={3}>
        {phase2Features.map((feature, index) => (
          <Grid xs={12} md={6} lg={4} key={feature.id}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.xl,
                transition: designTokens.animation.micro.cardHover,
                cursor: feature.status === 'available' ? 'pointer' : 'default',
                '&:hover': feature.status === 'available' ? {
                  boxShadow: designTokens.shadows.lg,
                  transform: 'translateY(-4px)',
                  borderColor: designTokens.colors.primary[300]
                } : {},
                position: 'relative',
                overflow: 'visible'
              }}
              onClick={() => handleFeatureClick(feature)}
            >
              {/* Status Badge */}
              <Box sx={{ position: 'absolute', top: -8, right: 16 }}>
                <Chip
                  label={feature.status === 'available' ? 'Available' : 
                         feature.status === 'coming-soon' ? 'Coming Soon' : 'PRO'}
                  size="small"
                  sx={{
                    background: getStatusColor(feature.status),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    '& .MuiChip-label': {
                      px: 1.5
                    }
                  }}
                />
              </Box>

              {/* Pro Badge */}
              {feature.proFeature && (
                <Box sx={{ position: 'absolute', top: -8, left: 16 }}>
                  <Chip
                    label="PRO"
                    size="small"
                    sx={{
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                    }}
                  />
                </Box>
              )}

              <CardContent sx={{ p: 3, pt: 4 }}>
                {/* Icon */}
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: feature.aiPowered ? 
                        'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' :
                        'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      color: feature.aiPowered ? designTokens.colors.ai[600] : designTokens.colors.primary[600]
                    }}
                  >
                    <feature.icon sx={{ fontSize: 28 }} />
                  </Box>
                </Box>

                {/* Title */}
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    color: designTokens.colors.neutral[900],
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  {feature.title}
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: designTokens.colors.neutral[600],
                    mb: 3,
                    lineHeight: 1.6,
                    textAlign: 'center'
                  }}
                >
                  {feature.description}
                </Typography>

                {/* Metadata */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  <Chip
                    label={feature.difficulty}
                    size="small"
                    sx={{
                      background: `${getDifficultyColor(feature.difficulty)}15`,
                      color: getDifficultyColor(feature.difficulty),
                      fontSize: '0.6rem',
                      fontWeight: 'medium'
                    }}
                  />
                  <Chip
                    label={feature.estimatedTime}
                    size="small"
                    sx={{
                      background: designTokens.colors.neutral[100],
                      color: designTokens.colors.neutral[700],
                      fontSize: '0.6rem'
                    }}
                  />
                  {feature.aiPowered && (
                    <Chip
                      label="AI Powered"
                      size="small"
                      icon={<Brain sx={{ fontSize: 12 }} />}
                      sx={{
                        background: designTokens.colors.ai[100],
                        color: designTokens.colors.ai[700],
                        fontSize: '0.6rem'
                      }}
                    />
                  )}
                </Box>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant={feature.status === 'available' ? 'contained' : 'outlined'}
                  fullWidth
                  disabled={feature.status !== 'available'}
                  startIcon={feature.status === 'available' ? <Rocket /> : <Lightbulb />}
                  sx={{
                    background: feature.status === 'available' ? 
                      'linear-gradient(90deg, #3B82F6, #8B5CF6)' : 'transparent',
                    '&:hover': feature.status === 'available' ? {
                      background: 'linear-gradient(90deg, #2563EB, #7C3AED)'
                    } : {},
                    borderRadius: designTokens.borderRadius.lg,
                    py: 1.5
                  }}
                >
                  {feature.status === 'available' ? 'Get Started' : 
                   feature.status === 'coming-soon' ? 'Coming Soon' : 'Upgrade to Pro'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Start Guide */}
      <Box sx={{ mt: 6, p: 4, background: designTokens.colors.neutral[50], borderRadius: designTokens.borderRadius.xl }}>
        <Typography variant="h5" sx={{ mb: 3, color: designTokens.colors.neutral[900], textAlign: 'center' }}>
          🎯 Quick Start Guide
        </Typography>
        
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: designTokens.colors.success[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: designTokens.colors.success[600]
                }}
              >
                <CheckCircle sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: designTokens.colors.neutral[800] }}>
                Step 1: Create Content
              </Typography>
              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                Start with AI Content Creation to experience AI-powered content optimization and performance predictions.
              </Typography>
            </Box>
          </Grid>
          
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: designTokens.colors.primary[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: designTokens.colors.primary[600]
                }}
              >
                <Schedule sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: designTokens.colors.neutral[800] }}>
                Step 2: Schedule Smart
              </Typography>
              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                Use Smart Scheduling to find optimal posting times and create automated publishing rules.
              </Typography>
            </Box>
          </Grid>
          
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: designTokens.colors.ai[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: designTokens.colors.ai[600]
                }}
              >
                <Analytics sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: designTokens.colors.neutral[800] }}>
                Step 3: Track & Optimize
              </Typography>
              <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                Monitor performance with AI insights and get recommendations for continuous improvement.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Container>
  );
}
