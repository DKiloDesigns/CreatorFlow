"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Tabs, Tab, Button, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { BarChart3, TrendingUp, Brain, Building2, Activity, Users, Target, Zap } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import QuickInsights from '@/components/analytics/QuickInsights';
import PerformanceAnalytics from '@/components/analytics/PerformanceAnalytics';
import BusinessIntelligence from '@/components/analytics/BusinessIntelligence';
import PredictiveAnalytics from '@/components/ai/PredictiveAnalytics';
import EnterpriseAnalytics from '@/components/enterprise/EnterpriseAnalytics';
import AdvancedPerformanceMetrics from '@/components/analytics/advanced-performance-metrics';
import AdvancedAudienceIntelligence from '@/components/analytics/advanced-audience-intelligence';
import CompetitiveIntelligence from '@/components/analytics/competitive-intelligence';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Modal state for mobile view
  const [quickInsightsModalOpen, setQuickInsightsModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [businessIntelligenceModalOpen, setBusinessIntelligenceModalOpen] = useState(false);
  const [predictiveModalOpen, setPredictiveModalOpen] = useState(false);
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false);
  const [advancedPerformanceModalOpen, setAdvancedPerformanceModalOpen] = useState(false);
  const [audienceIntelligenceModalOpen, setAudienceIntelligenceModalOpen] = useState(false);
  const [competitiveIntelligenceModalOpen, setCompetitiveIntelligenceModalOpen] = useState(false);

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add screen size detection for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    // Check on mount
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <PerformanceAnalytics />;
      case 1:
        return <BusinessIntelligence />;
      case 2:
        return <PredictiveAnalytics />;
      case 3:
        return <EnterpriseAnalytics />;
      case 4:
        return <AdvancedPerformanceMetrics />;
      case 5:
        return <AdvancedAudienceIntelligence />;
      case 6:
        return <CompetitiveIntelligence />;
      default:
        return <PerformanceAnalytics />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: { xs: 12, sm: 8 } }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        
        {/* Quick Insights Section - Always visible above tabs */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quick Insights
          </Typography>
          <QuickInsights 
            user={user} 
            analyticsData={{
              totalEngagement: 12500,
              engagementRate: 4.2,
              growthRate: 15
            }}
          />
        </Box>
        
        {/* Conditional Rendering: Mobile Buttons vs Desktop Tabs */}
        {isMobile ? (
          // Mobile: Show action buttons that open modals
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Analytics Tools
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
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
                startIcon={<TrendingUp style={{ width: 16, height: 16 }} />}
                onClick={() => setPerformanceModalOpen(true)}
                sx={{ height: 48 }}
              >
                Performance Analytics
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
                startIcon={<Target style={{ width: 16, height: 16 }} />}
                onClick={() => setAdvancedPerformanceModalOpen(true)}
                sx={{ height: 48 }}
              >
                Advanced Performance
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
        ) : (
          // Desktop: Show traditional tabs
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Performance Analytics" />
              <Tab label="Business Intelligence" />
              <Tab label="Predictive Analytics" />
              <Tab label="Enterprise Analytics" />
              <Tab label="Advanced Performance" />
              <Tab label="Audience Intelligence" />
              <Tab label="Competitive Intelligence" />
            </Tabs>
          </Box>
        )}

        {/* Tab Content */}
        <Box sx={{ mb: { xs: 8, sm: 6 } }}>
          {renderTabContent()}
        </Box>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>

    {/* Analytics Modals for Mobile View */}
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

    {/* Performance Analytics Modal */}
    <Dialog
      open={performanceModalOpen}
      onClose={() => setPerformanceModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Performance Analytics</DialogTitle>
      <DialogContent>
        <PerformanceAnalytics />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPerformanceModalOpen(false)} variant="outlined">
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

    {/* Advanced Performance Modal */}
    <Dialog
      open={advancedPerformanceModalOpen}
      onClose={() => setAdvancedPerformanceModalOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Advanced Performance Metrics</DialogTitle>
      <DialogContent>
        <AdvancedPerformanceMetrics />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAdvancedPerformanceModalOpen(false)} variant="outlined">
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
  </Container>
  );
} 