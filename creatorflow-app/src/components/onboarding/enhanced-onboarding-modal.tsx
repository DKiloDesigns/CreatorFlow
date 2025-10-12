'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon,
  SkipNext as SkipNextIcon,
  Close as XIcon,
  HelpOutline as HelpCircleIcon,
  AccessTime as ClockIcon,
  Group as UsersIcon,
  Settings as SettingsIcon,
  BarChart as BarChart3Icon,
  Psychology as BrainIcon,
  CalendarMonth as CalendarIcon,
  Share as Share2Icon
} from '@mui/icons-material';
import { OnboardingStep, OnboardingProgress } from '@/lib/onboarding-progress';

interface EnhancedOnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onStepAction?: (stepId: string, action: string, metadata?: any) => void;
}

export function EnhancedOnboardingModal({
  open,
  onClose,
  onComplete,
  onStepAction
}: EnhancedOnboardingModalProps) {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [nextSteps, setNextSteps] = useState<OnboardingStep[]>([]);
  const [completionStats, setCompletionStats] = useState<any>(null);
  const [recommendedHelp, setRecommendedHelp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch onboarding progress
  useEffect(() => {
    if (open) {
      fetchProgress();
    }
  }, [open]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/onboarding/progress');
      const data = await response.json();
      
      if (data.success) {
        setProgress(data.progress);
        setCurrentStep(data.currentStep);
        setNextSteps(data.nextSteps);
        setCompletionStats(data.completionStats);
        setRecommendedHelp(data.recommendedHelp);
        
        // Set active step based on current step
        if (data.currentStep) {
          const stepIndex = data.progress.completedSteps.length;
          setActiveStep(stepIndex);
        }
      }
    } catch (error) {
      console.error('Failed to fetch onboarding progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepAction = async (stepId: string, action: string, metadata?: any) => {
    try {
      const response = await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          stepId,
          metadata
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setProgress(data.progress);
        setCurrentStep(data.currentStep);
        setNextSteps(data.nextSteps);
        setCompletionStats(data.completionStats);
        setRecommendedHelp(data.recommendedHelp);
        
        // Update active step
        const stepIndex = data.progress.completedSteps.length;
        setActiveStep(stepIndex);
        
        // Call external handler
        onStepAction?.(stepId, action, metadata);
        
        // Check if onboarding is complete
        if (data.isComplete) {
          onComplete?.();
        }
      }
    } catch (error) {
      console.error('Failed to update onboarding progress:', error);
    }
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'welcome':
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      case 'connect-accounts':
        return <UsersIcon sx={{ fontSize: 20 }} />;
      case 'create-first-post':
        return <Share2Icon sx={{ fontSize: 20 }} />;
      case 'schedule-content':
        return <CalendarIcon sx={{ fontSize: 20 }} />;
      case 'explore-analytics':
        return <BarChart3Icon sx={{ fontSize: 20 }} />;
      case 'set-up-team':
        return <UsersIcon sx={{ fontSize: 20 }} />;
      case 'explore-ai-tools':
        return <BrainIcon sx={{ fontSize: 20 }} />;
      case 'customize-settings':
        return <SettingsIcon sx={{ fontSize: 20 }} />;
      case 'onboarding-complete':
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      default:
        return <PlayIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getStepColor = (step: OnboardingStep, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return 'success';
    if (isCurrent) return 'primary';
    if (step.required) return 'default';
    return 'secondary';
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Loading onboarding progress...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!progress || !currentStep) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Welcome to floai.studio!
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Let's get you started with a quick onboarding tour.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => handleStepAction('welcome', 'start_step')}
            >
              Start Onboarding
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const allSteps = [
    ...progress.completedSteps.map(id => ({ id, status: 'completed' as const })),
    ...progress.skippedSteps.map(id => ({ id, status: 'skipped' as const })),
    { id: progress.currentStep, status: 'current' as const },
    ...nextSteps.map(step => ({ id: step.id, status: 'pending' as const }))
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          minHeight: isMobile ? '100vh' : 600,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            floai.studio Onboarding
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {completionStats && (
              <Chip 
                label={`${completionStats.progressPercentage}% Complete`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
            <IconButton onClick={onClose} size="small">
              <XIcon />
            </IconButton>
          </Box>
        </Box>
        
        {completionStats && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={completionStats.progressPercentage} 
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {completionStats.completedSteps} of {completionStats.totalSteps} steps completed
              {completionStats.estimatedTimeRemaining > 0 && (
                ` • ${completionStats.estimatedTimeRemaining} min remaining`
              )}
            </Typography>
          </Box>
        )}
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: isMobile ? 'calc(100vh - 200px)' : 500 }}>
          {/* Stepper Sidebar */}
          <Box sx={{ 
            width: isMobile ? '100%' : 300, 
            borderRight: isMobile ? 'none' : 1, 
            borderColor: 'divider',
            p: 2,
            overflow: 'auto'
          }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {allSteps.map((stepInfo, index) => {
                const step = stepInfo.id === currentStep?.id ? currentStep : 
                  nextSteps.find(s => s.id === stepInfo.id);
                
                if (!step) return null;

                const isCompleted = stepInfo.status === 'completed';
                const isSkipped = stepInfo.status === 'skipped';
                const isCurrent = stepInfo.status === 'current';

                return (
                  <Step key={step.id} completed={isCompleted}>
                    <StepLabel
                      icon={getStepIcon(step.id)}
                      sx={{ 
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          color: isSkipped ? 'text.disabled' : 'inherit'
                        }
                      }}
                    >
                      {step.title}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {step.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={step.required ? 'Required' : 'Optional'} 
                          size="small" 
                          color={step.required ? 'primary' : 'secondary'}
                          variant="outlined" 
                        />
                        <Chip 
                          icon={<ClockIcon sx={{ fontSize: 12 }} />}
                          label={`${step.estimatedTime} min`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </Box>

          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'auto'
          }}>
            {/* Current Step Content */}
            <Box sx={{ flex: 1, mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                {currentStep.title}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {currentStep.description}
              </Typography>

              {/* Step Features */}
              {currentStep.features.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Features you'll learn:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {currentStep.features.map(feature => (
                      <Chip 
                        key={feature}
                        label={feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                        size="small" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Help Resources */}
              {recommendedHelp && (
                <Card sx={{ mb: 3, bgcolor: 'action.hover' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                      💡 Helpful Resources
                    </Typography>
                    
                    {recommendedHelp.articles.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Articles:
                        </Typography>
                        {recommendedHelp.articles.map((articleId: string) => (
                          <Button
                            key={articleId}
                            size="small"
                            href={`/support/article/${articleId}`}
                            target="_blank"
                            sx={{ mr: 1, mb: 1 }}
                          >
                            {articleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Button>
                        ))}
                      </Box>
                    )}
                    
                    {recommendedHelp.tutorials.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Tutorials:
                        </Typography>
                        {recommendedHelp.tutorials.map((tutorialId: string) => (
                          <Button
                            key={tutorialId}
                            size="small"
                            href={`/tutorials?tutorial=${tutorialId}`}
                            target="_blank"
                            sx={{ mr: 1, mb: 1 }}
                          >
                            {tutorialId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Button>
                        ))}
                      </Box>
                    )}
                    
                    {recommendedHelp.videos.length > 0 && (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Videos:
                        </Typography>
                        {recommendedHelp.videos.map((videoId: string) => (
                          <Button
                            key={videoId}
                            size="small"
                            href={`/tutorials?video=${videoId}`}
                            target="_blank"
                            sx={{ mr: 1, mb: 1 }}
                          >
                            {videoId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Button>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {currentStep.type === 'tutorial' && (
                  <Button
                    variant="outlined"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStepAction(currentStep.id, 'start_step')}
                  >
                    Start Tutorial
                  </Button>
                )}
                
                {currentStep.type === 'action' && (
                  <Button
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={() => handleStepAction(currentStep.id, 'start_step')}
                  >
                    Try This Action
                  </Button>
                )}
                
                {currentStep.type === 'information' && (
                  <Button
                    variant="contained"
                    onClick={() => handleStepAction(currentStep.id, 'complete_step')}
                  >
                    Got It
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {!currentStep.required && (
                  <Button
                    variant="outlined"
                    onClick={() => handleStepAction(currentStep.id, 'skip_step', { reason: 'not_needed' })}
                  >
                    Skip
                  </Button>
                )}
                
                <Button
                  variant="contained"
                  onClick={() => handleStepAction(currentStep.id, 'complete_step')}
                  endIcon={<CheckCircleIcon />}
                >
                  Complete
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
