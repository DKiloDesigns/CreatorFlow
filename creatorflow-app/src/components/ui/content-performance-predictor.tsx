'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { 
  Lightbulb, 
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
  Calendar,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Video,
  Image,
  FileText,
  Mic,
  Play,
  Camera,
  Edit3,
  Hash,
  MapPin,
  CalendarDays,
  Clock3,
  Rocket,
  Crown,
  Trophy,
  Medal,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  TrendingUp as TrendingUpIcon,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface PerformancePrediction {
  id: string;
  content_type: string;
  platform: string;
  predicted_engagement: number;
  predicted_reach: number;
  predicted_impressions: number;
  predicted_clicks: number;
  predicted_shares: number;
  predicted_comments: number;
  predicted_saves: number;
  confidence_score: number;
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendations: {
    high_impact: string[];
    medium_impact: string[];
    low_impact: string[];
  };
  audience_insights: {
    primary_audience: string;
    secondary_audience: string;
    engagement_drivers: string[];
    content_preferences: string[];
    posting_preferences: string[];
  };
  competitive_analysis: {
    similar_content_performance: number;
    market_gap_opportunity: number;
    differentiation_factors: string[];
    competitor_benchmarks: {
      avg_engagement: number;
      avg_reach: number;
      top_performers: string[];
    };
  };
  optimization_suggestions: {
    content_improvements: string[];
    timing_optimization: string[];
    hashtag_strategy: string[];
    caption_enhancements: string[];
    visual_optimizations: string[];
  };
  risk_assessment: {
    low_risk_factors: string[];
    medium_risk_factors: string[];
    high_risk_factors: string[];
    mitigation_strategies: string[];
  };
  roi_prediction: {
    estimated_value: number;
    cost_effectiveness: number;
    conversion_potential: number;
    brand_impact: number;
  };
  seasonal_factors: {
    current_trend: 'rising' | 'stable' | 'declining';
    seasonal_boost: number;
    timing_advantage: number;
    market_conditions: string[];
  };
}

interface ContentPerformancePredictorProps {
  provider: string;
}

const CONTENT_TYPES = [
  { id: 'image', name: 'Image Post', icon: '🖼️' },
  { id: 'video', name: 'Video', icon: '🎥' },
  { id: 'carousel', name: 'Carousel', icon: '📑' },
  { id: 'story', name: 'Story/Reel', icon: '📱' },
  { id: 'article', name: 'Article', icon: '📄' },
  { id: 'live', name: 'Live Stream', icon: '📺' },
  { id: 'poll', name: 'Poll/Quiz', icon: '📊' },
  { id: 'user_generated', name: 'User Generated', icon: '👥' }
];

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' }
];

const AUDIENCE_SIZES = [
  { id: 'micro', name: 'Micro (1K-10K)', range: '1K-10K' },
  { id: 'small', name: 'Small (10K-50K)', range: '10K-50K' },
  { id: 'medium', name: 'Medium (50K-500K)', range: '50K-500K' },
  { id: 'large', name: 'Large (500K-1M)', range: '500K-1M' },
  { id: 'mega', name: 'Mega (1M+)', range: '1M+' }
];

