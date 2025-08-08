'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip,
  Tabs,
  Tab,
  Container,
  Grid,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
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
  BarChart3,
  Star,
  Shield,
  Info
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hasAPIKey) {
    return <AIOnboarding />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              AI Tools
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Supercharge your content creation with AI-powered tools
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<Zap style={{ width: 16, height: 16 }} />}
              label="AI Enabled"
              color="success"
              variant="outlined"
            />
            <Button variant="outlined" size="small" startIcon={<Settings style={{ width: 16, height: 16 }} />}>
              Settings
            </Button>
          </Box>
        </Box>

        {/* AI Provider Filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Filter by:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="text"
              size="small"
              startIcon={<Star style={{ width: 16, height: 16 }} />}
              sx={{ textTransform: 'none' }}
            >
              All Options
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Zap style={{ width: 16, height: 16 }} />}
              sx={{ textTransform: 'none' }}
            >
              Popular
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ width: '100%' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Overview" value="overview" />
                <Tab label="Content Creation" value="content" />
                <Tab label="Analytics" value="analytics" />
                <Tab label="Optimization" value="optimization" />
              </Tabs>
            </Box>

            {/* Overview Tab */}
            <Box role="tabpanel" hidden={activeTab !== 'overview'} sx={{ pt: 3 }}>
              {activeTab === 'overview' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Card>
                      <CardHeader
                        title="Smart Caption Generator"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        avatar={<Sparkles style={{ width: 24, height: 24, color: '#3b82f6' }} />}
                      />
                      <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Generate engaging captions for your content using AI
                        </Typography>
                        <SmartCaptionGenerator />
                      </CardContent>
                    </Card>
                  </Box>

                  <Box>
                    <Card>
                      <CardHeader
                        title="Hashtag Recommender"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        avatar={<Hash style={{ width: 24, height: 24, color: '#8b5cf6' }} />}
                      />
                      <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Find the best hashtags to increase your reach
                        </Typography>
                        <AdvancedHashtagRecommender />
                      </CardContent>
                    </Card>
                  </Box>

                  <Box>
                    <Card>
                      <CardHeader
                        title="Content Ideas"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        avatar={<Lightbulb style={{ width: 24, height: 24, color: '#f59e0b' }} />}
                      />
                      <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Get AI-powered content ideas based on your niche
                        </Typography>
                        <ContentIdeasGenerator />
                      </CardContent>
                    </Card>
                  </Box>

                  <Box>
                    <Card>
                      <CardHeader
                        title="Posting Time Predictor"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        avatar={<Clock style={{ width: 24, height: 24, color: '#10b981' }} />}
                      />
                      <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Find the optimal times to post for maximum engagement
                        </Typography>
                        <OptimalPostingTimePredictor />
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Content Creation Tab */}
            <Box role="tabpanel" hidden={activeTab !== 'content'} sx={{ pt: 3 }}>
              {activeTab === 'content' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                  <Box>
                    <Card>
                      <CardHeader
                        title="Content Creation Tools"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        avatar={<Sparkles style={{ width: 24, height: 24, color: '#3b82f6' }} />}
                      />
                      <CardContent>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Advanced AI tools for content creation and optimization
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                          <Box>
                            <SmartCaptionGenerator />
                          </Box>
                          <Box>
                            <AdvancedHashtagRecommender />
                          </Box>
                          <Box sx={{ gridColumn: '1 / -1' }}>
                            <ContentIdeasGenerator />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Analytics Tab */}
            <Box role="tabpanel" hidden={activeTab !== 'analytics'} sx={{ pt: 3 }}>
              {activeTab === 'analytics' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                  <Box>
                    <Card>
                      <CardHeader
                        title="Performance Predictor"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        avatar={<TrendingUp style={{ width: 24, height: 24, color: '#ef4444' }} />}
                      />
                      <CardContent>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Predict how your content will perform before posting
                        </Typography>
                        <ContentPerformancePredictor />
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Optimization Tab */}
            <Box role="tabpanel" hidden={activeTab !== 'optimization'} sx={{ pt: 3 }}>
              {activeTab === 'optimization' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Card>
                      <CardHeader
                        title="Optimal Posting Times"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        avatar={<Clock style={{ width: 24, height: 24, color: '#10b981' }} />}
                      />
                      <CardContent>
                        <OptimalPostingTimePredictor />
                      </CardContent>
                    </Card>
                  </Box>
                  <Box>
                    <Card>
                      <CardHeader
                        title="Content Performance"
                        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                        avatar={<BarChart3 style={{ width: 24, height: 24, color: '#8b5cf6' }} />}
                      />
                      <CardContent>
                        <ContentPerformancePredictor />
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              )}
            </Box>
          </Tabs>
        </Box>

        {/* AI Provider Setup Modal */}
        {setupModalOpen && selectedProviderForSetup && (
          <AIProviderSetupModal
            provider={selectedProviderForSetup}
            open={setupModalOpen}
            onClose={() => setSetupModalOpen(false)}
            onComplete={handleSetupComplete}
          />
        )}
      </Box>
    </Container>
  );
} 