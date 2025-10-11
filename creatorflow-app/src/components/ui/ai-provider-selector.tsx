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
  TrendingUp as ActivityIcon
} from '@mui/icons-material';
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
        return <Chip label="Available" variant="outlined" sx={{ bgcolor: 'success.main', color: 'white' }} />;
      case 'beta':
        return <Chip label="Beta" variant="outlined" sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }} />;
      case 'coming_soon':
        return <Chip label="Coming Soon" variant="outlined" sx={{ borderColor: 'grey.300', color: 'grey.600' }} />;
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
            { key: 'all', label: 'All Options', icon: BrainIcon },
            { key: 'free', label: 'Free', icon: ActivityIcon },
            { key: 'low-cost', label: 'Low Cost', icon: BrainIcon },
            { key: 'premium', label: 'Premium', icon: ActivityIcon }
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
      <Grid container spacing={3}>
        {filteredProviders.map((provider) => (
          <Grid item xs={12} md={6} lg={4} key={provider.id}>
            <Card
              sx={{
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                  bgcolor: 'grey.50',
                },
                ...(selectedProvider === provider.id && {
                  border: 2,
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                }),
              }}
              onClick={() => onProviderSelect(provider.id)}
            >
            {/* Provider Header */}
            <CardHeader sx={{ pb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    bgcolor: provider.color
                  }}>
                    {provider.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{provider.name}</Typography>
                    <Typography variant="body2">
                      {provider.description}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {getPricingBadge(provider)}
                  {getStatusBadge(provider)}
                </Box>
              </Box>
            </CardHeader>

            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              <Box>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mb: 1 }}>
                  Key Features
                </Typography>
                <Box sx={{ '& > * + *': { mt: 0.5 } }}>
                  {provider.features.slice(0, 3).map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={<BrainIcon sx={{ width: 12, height: 12, color: 'green' }} />}
                        size="small"
                        sx={{ '& .MuiChip-label': { p: 0.5 } }}
                      />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                  {provider.features.length > 3 && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      +{provider.features.length - 3} more features
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Setup Requirements */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box>
                  {provider.setupRequired ? (
                    <Chip label="Setup required" variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} />
                  ) : (
                    <Chip label="Ready to use" variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }} />
                  )}
                </Box>

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
                      <Chip label="Selected" variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} />
                    ) : provider.setupRequired ? (
                      <Chip label="Setup" variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} />
                    ) : (
                      <Chip label="Select" variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} />
                    )}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recommendations */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)',
          borderRadius: 2,
          p: 3
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary', mb: 2 }}>
          💡 Recommendations
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ '& > * + *': { mt: 1 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                🎯 For Beginners
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Start with <strong>CreatorFlow AI</strong> or <strong>DeepSeek</strong> - both free and easy to use.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ '& > * + *': { mt: 1 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                💰 For Budget-Conscious
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Try <strong>Google AI</strong> or <strong>Hugging Face</strong> - excellent quality at low cost.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ '& > * + *': { mt: 1 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                🔒 For Privacy
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Use <strong>Local AI (Ollama)</strong> - runs completely on your device.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
} 