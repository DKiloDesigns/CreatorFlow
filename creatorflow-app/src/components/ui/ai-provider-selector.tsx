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
      return <Chip label="Free" variant="outlined" className="bg-green-100 text-green-800" />;
    }
    if (provider.pricing.costPerRequest && provider.pricing.costPerRequest < 0.005) {
      return <Chip label="Low Cost" variant="outlined" className="bg-blue-100 text-blue-800" />;
    }
    return <Chip label="Premium" variant="outlined" className="bg-purple-100 text-purple-800" />;
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
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your AI Provider</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select from multiple AI providers to find the perfect balance of cost, quality, and features for your content creation needs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          {[
            { key: 'all', label: 'All Options', icon: Brain },
            { key: 'free', label: 'Free', icon: Activity },
            { key: 'low-cost', label: 'Low Cost', icon: Brain },
            { key: 'premium', label: 'Premium', icon: Activity }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => setFilter(key as 'all' | 'free' | 'premium')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

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
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <Typography variant="body2" className="text-gray-700 font-medium">Pricing</Typography>
                  {provider.pricing.costPerRequest === 0 ? (
                    <Typography variant="body2" className="text-green-600 font-semibold">Free</Typography>
                  ) : (
                    <Typography variant="body2" className="text-gray-900 font-semibold">
                      ${provider.pricing.costPerRequest?.toFixed(3)}/request
                    </Typography>
                  )}
                </div>
                <Typography variant="body2" className="text-gray-600 mt-1">{provider.pricing.details}</Typography>
                {provider.pricing.monthlyLimit && (
                  <Typography variant="body2" className="text-gray-500 mt-1">
                    {provider.pricing.monthlyLimit} requests/month included
                  </Typography>
                )}
              </div>

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
          <Grid item xs={12} md={4}>
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