export function ContentPerformancePredictor({ provider }: ContentPerformancePredictorProps) {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('image');
  const [platform, setPlatform] = useState('instagram');
  const [audienceSize, setAudienceSize] = useState('medium');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PerformancePrediction | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeCompetitorAnalysis, setIncludeCompetitorAnalysis] = useState(true);
  const [includeSeasonalFactors, setIncludeSeasonalFactors] = useState(true);
  const [includeROIAnalysis, setIncludeROIAnalysis] = useState(true);
  const [includeRiskAssessment, setIncludeRiskAssessment] = useState(true);
  const [historicalData, setHistoricalData] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [brandVoice, setBrandVoice] = useState('friendly');

  const analyzePerformance = async () => {
    if (!content.trim() && !industry.trim()) {
      toast.error('Please enter content or industry to analyze performance');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis with realistic delays
      await new Promise(resolve => setTimeout(resolve, 4500));
      
      const mockPrediction: PerformancePrediction = {
        id: '1',
        content_type: contentType,
        platform: platform,
        predicted_engagement: 87,
        predicted_reach: 12500,
        predicted_impressions: 18500,
        predicted_clicks: 450,
        predicted_shares: 125,
        predicted_comments: 89,
        predicted_saves: 67,
        confidence_score: 92,
        factors: {
          positive: [
            'Strong visual appeal',
            'Relevant hashtags',
            'Optimal posting time',
            'Engaging caption',
            'Trending topic alignment'
          ],
          negative: [
            'High competition in niche',
            'Limited seasonal boost',
            'Audience fatigue with similar content'
          ],
          neutral: [
            'Standard content format',
            'Average brand recognition',
            'Moderate trending relevance'
          ]
        },
        recommendations: {
          high_impact: [
            'Add trending hashtags',
            'Include call-to-action',
            'Optimize posting time',
            'Enhance visual design'
          ],
          medium_impact: [
            'Cross-platform promotion',
            'Engage with comments quickly',
            'Use platform-specific features',
            'Collaborate with micro-influencers'
          ],
          low_impact: [
            'Add location tags',
            'Include product links',
            'Use branded hashtags',
            'Schedule follow-up content'
          ]
        },
        audience_insights: {
          primary_audience: 'Tech-savvy professionals (25-34)',
          secondary_audience: 'Creative entrepreneurs (18-24)',
          engagement_drivers: ['Educational value', 'Visual appeal', 'Trending relevance'],
          content_preferences: ['How-to guides', 'Behind-the-scenes', 'Industry insights'],
          posting_preferences: ['Tuesday 9 AM', 'Thursday 7 PM', 'Weekend mornings']
        },
        competitive_analysis: {
          similar_content_performance: 78,
          market_gap_opportunity: 85,
          differentiation_factors: [
            'Unique visual style',
            'Educational approach',
            'Authentic storytelling'
          ],
          competitor_benchmarks: {
            avg_engagement: 3.2,
            avg_reach: 8500,
            top_performers: ['@techguru', '@innovate_now', '@future_tech']
          }
        },
        optimization_suggestions: {
          content_improvements: [
            'Add trending hashtags (#tech, #innovation, #future)',
            'Include data visualization',
            'Add behind-the-scenes elements'
          ],
          timing_optimization: [
            'Post on Tuesday 9 AM for maximum engagement',
            'Consider Thursday 7 PM for reach',
            'Avoid weekend afternoons'
          ],
          hashtag_strategy: [
            'Use 15-20 relevant hashtags',
            'Mix trending and niche hashtags',
            'Include branded hashtags'
          ],
          caption_enhancements: [
            'Start with a hook question',
            'Include 2-3 emojis strategically',
            'End with a clear call-to-action'
          ],
          visual_optimizations: [
            'Use high-contrast colors',
            'Include text overlays',
            'Optimize for mobile viewing'
          ]
        },
        risk_assessment: {
          low_risk_factors: [
            'Content aligns with brand voice',
            'Appropriate for target audience',
            'No controversial elements'
          ],
          medium_risk_factors: [
            'High competition in niche',
            'Potential algorithm changes',
            'Audience content fatigue'
          ],
          high_risk_factors: [
            'Seasonal content timing',
            'Platform policy updates',
            'Market saturation'
          ],
          mitigation_strategies: [
            'Diversify content strategy',
            'Monitor platform updates',
            'Engage with audience feedback'
          ]
        },
        roi_prediction: {
          estimated_value: 1250,
          cost_effectiveness: 85,
          conversion_potential: 12,
          brand_impact: 78
        },
        seasonal_factors: {
          current_trend: 'rising',
          seasonal_boost: 15,
          timing_advantage: 8,
          market_conditions: [
            'Back-to-school season',
            'Tech conference season',
            'Q4 planning period'
          ]
        }
      };

      setPrediction(mockPrediction);
      toast.success('Performance analysis complete! Confidence score: 92%');
    } catch (error) {
      toast.error('Failed to analyze performance. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Crown className="w-4 h-4" />;
    if (score >= 80) return <Trophy className="w-4 h-4" />;
    if (score >= 70) return <Medal className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Content Performance Predictor
          </CardTitle>
          <CardDescription>
            AI-powered content performance forecasting with engagement predictions and optimization insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Content Description</Label>
              <Textarea
                placeholder="Describe your content, key message, or what you want to achieve..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
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
                <Label>Audience Size</Label>
                <Select value={audienceSize} onValueChange={setAudienceSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCE_SIZES.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Industry/Niche</Label>
              <Input
                placeholder="e.g., tech, fitness, fashion, business..."
                value={industry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input
                placeholder="e.g., entrepreneurs, fitness enthusiasts..."
                value={targetAudience}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetAudience(e.target.value)}
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
                    <Label>Analysis Features</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Competitor Analysis</span>
                        <Switch checked={includeCompetitorAnalysis} onCheckedChange={setIncludeCompetitorAnalysis} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Seasonal Factors</span>
                        <Switch checked={includeSeasonalFactors} onCheckedChange={setIncludeSeasonalFactors} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ROI Analysis</span>
                        <Switch checked={includeROIAnalysis} onCheckedChange={setIncludeROIAnalysis} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk Assessment</span>
                        <Switch checked={includeRiskAssessment} onCheckedChange={setIncludeRiskAssessment} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Brand Voice</Label>
                    <Select value={brandVoice} onValueChange={setBrandVoice}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                        <SelectItem value="professional">Professional & Authoritative</SelectItem>
                        <SelectItem value="energetic">Energetic & Motivational</SelectItem>
                        <SelectItem value="humorous">Humorous & Entertaining</SelectItem>
                        <SelectItem value="luxury">Luxury & Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Analysis Includes:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Engagement rate predictions</li>
                      <li>• Reach and impressions forecast</li>
                      <li>• Competitive benchmarking</li>
                      <li>• Optimization recommendations</li>
                      <li>• Risk assessment</li>
                      <li>• ROI predictions</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <Button
            onClick={analyzePerformance}
            disabled={isAnalyzing || (!content.trim() && !industry.trim())}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Performance...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Predict Content Performance
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {prediction && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Performance Prediction</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                {prediction.confidence_score}% Confidence
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="predictions">Detailed Predictions</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(prediction.predicted_engagement)}`}>
                        {getScoreIcon(prediction.predicted_engagement)}
                      </div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                      <p className="text-xl font-bold">{prediction.predicted_engagement}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        <Users className="w-6 h-6 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600">Predicted Reach</p>
                      <p className="text-xl font-bold">{prediction.predicted_reach.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        <Eye className="w-6 h-6 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600">Impressions</p>
                      <p className="text-xl font-bold">{prediction.predicted_impressions.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        <DollarSign className="w-6 h-6 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600">Estimated Value</p>
                      <p className="text-xl font-bold">${prediction.roi_prediction.estimated_value}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Factors */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Positive Factors</h4>
                      <ul className="text-sm space-y-1">
                        {prediction.factors.positive.map((factor, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">Negative Factors</h4>
                      <ul className="text-sm space-y-1">
                        {prediction.factors.negative.map((factor, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-600 mb-2">Neutral Factors</h4>
                      <ul className="text-sm space-y-1">
                        {prediction.factors.neutral.map((factor, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <Info className="w-3 h-3 text-gray-600" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Performance Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Engagement Metrics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Comments</span>
                            <span className="font-medium">{prediction.predicted_comments}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Shares</span>
                            <span className="font-medium">{prediction.predicted_shares}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Saves</span>
                            <span className="font-medium">{prediction.predicted_saves}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Clicks</span>
                            <span className="font-medium">{prediction.predicted_clicks}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Audience Insights</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium">Primary Audience:</span>
                            <p className="text-sm text-gray-600">{prediction.audience_insights.primary_audience}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Secondary Audience:</span>
                            <p className="text-sm text-gray-600">{prediction.audience_insights.secondary_audience}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Engagement Drivers:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {prediction.audience_insights.engagement_drivers.map((driver, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {driver}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">High Impact</h4>
                        <ul className="text-sm space-y-1">
                          {prediction.recommendations.high_impact.map((rec, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-red-600" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-600 mb-2">Medium Impact</h4>
                        <ul className="text-sm space-y-1">
                          {prediction.recommendations.medium_impact.map((rec, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <Target className="w-3 h-3 text-yellow-600" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Low Impact</h4>
                        <ul className="text-sm space-y-1">
                          {prediction.recommendations.low_impact.map((rec, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Content Optimization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Hashtag Strategy</Label>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            {prediction.optimization_suggestions.hashtag_strategy.map((suggestion, index) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Caption Enhancements</Label>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            {prediction.optimization_suggestions.caption_enhancements.map((suggestion, index) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Competitive Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Similar Content Performance</span>
                        <span className="font-medium">{prediction.competitive_analysis.similar_content_performance}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Market Gap Opportunity</span>
                        <span className="font-medium">{prediction.competitive_analysis.market_gap_opportunity}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Avg Industry Engagement</span>
                        <span className="font-medium">{prediction.competitive_analysis.competitor_benchmarks.avg_engagement}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Seasonal Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(prediction.seasonal_factors.current_trend)}
                        <span className="text-sm font-medium">Current Trend: {prediction.seasonal_factors.current_trend}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Seasonal Boost</span>
                        <span className="font-medium">+{prediction.seasonal_factors.seasonal_boost}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Timing Advantage</span>
                        <span className="font-medium">+{prediction.seasonal_factors.timing_advantage}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
} 