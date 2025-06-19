import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { APIKeySetup } from './api-key-setup';

interface AIOnboardingProps {
  onComplete?: () => void;
  className?: string;
}

export function AIOnboarding({ onComplete, className }: AIOnboardingProps) {
  const [step, setStep] = useState<'intro' | 'setup' | 'complete'>('intro');

  const benefits = [
    {
      icon: Sparkles,
      title: 'Smart Captions',
      description: 'Generate engaging captions in seconds',
      color: 'text-purple-600'
    },
    {
      icon: Target,
      title: 'Perfect Hashtags',
      description: 'Find trending and relevant hashtags',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Content Ideas',
      description: 'Never run out of creative post ideas',
      color: 'text-green-600'
    },
    {
      icon: Zap,
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
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
            <p className="text-muted-foreground">
              Your AI features are now ready to use. Let's get started!
            </p>
          </div>
          <Button onClick={onComplete} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
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
          <Badge variant="outline" className="text-sm">
            <Zap className="h-3 w-3 mr-1" />
            Powered by OpenAI
          </Badge>
          <Badge variant="outline" className="text-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Secure & Private
          </Badge>
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
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Setup - 2 Minutes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-medium mb-1">Get API Key</h4>
              <p className="text-sm text-muted-foreground">
                Visit OpenAI and create a free API key
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-green-600">2</span>
              </div>
              <h4 className="font-medium mb-1">Enter Key</h4>
              <p className="text-sm text-muted-foreground">
                Paste your key securely in CreatorFlow
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-medium mb-1">Start Creating</h4>
              <p className="text-sm text-muted-foreground">
                Generate amazing content instantly
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setStep('setup')} 
            className="w-full"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Get Started with AI
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Pricing Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cost-Effective AI</h3>
              <p className="text-sm text-muted-foreground mb-3">
                OpenAI charges per API call, but costs are minimal. Typical usage:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Caption generation: ~$0.002 per caption</li>
                <li>• Hashtag suggestions: ~$0.001 per request</li>
                <li>• Content ideas: ~$0.005 per idea set</li>
                <li>• Most users spend $1-5/month on AI features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 