'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Check, ExternalLink, Zap, Shield, Star, Info } from 'lucide-react';
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
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Free</Badge>;
    }
    if (provider.pricing.costPerRequest && provider.pricing.costPerRequest < 0.005) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Low Cost</Badge>;
    }
    return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Premium</Badge>;
  };

  const getStatusBadge = (provider: AIProvider) => {
    switch (provider.status) {
      case 'available':
        return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case 'beta':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Beta</Badge>;
      case 'coming_soon':
        return <Badge variant="outline" className="border-gray-300 text-gray-600">Coming Soon</Badge>;
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
            { key: 'all', label: 'All Options', icon: Star },
            { key: 'free', label: 'Free', icon: Zap },
            { key: 'low-cost', label: 'Low Cost', icon: Shield },
            { key: 'premium', label: 'Premium', icon: Info }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
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
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {provider.description}
                    </CardDescription>
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
                  <span className="text-sm font-medium text-gray-700">Pricing</span>
                  {provider.pricing.costPerRequest === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    <span className="text-gray-900 font-semibold">
                      ${provider.pricing.costPerRequest?.toFixed(3)}/request
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{provider.pricing.details}</p>
                {provider.pricing.monthlyLimit && (
                  <p className="text-xs text-gray-500 mt-1">
                    {provider.pricing.monthlyLimit} requests/month included
                  </p>
                )}
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features</h4>
                <div className="space-y-1">
                  {provider.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                  {provider.features.length > 3 && (
                    <div className="text-xs text-gray-500 mt-1">
                      +{provider.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>

              {/* Setup Requirements */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-gray-500">
                  {provider.setupRequired ? (
                    <span className="flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Setup required
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check className="w-3 h-3" />
                      Ready to use
                    </span>
                  )}
                </div>
                
                {provider.status === 'available' && (
                  <Button
                    size="sm"
                    variant={selectedProvider === provider.id ? "default" : "outline"}
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
                        <Check className="w-4 h-4 mr-1" />
                        Selected
                      </>
                    ) : provider.setupRequired ? (
                      <>
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Setup
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-1" />
                        Select
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
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">🎯 For Beginners</h4>
            <p className="text-gray-600">Start with <strong>CreatorFlow AI</strong> or <strong>DeepSeek</strong> - both free and easy to use.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">💰 For Budget-Conscious</h4>
            <p className="text-gray-600">Try <strong>Google AI</strong> or <strong>Hugging Face</strong> - excellent quality at low cost.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">🔒 For Privacy</h4>
            <p className="text-gray-600">Use <strong>Local AI (Ollama)</strong> - runs completely on your device.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 