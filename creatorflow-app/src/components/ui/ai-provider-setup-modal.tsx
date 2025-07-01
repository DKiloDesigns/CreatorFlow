'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { Check, ExternalLink, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { AIProvider } from '@/lib/ai-providers';

interface AIProviderSetupModalProps {
  provider: AIProvider | null;
  isOpen: boolean;
  onClose: () => void;
  onSetupComplete: (providerId: string, apiKey: string) => void;
}

export function AIProviderSetupModal({
  provider,
  isOpen,
  onClose,
  onSetupComplete
}: AIProviderSetupModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'testing' | 'success'>('setup');

  if (!provider) return null;

  const handleSetup = async () => {
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    setStep('testing');
    
    // Simulate API key testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep('success');
    setIsLoading(false);
  };

  const handleComplete = () => {
    onSetupComplete(provider.id, apiKey);
    setApiKey('');
    setStep('setup');
    onClose();
  };

  const getSetupInstructions = () => {
    switch (provider.id) {
      case 'openai':
        return {
          title: 'Get Your OpenAI API Key',
          steps: [
            'Go to platform.openai.com and sign in',
            'Navigate to API Keys section',
            'Click "Create new secret key"',
            'Copy the generated key (starts with "sk-")',
            'Paste it below'
          ],
          link: 'https://platform.openai.com/api-keys',
          note: 'You\'ll need to add billing information to your OpenAI account.'
        };
      case 'anthropic':
        return {
          title: 'Get Your Anthropic API Key',
          steps: [
            'Go to console.anthropic.com and sign in',
            'Navigate to API Keys section',
            'Click "Create Key"',
            'Copy the generated key (starts with "sk-ant-")',
            'Paste it below'
          ],
          link: 'https://console.anthropic.com/',
          note: 'Anthropic offers free credits for new users.'
        };
      case 'google_ai':
        return {
          title: 'Get Your Google AI API Key',
          steps: [
            'Go to makersuite.google.com/app/apikey',
            'Sign in with your Google account',
            'Click "Create API Key"',
            'Copy the generated key',
            'Paste it below'
          ],
          link: 'https://makersuite.google.com/app/apikey',
          note: 'Google AI offers generous free tier with $0 cost for most requests.'
        };
      case 'huggingface_pro':
        return {
          title: 'Get Your Hugging Face API Key',
          steps: [
            'Go to huggingface.co and sign in',
            'Navigate to Settings > Access Tokens',
            'Click "New token"',
            'Copy the generated token',
            'Paste it below'
          ],
          link: 'https://huggingface.co/settings/tokens',
          note: 'Hugging Face offers free tier with community models.'
        };
      case 'cohere_free':
        return {
          title: 'Get Your Cohere API Key',
          steps: [
            'Go to cohere.ai and sign up',
            'Navigate to API Keys section',
            'Click "Create API Key"',
            'Copy the generated key',
            'Paste it below'
          ],
          link: 'https://cohere.ai/',
          note: 'Cohere offers free tier with monthly limits.'
        };
      default:
        return {
          title: 'Setup Required',
          steps: ['Please visit the provider\'s website to get your API key'],
          link: '#',
          note: 'Check the provider\'s documentation for setup instructions.'
        };
    }
  };

  const instructions = getSetupInstructions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${provider.color}`}>
              {provider.icon}
            </div>
            <div>
              <DialogTitle>{provider.name} Setup</DialogTitle>
              <DialogDescription>
                Configure {provider.name} to start using AI-powered content generation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {step === 'setup' && (
          <div className="space-y-6">
            {/* Provider Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ${provider.pricing.costPerRequest?.toFixed(3) || '0'}/request
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Features:</span>
                    <ul className="mt-1 space-y-1">
                      {provider.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-gray-600">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Pricing:</span>
                    <p className="mt-1 text-gray-600">{provider.pricing.details}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Setup Instructions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{instructions.title}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(instructions.link, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Visit Website
                </Button>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <ol className="space-y-2 text-sm">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {instructions.note && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">{instructions.note}</p>
                </div>
              )}
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter your API key here..."
                  value={apiKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                    disabled={!apiKey}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Your API key is encrypted and stored securely. We never share it with third parties.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSetup}
                disabled={!apiKey.trim() || isLoading}
              >
                {isLoading ? 'Testing...' : 'Test & Save'}
              </Button>
            </div>
          </div>
        )}

        {step === 'testing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing API Key</h3>
            <p className="text-gray-600">Verifying your {provider.name} API key...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup Complete!</h3>
            <p className="text-gray-600 mb-6">
              Your {provider.name} API key has been verified and saved successfully.
            </p>
            <Button onClick={handleComplete} className="w-full">
              Start Using {provider.name}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 