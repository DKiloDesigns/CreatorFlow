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
import { Brain, Activity } from 'lucide-react';
import { APIKeySetup } from './api-key-setup';

interface AIOnboardingProps {
  onComplete?: () => void;
  className?: string;
}

export function AIOnboarding({ onComplete, className }: AIOnboardingProps) {
  const [step, setStep] = useState<'intro' | 'setup' | 'complete'>('intro');

  const benefits = [
    {
      icon: Activity,
      title: 'Smart Captions',
      description: 'Generate engaging captions in seconds',
      color: 'text-purple-600'
    },
    {
      icon: Activity,
      title: 'Perfect Hashtags',
      description: 'Find trending and relevant hashtags',
      color: 'text-blue-600'
    },
    {
      icon: Activity,
      title: 'Content Ideas',
      description: 'Never run out of creative post ideas',
      color: 'text-green-600'
    },
    {
      icon: Activity,
      title: 'Optimal Timing',
      description: 'Post when your audience is most active',
      color: 'text-orange-600'
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
      <div className={className}>
        <APIKeySetup onKeyAdded={handleSetupComplete} />
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
            <p className="text-muted-foreground">
              Your AI features are now ready to use. Let&apos;s get started!
            </p>
          </div>
          <Button onClick={onComplete} className="w-full">
            <Activity className="h-4 w-4 mr-2" />
            Start Using AI Tools
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to AI-Powered Content Creation
        </h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Supercharge your social media presence with intelligent AI tools that help you create engaging content faster than ever.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Chip label="Powered by OpenAI" variant="outlined" size="small" />
          <Chip label="Secure & Private" variant="outlined" size="small" />
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {benefits.map((benefit, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className={`p-3 rounded-lg w-fit mb-4 ${benefit.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Setup */}
      <Card className="mb-8">
        <CardHeader>
          <Typography variant="h5" component="h2" className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Setup - 2 Minutes
          </Typography>
        </CardHeader>
        <CardContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Box className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Typography variant="h6" component="span" className="font-bold text-blue-600">1</Typography>
                </Box>
                <Typography variant="subtitle2" component="h4" className="font-medium mb-1">Get API Key</Typography>
                <Typography variant="body2" className="text-sm text-muted-foreground">
                  Visit OpenAI and create a free API key
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} component="div">
              <Box textAlign="center">
                <Box className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Typography variant="h6" component="span" className="font-bold text-green-600">2</Typography>
                </Box>
                <Typography variant="subtitle2" component="h4" className="font-medium mb-1">Enter Key</Typography>
                <Typography variant="body2" className="text-sm text-muted-foreground">
                  Paste your key securely in CreatorFlow
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} component="div">
              <Box textAlign="center">
                <Box className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Typography variant="h6" component="span" className="font-bold text-purple-600">3</Typography>
                </Box>
                <Typography variant="subtitle2" component="h4" className="font-medium mb-1">Start Creating</Typography>
                <Typography variant="body2" className="text-sm text-muted-foreground">
                  Generate amazing content instantly
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Button 
            onClick={() => setStep('setup')} 
            className="w-full"
            variant="contained"
            size="large"
          >
            <Activity className="h-5 w-5 mr-2" />
            Get Started with AI
            <Activity className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Pricing Info */}
      <Card>
        <CardContent className="p-6">
          <Box display="flex" alignItems="start" gap={2}>
            <Box className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="h-5 w-5 text-yellow-600" />
            </Box>
            <Box>
              <Typography variant="subtitle1" className="font-semibold mb-2">Cost-Effective AI</Typography>
              <Typography variant="body2" className="text-sm text-muted-foreground mb-3">
                OpenAI charges per API call, but costs are minimal. Typical usage:
              </Typography>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Caption generation: ~$0.002 per caption</li>
                <li>• Hashtag suggestions: ~$0.001 per request</li>
                <li>• Content ideas: ~$0.005 per idea set</li>
                <li>• Most users spend $1-5/month on AI features</li>
              </ul>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
} 