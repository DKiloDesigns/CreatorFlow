"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  AutoAwesome,
  Psychology,
  TrendingUp,
  ContentCopy,
  Schedule,
  Analytics,
  Settings,
  Refresh,
  CheckCircle,
  Warning,
  Info,
  Lightbulb
} from '@mui/icons-material';
import { 
  UnifiedDashboardLayout, 
  DashboardSection, 
  QuickStat, 
  AIInsight 
} from '@/components/ui';
import { designTokens } from '@/lib/design-system';

export default function UnifiedDemoPage() {
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [proStatus, setProStatus] = useState<'free' | 'pro' | 'enterprise'>('free');

  // Demo quick stats
  const demoQuickStats: QuickStat[] = [
    {
      label: 'Total Posts',
      value: '247',
      change: 12,
      trend: 'up',
      icon: ContentCopy,
      color: designTokens.colors.primary[500],
      aiInsight: 'Posts with videos perform 2.3x better'
    },
    {
      label: 'Engagement Rate',
      value: '4.2%',
      change: 0.8,
      trend: 'up',
      icon: TrendingUp,
      color: designTokens.colors.success[500],
      aiInsight: 'Your engagement is 15% above average'
    },
    {
      label: 'Reach',
      value: '89.2K',
      change: -2.1,
      trend: 'down',
      icon: TrendingUp,
      color: designTokens.colors.warning[500],
      aiInsight: 'Consider posting during peak hours (2-4 PM)'
    },
    {
      label: 'Scheduled',
      value: '12',
      change: 3,
      trend: 'up',
      icon: Schedule,
      color: designTokens.colors.secondary[500],
      aiInsight: 'Consistent posting improves algorithm favorability'
    }
  ];

  // Demo AI insights
  const demoAIInsights: AIInsight[] = [
    {
      type: 'success',
      message: 'Your Instagram posts are performing 23% above average this week',
      action: 'View insights',
      priority: 'high',
      timestamp: new Date()
    },
    {
      type: 'tip',
      message: 'Posts with questions in captions get 40% more engagement',
      action: 'Learn more',
      priority: 'medium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      type: 'warning',
      message: 'Your Twitter engagement dropped 15% - consider trending hashtags',
      action: 'Optimize now',
      priority: 'high',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      type: 'info',
      message: 'New AI content optimization features are now available',
      action: 'Explore',
      priority: 'medium',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];

  // Demo dashboard sections
  const demoSections: DashboardSection[] = [
    {
      id: 'content-creation',
      title: 'Content Creation Hub',
      subtitle: 'AI-powered content creation and optimization',
      icon: ContentCopy,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This is where users will create and optimize their content with AI assistance.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, background: designTokens.colors.primary[50] }}>
                <Typography variant="subtitle2" sx={{ color: designTokens.colors.primary[700] }}>
                  Quick Create
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.primary[600] }}>
                  Start with AI-suggested templates
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, background: designTokens.colors.ai[50] }}>
                <Typography variant="subtitle2" sx={{ color: designTokens.colors.ai[700] }}>
                  AI Optimization
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.ai[600] }}>
                  Get performance predictions
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
      priority: 1,
      aiEnhanced: true,
      defaultExpanded: true
    },
    {
      id: 'analytics-overview',
      title: 'Analytics Overview',
      subtitle: 'Real-time performance insights and trends',
      icon: Analytics,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Comprehensive analytics with AI-powered insights and recommendations.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: designTokens.colors.success[600] }}>
                  4.2%
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Engagement Rate
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: designTokens.colors.primary[600] }}>
                  89.2K
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Total Reach
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: designTokens.colors.secondary[600] }}>
                  247
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Posts Created
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ),
      priority: 2,
      aiEnhanced: true,
      proFeature: true,
      defaultExpanded: true
    },
    {
      id: 'ai-tools',
      title: 'AI Tools & Automation',
      subtitle: 'Advanced AI features for content creators',
      icon: Psychology,
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Advanced AI tools including content optimization, predictive analytics, and automated publishing.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, background: designTokens.colors.ai[50] }}>
                <Typography variant="subtitle2" sx={{ color: designTokens.colors.ai[700] }}>
                  Content Optimization
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.ai[600] }}>
                  AI-powered content performance prediction
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, background: designTokens.colors.secondary[50] }}>
                <Typography variant="subtitle2" sx={{ color: designTokens.colors.secondary[700] }}>
                  Automated Publishing
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.secondary[600] }}>
                  Smart scheduling and cross-platform automation
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
      priority: 3,
      aiEnhanced: true,
      proFeature: true,
      collapsible: true,
      defaultExpanded: false
    }
  ];

  const handleRefresh = () => {
    // Simulate refresh
    console.log('Refreshing dashboard...');
  };

  const handleSettings = () => {
    // Simulate settings
    console.log('Opening settings...');
  };

  return (
    <UnifiedDashboardLayout
      title="Unified Dashboard Demo"
      subtitle="Phase 1: Foundation & Design System"
      quickStats={demoQuickStats}
      aiInsights={demoAIInsights}
      sections={demoSections}
      showConnectedAccounts={true}
      showBottomNavigation={showBottomNav}
      compact={compactMode}
      proStatus={proStatus}
      onRefresh={handleRefresh}
      onSettings={handleSettings}
    >
      {/* Demo Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Demo Controls
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showBottomNav}
                    onChange={(e) => setShowBottomNav(e.target.checked)}
                  />
                }
                label="Show Bottom Navigation"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                  />
                }
                label="Compact Mode"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Pro Status
                </Typography>
                <Stack direction="row" spacing={1}>
                  {(['free', 'pro', 'enterprise'] as const).map((status) => (
                    <Chip
                      key={status}
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      size="small"
                      variant={proStatus === status ? "filled" : "outlined"}
                      onClick={() => setProStatus(status)}
                      sx={{
                        background: proStatus === status ? designTokens.colors.primary[500] : 'transparent',
                        color: proStatus === status ? 'white' : designTokens.colors.primary[500],
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Actions
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleRefresh}
                    startIcon={<Refresh />}
                  >
                    Refresh
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleSettings}
                    startIcon={<Settings />}
                  >
                    Settings
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Feature Showcase */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Phase 1 Features Implemented
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <AutoAwesome sx={{ fontSize: 40, color: designTokens.colors.ai[500], mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[800] }}>
                  Design System
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Complete color palette, typography, spacing, and animation tokens
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Brain sx={{ fontSize: 40, color: designTokens.colors.secondary[500], mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[800] }}>
                  AI Insights
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Contextual AI recommendations and performance insights
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: designTokens.colors.success[500], mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[800] }}>
                  Quick Stats
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Real-time metrics with AI-powered insights
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <ContentCopy sx={{ fontSize: 40, color: designTokens.colors.primary[500], mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[800] }}>
                  Connected Accounts
                </Typography>
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                  Instagram story-style account management
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <AlertTitle>Next Steps</AlertTitle>
        <Typography variant="body2">
          Phase 1 foundation is complete! Next phases will include:
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
          <li>Phase 2: Core Features - AI-enhanced content creation flow</li>
          <li>Phase 3: Enhancement - Tablet and desktop layouts</li>
          <li>Integration with existing Phase 5-6 components</li>
        </Box>
      </Alert>
    </UnifiedDashboardLayout>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
