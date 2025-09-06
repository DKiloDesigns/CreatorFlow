"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert, AlertTitle, Skeleton } from '@mui/material';
import { AutoAwesome, Psychology as Brain } from '@/lib/mui-optimized-imports';
import AIContentCreation from '@/components/ui/ai-content-creation';
import { designTokens } from '@/lib/design-system';

export default function AIContentCreationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userOnboarding, setUserOnboarding] = useState<any>(null);

  useEffect(() => {
    // Simulate loading and fetch user onboarding status
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock user onboarding data
      setUserOnboarding({
        feature: 'ai-content-creation',
        completed: false,
        currentStep: 'content-input',
        tips: [
          'Start by selecting your content type',
          'Enable AI optimization for better performance',
          'Use the performance predictions to improve your content'
        ]
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSave = (draft: any) => {
    console.log('Saving draft:', draft);
    // TODO: Integrate with real API
    // await fetch('/api/content/drafts', { method: 'POST', body: JSON.stringify(draft) });
  };

  const handleSchedule = (draft: any) => {
    console.log('Scheduling content:', draft);
    // TODO: Integrate with real API
    // await fetch('/api/content/schedule', { method: 'POST', body: JSON.stringify(draft) });
  };

  const handlePublish = (draft: any) => {
    console.log('Publishing content:', draft);
    // TODO: Integrate with real API
    // await fetch('/api/content/publish', { method: 'POST', body: JSON.stringify(draft) });
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
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.ai[600]
            }}
          >
            <Brain sx={{ fontSize: 28 }} />
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
              AI Content Creation
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Create, optimize, and enhance content with AI assistance
            </Typography>
          </Box>
        </Box>

        {/* Onboarding Tips */}
        {userOnboarding && (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3,
              background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: `1px solid ${designTokens.colors.ai[200]}`,
              borderRadius: designTokens.borderRadius.lg
            }}
          >
            <AlertTitle sx={{ color: designTokens.colors.ai[700] }}>
              💡 Getting Started Tips
            </AlertTitle>
            <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
              {userOnboarding.tips.map((tip: string, index: number) => (
                <Box component="li" key={index}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.ai[700] }}>
                    {tip}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Alert>
        )}
      </Box>

      {/* Main Component */}
      <AIContentCreation
        onSave={handleSave}
        onSchedule={handleSchedule}
        onPublish={handlePublish}
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
