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
  Psychology,
  TrendingUp,
  ContentCopy,
  Schedule,
  Analytics,
  Rocket,
  Lightbulb,
  CheckCircle,
  Star,
  SmartToy,
  Hub,
  Code
} from '@/lib/mui-optimized-imports';
import { useRouter } from 'next/navigation';
import { designTokens } from '@/lib/design-system';

// Phase 3 feature interface
interface Phase3Feature {
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
  category: 'automation' | 'intelligence' | 'workflow' | 'integration';
}

export default function Phase3HubPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
  const [userOnboarding, setUserOnboarding] = useState<any>(null);

  // Phase 3 features
  const phase3Features: Phase3Feature[] = [
    {
      id: 'ai-workflow-automation',
      title: 'AI Workflow Automation',
      description: 'Create intelligent, self-optimizing content workflows that adapt to performance data and user behavior.',
      icon: SmartToy,
      route: '/dashboard/phase3-hub/ai-workflow-automation',
      status: 'available',
      difficulty: 'advanced',
      estimatedTime: '15-25 min',
      aiPowered: true,
      proFeature: true,
      category: 'automation'
    },
    {
      id: 'predictive-content-intelligence',
      title: 'Predictive Content Intelligence',
      description: 'Advanced AI that predicts content performance, audience behavior, and optimal publishing strategies.',
      icon: Psychology,
      route: '/dashboard/phase3-hub/predictive-content-intelligence',
      status: 'available',
      difficulty: 'advanced',
      estimatedTime: '20-30 min',
      aiPowered: true,
      proFeature: true,
      category: 'intelligence'
    },
    {
      id: 'cross-platform-optimization',
      title: 'Cross-Platform Optimization',
      description: 'AI-powered content adaptation and optimization across multiple social media platforms simultaneously.',
      icon: Hub,
      route: '/dashboard/phase3-hub/cross-platform-optimization',
      status: 'available',
      difficulty: 'intermediate',
      estimatedTime: '12-18 min',
      aiPowered: true,
      proFeature: false,
      category: 'automation'
    },
    {
      id: 'ai-content-generation',
      title: 'AI Content Generation',
      description: 'Generate high-quality content variations, captions, and hashtags using advanced language models.',
      icon: ContentCopy,
      route: '/dashboard/phase3-hub/ai-content-generation',
      status: 'available',
      difficulty: 'intermediate',
      estimatedTime: '10-15 min',
      aiPowered: true,
      proFeature: false,
      category: 'intelligence'
    },
    {
      id: 'automated-a-b-testing',
      title: 'Automated A/B Testing',
      description: 'AI-driven content testing that automatically identifies winning variations and optimizes performance.',
      icon: Analytics,
      route: '/dashboard/phase3-hub/automated-ab-testing',
      status: 'coming-soon',
      difficulty: 'advanced',
      estimatedTime: '18-25 min',
      aiPowered: true,
      proFeature: true,
      category: 'automation'
    },
    {
      id: 'intelligent-scheduling-ai',
      title: 'Intelligent Scheduling AI',
      description: 'Advanced scheduling that learns from audience behavior and automatically adjusts posting times.',
      icon: Schedule,
      route: '/dashboard/phase3-hub/intelligent-scheduling-ai',
      status: 'coming-soon',
      difficulty: 'intermediate',
      estimatedTime: '15-20 min',
      aiPowered: true,
      proFeature: true,
      category: 'automation'
    },
    {
      id: 'ai-audience-insights',
      title: 'AI Audience Insights',
      description: 'Deep audience analysis with AI-powered segmentation, behavior prediction, and content recommendations.',
      icon: TrendingUp,
      route: '/dashboard/phase3-hub/ai-audience-insights',
      status: 'available',
      difficulty: 'intermediate',
      estimatedTime: '12-18 min',
      aiPowered: true,
      proFeature: false,
      category: 'intelligence'
    },
    {
      id: 'content-performance-ai',
      title: 'Content Performance AI',
      description: 'AI-powered content analysis that provides actionable insights and optimization recommendations.',
      icon: Psychology,
      route: '/dashboard/phase3-hub/content-performance-ai',
      status: 'available',
      difficulty: 'intermediate',
      estimatedTime: '10-15 min',
      aiPowered: true,
      proFeature: false,
      category: 'intelligence'
    }
  ];

  useEffect(() => {
    // Simulate loading and fetch user onboarding status
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock user onboarding data
      setUserOnboarding({
        phase: 3,
        completedFeatures: ['ai-workflow-automation'],
        currentFeature: 'predictive-content-intelligence',
        progress: 25,
        nextSteps: ['Complete Predictive Content Intelligence setup', 'Test Cross-Platform Optimization', 'Explore AI Workflow Automation']
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFeatureClick = (feature: Phase3Feature) => {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation':
        return designTokens.colors.ai[500];
      case 'intelligence':
        return designTokens.colors.primary[500];
      case 'optimization':
        return designTokens.colors.success[500];
      case 'generation':
        return designTokens.colors.secondary[500];
      case 'testing':
        return designTokens.colors.warning[500];
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.ai[600]
            }}
          >
            <SmartToy sx={{ fontSize: 32 }} />
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
              Phase 3: Advanced AI & Automation
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Unleash the full power of AI with advanced automation and intelligent workflows
            </Typography>
          </Box>
        </Box>

        {/* Progress Indicator */}
        {userOnboarding && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                Your Progress: Phase 3
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
                  background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
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
          background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.ai[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.ai[700] }}>
          🚀 Welcome to Phase 3!
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.ai[700] }}>
          You're now entering the realm of advanced AI and automation. These features represent the cutting edge of content creation technology, 
          designed to transform your workflow from manual to intelligent. Start with AI Workflow Automation to experience the future of content management.
        </Typography>
      </Alert>

      {/* Features Grid */}
      <Grid container spacing={3}>
        {phase3Features.map((feature, index) => (
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
                  borderColor: designTokens.colors.ai[300]
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

              {/* Category Badge */}
              <Box sx={{ position: 'absolute', top: 24, left: 16 }}>
                <Chip
                  label={feature.category.charAt(0).toUpperCase() + feature.category.slice(1)}
                  size="small"
                  sx={{
                    background: `${getCategoryColor(feature.category)}15`,
                    color: getCategoryColor(feature.category),
                    fontSize: '0.6rem',
                    fontWeight: 'medium',
                    textTransform: 'capitalize'
                  }}
                />
              </Box>

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
                      icon={<Psychology sx={{ fontSize: 12 }} />}
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
                      'linear-gradient(90deg, #06B6D4, #8B5CF6)' : 'transparent',
                    '&:hover': feature.status === 'available' ? {
                      background: 'linear-gradient(90deg, #0891B2, #7C3AED)'
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

      {/* Advanced Features Guide */}
      <Box sx={{ mt: 6, p: 4, background: designTokens.colors.ai[50], borderRadius: designTokens.borderRadius.xl }}>
        <Typography variant="h5" sx={{ mb: 3, color: designTokens.colors.ai[900], textAlign: 'center' }}>
          🎯 Advanced AI Features Guide
        </Typography>
        
        <Grid container spacing={3}>
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
                <SmartToy sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: designTokens.colors.ai[800] }}>
                Automation First
              </Typography>
              <Typography variant="body2" sx={{ color: designTokens.colors.ai[700] }}>
                Start with AI Workflow Automation to create intelligent, self-optimizing content workflows that adapt to performance data.
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
                <Psychology sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: designTokens.colors.primary[800] }}>
                Intelligence Deep
              </Typography>
              <Typography variant="body2" sx={{ color: designTokens.colors.primary[700] }}>
                Use Predictive Content Intelligence to understand audience behavior and optimize your content strategy with AI insights.
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
                  background: designTokens.colors.success[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: designTokens.colors.success[600]
                }}
              >
                <Hub sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: designTokens.colors.success[800] }}>
                Cross-Platform Sync
              </Typography>
              <Typography variant="body2" sx={{ color: designTokens.colors.success[700] }}>
                Leverage Cross-Platform Optimization to ensure your content performs optimally across all social media platforms.
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
