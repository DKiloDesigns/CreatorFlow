'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  Calendar,
  Hash,
  Users,
  BarChart3,
  RefreshCw,
  Copy,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  MessageSquare,
  Image,
  Video,
  Music,
  FileText
} from 'lucide-react';

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
      case 'content': return <FileText className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'hashtag': return <Hash className="h-4 w-4" />;
      case 'audience': return <Users className="h-4 w-4" />;
      case 'platform': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
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
            <Lightbulb className="h-4 w-4 mr-2" />
            Get Suggestions
          </Button>
        </div>
      </div>

      {/* AI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimizations</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-xs text-muted-foreground">
              Performance improved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-xs text-muted-foreground">
              High impact
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">6.5h</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="optimize" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Optimize
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Content Generation
              </CardTitle>
              <CardDescription>
                Generate engaging content for any platform with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Content Type</label>
                    <Select 
                      value={contentRequest.type} 
                      onValueChange={(value) => setContentRequest({...contentRequest, type: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="caption">Caption</SelectItem>
                        <SelectItem value="hashtag">Hashtags</SelectItem>
                        <SelectItem value="bio">Bio</SelectItem>
                        <SelectItem value="ad_copy">Ad Copy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Platform</label>
                    <Select 
                      value={contentRequest.platform} 
                      onValueChange={(value) => setContentRequest({...contentRequest, platform: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Topic</label>
                    <Input 
                      placeholder="What's your content about?"
                      value={contentRequest.topic}
                      onChange={(e) => setContentRequest({...contentRequest, topic: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tone</label>
                    <Select 
                      value={contentRequest.tone} 
                      onValueChange={(value) => setContentRequest({...contentRequest, tone: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Length</label>
                    <Select 
                      value={contentRequest.length} 
                      onValueChange={(value) => setContentRequest({...contentRequest, length: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Target Audience</label>
                    <Input 
                      placeholder="Who is your target audience?"
                      value={contentRequest.targetAudience}
                      onChange={(e) => setContentRequest({...contentRequest, targetAudience: e.target.value})}
                    />
                  </div>

                  <Button onClick={generateContent} disabled={loading} className="w-full">
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Content
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Generated Content</label>
                    <div className="relative">
                      <Textarea 
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        placeholder="AI-generated content will appear here..."
                        className="min-h-[200px]"
                      />
                      {generatedContent && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(generatedContent)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Content Optimization
              </CardTitle>
              <CardDescription>
                Optimize your content for better performance and engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Original Content</label>
                    <Textarea 
                      placeholder="Paste your content here..."
                      value={optimizationRequest.content}
                      onChange={(e) => setOptimizationRequest({...optimizationRequest, content: e.target.value})}
                      className="min-h-[150px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Platform</label>
                    <Select 
                      value={optimizationRequest.platform} 
                      onValueChange={(value) => setOptimizationRequest({...optimizationRequest, platform: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={optimizeContent} disabled={loading} className="w-full">
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4 mr-2" />
                    )}
                    Optimize Content
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Optimized Content</label>
                    <div className="relative">
                      <Textarea 
                        value={optimizedContent}
                        onChange={(e) => setOptimizedContent(e.target.value)}
                        placeholder="Optimized content will appear here..."
                        className="min-h-[150px]"
                      />
                      {optimizedContent && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(optimizedContent)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Suggestions
              </CardTitle>
              <CardDescription>
                Get personalized suggestions to improve your content strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>No suggestions yet. Click "Get Suggestions" to receive AI-powered recommendations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getSuggestionIcon(suggestion.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{suggestion.title}</h3>
                              <Badge className={getImpactColor(suggestion.impact)}>
                                {suggestion.impact} impact
                              </Badge>
                              <Badge variant="outline">
                                {Math.round(suggestion.confidence * 100)}% confidence
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {suggestion.description}
                            </p>
                            <div className="text-xs">
                              <strong>Implementation:</strong> {suggestion.implementation}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Content Performance
                </CardTitle>
                <CardDescription>
                  AI-powered insights about your content performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engagement Rate</span>
                    <span className="font-semibold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reach Growth</span>
                    <span className="font-semibold text-blue-600">+8.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Best Posting Time</span>
                    <span className="font-semibold">6-8 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top Performing Content</span>
                    <span className="font-semibold">Video Posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Audience Insights
                </CardTitle>
                <CardDescription>
                  AI analysis of your audience behavior and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Primary Audience</span>
                    <span className="font-semibold">18-34 years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top Interests</span>
                    <span className="font-semibold">Tech, Fitness</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Hours</span>
                    <span className="font-semibold">Evening</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Engagement Type</span>
                    <span className="font-semibold">Comments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 