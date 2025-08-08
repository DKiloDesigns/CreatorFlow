'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Chip,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Brain, Sparkles, Zap, Activity, Settings } from 'lucide-react';

interface AISuggestion {
  type: 'content' | 'timing' | 'hashtag' | 'audience' | 'platform';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
}

interface ContentGenerationRequest {
  type: 'post' | 'caption' | 'hashtag' | 'bio' | 'ad_copy';
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  topic: string;
  tone: 'professional' | 'casual' | 'funny' | 'inspirational';
  length: 'short' | 'medium' | 'long';
  keywords?: string[];
  targetAudience?: string;
}

interface ContentOptimizationRequest {
  content: string;
  platform: string;
  targetMetrics: string[];
}

export default function AIPage() {
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [optimizedContent, setOptimizedContent] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [contentRequest, setContentRequest] = useState<ContentGenerationRequest>({
    type: 'post',
    platform: 'instagram',
    topic: '',
    tone: 'casual',
    length: 'medium',
    keywords: [],
    targetAudience: '',
  });
  const [optimizationRequest, setOptimizationRequest] = useState<ContentOptimizationRequest>({
    content: '',
    platform: 'instagram',
    targetMetrics: ['engagement', 'reach'],
  });

  const generateContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentRequest),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data.content);
      }
    } catch (error) {
      console.error('Content generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const optimizeContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimizationRequest),
      });

      if (response.ok) {
        const data = await response.json();
        setOptimizedContent(data.optimization.optimizedContent);
      }
    } catch (error) {
      console.error('Content optimization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'content_creation',
          type: 'content',
          platform: 'instagram',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Suggestions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'content': return <Activity className="h-4 w-4" />;
      case 'timing': return <Activity className="h-4 w-4" />;
      case 'hashtag': return <Activity className="h-4 w-4" />;
      case 'audience': return <Activity className="h-4 w-4" />;
      case 'platform': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            AI Features
          </h1>
          <p className="text-muted-foreground">Generate, optimize, and enhance your content with AI</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={getSuggestions} disabled={loading} variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            Get Suggestions
          </Button>
        </div>
      </div>

      {/* AI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" component="h3">Content Generated</Typography>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Typography variant="h4" component="div">24</Typography>
            <Typography variant="caption" color="text.secondary">
              This week
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" component="h3">Optimizations</Typography>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <Typography variant="h4" component="div" color="text.primary">12</Typography>
            <Typography variant="caption" color="text.secondary">
              Performance improved
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" component="h3">AI Suggestions</Typography>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <Typography variant="h4" component="div" color="text.primary">8</Typography>
            <Typography variant="caption" color="text.secondary">
              High impact
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="subtitle2" component="h3">Time Saved</Typography>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <Typography variant="h4" component="div" color="text.primary">6.5h</Typography>
            <Typography variant="caption" color="text.secondary">
              This week
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} className="space-y-6">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Generate" icon={<Activity />} />
            <Tab label="Optimize" icon={<Zap />} />
            <Tab label="Suggestions" icon={<Brain />} />
            <Tab label="Insights" icon={<Settings />} />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index="generate">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="h2" display="flex" alignItems="center" gap={1}>
                <Sparkles className="h-5 w-5" />
                AI Content Generation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate engaging content for any platform with AI assistance
              </Typography>
            </CardHeader>
            <CardContent className="space-y-6">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="content-type-label">Content Type</InputLabel>
                    <Select
                      labelId="content-type-label"
                      value={contentRequest.type} 
                      label="Content Type"
                      onChange={(event) => setContentRequest({...contentRequest, type: event.target.value as any})}
                    >
                      <MenuItem value="post">Post</MenuItem>
                      <MenuItem value="caption">Caption</MenuItem>
                      <MenuItem value="hashtag">Hashtags</MenuItem>
                      <MenuItem value="bio">Bio</MenuItem>
                      <MenuItem value="ad_copy">Ad Copy</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="platform-label">Platform</InputLabel>
                    <Select
                      labelId="platform-label"
                      value={contentRequest.platform} 
                      label="Platform"
                      onChange={(event) => setContentRequest({...contentRequest, platform: event.target.value as any})}
                    >
                      <MenuItem value="instagram">Instagram</MenuItem>
                      <MenuItem value="tiktok">TikTok</MenuItem>
                      <MenuItem value="youtube">YouTube</MenuItem>
                      <MenuItem value="twitter">Twitter</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="topic-label">Topic</InputLabel>
                    <Select
                      labelId="topic-label"
                      value={contentRequest.topic}
                      label="Topic"
                      onChange={(event) => setContentRequest({...contentRequest, topic: event.target.value})}
                    >
                      <MenuItem value="What's your content about?">What's your content about?</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="tone-label">Tone</InputLabel>
                    <Select
                      labelId="tone-label"
                      value={contentRequest.tone} 
                      label="Tone"
                      onChange={(event) => setContentRequest({...contentRequest, tone: event.target.value as any})}
                    >
                      <MenuItem value="professional">Professional</MenuItem>
                      <MenuItem value="casual">Casual</MenuItem>
                      <MenuItem value="funny">Funny</MenuItem>
                      <MenuItem value="inspirational">Inspirational</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="length-label">Length</InputLabel>
                    <Select
                      labelId="length-label"
                      value={contentRequest.length} 
                      label="Length"
                      onChange={(event) => setContentRequest({...contentRequest, length: event.target.value as any})}
                    >
                      <MenuItem value="short">Short</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="long">Long</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="target-audience-label">Target Audience</InputLabel>
                    <Select
                      labelId="target-audience-label"
                      value={contentRequest.targetAudience}
                      label="Target Audience"
                      onChange={(event) => setContentRequest({...contentRequest, targetAudience: event.target.value})}
                    >
                      <MenuItem value="Who is your target audience?">Who is your target audience?</MenuItem>
                    </Select>
                  </FormControl>

                  <Button onClick={generateContent} disabled={loading} className="w-full">
                    {loading ? (
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Content
                  </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="generated-content-label">Generated Content</InputLabel>
                    <Select
                      labelId="generated-content-label"
                      value={generatedContent}
                      label="Generated Content"
                      onChange={(event) => setGeneratedContent(event.target.value)}
                      fullWidth
                    >
                      <MenuItem value="AI-generated content will appear here...">AI-generated content will appear here...</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index="optimize">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="h2" display="flex" alignItems="center" gap={1}>
                <Zap className="h-5 w-5" />
                Content Optimization
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optimize your content for better performance and engagement
              </Typography>
            </CardHeader>
            <CardContent className="space-y-6">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="original-content-label">Original Content</InputLabel>
                    <Select
                      labelId="original-content-label"
                      value={optimizationRequest.content}
                      label="Original Content"
                      onChange={(event) => setOptimizationRequest({...optimizationRequest, content: event.target.value})}
                      fullWidth
                      multiline
                      rows={4}
                    >
                      <MenuItem value="Paste your content here...">Paste your content here...</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="platform-label">Platform</InputLabel>
                    <Select
                      labelId="platform-label"
                      value={optimizationRequest.platform} 
                      label="Platform"
                      onChange={(event) => setOptimizationRequest({...optimizationRequest, platform: event.target.value})}
                    >
                      <MenuItem value="instagram">Instagram</MenuItem>
                      <MenuItem value="tiktok">TikTok</MenuItem>
                      <MenuItem value="youtube">YouTube</MenuItem>
                      <MenuItem value="twitter">Twitter</MenuItem>
                    </Select>
                  </FormControl>

                  <Button onClick={optimizeContent} disabled={loading} className="w-full">
                    {loading ? (
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Optimize Content
                  </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="optimized-content-label">Optimized Content</InputLabel>
                    <Select
                      labelId="optimized-content-label"
                      value={optimizedContent}
                      label="Optimized Content"
                      onChange={(event) => setOptimizedContent(event.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                    >
                      <MenuItem value="Optimized content will appear here...">Optimized content will appear here...</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index="suggestions">
          <Card>
            <CardHeader>
              <Typography variant="h5" component="h2" display="flex" alignItems="center" gap={1}>
                <Brain className="h-5 w-5" />
                AI Suggestions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get personalized suggestions to improve your content strategy
              </Typography>
            </CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                  <Brain className="h-12 w-12 mx-auto mb-4" />
                  <Typography variant="body2">No suggestions yet. Click "Get Suggestions" to receive AI-powered recommendations.</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {suggestions.map((suggestion, index) => (
                    <Box key={index} sx={{ p: 2, border: '1px solid', borderRadius: 1, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          {getSuggestionIcon(suggestion.type)}
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <Typography variant="subtitle2">{suggestion.title}</Typography>
                              <Chip label={`${suggestion.impact} impact`} size="small" className={getImpactColor(suggestion.impact)} />
                              <Chip label={`${Math.round(suggestion.confidence * 100)}% confidence`} size="small" variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{suggestion.description}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Implementation:</Typography> {suggestion.implementation}
                          </Box>
                        </Box>
                        <Button size="small" variant="outlined">
                          <Activity className="h-3 w-3" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index="insights">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader>
                  <Typography variant="h5" component="h2" display="flex" alignItems="center" gap={1}>
                    <Activity className="h-5 w-5" />
                    Content Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-powered insights about your content performance
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">Engagement Rate</Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'semibold' }}>+12.5%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">Reach Growth</Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'semibold' }}>+8.3%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">Best Posting Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>6-8 PM</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">Top Performing Content</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>Video Posts</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader>
                  <Typography variant="h5" component="h2" display="flex" alignItems="center" gap={1}>
                    <Activity className="h-5 w-5" />
                    Audience Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI analysis of your audience behavior and preferences
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">Primary Audience</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>18-34 years</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">Top Interests</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>Tech, Fitness</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">Active Hours</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>Evening</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">Engagement Type</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>Comments</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Tabs>
    </div>
  );
} 