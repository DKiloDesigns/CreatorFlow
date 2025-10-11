'use client';
'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Box,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import {
  PsychologyOutlined as BrainIcon,
  Timeline as ActivityIcon
} from '@mui/icons-material';
import { APIKeySetup } from './api-key-setup';

interface AIOnboardingProps {
  onComplete?: () => void;
  className?: string;
}

export function AIOnboarding({ onComplete, className }: AIOnboardingProps) {
  const [step, setStep] = useState<'intro' | 'setup' | 'complete'>('intro');

  const benefits = [
    {
      icon: ActivityIcon,
      title: 'Smart Captions',
      description: 'Generate engaging captions in seconds',
      color: 'purple.600'
    },
    {
      icon: ActivityIcon,
      title: 'Perfect Hashtags',
      description: 'Find trending and relevant hashtags',
      color: 'blue.600'
    },
    {
      icon: ActivityIcon,
      title: 'Content Ideas',
      description: 'Never run out of creative post ideas',
      color: 'green.600'
    },
    {
      icon: ActivityIcon,
      title: 'Optimal Timing',
      description: 'Post when your audience is most active',
      color: 'orange.600'
    }
  ];

  const handleSetupComplete = () => {
    setStep('complete');
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  };

  if (step === 'setup') {
    return (
      <Box sx={className ? { className } : {}}>
        <APIKeySetup onKeyAdded={handleSetupComplete} />
      </Box>
    );
  }

  if (step === 'complete') {
    return (
      <Card sx={className ? { className } : {}}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'success.50', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mx: 'auto', 
              mb: 2 
            }}>
              <ActivityIcon sx={{ width: 32, height: 32, color: 'success.main' }} />
            </Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>Setup Complete!</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Your AI features are now ready to use. Let&apos;s get started!
            </Typography>
          </Box>
          <Button onClick={onComplete} sx={{ width: '100%' }}>
            <ActivityIcon sx={{ width: 16, height: 16, marginRight: 8 }} />
            Start Using AI Tools
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={className ? { className } : {}}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ 
          width: 80, 
          height: 80, 
          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mx: 'auto', 
          mb: 3 
        }}>
          <BrainIcon sx={{ width: 40, height: 40, color: 'white' }} />
        </Box>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome to AI-Powered Content Creation
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3, maxWidth: '32rem', mx: 'auto' }}>
          Supercharge your social media presence with intelligent AI tools that help you create engaging content faster than ever.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Chip label="Powered by OpenAI" variant="outlined" size="small" />
          <Chip label="Secure & Private" variant="outlined" size="small" />
        </Box>
      </Box>

      {/* Benefits Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
        {benefits.map((benefit, index) => (
          <Card key={index} sx={{ 
            '&:hover': { 
              boxShadow: 3,
              transition: 'box-shadow 0.2s ease-in-out'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 1, 
                width: 'fit-content', 
                mb: 2,
                bgcolor: benefit.color === 'blue.600' ? 'blue.50' : 
                         benefit.color === 'green.600' ? 'green.50' : 
                         benefit.color === 'purple.600' ? 'purple.50' : 'orange.50'
              }}>
                <benefit.icon sx={{ 
                  width: 24, 
                  height: 24, 
                  color: benefit.color === 'blue.600' ? 'blue.main' : 
                         benefit.color === 'green.600' ? 'green.main' : 
                         benefit.color === 'purple.600' ? 'purple.main' : 'orange.main'
                }} />
              </Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>{benefit.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{benefit.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Setup */}
      <Card sx={{ mb: 4 }}>
        <CardHeader>
          <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ActivityIcon sx={{ width: 20, height: 20 }} />
            Quick Setup - 2 Minutes
          </Typography>
        </CardHeader>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'primary.50', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mx: 'auto', 
                mb: 1.5 
              }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>1</Typography>
              </Box>
              <Typography variant="subtitle2" component="h4" sx={{ fontWeight: 500, mb: 0.5 }}>Get API Key</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Visit OpenAI and create a free API key
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'success.50', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mx: 'auto', 
                mb: 1.5 
              }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'success.main' }}>2</Typography>
              </Box>
              <Typography variant="subtitle2" component="h4" sx={{ fontWeight: 500, mb: 0.5 }}>Enter Key</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Paste your key securely in CreatorFlow
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'secondary.50', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                mx: 'auto', 
                mb: 1.5 
              }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>3</Typography>
              </Box>
              <Typography variant="subtitle2" component="h4" sx={{ fontWeight: 500, mb: 0.5 }}>Start Creating</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Generate amazing content instantly
              </Typography>
            </Box>
          </Box>
          
          <Button 
            onClick={() => setStep('setup')} 
            sx={{ width: '100%' }}
            variant="contained"
            size="large"
          >
            <ActivityIcon sx={{ width: 20, height: 20, marginRight: 8 }} />
            Get Started with AI
            <ActivityIcon sx={{ width: 16, height: 16, marginLeft: 8 }} />
          </Button>
        </CardContent>
      </Card>

      {/* Pricing Info */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
            <Box sx={{ p: 1, bgcolor: 'warning.50', borderRadius: 1 }}>
              <ActivityIcon sx={{ width: 20, height: 20, color: 'warning.main' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Cost-Effective AI</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary', mb: 1.5 }}>
                OpenAI charges per API call, but costs are minimal. Typical usage:
              </Typography>
              <Box component="ul" sx={{ fontSize: '0.875rem', color: 'text.secondary', '& > li': { mb: 0.5 } }}>
                <Typography component="li">• Caption generation: ~$0.002 per caption</Typography>
                <Typography component="li">• Hashtag suggestions: ~$0.001 per request</Typography>
                <Typography component="li">• Content ideas: ~$0.005 per idea set</Typography>
                <Typography component="li">• Most users spend $1-5/month on AI features</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 