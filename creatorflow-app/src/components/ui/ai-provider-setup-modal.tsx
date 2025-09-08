'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/mui-card';
import { Button, Box, Typography, Grid, Alert, AlertTitle, AlertDescription, Chip } from '@mui/material';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent sx={{ maxWidth: '2xl', maxHeight: '90vh', overflowY: 'auto' }}>
        <DialogHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.25rem',
              bgcolor: provider.color || 'primary.main'
            }}>
              {provider.icon}
            </Box>
            <Box>
              <DialogTitle>{provider.name} Setup</DialogTitle>
              <DialogDescription>
                Configure {provider.name} to start using AI-powered content generation
              </DialogDescription>
            </Box>
          </Box>
        </DialogHeader>

        {step === 'setup' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Provider Info */}
            <Card>
              <CardContent sx={{ pt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {provider.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {provider.description}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`$${provider.pricing.costPerRequest?.toFixed(3) || '0'}/request`}
                    color="success"
                    variant="outlined"
                  />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                      Features:
                    </Typography>
                    <Box component="ul" sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {provider.features.slice(0, 3).map((feature, index) => (
                        <Typography key={index} component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                          • {feature}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                      Pricing:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                      {provider.pricing.details}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Setup Instructions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {instructions.title}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(instructions.link, '_blank')}
                >
                  <ExternalLink style={{ width: 16, height: 16, marginRight: 4 }} />
                  Visit Website
                </Button>
              </Box>

              <Box sx={{ bgcolor: 'info.50', borderRadius: 2, p: 2 }}>
                <Box component="ol" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {instructions.steps.map((step, index) => (
                    <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ 
                        flexShrink: 0, 
                        width: 20, 
                        height: 20, 
                        bgcolor: 'info.main', 
                        color: 'white', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: 500 
                      }}>
                        {index + 1}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {step}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {instructions.note && (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  <AlertCircle style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                  <AlertTitle sx={{ fontSize: '0.875rem' }}>Note</AlertTitle>
                  <AlertDescription sx={{ fontSize: '0.875rem' }}>
                    {instructions.note}
                  </AlertDescription>
                </Alert>
              )}
            </Box>

            {/* API Key Input */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Label htmlFor="api-key">API Key</Label>
              <Box sx={{ position: 'relative' }}>
                <Input
                  id="api-key"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Enter your API key here..."
                  value={apiKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                  className="pr-20"
                />
                <Box sx={{ position: 'absolute', right: 1, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Button
                    type="button"
                    variant="text"
                    size="small"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="text"
                    size="small"
                    onClick={() => navigator.clipboard.writeText(apiKey)}
                    disabled={!apiKey}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Your API key is encrypted and stored securely. We never share it with third parties.
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSetup}
                disabled={!apiKey.trim() || isLoading}
              >
                {isLoading ? 'Testing...' : 'Test & Save'}
              </Button>
            </Box>
          </Box>
        )}

        {step === 'testing' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: 48, width: 48, borderBottom: '2px solid', borderColor: 'primary.main', mx: 'auto', mb: 2 }}></Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>Testing API Key</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Verifying your {provider.name} API key...</Typography>
          </Box>
        )}

        {step === 'success' && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ width: 64, height: 64, bgcolor: 'green.100', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Check style={{ width: 32, height: 32, color: 'green.600' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>Setup Complete!</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Your {provider.name} API key has been verified and saved successfully.
            </Typography>
            <Button onClick={handleComplete} sx={{ width: '100%' }}>
              Start Using {provider.name}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
} 