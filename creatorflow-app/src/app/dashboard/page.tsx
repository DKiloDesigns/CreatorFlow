'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { 
  Box, 
  Typography, 
  Button, 
  Card,
  CardHeader,
  CardContent,
  Grid,
  Container,
  Chip,
  Divider,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  FileText, 
  Users, 
  BarChart2, 
  Calendar,
  Brain,
  Zap,
  TrendingUp,
  Plus,
  Settings,
  Home,
  ChevronDown,
  ChevronUp,
  Target,
  CreditCard
} from 'lucide-react';
import { useAPIKey } from '@/hooks/use-api-key';
import dynamic from 'next/dynamic';
import SubscriptionStatus from '@/components/SubscriptionStatus';

// Lazy load heavy components
const MiniCalendar = dynamic(() => import('./_components/mini-calendar'), {
  loading: () => <div>Loading calendar...</div>,
  ssr: false
});

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasAPIKey } = useAPIKey();
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalPosts: 0,
    connectedAccounts: 0,
    totalEngagement: 0,
    scheduledPosts: 0,
    aiCredits: 100,
    planStatus: 'Pro'
  });

  // State for expandable sections
  const [contentHubExpanded, setContentHubExpanded] = useState(false);
  const [analyticsCenterExpanded, setAnalyticsCenterExpanded] = useState(false);
  const [aiInsightsExpanded, setAiInsightsExpanded] = useState(false);

  // State for calendar modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bulkScheduleModalOpen, setBulkScheduleModalOpen] = useState(false);
  const [aiInsightsModalOpen, setAiInsightsModalOpen] = useState(false);

  // State for AI tool modals
  const [aiIntelligenceModalOpen, setAiIntelligenceModalOpen] = useState(false);
  const [predictiveAnalyticsModalOpen, setPredictiveAnalyticsModalOpen] = useState(false);
  const [audienceIntelligenceModalOpen, setAudienceIntelligenceModalOpen] = useState(false);
  const [competitiveIntelligenceModalOpen, setCompetitiveIntelligenceModalOpen] = useState(false);
  const [advancedAnalyticsModalOpen, setAdvancedAnalyticsModalOpen] = useState(false);

  // State for individual AI tool modals
  const [contentAnalysisModalOpen, setContentAnalysisModalOpen] = useState(false);
  const [competitorIntelligenceModalOpen, setCompetitorIntelligenceModalOpen] = useState(false);
  const [trendPredictionModalOpen, setTrendPredictionModalOpen] = useState(false);
  const [contentOptimizationModalOpen, setContentOptimizationModalOpen] = useState(false);

  // Navigation handlers
  const handleContentNavigation = (section: string) => {
    if (section === 'ai-intelligence') {
      setAiIntelligenceModalOpen(true);
      return;
    }
    if (section === 'media-library') {
      router.push('/dashboard/media');
      return;
    }
    // Navigate to content page with section
    router.push(`/dashboard/content#${section}`);
  };

  const handleAnalyticsNavigation = (section: string) => {
    if (section === 'ai-insights') {
      setAiInsightsModalOpen(true);
      return;
    }
    if (section === 'predictive-analytics') {
      setPredictiveAnalyticsModalOpen(true);
      return;
    }
    if (section === 'audience-intelligence') {
      setAudienceIntelligenceModalOpen(true);
      return;
    }
    if (section === 'competitive-intelligence') {
      setCompetitiveIntelligenceModalOpen(true);
      return;
    }
    if (section === 'advanced-analytics-suite') {
      setAdvancedAnalyticsModalOpen(true);
      return;
    }
    // Navigate to analytics page with section
    router.push(`/dashboard/analytics#${section}`);
  };

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalPosts: 12,
        connectedAccounts: 3,
        totalEngagement: 15420,
        scheduledPosts: 5,
        aiCredits: 100,
        planStatus: 'Pro'
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
          Dashboard{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}
          </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Your content creation command center
          </Typography>
        
        {/* Quick Stats Bar */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, 
          gap: 3,
          mb: 4
        }}>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="primary.main">{stats.totalPosts}</Typography>
            <Typography variant="caption" color="text.secondary">Posts This Month</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="success.main">{stats.connectedAccounts}</Typography>
            <Typography variant="caption" color="text.secondary">Social Accounts</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="info.main">{stats.totalEngagement.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">Total Engagement</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="warning.main">{stats.scheduledPosts}</Typography>
            <Typography variant="caption" color="text.secondary">Scheduled Posts</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="secondary.main">{stats.aiCredits}</Typography>
            <Typography variant="caption" color="text.secondary">AI Credits</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Typography variant="h6" color="success.main">{stats.planStatus}</Typography>
            <Typography variant="caption" color="text.secondary">Plan Status</Typography>
          </Box>
        </Box>
      </Box>

      {/* Subscription Status */}
      <Box sx={{ mb: 4 }}>
        <SubscriptionStatus />
      </Box>

      {/* Navigation Hub - Main Section */}
      <Grid container spacing={4} sx={{ mb: 5, mt: 1 }}>
        {/* Content Hub */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<FileText size={32} color="#1976d2" />}
              title="Content Hub"
              subheader="Create, manage, and schedule your content"
              action={
                <IconButton 
                  onClick={() => setContentHubExpanded(!contentHubExpanded)}
                  size="small"
                >
                  {contentHubExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </IconButton>
              }
              sx={{ cursor: 'pointer' }}
              onClick={() => setContentHubExpanded(!contentHubExpanded)}
                          />
            <Collapse in={contentHubExpanded}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Access your content calendar, AI tools, and publishing automation
                              </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label="Calendar View" 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ 
                      bgcolor: 'primary.50', 
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.100' }
                    }}
                    onClick={() => handleContentNavigation('calendar-view')}
                  />
                  <Chip 
                    label="Content Management" 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ 
                      bgcolor: 'primary.50', 
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.100' }
                    }}
                    onClick={() => handleContentNavigation('content-management')}
                  />
                  <Chip 
                    label="Text Posts" 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ 
                      bgcolor: 'primary.50', 
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.100' }
                    }}
                    onClick={() => handleContentNavigation('text-posts')}
                  />
                  <Chip 
                    label="Image Posts" 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ 
                      bgcolor: 'primary.50', 
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.100' }
                    }}
                    onClick={() => handleContentNavigation('image-posts')}
                  />
                  <Chip 
                    label="Video Posts" 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ 
                      bgcolor: 'primary.50', 
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.100' }
                    }}
                    onClick={() => handleContentNavigation('video-posts')}
                  />
                  <Chip 
                    label="Media Library" 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ 
                      bgcolor: 'primary.50', 
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'primary.100' }
                    }}
                    onClick={() => handleContentNavigation('media-library')}
                  />
                  <Chip 
                    label="AI Intelligence" 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                    sx={{ 
                      bgcolor: 'secondary.50', 
                      borderColor: 'secondary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'secondary.100' }
                    }}
                    onClick={() => handleContentNavigation('ai-intelligence')}
                  />
                              </Box>
                            </CardContent>
            </Collapse>
                          </Card>
        </Grid>

        {/* Analytics Center */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              avatar={<BarChart2 size={32} color="#2e7d32" />}
              title="Analytics Center"
              subheader="Track performance and insights"
              action={
                <IconButton 
                  onClick={() => setAnalyticsCenterExpanded(!analyticsCenterExpanded)}
                                size="small"
                >
                  {analyticsCenterExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </IconButton>
              }
              sx={{ cursor: 'pointer' }}
              onClick={() => setAnalyticsCenterExpanded(!analyticsCenterExpanded)}
            />
            <Collapse in={analyticsCenterExpanded}>
                        <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Monitor your content performance with advanced analytics and AI predictions
                          </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label="Quick Insights" 
                    size="small" 
                    variant="outlined" 
                    color="success" 
                    sx={{ 
                      bgcolor: 'success.50', 
                      borderColor: 'success.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'success.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('quick-insights')}
                  />
                  <Chip 
                    label="Performance Metrics" 
                    size="small" 
                    variant="outlined" 
                    color="success" 
                    sx={{ 
                      bgcolor: 'success.50', 
                      borderColor: 'success.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'success.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('performance-metrics')}
                  />
                  <Chip 
                    label="Trend Analysis" 
                    size="small" 
                    variant="outlined" 
                    color="success" 
                    sx={{ 
                      bgcolor: 'success.50', 
                      borderColor: 'success.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'success.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('trend-analysis')}
                  />
                  <Chip 
                    label="AI Insights" 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                    sx={{ 
                      bgcolor: 'secondary.50', 
                      borderColor: 'secondary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'secondary.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('ai-insights')}
                  />
                  <Chip 
                    label="Business Intelligence" 
                    size="small" 
                    variant="outlined" 
                    color="success" 
                    sx={{ 
                      bgcolor: 'success.50', 
                      borderColor: 'success.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'success.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('business-intelligence')}
                  />
                  <Chip 
                    label="Predictive Analytics" 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                    sx={{ 
                      bgcolor: 'secondary.50', 
                      borderColor: 'secondary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'secondary.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('predictive-analytics')}
                  />
                  <Chip 
                    label="Enterprise Analytics" 
                    size="small" 
                    variant="outlined" 
                    color="success" 
                    sx={{ 
                      bgcolor: 'success.50', 
                      borderColor: 'success.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'success.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('enterprise-analytics')}
                  />
                  <Chip 
                    label="Audience Intelligence" 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                    sx={{ 
                      bgcolor: 'secondary.50', 
                      borderColor: 'secondary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'secondary.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('audience-intelligence')}
                  />
                  <Chip 
                    label="Competitive Intelligence" 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                    sx={{ 
                      bgcolor: 'secondary.50', 
                      borderColor: 'secondary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'secondary.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('competitive-intelligence')}
                  />
                  <Chip 
                    label="Advanced Analytics Suite" 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                    sx={{ 
                      bgcolor: 'secondary.50', 
                      borderColor: 'secondary.main',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'secondary.100' }
                    }}
                    onClick={() => handleAnalyticsNavigation('advanced-analytics-suite')}
                  />
                          </Box>
                        </CardContent>
            </Collapse>
                      </Card>
        </Grid>
      </Grid>

      {/* AI Insights Section */}
      <Card sx={{ mb: 5 }}>
        <CardHeader
          avatar={<Brain size={32} color="#667eea" />}
          title="AI Insights"
          subheader="Get AI-powered recommendations and insights"
          action={
            <IconButton 
              onClick={() => setAiInsightsExpanded(!aiInsightsExpanded)}
              size="small"
            >
              {aiInsightsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </IconButton>
          }
          sx={{ cursor: 'pointer' }}
          onClick={() => setAiInsightsExpanded(!aiInsightsExpanded)}
        />
              <Collapse in={aiInsightsExpanded}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    AI-powered insights and recommendations to optimize your content strategy
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<Zap size={16} />}
                      onClick={() => setAiInsightsModalOpen(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        }
                      }}
                    >
                      View Full Insights
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Target size={16} />}
                      onClick={() => handleAnalyticsNavigation('ai-insights')}
                      sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                    >
                      Quick Analysis
                    </Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="h6" color="primary.main">+23%</Typography>
                        <Typography variant="caption" color="text.secondary">Engagement Boost</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="h6" color="success.main">4.2k</Typography>
                        <Typography variant="caption" color="text.secondary">Predicted Views</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="h6" color="warning.main">2</Typography>
                        <Typography variant="caption" color="text.secondary">AI Suggestions</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Collapse>
      </Card>

      {/* Content Calendar Widget */}
      <Box sx={{ mb: 5 }}>
        <MiniCalendar
          onCreatePost={() => router.push('/dashboard/content')}
          onBulkSchedule={() => router.push('/dashboard/content')}
          onViewFullCalendar={() => router.push('/dashboard/content')}
        />
      </Box>


      {/* Recent Activity Feed */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Recent Activity"
          subheader="Your latest content and platform activity"
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <FileText size={20} color="#1976d2" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  New post published on Instagram
          </Typography>
                <Typography variant="caption" color="text.secondary">
                  2 hours ago • 24 likes, 3 comments
            </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Brain size={20} color="#2e7d32" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  AI Content Optimization completed
            </Typography>
                <Typography variant="caption" color="text.secondary">
                  4 hours ago • 15% engagement improvement
            </Typography>
          </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Calendar size={20} color="#ed6c02" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  3 posts scheduled for tomorrow
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  6 hours ago • Instagram, Twitter, LinkedIn
                </Typography>
              </Box>
            </Box>
    </Box>
        </CardContent>
      </Card>

      {/* Bottom Spacer */}
      <Box sx={{ height: { xs: '120px', sm: '60px' } }} />

      {/* AI Insights Modal */}
      <Dialog
        open={aiInsightsModalOpen}
        onClose={() => setAiInsightsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          AI Insights Dashboard
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Grid container spacing={3}>
            {/* Performance Insights */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }}>
                    <TrendingUp size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Performance Insights
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your content is performing 23% better than last month. Focus on video content for maximum engagement.
                </Typography>
                <Button variant="outlined" fullWidth>
                  View Details
                </Button>
              </Card>
            </Grid>

            {/* Content Suggestions */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    color: 'success.contrastText'
                  }}>
                    <Brain size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Content Suggestions
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Post about "AI trends" on Tuesday at 2 PM for optimal engagement. Use hashtags: #AI #Tech #Innovation
                </Typography>
                <Button variant="outlined" fullWidth>
                  Apply Suggestion
                </Button>
              </Card>
            </Grid>

            {/* Audience Insights */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText'
                  }}>
                    <Users size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Audience Insights
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your audience is 65% millennials, most active on Instagram. Consider more visual content.
                </Typography>
                <Button variant="outlined" fullWidth>
                  Analyze Audience
                </Button>
              </Card>
            </Grid>

            {/* Trend Predictions */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText'
                  }}>
                    <Zap size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Trend Predictions
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  "Sustainable living" content is trending up 40%. Consider creating eco-friendly content.
                </Typography>
                <Button variant="outlined" fullWidth>
                  View Trends
                </Button>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAiInsightsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* AI Intelligence Modal */}
      <Dialog 
        open={aiIntelligenceModalOpen} 
        onClose={() => setAiIntelligenceModalOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          AI Intelligence Suite
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Grid container spacing={3}>
            {/* Advanced Content Analysis */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }}>
                    <Brain size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Advanced Content Analysis
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Deep analysis of content performance, engagement patterns, and optimization opportunities.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setContentAnalysisModalOpen(true)}
                >
                  Analyze Content
                </Button>
              </Card>
            </Grid>

            {/* Competitor Intelligence */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText'
                  }}>
                    <Target size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Competitor Intelligence
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Monitor competitor content strategies, trending topics, and market positioning.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setCompetitorIntelligenceModalOpen(true)}
                >
                  Monitor Competitors
                </Button>
              </Card>
            </Grid>

            {/* Trend Prediction */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    color: 'success.contrastText'
                  }}>
                    <TrendingUp size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Trend Prediction
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  AI-powered forecasting of content trends and viral potential.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setTrendPredictionModalOpen(true)}
                >
                  Predict Trends
                </Button>
              </Card>
            </Grid>

            {/* Content Optimization */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText'
                  }}>
                    <Zap size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Content Optimization
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Real-time suggestions for improving content performance across platforms.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setContentOptimizationModalOpen(true)}
                >
                  Optimize Content
                </Button>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAiIntelligenceModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Content Analysis Modal */}
      <Dialog 
        open={contentAnalysisModalOpen} 
        onClose={() => setContentAnalysisModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Advanced Content Analysis
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              AI-Powered Content Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get deep insights into your content performance, engagement patterns, and optimization opportunities using advanced AI algorithms.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText'
                    }}>
                      <BarChart2 size={16} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      Performance Metrics
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Analyze engagement rates, reach, impressions, and conversion metrics across all platforms.
                  </Typography>
                  <Button variant="outlined" fullWidth size="small">
                    Analyze Performance
                  </Button>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText'
                    }}>
                      <Brain size={16} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      Content Insights
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Discover what content resonates with your audience and identify optimization opportunities.
                  </Typography>
                  <Button variant="outlined" fullWidth size="small">
                    Get Insights
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setContentAnalysisModalOpen(false)}>Close</Button>
          <Button variant="contained">Start Analysis</Button>
        </DialogActions>
      </Dialog>

      {/* Competitor Intelligence Modal */}
      <Dialog 
        open={competitorIntelligenceModalOpen} 
        onClose={() => setCompetitorIntelligenceModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Competitor Intelligence
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              Monitor Your Competition
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Track competitor content strategies, trending topics, and market positioning to stay ahead of the curve.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText'
                    }}>
                      <Target size={16} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      Competitor Tracking
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Monitor competitor content, posting schedules, and engagement strategies.
                  </Typography>
                  <Button variant="outlined" fullWidth size="small">
                    Track Competitors
                  </Button>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      color: 'success.contrastText'
                    }}>
                      <TrendingUp size={16} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      Market Trends
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Identify trending topics and content themes in your industry.
                  </Typography>
                  <Button variant="outlined" fullWidth size="small">
                    View Trends
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCompetitorIntelligenceModalOpen(false)}>Close</Button>
          <Button variant="contained">Start Monitoring</Button>
        </DialogActions>
      </Dialog>

      {/* Trend Prediction Modal */}
      <Dialog 
        open={trendPredictionModalOpen} 
        onClose={() => setTrendPredictionModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Trend Prediction
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              AI-Powered Trend Forecasting
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get ahead of the curve with AI-powered forecasting of content trends and viral potential.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      color: 'success.contrastText'
                    }}>
                      <TrendingUp size={16} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      Viral Potential
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Predict which content has the highest chance of going viral.
                  </Typography>
                  <Button variant="outlined" fullWidth size="small">
                    Predict Viral Content
                  </Button>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'warning.main',
                      color: 'warning.contrastText'
                    }}>
                      <Zap size={16} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      Trend Analysis
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Analyze emerging trends and their potential impact on your content strategy.
                  </Typography>
                  <Button variant="outlined" fullWidth size="small">
                    Analyze Trends
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTrendPredictionModalOpen(false)}>Close</Button>
          <Button variant="contained">Start Prediction</Button>
        </DialogActions>
      </Dialog>

      {/* Content Optimization Modal */}
      <Dialog 
        open={contentOptimizationModalOpen} 
        onClose={() => setContentOptimizationModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Content Optimization
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              Real-Time Content Optimization
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get real-time suggestions for improving content performance across all platforms.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'warning.main',
                      color: 'warning.contrastText'
                    }}>
                      <Zap size={16} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      Quick Optimizations
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Get instant suggestions for improving headlines, descriptions, and hashtags.
                  </Typography>
                  <Button variant="outlined" fullWidth size="small">
                    Optimize Now
                  </Button>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText'
                    }}>
                      <Brain size={16} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      AI Suggestions
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Receive AI-powered recommendations for content improvements and strategy adjustments.
                  </Typography>
                  <Button variant="outlined" fullWidth size="small">
                    Get Suggestions
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setContentOptimizationModalOpen(false)}>Close</Button>
          <Button variant="contained">Start Optimization</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 