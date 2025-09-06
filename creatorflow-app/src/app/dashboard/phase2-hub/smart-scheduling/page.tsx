"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert, AlertTitle, Skeleton } from '@mui/material';
import { Schedule, AutoAwesome } from '@/lib/mui-optimized-imports';
import SmartScheduling from '@/components/ui/smart-scheduling';
import { designTokens } from '@/lib/design-system';

export default function SmartSchedulingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userOnboarding, setUserOnboarding] = useState<any>(null);

  useEffect(() => {
    // Simulate loading and fetch user onboarding status
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock user onboarding data
      setUserOnboarding({
        feature: 'smart-scheduling',
        completed: false,
        currentStep: 'optimal-times',
        tips: [
          'Review AI-optimized posting times for your platforms',
          'Create scheduling rules for consistent posting',
          'Monitor audience activity patterns for better timing'
        ]
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSchedule = (content: any) => {
    console.log('Scheduling content:', content);
    // TODO: Integrate with real API
    // await fetch('/api/scheduling/schedule', { method: 'POST', body: JSON.stringify(content) });
  };

  const handleRuleCreate = (rule: any) => {
    console.log('Creating rule:', rule);
    // TODO: Integrate with real API
    // await fetch('/api/scheduling/rules', { method: 'POST', body: JSON.stringify(rule) });
  };

  const handleRuleUpdate = (rule: any) => {
    console.log('Updating rule:', rule);
    // TODO: Integrate with real API
    // await fetch(`/api/scheduling/rules/${rule.id}`, { method: 'PUT', body: JSON.stringify(rule) });
  };

  const handleRuleDelete = (ruleId: string) => {
    console.log('Deleting rule:', ruleId);
    // TODO: Integrate with real API
    // await fetch(`/api/scheduling/rules/${ruleId}`, { method: 'DELETE' });
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
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.secondary[600]
            }}
          >
            <Schedule sx={{ fontSize: 28 }} />
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
              Smart Scheduling
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              AI-powered optimal timing and automated scheduling
            </Typography>
          </Box>
        </Box>

        {/* Onboarding Tips */}
        {userOnboarding && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3,
              background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
              border: `1px solid ${designTokens.colors.secondary[200]}`,
              borderRadius: designTokens.borderRadius.lg
            }}
          >
            <AlertTitle sx={{ color: designTokens.colors.secondary[700] }}>
              ⏰ Smart Scheduling Tips
            </AlertTitle>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              {userOnboarding.tips.map((tip: string, index: number) => (
                <Box component="li" key={index}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.secondary[700] }}>
                    {tip}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Alert>
        )}
      </Box>

      {/* Main Component */}
      <SmartScheduling
        onSchedule={handleSchedule}
        onRuleCreate={handleRuleCreate}
        onRuleUpdate={handleRuleUpdate}
        onRuleDelete={handleRuleDelete}
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
