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
import { AI_PROVIDERS, AIProvider } from '@/lib/ai-providers';

interface AIProviderSelectorProps {
  selectedProvider?: string;
  onProviderSelect: (providerId: string) => void;
  onSetupProvider: (provider: AIProvider) => void;
  className?: string;
}

export function AIProviderSelector({
  selectedProvider,
  onProviderSelect,
  onSetupProvider,
  className = ''
}: AIProviderSelectorProps) {
  const [filter, setFilter] = useState<'all' | 'free' | 'low-cost' | 'premium'>('all');

  const filteredProviders = AI_PROVIDERS.filter(provider => {
    if (filter === 'all') return true;
    if (filter === 'free') return provider.pricing.model === 'free';
    if (filter === 'low-cost') return provider.pricing.costPerRequest && provider.pricing.costPerRequest < 0.005;
    if (filter === 'premium') return provider.pricing.costPerRequest && provider.pricing.costPerRequest >= 0.005;
    return true;
  });

  const getPricingBadge = (provider: AIProvider) => {
    if (provider.pricing.model === 'free') {
      return <Chip label="Free" variant="outlined" sx={{ bgcolor: 'green.100', color: 'green.800' }} />;
    }
    if (provider.pricing.costPerRequest && provider.pricing.costPerRequest < 0.005) {
      return <Chip label="Low Cost" variant="outlined" sx={{ bgcolor: 'blue.100', color: 'blue.800' }} />;
    }
    return <Chip label="Premium" variant="outlined" sx={{ bgcolor: 'purple.100', color: 'purple.800' }} />;
  };

  const getStatusBadge = (provider: AIProvider) => {
    switch (provider.status) {
      case 'available':
        return <Chip label="Available" variant="outlined" className="bg-green-500" />;
      case 'beta':
        return <Chip label="Beta" variant="outlined" className="bg-yellow-100 text-yellow-800" />;
      case 'coming_soon':
        return <Chip label="Coming Soon" variant="outlined" className="border-gray-300 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} className={className}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>Choose Your AI Provider</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '42rem', mx: 'auto' }}>
          Select from multiple AI providers to find the perfect balance of cost, quality, and features for your content creation needs.
        </Typography>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'inline-flex', borderRadius: '8px', bgcolor: 'grey.100', p: 0.5 }}>
          {[
            { key: 'all', label: 'All Options', icon: Brain },
            { key: 'free', label: 'Free', icon: Activity },
            { key: 'low-cost', label: 'Low Cost', icon: Brain },
            { key: 'premium', label: 'Premium', icon: Activity }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setFilter(key as 'all' | 'free' | 'premium')}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'colors 0.2s ease',
                ...(filter === key
                  ? { bgcolor: 'white', color: 'grey.900', boxShadow: 1 }
                  : { color: 'grey.600', '&:hover': { color: 'grey.900' } }
                )
              }}
            >
              <Icon style={{ width: 16, height: 16 }} />
              {label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card
            key={provider.id}
            className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
              selectedProvider === provider.id
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onProviderSelect(provider.id)}
          >
            {/* Provider Header */}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${provider.color}`}>
                    {provider.icon}
                  </div>
                  <div>
                    <Typography variant="h6">{provider.name}</Typography>
                    <Typography variant="body2">
                      {provider.description}
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {getPricingBadge(provider)}
                  {getStatusBadge(provider)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Pricing Info */}
              <Box sx={{ bgcolor: 'grey.50', borderRadius: '8px', p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Pricing</Typography>
                  {provider.pricing.costPerRequest === 0 ? (
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>Free</Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      ${provider.pricing.costPerRequest?.toFixed(3)}/request
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{provider.pricing.details}</Typography>
                {provider.pricing.monthlyLimit && (
                  <Typography variant="body2" sx={{ color: 'text.disabled', mt: 0.5 }}>
                    {provider.pricing.monthlyLimit} requests/month included
                  </Typography>
                )}
              </Box>

              {/* Features */}
              <div>
                <Typography variant="body2" className="text-gray-700 font-medium mb-2">Key Features</Typography>
                <div className="space-y-1">
                  {provider.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Chip label={<Brain className="w-3 h-3 text-green-500 flex-shrink-0" />} />
                      {feature}
                    </div>
                  ))}
                  {provider.features.length > 3 && (
                    <Typography variant="body2" className="text-gray-500 mt-1">
                      +{provider.features.length - 3} more features
                    </Typography>
                  )}
                </div>
              </div>

              {/* Setup Requirements */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Typography variant="body2" className="text-gray-500">
                  {provider.setupRequired ? (
                    <Chip label="Setup required" variant="outlined" className="flex items-center gap-1" />
                  ) : (
                    <Chip label="Ready to use" variant="outlined" className="flex items-center gap-1 text-green-600" />
                  )}
                </Typography>
                
                {provider.status === 'available' && (
                  <Button
                    size="small"
                    variant={selectedProvider === provider.id ? "contained" : "outlined"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (provider.setupRequired) {
                        onSetupProvider(provider);
                      } else {
                        onProviderSelect(provider.id);
                      }
                    }}
                  >
                    {selectedProvider === provider.id ? (
                      <>
                        <Chip label="Selected" variant="outlined" className="flex items-center gap-1" />
                      </>
                    ) : provider.setupRequired ? (
                      <>
                        <Chip label="Setup" variant="outlined" className="flex items-center gap-1" />
                      </>
                    ) : (
                      <>
                        <Chip label="Select" variant="outlined" className="flex items-center gap-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <Typography variant="h6" className="text-lg font-semibold text-gray-900 mb-3">💡 Recommendations</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} component="div">
            <Box className="space-y-2">
              <Typography variant="subtitle1" className="font-medium text-gray-800">🎯 For Beginners</Typography>
              <Typography variant="body2" className="text-gray-600">Start with <strong>CreatorFlow AI</strong> or <strong>DeepSeek</strong> - both free and easy to use.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} component="div">
            <Box className="space-y-2">
              <Typography variant="subtitle1" className="font-medium text-gray-800">💰 For Budget-Conscious</Typography>
              <Typography variant="body2" className="text-gray-600">Try <strong>Google AI</strong> or <strong>Hugging Face</strong> - excellent quality at low cost.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} component="div">
            <Box className="space-y-2">
              <Typography variant="subtitle1" className="font-medium text-gray-800">🔒 For Privacy</Typography>
              <Typography variant="body2" className="text-gray-600">Use <strong>Local AI (Ollama)</strong> - runs completely on your device.</Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
} 