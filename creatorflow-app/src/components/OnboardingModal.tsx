'use client';

import React, { useState, useEffect } from 'react';
import { 
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import { Rocket, Activity, Sparkles, Users, Zap, Calendar, BarChart3, Settings } from 'lucide-react';

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
      case 'welcome': return <Sparkles className="h-6 w-6" />;
      case 'connect_accounts': return <Users className="h-6 w-6" />;
      case 'create_post': return <Zap className="h-6 w-6" />;
      case 'schedule_content': return <Calendar className="h-6 w-6" />;
      case 'analytics': return <BarChart3 className="h-6 w-6" />;
      default: return <Settings className="h-6 w-6" />;
    }
  };

  const getStepColor = (stepId: string) => {
    switch (stepId) {
      case 'welcome': return 'text-purple-600';
      case 'connect_accounts': return 'text-blue-600';
      case 'create_post': return 'text-green-600';
      case 'schedule_content': return 'text-orange-600';
      case 'analytics': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  if (steps.length === 0) return null;

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Welcome to CreatorFlow
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress.percentage}% Complete</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress.completed} of {progress.total} steps</span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="text-center space-y-4">
            <div className={`mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center ${getStepColor(currentStepData.id)}`}>
              {getStepIcon(currentStepData.id)}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">{currentStepData.title}</h3>
              <p className="text-muted-foreground mb-4">{currentStepData.description}</p>
            </div>

            {/* Step-specific content */}
            {currentStepData.id === 'welcome' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Let's get you started with CreatorFlow! We'll guide you through the essential features to help you create and manage your social media content effectively.
                </p>
              </div>
            )}

            {currentStepData.id === 'connect_accounts' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  Connect your social media accounts to start publishing content directly from CreatorFlow. We support Instagram, TikTok, YouTube, and Twitter.
                </p>
              </div>
            )}

            {currentStepData.id === 'create_post' && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-800">
                  Learn how to create engaging posts with our AI-powered content generation tools. You can create posts, captions, and hashtags optimized for each platform.
                </p>
              </div>
            )}

            {currentStepData.id === 'schedule_content' && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-800">
                  Schedule your content in advance to maintain a consistent posting schedule. Our AI can suggest the best times to post for maximum engagement.
                </p>
              </div>
            )}

            {currentStepData.id === 'analytics' && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm text-indigo-800">
                  Track your performance with detailed analytics and insights. Monitor engagement, reach, and audience growth across all your connected platforms.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center space-x-2">
              {currentStepData.required && (
                <Badge variant="secondary">Required</Badge>
              )}
            </div>

            <div className="flex space-x-2">
              {currentStepData.required ? (
                <Button onClick={() => completeStep(currentStepData.id)} disabled={loading}>
                  {loading ? 'Completing...' : 'Complete Step'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={skipStep}>
                    Skip
                  </Button>
                  <Button onClick={() => completeStep(currentStepData.id)} disabled={loading}>
                    {loading ? 'Completing...' : 'Complete'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 