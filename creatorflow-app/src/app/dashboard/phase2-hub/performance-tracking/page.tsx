"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert, AlertTitle, Skeleton } from '@mui/material';
import { Analytics, TrendingUp } from '@/lib/mui-optimized-imports';
import PerformanceTracking from '@/components/ui/performance-tracking';
import { designTokens } from '@/lib/design-system';

export default function PerformanceTrackingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userOnboarding, setUserOnboarding] = useState<any>(null);

  useEffect(() => {
    // Simulate loading and fetch user onboarding status
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock user onboarding data
      setUserOnboarding({
        feature: 'performance-tracking',
        completed: false,
        currentStep: 'metrics-overview',
        tips: [
          'Review your key performance metrics and AI insights',
          'Analyze content performance to identify top performers',
          'Use trend analysis to predict future performance'
        ]
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInsightAction = (insight: any) => {
    console.log('Insight action:', insight);
    // TODO: Integrate with real API
    // await fetch('/api/analytics/insights/action', { method: 'POST', body: JSON.stringify(insight) });
  };

  const handleContentOptimize = (content: any) => {
    console.log('Content optimization:', content);
    // TODO: Integrate with real API
    // await fetch('/api/content/optimize', { method: 'POST', body: JSON.stringify(content) });
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="rectangular" height={600} />
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
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.success[600]
            }}
          >
            <Analytics sx={{ fontSize: 28 }} />
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
              Performance Tracking
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Real-time analytics with AI-powered insights and recommendations
            </Typography>
          </Box>
        </Box>

        {/* Onboarding Tips */}
        {userOnboarding && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3,
              background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: `1px solid ${designTokens.colors.success[200]}`,
              borderRadius: designTokens.borderRadius.lg
            }}
          >
            <AlertTitle sx={{ color: designTokens.colors.success[700] }}>
              📊 Performance Tracking Tips
            </AlertTitle>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              {userOnboarding.tips.map((tip: string, index: number) => (
                <Box component="li" key={index}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.success[700] }}>
                    {tip}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Alert>
        )}
      </Box>

      {/* Main Component */}
      <PerformanceTracking
        onInsightAction={handleInsightAction}
        onContentOptimize={handleContentOptimize}
        loading={false}
        error={error}
      />
    </Container>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
