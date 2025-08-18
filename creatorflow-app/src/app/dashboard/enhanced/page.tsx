'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Grid,
  Button,
  Chip,
  Paper,
  Divider,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  TrackChanges,
  FlashOn,
  BarChart,
  Rocket,
  CheckCircle,
  Settings,
  Monitor,
  Send,
  Schedule,
  Analytics,
  AutoAwesome
} from '@mui/icons-material';

// Import Phase 2 components
import AIContentIntelligence from '@/components/ui/ai-content-intelligence';
import RealTimeAnalytics from '@/components/ui/real-time-analytics';
import MultiPlatformPublisher from '@/components/ui/multi-platform-publisher';

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const features = [
    {
      name: 'AI Content Intelligence',
      description: 'Advanced AI-powered content analysis, competitor intelligence, and trend prediction',
      icon: <Psychology />,
      color: 'primary',
      route: '/dashboard/phase2-hub'
    },
    {
      name: 'Real-Time Analytics',
      description: 'Live performance tracking, A/B testing, and ROI optimization with real-time data',
      icon: <Monitor />,
      color: 'success',
      route: '/dashboard/phase2-hub'
    },
    {
      name: 'Multi-Platform Publisher',
      description: 'Create once, publish everywhere with intelligent optimization and real publishing APIs',
      icon: <Send />,
      color: 'warning',
      route: '/dashboard/phase2-hub'
    },
    {
      name: 'Smart Content Workflow',
      description: '5-step guided content creation process with AI-powered suggestions and optimization',
      icon: <AutoAwesome />,
      color: 'info',
      route: '/dashboard/phase2-hub'
    }
  ];

  const renderOverview = () => (
    <Box>
      {/* Hero Section */}
      <Card sx={{ mb: 4, bgcolor: 'primary.50', border: '2px solid', borderColor: 'primary.main' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary.main">
            🚀 Enhanced AI-Powered Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Welcome to the next generation of content creation intelligence
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip icon={<Psychology />} label="AI-Powered" color="primary" />
            <Chip icon={<Monitor />} label="Real-Time" color="success" />
            <Chip icon={<FlashOn />} label="Intelligent" color="warning" />
            <Chip icon={<Rocket />} label="Advanced" color="info" />
          </Box>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {features.map((feature, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => router.push(feature.route)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2,
                  color: `${feature.color}.main`
                }}>
                  {React.cloneElement(feature.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {feature.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  color={feature.color as any}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(feature.route);
                  }}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Quick Actions" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Psychology />}
                onClick={() => setActiveTab('ai-intelligence')}
                sx={{ py: 2 }}
              >
                AI Content Analysis
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Monitor />}
                onClick={() => setActiveTab('analytics')}
                sx={{ py: 2 }}
                color="success"
              >
                View Live Analytics
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Send />}
                onClick={() => setActiveTab('publisher')}
                sx={{ py: 2 }}
                color="warning"
              >
                Publish Content
              </Button>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => router.push('/dashboard/phase2-hub')}
                sx={{ py: 2 }}
              >
                Phase 2 Hub
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader title="System Status" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6">AI Intelligence</Typography>
                <Typography variant="body2" color="success.main">Active</Typography>
              </Paper>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6">Real-Time Data</Typography>
                <Typography variant="body2" color="success.main">Live</Typography>
              </Paper>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6">Publishing</Typography>
                <Typography variant="body2" color="success.main">Ready</Typography>
              </Paper>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircle color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6">Workflow</Typography>
                <Typography variant="body2" color="success.main">Optimized</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3, pb: { xs: 20, sm: 8 } }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🚀 Enhanced AI-Powered Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Phase 2 AI Intelligence integrated directly into your main dashboard
        </Typography>
        <Alert severity="info" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
          This dashboard showcases the enhanced Phase 2 features integrated directly into your main workflow.
          All AI intelligence, real-time analytics, and advanced publishing features are now accessible here.
        </Alert>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" value="overview" />
          <Tab label="AI Content Intelligence" value="ai-intelligence" />
          <Tab label="Real-Time Analytics" value="analytics" />
          <Tab label="Multi-Platform Publisher" value="publisher" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'ai-intelligence' && <AIContentIntelligence />}
      {activeTab === 'analytics' && <RealTimeAnalytics />}
      {activeTab === 'publisher' && <MultiPlatformPublisher />}

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: 'center', py: 4, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enhanced Dashboard - Phase 2 AI Intelligence Suite
        </Typography>
        <Typography variant="caption" color="text.secondary">
          All features are fully operational and integrated with your existing workflow
        </Typography>
      </Box>

      {/* Spacer to Clear Bottom Navigation */}
      <Box sx={{ 
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
}
