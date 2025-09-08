"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { BarChart3, TrendingUp, Brain, Building2, Activity, Users, Target, Zap } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import QuickInsights from '@/components/analytics/QuickInsights';
import PerformanceMetrics from '@/components/analytics/PerformanceMetrics';
import TrendAnalysis from '@/components/analytics/TrendAnalysis';
import AIInsights from '@/components/analytics/AIInsights';
import BusinessIntelligence from '@/components/analytics/BusinessIntelligence';
import PredictiveAnalytics from '@/components/ai/PredictiveAnalytics';
import EnterpriseAnalytics from '@/components/enterprise/EnterpriseAnalytics';
import AdvancedAudienceIntelligence from '@/components/analytics/advanced-audience-intelligence';
import CompetitiveIntelligence from '@/components/analytics/competitive-intelligence';

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Modal state for all analytics tools
  const [quickInsightsModalOpen, setQuickInsightsModalOpen] = useState(false);
  const [performanceMetricsModalOpen, setPerformanceMetricsModalOpen] = useState(false);
  const [trendAnalysisModalOpen, setTrendAnalysisModalOpen] = useState(false);
  const [aiInsightsModalOpen, setAiInsightsModalOpen] = useState(false);
  const [businessIntelligenceModalOpen, setBusinessIntelligenceModalOpen] = useState(false);
  const [predictiveModalOpen, setPredictiveModalOpen] = useState(false);
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false);
  const [audienceIntelligenceModalOpen, setAudienceIntelligenceModalOpen] = useState(false);
  const [competitiveIntelligenceModalOpen, setCompetitiveIntelligenceModalOpen] = useState(false);
  const [advancedAnalyticsModalOpen, setAdvancedAnalyticsModalOpen] = useState(false);

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Fetch user data for QuickInsights
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);


  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: { xs: 12, sm: 8 } }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          Analytics Dashboard
        </Typography>
        
        {/* Advanced Analytics Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Brain style={{ width: 20, height: 20 }} />}
            onClick={() => setAdvancedAnalyticsModalOpen(true)}
            sx={{ 
              height: 60,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
              fontSize: '1.1rem',
              fontWeight: 600,
              px: 4
            }}
          >
            Advanced Analytics Suite
          </Button>
        </Box>

        {/* Unified Analytics Tools Grid */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
            Analytics Tools
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(3, 1fr)', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: 2 
          }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<BarChart3 style={{ width: 16, height: 16 }} />}
              onClick={() => setQuickInsightsModalOpen(true)}
              sx={{ height: 48 }}
            >
              Quick Insights
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<BarChart3 style={{ width: 16, height: 16 }} />}
              onClick={() => setPerformanceMetricsModalOpen(true)}
              sx={{ height: 48 }}
            >
              Performance Metrics
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<TrendingUp style={{ width: 16, height: 16 }} />}
              onClick={() => setTrendAnalysisModalOpen(true)}
              sx={{ height: 48 }}
            >
              Trend Analysis
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Brain style={{ width: 16, height: 16 }} />}
              onClick={() => setAiInsightsModalOpen(true)}
              sx={{ height: 48 }}
            >
              AI Insights
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Building2 style={{ width: 16, height: 16 }} />}
              onClick={() => setBusinessIntelligenceModalOpen(true)}
              sx={{ height: 48 }}
            >
              Business Intelligence
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Brain style={{ width: 16, height: 16 }} />}
              onClick={() => setPredictiveModalOpen(true)}
              sx={{ height: 48 }}
            >
              Predictive Analytics
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Activity style={{ width: 16, height: 16 }} />}
              onClick={() => setEnterpriseModalOpen(true)}
              sx={{ height: 48 }}
            >
              Enterprise Analytics
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Users style={{ width: 16, height: 16 }} />}
              onClick={() => setAudienceIntelligenceModalOpen(true)}
              sx={{ height: 48 }}
            >
              Audience Intelligence
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Zap style={{ width: 16, height: 16 }} />}
              onClick={() => setCompetitiveIntelligenceModalOpen(true)}
              sx={{ height: 48 }}
            >
              Competitive Intelligence
            </Button>
          </Box>
        </Box>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>

    {/* Analytics Modals */}
    {/* Quick Insights Modal */}
    <Dialog
      open={quickInsightsModalOpen}
      onClose={() => setQuickInsightsModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Quick Insights</DialogTitle>
      <DialogContent>
        <QuickInsights 
          user={user} 
          analyticsData={{
            totalEngagement: 12500,
            engagementRate: 4.2,
            growthRate: 15
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setQuickInsightsModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>


    {/* Business Intelligence Modal */}
    <Dialog
      open={businessIntelligenceModalOpen}
      onClose={() => setBusinessIntelligenceModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Business Intelligence</DialogTitle>
      <DialogContent>
        <BusinessIntelligence />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBusinessIntelligenceModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Predictive Analytics Modal */}
    <Dialog
      open={predictiveModalOpen}
      onClose={() => setPredictiveModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Predictive Analytics</DialogTitle>
      <DialogContent>
        <PredictiveAnalytics />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPredictiveModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Enterprise Analytics Modal */}
    <Dialog
      open={enterpriseModalOpen}
      onClose={() => setEnterpriseModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Enterprise Analytics</DialogTitle>
      <DialogContent>
        <EnterpriseAnalytics />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEnterpriseModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Performance Metrics Modal */}
    <Dialog
      open={performanceMetricsModalOpen}
      onClose={() => setPerformanceMetricsModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Performance Metrics</DialogTitle>
      <DialogContent>
        <PerformanceMetrics />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPerformanceMetricsModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Trend Analysis Modal */}
    <Dialog
      open={trendAnalysisModalOpen}
      onClose={() => setTrendAnalysisModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Trend Analysis</DialogTitle>
      <DialogContent>
        <TrendAnalysis />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setTrendAnalysisModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* AI Insights Modal */}
    <Dialog
      open={aiInsightsModalOpen}
      onClose={() => setAiInsightsModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>AI Insights</DialogTitle>
      <DialogContent>
        <AIInsights />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAiInsightsModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Audience Intelligence Modal */}
    <Dialog
      open={audienceIntelligenceModalOpen}
      onClose={() => setAudienceIntelligenceModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Audience Intelligence</DialogTitle>
      <DialogContent>
        <AdvancedAudienceIntelligence />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAudienceIntelligenceModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Competitive Intelligence Modal */}
    <Dialog
      open={competitiveIntelligenceModalOpen}
      onClose={() => setCompetitiveIntelligenceModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Competitive Intelligence</DialogTitle>
      <DialogContent>
        <CompetitiveIntelligence />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCompetitiveIntelligenceModalOpen(false)} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>

    {/* Advanced Analytics Modal */}
    <Dialog
      open={advancedAnalyticsModalOpen}
      onClose={() => setAdvancedAnalyticsModalOpen(false)}
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
        Advanced Analytics Suite
      </DialogTitle>
      <DialogContent sx={{ 
        p: { xs: 2, sm: 3 },
        pb: { xs: 6, sm: 3 },
        maxWidth: '100%',
        overflow: 'hidden',
        '& *': { maxWidth: '100%' }
      }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(2, 1fr)' 
          }, 
          gap: 3 
        }}>
          {/* Live Performance Monitoring */}
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
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
                <Activity size={20} />
              </Box>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Live Performance Monitoring
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Real-time tracking of content engagement, reach, and conversion metrics.
            </Typography>
            <Button variant="outlined" fullWidth>
              View Live Data
            </Button>
          </Box>

          {/* Cross-Platform Analytics */}
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
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
                <BarChart3 size={20} />
              </Box>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Cross-Platform Analytics
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Comprehensive analytics across all your social media platforms.
            </Typography>
            <Button variant="outlined" fullWidth>
              View Cross-Platform
            </Button>
          </Box>

          {/* Predictive Analytics */}
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
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
                Predictive Analytics
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              AI-powered forecasting of content performance and audience growth.
            </Typography>
            <Button variant="outlined" fullWidth>
              View Predictions
            </Button>
          </Box>

          {/* Audience Insights */}
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
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
                <Users size={20} />
              </Box>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Advanced Audience Insights
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Deep audience analysis and demographic insights for better targeting.
            </Typography>
            <Button variant="outlined" fullWidth>
              Analyze Audience
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setAdvancedAnalyticsModalOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </Container>
  );
} 