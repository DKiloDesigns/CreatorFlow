'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Button, Chip } from '@mui/material';
import { 
  ArrowBack as ArrowLeftIcon,
  AutoAwesome as SparklesIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import SmartContentWorkflow from '../_components/smart-content-workflow';
import { ProFeatureGate } from '@/components/ui/pro-feature-gate';
import { useUserPlan } from '@/hooks/use-user-plan';

export default function SmartWorkflowPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const { userPlan, isProUser, isLoading } = useUserPlan();

  // Show loading state
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, pb: { xs: 12, sm: 6 } }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: { xs: 12, sm: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeftIcon />}
          onClick={() => router.back()}
          sx={{ mb: 2 }}
        >
          Back to Content Dashboard
        </Button>
        
        <Paper sx={{ 
          p: 3, 
          bgcolor: 'background.paper', 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ 
              p: 1, 
              bgcolor: 'primary.main', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SparklesIcon style={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                Smart Content Creation Workflow
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, optimize, and schedule content with AI-powered insights in a unified workflow
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {[
              { id: 0, label: '🚀 AI-Powered Ideation', icon: '🚀' },
              { id: 1, label: '✍️ Smart Creation', icon: '✍️' },
              { id: 2, label: '🤖 AI Optimization', icon: '🤖' },
              { id: 3, label: '📅 Smart Scheduling', icon: '📅' },
              { id: 4, label: '✅ Review & Publish', icon: '✅' }
            ].map((step, index) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              const isUpcoming = activeStep < step.id;
              
              return (
                <Chip
                  key={step.id}
                  label={step.label}
                  icon={isCompleted ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : undefined}
                  variant={isActive ? "filled" : "outlined"}
                  color={isActive ? "primary" : isCompleted ? "success" : "default"}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontWeight: isActive ? 600 : 400,
                    opacity: isUpcoming ? 0.6 : 1,
                    cursor: isCompleted ? 'pointer' : 'default',
                    '&:hover': {
                      opacity: isCompleted ? 0.8 : 1,
                    },
                    transition: 'all 0.2s ease-in-out',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isActive ? 2 : 0,
                  }}
                  onClick={() => {
                    if (isCompleted) {
                      setActiveStep(step.id);
                    }
                  }}
                />
              );
            })}
          </Box>
        </Paper>
      </Box>

      {/* Workflow Component with Plan Gate */}
      <ProFeatureGate
        featureId="smart-workflow"
        userPlan={userPlan}
      >
        <SmartContentWorkflow 
          activeStep={activeStep} 
          onStepChange={setActiveStep} 
        />
      </ProFeatureGate>
    </Container>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
