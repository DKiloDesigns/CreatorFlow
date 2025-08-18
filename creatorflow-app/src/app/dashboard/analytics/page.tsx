"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Tabs, Tab } from '@mui/material';
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
        return <QuickInsights 
          user={user} 
          analyticsData={{
            totalEngagement: 12500,
            engagementRate: 4.2,
            growthRate: 15
          }}
        />;
      case 1:
        return <PerformanceAnalytics />;
      case 2:
        return <BusinessIntelligence />;
      case 3:
        return <PredictiveAnalytics />;
      case 4:
        return <EnterpriseAnalytics />;
      case 5:
        return <AdvancedPerformanceMetrics />;
      case 6:
        return <AdvancedAudienceIntelligence />;
      case 7:
        return <CompetitiveIntelligence />;
      default:
        return <QuickInsights 
          user={user} 
          analyticsData={{
            totalEngagement: 12500,
            engagementRate: 4.2,
            growthRate: 15
          }}
        />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pb: { xs: 12, sm: 8 } }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Quick Insights" />
          <Tab label="Performance Analytics" />
          <Tab label="Business Intelligence" />
          <Tab label="Predictive Analytics" />
          <Tab label="Enterprise Analytics" />
          <Tab label="Advanced Performance" />
          <Tab label="Audience Intelligence" />
          <Tab label="Competitive Intelligence" />
        </Tabs>
      </Box>

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
  );
} 