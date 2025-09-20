'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Image,
  Eye
} from 'lucide-react';
import { VisualTutorialStep } from './visual-tutorial-step';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  action?: {
    type: 'click' | 'navigate' | 'input' | 'wait';
    target?: string;
    value?: string;
    url?: string;
    duration?: number;
  };
  validation?: {
    type: 'element_exists' | 'text_contains' | 'url_contains';
    target?: string;
    value?: string;
  };
  hints?: string[];
  media?: {
    type: 'image' | 'video' | 'gif';
    url: string;
    alt?: string;
  };
  // NEW: Visual enhancements
  screenshot?: string;
  highlight?: {
    x: number;
    y: number;
    width: number;
    height: number;
    description: string;
  };
  beforeImage?: string;
  afterImage?: string;
  visualNotes?: string;
}

interface InteractiveTutorialProps {
  tutorialId: string;
  steps: TutorialStep[];
  onComplete?: () => void;
  onClose?: () => void;
  autoStart?: boolean;
  className?: string;
}

export function InteractiveTutorial({
  tutorialId,
  steps,
  onComplete,
  onClose,
  autoStart = false,
  className
}: InteractiveTutorialProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isValidating, setIsValidating] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [open, setOpen] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && activeStep < steps.length) {
      const currentStep = steps[activeStep];
      
      if (currentStep.action?.type === 'wait' && currentStep.action.duration) {
        intervalRef.current = setTimeout(() => {
          handleNext();
        }, currentStep.action.duration);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, activeStep, steps]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
      setShowHints(false);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      setShowHints(false);
    }
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setCompletedSteps(new Set(Array.from({ length: steps.length }, (_, i) => i)));
    onComplete?.();
  };

  const handleClose = () => {
    setIsPlaying(false);
    setOpen(false);
    onClose?.();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
    setShowHints(false);
  };

  const handleAction = async (action: TutorialStep['action']) => {
    if (!action) return;

    setIsValidating(true);

    try {
      switch (action.type) {
        case 'click':
          if (action.target) {
            const element = document.querySelector(action.target);
            if (element) {
              (element as HTMLElement).click();
            }
          }
          break;
        
        case 'navigate':
          if (action.url) {
            window.open(action.url, '_blank');
          }
          break;
        
        case 'input':
          if (action.target && action.value) {
            const element = document.querySelector(action.target) as HTMLInputElement;
            if (element) {
              element.value = action.value;
              element.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
          break;
        
        case 'wait':
          if (action.duration) {
            await new Promise(resolve => setTimeout(resolve, action.duration));
          }
          break;
      }

      // Validate the action if validation is defined
      const currentStep = steps[activeStep];
      if (currentStep.validation) {
        const isValid = await validateStep(currentStep.validation);
        if (isValid) {
          setCompletedSteps(prev => new Set([...prev, activeStep]));
        }
      }

    } catch (error) {
      console.error('Tutorial action failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const validateStep = async (validation: TutorialStep['validation']): Promise<boolean> => {
    if (!validation) return true;

    switch (validation.type) {
      case 'element_exists':
        if (validation.target) {
          return document.querySelector(validation.target) !== null;
        }
        break;
      
      case 'text_contains':
        if (validation.target && validation.value) {
          const element = document.querySelector(validation.target);
          return element?.textContent?.includes(validation.value) || false;
        }
        break;
      
      case 'url_contains':
        if (validation.value) {
          return window.location.href.includes(validation.value);
        }
        break;
    }

    return false;
  };

  const currentStep = steps[activeStep];
  const progress = ((activeStep + 1) / steps.length) * 100;

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      className={className}
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
            {tutorialId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${activeStep + 1} of ${steps.length}`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
            <IconButton onClick={handleClose} size="small">
              <X />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: isMobile ? 'calc(100vh - 120px)' : 500 }}>
          {/* Stepper Sidebar */}
          <Box sx={{ 
            width: isMobile ? '100%' : 300, 
            borderRight: isMobile ? 'none' : 1, 
            borderColor: 'divider',
            p: 2,
            overflow: 'auto'
          }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.id} completed={completedSteps.has(index)}>
                  <StepLabel
                    onClick={() => handleStepClick(index)}
                    sx={{ 
                      cursor: 'pointer',
                      '& .MuiStepLabel-label': {
                        fontSize: '0.875rem'
                      }
                    }}
                  >
                    {step.title}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
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
            {/* Progress Bar */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ 
                width: '100%', 
                height: 4, 
                bgcolor: 'action.hover', 
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  width: `${progress}%`, 
                  height: '100%', 
                  bgcolor: 'primary.main',
                  transition: 'width 0.3s ease'
                }} />
              </Box>
            </Box>

            {/* Step Content */}
            <Box sx={{ flex: 1, mb: 3 }}>
              {/* Use VisualTutorialStep if screenshot is available, otherwise use standard layout */}
              {currentStep.screenshot ? (
                <VisualTutorialStep
                  step={currentStep}
                  onNext={activeStep < steps.length - 1 ? () => handleNext() : undefined}
                  onPrevious={activeStep > 0 ? () => handlePrevious() : undefined}
                  onClose={handleClose}
                  showNavigation={false}
                />
              ) : (
                <>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {currentStep.title}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {currentStep.content}
                  </Typography>

                  {/* Media */}
                  {currentStep.media && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      {currentStep.media.type === 'image' && (
                        <img
                          src={currentStep.media.url}
                          alt={currentStep.media.alt || currentStep.title}
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                      )}
                      {currentStep.media.type === 'video' && (
                        <video
                          src={currentStep.media.url}
                          controls
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 8
                          }}
                        />
                      )}
                      {currentStep.media.type === 'gif' && (
                        <img
                          src={currentStep.media.url}
                          alt={currentStep.media.alt || currentStep.title}
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: 8
                          }}
                        />
                      )}
                    </Box>
                  )}
                </>
              )}

              {/* Action Button */}
              {currentStep.action && (
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleAction(currentStep.action)}
                    disabled={isValidating}
                    startIcon={isValidating ? <CircularProgress size={16} /> : <Play />}
                    sx={{ mr: 2 }}
                  >
                    {isValidating ? 'Executing...' : 'Try This Action'}
                  </Button>
                  
                  {currentStep.hints && currentStep.hints.length > 0 && (
                    <Button
                      variant="outlined"
                      onClick={() => setShowHints(!showHints)}
                      startIcon={<RotateCcw />}
                    >
                      {showHints ? 'Hide' : 'Show'} Hints
                    </Button>
                  )}
                </Box>
              )}

              {/* Hints */}
              {showHints && currentStep.hints && currentStep.hints.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: 'action.hover', mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    💡 Hints:
                  </Typography>
                  {currentStep.hints.map((hint, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      • {hint}
                    </Typography>
                  ))}
                </Paper>
              )}
            </Box>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                onClick={handlePrevious}
                disabled={activeStep === 0}
                startIcon={<ArrowLeft />}
              >
                Previous
              </Button>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handlePlayPause}
                  color="primary"
                >
                  {isPlaying ? <Pause /> : <Play />}
                </IconButton>
                
                <IconButton
                  onClick={() => setActiveStep(0)}
                  disabled={activeStep === 0}
                >
                  <ChevronLeft />
                </IconButton>
                
                <IconButton
                  onClick={() => setActiveStep(steps.length - 1)}
                  disabled={activeStep === steps.length - 1}
                >
                  <ChevronRight />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowRight />}
              >
                {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
