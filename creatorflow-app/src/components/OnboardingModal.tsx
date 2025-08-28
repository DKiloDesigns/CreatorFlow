'use client';

import React, { useState, useEffect } from 'react';
import { 
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Paper
} from '@mui/material';
import { Rocket, Activity, Sparkles, Users, Zap, Calendar, BarChart3, Settings, X, CheckCircle, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  order: number;
}

interface OnboardingProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [progress, setProgress] = useState<OnboardingProgress>({ completed: 0, total: 0, percentage: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOnboardingData();
    }
  }, [isOpen]);

  const fetchOnboardingData = async () => {
    try {
      const response = await fetch('/api/ux/onboarding');
      if (response.ok) {
        const data = await response.json();
        setSteps(data.steps);
        setProgress(data.progress);
        
        // Find first incomplete step
        const firstIncomplete = data.steps.findIndex((step: OnboardingStep) => !step.completed);
        setCurrentStep(firstIncomplete >= 0 ? firstIncomplete : 0);
      }
    } catch (error) {
      console.error('Failed to fetch onboarding data:', error);
    }
  };

  const completeStep = async (stepId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/ux/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
        
        // Update steps
        setSteps(prev => prev.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        ));

        // Move to next step
        const nextStep = currentStep + 1;
        if (nextStep < steps.length) {
          setCurrentStep(nextStep);
        } else {
          // All steps completed
          onComplete();
        }
      }
    } catch (error) {
      console.error('Failed to complete step:', error);
    } finally {
      setLoading(false);
    }
  };

  const skipStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
    } else {
      onComplete();
    }
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'welcome': return <Box sx={{ color: 'purple.600' }}><Sparkles className="h-6 w-6" /></Box>;
      case 'connect_accounts': return <Box sx={{ color: 'blue.600' }}><Users className="h-6 w-6" /></Box>;
      case 'create_post': return <Box sx={{ color: 'green.600' }}><Zap className="h-6 w-6" /></Box>;
      case 'schedule_content': return <Box sx={{ color: 'orange.600' }}><Calendar className="h-6 w-6" /></Box>;
      case 'analytics': return <Box sx={{ color: 'indigo.600' }}><BarChart3 className="h-6 w-6" /></Box>;
      default: return <Box sx={{ color: 'grey.600' }}><Settings className="h-6 w-6" /></Box>;
    }
  };

  const getStepColor = (stepId: string) => {
    switch (stepId) {
      case 'welcome': return 'purple.600';
      case 'connect_accounts': return 'blue.600';
      case 'create_post': return 'green.600';
      case 'schedule_content': return 'orange.600';
      case 'analytics': return 'indigo.600';
      default: return 'grey.600';
    }
  };

  if (steps.length === 0) return null;

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <DialogTitle className="text-xl font-bold">
              Welcome to CreatorFlow
            </DialogTitle>
            <Button variant="text" size="small" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </Box>
        </DialogHeader>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Progress Bar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <Typography variant="body2">Progress</Typography>
              <Typography variant="body2">{progress.percentage}% Complete</Typography>
            </Box>
            <Progress value={progress.percentage} className="h-2" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'text.secondary' }}>
              <Typography variant="caption">{progress.completed} of {progress.total} steps</Typography>
            </Box>
          </Box>

          {/* Step Indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {steps.map((step, index) => (
              <Box
                key={step.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  ...(index === currentStep
                    ? { bgcolor: 'primary.main', color: 'primary.contrastText' }
                    : step.completed
                    ? { bgcolor: 'success.100', color: 'success.800' }
                    : { bgcolor: 'grey.100', color: 'grey.600' }
                  )
                }}
              >
                {step.completed ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </Box>
            ))}
          </Box>

          {/* Current Step Content */}
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ 
              mx: 'auto', 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              bgcolor: 'grey.100', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: getStepColor(currentStepData.id)
            }}>
              {getStepIcon(currentStepData.id)}
            </Box>
            
            <Box>
              <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                {currentStepData.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {currentStepData.description}
              </Typography>
            </Box>

            {/* Step-specific content */}
            {currentStepData.id === 'welcome' && (
              <Paper sx={{ bgcolor: 'blue.50', p: 2, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'blue.800' }}>
                  Let&apos;s get you started with CreatorFlow! We&apos;ll guide you through the essential features to help you create and manage your social media content effectively.
                </Typography>
              </Paper>
            )}

            {currentStepData.id === 'connect_accounts' && (
              <Paper sx={{ bgcolor: 'green.50', p: 2, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'green.800' }}>
                  Connect your social media accounts to start publishing content directly from CreatorFlow. We support Instagram, TikTok, YouTube, and Twitter.
                </Typography>
              </Paper>
            )}

            {currentStepData.id === 'create_post' && (
              <Paper sx={{ bgcolor: 'purple.50', p: 2, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'purple.800' }}>
                  Learn how to create engaging posts with our AI-powered content generation tools. You can create posts, captions, and hashtags optimized for each platform.
                </Typography>
              </Paper>
            )}

            {currentStepData.id === 'schedule_content' && (
              <Paper sx={{ bgcolor: 'orange.50', p: 2, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'orange.800' }}>
                  Schedule your content in advance to maintain a consistent posting schedule. Our AI can suggest the best times to post for maximum engagement.
                </Typography>
              </Paper>
            )}

            {currentStepData.id === 'analytics' && (
              <Paper sx={{ bgcolor: 'indigo.50', p: 2, borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'indigo.800' }}>
                  Track your performance with detailed analytics and insights. Monitor engagement, reach, and audience growth across all your connected platforms.
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {currentStepData.required && (
                <Badge variant="secondary">Required</Badge>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {currentStepData.required ? (
                <Button onClick={() => completeStep(currentStepData.id)} disabled={loading}>
                  {loading ? 'Completing...' : 'Complete Step'}
                  <Box sx={{ ml: 1 }}>
                    <ArrowRight className="h-4 w-4" />
                  </Box>
                </Button>
              ) : (
                <>
                  <Button variant="outlined" onClick={skipStep}>
                    Skip
                  </Button>
                  <Button onClick={() => completeStep(currentStepData.id)} disabled={loading}>
                    {loading ? 'Completing...' : 'Complete'}
                    <Box sx={{ ml: 1 }}>
                      <ArrowRight className="h-4 w-4" />
                    </Box>
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 