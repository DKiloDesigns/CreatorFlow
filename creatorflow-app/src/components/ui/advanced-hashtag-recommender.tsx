'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { 
  Hash, 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3, 
  Search, 
  Copy, 
  RefreshCw,
  Zap,
  Eye,
  Clock,
  Globe,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  Brain,
  Lightbulb,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

interface HashtagData {
  hashtag: string;
  posts: number;
  reach: number;
  engagement_rate: number;
  trending_score: number;
  competition_level: 'low' | 'medium' | 'high';
  growth_rate: number;
  audience_overlap: number;
  seasonal_trend: 'rising' | 'stable' | 'declining';
  best_posting_times: string[];
  related_hashtags: string[];
  top_performers: string[];
  content_types: string[];
  language_distribution: { [key: string]: number };
  sentiment_score: number;
  brand_safety_score: number;
  cost_per_click?: number;
  suggested_bid?: number;
}

interface HashtagRecommendation {
  category: 'trending' | 'niche' | 'competitor' | 'seasonal' | 'branded' | 'location';
  hashtags: HashtagData[];
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

interface AdvancedHashtagRecommenderProps {
  provider: string;
}

export function AdvancedHashtagRecommender({ provider }: AdvancedHashtagRecommenderProps) {
  const [content, setContent] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<HashtagRecommendation[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeTrending, setIncludeTrending] = useState(true);
  const [includeNiche, setIncludeNiche] = useState(true);
  const [includeCompetitor, setIncludeCompetitor] = useState(true);
  const [includeSeasonal, setIncludeSeasonal] = useState(true);
  const [maxHashtags, setMaxHashtags] = useState(30);
  const [minEngagement, setMinEngagement] = useState(2.0);
  const [competitorAccounts, setCompetitorAccounts] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('english');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸', maxHashtags: 30 },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', maxHashtags: 5 },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', maxHashtags: 3 },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', maxHashtags: 5 },
    { id: 'facebook', name: 'Facebook', icon: '📘', maxHashtags: 10 },
    { id: 'youtube', name: 'YouTube', icon: '📺', maxHashtags: 15 }
  ];

  const currentPlatform = platforms.find(p => p.id === platform);

  const analyzeHashtags = async () => {
    if (!content.trim() && !industry.trim()) {
      toast.error('Please enter content or industry to analyze hashtags');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis with realistic delays
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockRecommendations: HashtagRecommendation[] = [
        {
          category: 'trending',
          priority: 'high',
          reasoning: 'These hashtags are currently trending and have high engagement potential',
          hashtags: [
            {
              hashtag: '#techinnovation',
              posts: 125000,
              reach: 8500000,
              engagement_rate: 4.2,
              trending_score: 92,
              competition_level: 'medium',
              growth_rate: 15.3,
              audience_overlap: 78,
              seasonal_trend: 'rising',
              best_posting_times: ['9:00 AM', '2:00 PM', '7:00 PM'],
              related_hashtags: ['#innovation', '#technology', '#future'],
              top_performers: ['@techcrunch', '@wired', '@theverge'],
              content_types: ['video', 'carousel', 'story'],
              language_distribution: { english: 85, spanish: 8, french: 4, german: 3 },
              sentiment_score: 8.5,
              brand_safety_score: 9.2
            },
            {
              hashtag: '#startuplife',
              posts: 89000,
              reach: 6200000,
              engagement_rate: 3.8,
              trending_score: 88,
              competition_level: 'low',
              growth_rate: 12.7,
              audience_overlap: 82,
              seasonal_trend: 'stable',
              best_posting_times: ['8:00 AM', '1:00 PM', '6:00 PM'],
              related_hashtags: ['#entrepreneur', '#business', '#startup'],
              top_performers: ['@ycombinator', '@techstars', '@500startups'],
              content_types: ['image', 'video', 'story'],
              language_distribution: { english: 90, spanish: 5, french: 3, german: 2 },
              sentiment_score: 8.2,
              brand_safety_score: 8.8
            }
          ]
        },
        {
          category: 'niche',
          priority: 'medium',
          reasoning: 'Specialized hashtags with high engagement in your specific niche',
          hashtags: [
            {
              hashtag: '#saasgrowth',
              posts: 15000,
              reach: 1200000,
              engagement_rate: 6.8,
              trending_score: 65,
              competition_level: 'low',
              growth_rate: 8.9,
              audience_overlap: 95,
              seasonal_trend: 'rising',
              best_posting_times: ['9:00 AM', '3:00 PM', '8:00 PM'],
              related_hashtags: ['#saas', '#growthhacking', '#startup'],
              top_performers: ['@producthunt', '@indiehackers', '@saasgrowth'],
              content_types: ['carousel', 'video', 'image'],
              language_distribution: { english: 95, spanish: 3, french: 2 },
              sentiment_score: 8.8,
              brand_safety_score: 9.5
            }
          ]
        },
        {
          category: 'competitor',
          priority: 'high',
          reasoning: 'Hashtags used by your competitors with proven success',
          hashtags: [
            {
              hashtag: '#productivityhacks',
              posts: 45000,
              reach: 3800000,
              engagement_rate: 4.1,
              trending_score: 72,
              competition_level: 'high',
              growth_rate: 9.2,
              audience_overlap: 88,
              seasonal_trend: 'stable',
              best_posting_times: ['7:00 AM', '12:00 PM', '5:00 PM'],
              related_hashtags: ['#productivity', '#hacks', '#tips'],
              top_performers: ['@notion', '@asana', '@trello'],
              content_types: ['video', 'carousel', 'story'],
              language_distribution: { english: 88, spanish: 7, french: 3, german: 2 },
              sentiment_score: 7.9,
              brand_safety_score: 8.5
            }
          ]
        },
        {
          category: 'seasonal',
          priority: 'medium',
          reasoning: 'Seasonal hashtags relevant to current trends and events',
          hashtags: [
            {
              hashtag: '#newyeargoals',
              posts: 280000,
              reach: 15000000,
              engagement_rate: 3.2,
              trending_score: 95,
              competition_level: 'high',
              growth_rate: 25.1,
              audience_overlap: 65,
              seasonal_trend: 'rising',
              best_posting_times: ['6:00 AM', '12:00 PM', '9:00 PM'],
              related_hashtags: ['#2024goals', '#newyear', '#resolutions'],
              top_performers: ['@goalsetter', '@motivation', '@success'],
              content_types: ['image', 'video', 'story'],
              language_distribution: { english: 92, spanish: 5, french: 2, german: 1 },
              sentiment_score: 8.1,
              brand_safety_score: 9.0
            }
          ]
        }
      ];

      setRecommendations(mockRecommendations);
      toast.success('Hashtag analysis complete! Found 5 high-performing hashtags');
    } catch (error) {
      toast.error('Failed to analyze hashtags. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const copyHashtags = () => {
    const hashtagString = selectedHashtags.map(h => `#${h}`).join(' ');
    navigator.clipboard.writeText(hashtagString);
    toast.success('Hashtags copied to clipboard!');
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'declining': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Advanced Hashtag Recommender
          </CardTitle>
          <CardDescription>
            AI-powered hashtag analysis with trending detection, competitor insights, and performance predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Content Description</Label>
              <Input
                placeholder="Describe your content or key message..."
                value={content}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Industry/Niche</Label>
              <Input
                placeholder="e.g., tech, fitness, fashion, business..."
                value={industry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-2">
                        <span>{p.icon}</span>
                        <span>{p.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input
                placeholder="e.g., entrepreneurs, fitness enthusiasts..."
                value={targetAudience}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Location (Optional)</Label>
              <Input
                placeholder="e.g., New York, London, Tokyo..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              <Brain className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Analysis
            </Button>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Analysis Categories</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Trending Hashtags</span>
                        <Switch checked={includeTrending} onCheckedChange={setIncludeTrending} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Niche Hashtags</span>
                        <Switch checked={includeNiche} onCheckedChange={setIncludeNiche} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Competitor Analysis</span>
                        <Switch checked={includeCompetitor} onCheckedChange={setIncludeCompetitor} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Seasonal Trends</span>
                        <Switch checked={includeSeasonal} onCheckedChange={setIncludeSeasonal} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Competitor Accounts (Optional)</Label>
                    <Input
                      placeholder="e.g., @competitor1, @competitor2"
                      value={competitorAccounts.join(', ')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompetitorAccounts(e.target.value.split(',').map((s: string) => s.trim()))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Maximum Hashtags</Label>
                    <Input
                      type="number"
                      value={maxHashtags}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxHashtags(Number(e.target.value))}
                      min={1}
                      max={currentPlatform?.maxHashtags || 30}
                    />
                    <p className="text-xs text-gray-500">
                      Platform limit: {currentPlatform?.maxHashtags} hashtags
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Engagement Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={minEngagement}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinEngagement(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <Button
            onClick={analyzeHashtags}
            disabled={isAnalyzing || (!content.trim() && !industry.trim())}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Hashtags...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Hashtags with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Hashtag Recommendations</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedHashtags.length} selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={copyHashtags}
                disabled={selectedHashtags.length === 0}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Selected
              </Button>
            </div>
          </div>

          <Tabs defaultValue="recommendations" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trending Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(category.priority)}>
                          {category.priority.toUpperCase()}
                        </Badge>
                        <CardTitle className="capitalize">{category.category} Hashtags</CardTitle>
                      </div>
                      <Badge variant="outline">{category.hashtags.length} hashtags</Badge>
                    </div>
                    <CardDescription>{category.reasoning}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.hashtags.map((hashtag, hashtagIndex) => (
                        <div
                          key={hashtagIndex}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedHashtags.includes(hashtag.hashtag)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleHashtag(hashtag.hashtag)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">#{hashtag.hashtag}</h3>
                              <Badge className={getCompetitionColor(hashtag.competition_level)}>
                                {hashtag.competition_level} competition
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(hashtag.seasonal_trend)}
                              <span className="text-sm text-gray-600">
                                {hashtag.seasonal_trend}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-semibold text-blue-600">
                                {hashtag.posts.toLocaleString()}
                              </div>
                              <p className="text-gray-600">Posts</p>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-green-600">
                                {hashtag.engagement_rate}%
                              </div>
                              <p className="text-gray-600">Engagement</p>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-purple-600">
                                {hashtag.trending_score}
                              </div>
                              <p className="text-gray-600">Trend Score</p>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-orange-600">
                                {hashtag.growth_rate}%
                              </div>
                              <p className="text-gray-600">Growth</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t">
                            <div className="flex flex-wrap gap-1">
                              {hashtag.related_hashtags.slice(0, 3).map((related, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {related}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Top Performing Hashtags</h3>
                      <div className="space-y-2">
                        {recommendations.flatMap(cat => cat.hashtags)
                          .sort((a, b) => b.engagement_rate - a.engagement_rate)
                          .slice(0, 5)
                          .map((hashtag, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="font-medium">#{hashtag.hashtag}</span>
                              <span className="text-green-600 font-semibold">{hashtag.engagement_rate}%</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Trending Analysis</h3>
                      <div className="space-y-2">
                        {recommendations.flatMap(cat => cat.hashtags)
                          .sort((a, b) => b.trending_score - a.trending_score)
                          .slice(0, 5)
                          .map((hashtag, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="font-medium">#{hashtag.hashtag}</span>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 font-semibold">{hashtag.trending_score}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trending Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-800">Rising Trends</h3>
                      <p className="text-green-600 text-sm">15 hashtags trending up</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Minus className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-yellow-800">Stable Trends</h3>
                      <p className="text-yellow-600 text-sm">8 hashtags maintaining</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-red-800">Declining Trends</h3>
                      <p className="text-red-600 text-sm">3 hashtags trending down</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
} 