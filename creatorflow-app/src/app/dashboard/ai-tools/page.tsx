'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIProviderSelector } from '@/components/ui/ai-provider-selector';
import { AIProviderSetupModal } from '@/components/ui/ai-provider-setup-modal';
import { SmartCaptionGenerator } from '@/components/ui/smart-caption-generator';
import { AdvancedHashtagRecommender } from '@/components/ui/advanced-hashtag-recommender';
import { ContentIdeasGenerator } from '@/components/ui/content-ideas-generator';
import { OptimalPostingTimePredictor } from '@/components/ui/optimal-posting-time-predictor';
import { ContentPerformancePredictor } from '@/components/ui/content-performance-predictor';
import { AIOnboarding } from '@/components/ui/ai-onboarding';
import { useAPIKey } from '@/hooks/use-api-key';
import { AI_PROVIDERS, AIProvider } from '@/lib/ai-providers';
import { 
  Sparkles, 
  Hash, 
  Lightbulb, 
  Clock, 
  Settings, 
  Zap,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';

export default function AIToolsPage() {
  const { hasAPIKey, isChecking } = useAPIKey();
  const [selectedProvider, setSelectedProvider] = useState<string>('creatorflow_ai');
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedProviderForSetup, setSelectedProviderForSetup] = useState<AIProvider | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleSetupProvider = (provider: AIProvider) => {
    setSelectedProviderForSetup(provider);
    setSetupModalOpen(true);
  };

  const handleSetupComplete = (providerId: string, apiKey: string) => {
    setSelectedProvider(providerId);
    // Here you would save the API key to your backend
    console.log(`API key saved for ${providerId}`);
  };

  const selectedProviderData = AI_PROVIDERS.find(p => p.id === selectedProvider);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasAPIKey) {
    return <AIOnboarding />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Tools</h1>
          <p className="text-gray-600 mt-2">
            Supercharge your content creation with AI-powered tools
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Zap className="w-3 h-3 mr-1" />
            AI Enabled
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Provider
          </CardTitle>
          <CardDescription>
            Choose your preferred AI provider for content generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIProviderSelector
            selectedProvider={selectedProvider}
            onProviderSelect={handleProviderSelect}
            onSetupProvider={handleSetupProvider}
          />
        </CardContent>
      </Card>

      {/* AI Tools */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="caption" className="text-xs sm:text-sm">Caption Generator</TabsTrigger>
          <TabsTrigger value="hashtags" className="text-xs sm:text-sm">Hashtag Recommender</TabsTrigger>
          <TabsTrigger value="ideas" className="text-xs sm:text-sm">Content Ideas</TabsTrigger>
          <TabsTrigger value="scheduling" className="text-xs sm:text-sm">Posting Times</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance Predictor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Generations</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+23% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time Saved</p>
                    <p className="text-2xl font-bold text-gray-900">47h</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+15% efficiency</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Engagement Boost</p>
                    <p className="text-2xl font-bold text-gray-900">+34%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+8% this week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Generate content quickly with these AI-powered tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  className="h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  onClick={() => setActiveTab('caption')}
                >
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
                  <span>Generate Caption</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  onClick={() => setActiveTab('hashtags')}
                >
                  <Hash className="w-4 h-4 sm:w-6 sm:h-6" />
                  <span>Find Hashtags</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveTab('ideas')}
                >
                  <Lightbulb className="w-6 h-6" />
                  <span>Get Ideas</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveTab('scheduling')}
                >
                  <Clock className="w-6 h-6" />
                  <span>Best Times</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setActiveTab('performance')}
                >
                  <TrendingUp className="w-6 h-6" />
                  <span>Predict Performance</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'caption', content: 'Generated Instagram caption for travel post', time: '2 minutes ago', provider: 'CreatorFlow AI' },
                  { type: 'hashtags', content: 'Found trending hashtags for #tech', time: '15 minutes ago', provider: 'DeepSeek' },
                  { type: 'ideas', content: 'Generated 5 content ideas for fitness niche', time: '1 hour ago', provider: 'CreatorFlow AI' },
                  { type: 'scheduling', content: 'Analyzed optimal posting times for LinkedIn', time: '2 hours ago', provider: 'CreatorFlow AI' },
                  { type: 'performance', content: 'Predicted content performance with 92% confidence', time: '3 hours ago', provider: 'CreatorFlow AI' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {activity.type === 'caption' && <Sparkles className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'hashtags' && <Hash className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'ideas' && <Lightbulb className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'scheduling' && <Clock className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'performance' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.content}</p>
                        <p className="text-xs text-gray-500">via {activity.provider}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caption">
          <SmartCaptionGenerator provider={selectedProvider} />
        </TabsContent>

        <TabsContent value="hashtags">
          <AdvancedHashtagRecommender provider={selectedProvider} />
        </TabsContent>

        <TabsContent value="ideas">
          <ContentIdeasGenerator provider={selectedProvider} />
        </TabsContent>

        <TabsContent value="scheduling">
          <OptimalPostingTimePredictor provider={selectedProvider} />
        </TabsContent>

        <TabsContent value="performance">
          <ContentPerformancePredictor provider={selectedProvider} />
        </TabsContent>
      </Tabs>

      {/* Provider Setup Modal */}
      <AIProviderSetupModal
        provider={selectedProviderForSetup}
        isOpen={setupModalOpen}
        onClose={() => {
          setSetupModalOpen(false);
          setSelectedProviderForSetup(null);
        }}
        onSetupComplete={handleSetupComplete}
      />
    </div>
  );
} 