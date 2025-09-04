'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/mui-card';
import { Typography, Button } from '@mui/material';
import { 
  RefreshCw, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Users, 
  Eye, 
  DollarSign, 
  Zap, 
  Target, 
  BarChart3 
} from 'lucide-react';

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { TextField } from '@mui/material';
import { Switch, FormControlLabel } from '@mui/material';
import { Chip } from '@mui/material';
import { Tabs, Tab, Box } from '@mui/material';
import { TrendingUp, Activity, Crown, Trophy, Medal, Star, TrendingDown, Minus, Brain } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState(0);

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
    if (score >= 90) return 'green.600';
    if (score >= 80) return 'blue.600';
    if (score >= 70) return 'yellow.600';
    return 'red.600';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <Typography variant="h6" className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Content Performance Predictor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-powered content performance forecasting with engagement predictions and optimization insights
          </Typography>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Content Description"
              placeholder="Describe your content, key message, or what you want to achieve..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <div className="space-y-4">
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Content Type</InputLabel>
                <Select value={contentType} onChange={(e) => setContentType(e.target.value)} label="Content Type">
                  {CONTENT_TYPES.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{type.icon}</span>
                        <span>{type.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Platform</InputLabel>
                <Select value={platform} onChange={(e) => setPlatform(e.target.value)} label="Platform">
                  {PLATFORMS.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{p.icon}</span>
                        <span>{p.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Audience Size</InputLabel>
                <Select value={audienceSize} onChange={(e) => setAudienceSize(e.target.value)} label="Audience Size">
                  {AUDIENCE_SIZES.map((size) => (
                    <MenuItem key={size.id} value={size.id}>
                      {size.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Industry/Niche"
              placeholder="e.g., tech, fitness, fashion, business..."
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Target Audience"
              placeholder="e.g., entrepreneurs, fitness enthusiasts..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </div>

          {/* Advanced Settings */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ width: '100%' }}
            >
              <Brain className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Analysis
            </Button>

            {showAdvanced && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, p: 2, bgcolor: 'grey.50', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Analysis Features</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControlLabel
                        control={<Switch checked={includeCompetitorAnalysis} onChange={(e) => setIncludeCompetitorAnalysis(e.target.checked)} />}
                        label="Competitor Analysis"
                      />
                      <FormControlLabel
                        control={<Switch checked={includeSeasonalFactors} onChange={(e) => setIncludeSeasonalFactors(e.target.checked)} />}
                        label="Seasonal Factors"
                      />
                      <FormControlLabel
                        control={<Switch checked={includeROIAnalysis} onChange={(e) => setIncludeROIAnalysis(e.target.checked)} />}
                        label="ROI Analysis"
                      />
                      <FormControlLabel
                        control={<Switch checked={includeRiskAssessment} onChange={(e) => setIncludeRiskAssessment(e.target.checked)} />}
                        label="Risk Assessment"
                      />
                    </Box>
                  </Box>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Brand Voice</InputLabel>
                    <Select value={brandVoice} onChange={(e) => setBrandVoice(e.target.value)} label="Brand Voice">
                      <MenuItem value="friendly">Friendly & Approachable</MenuItem>
                      <MenuItem value="professional">Professional & Authoritative</MenuItem>
                      <MenuItem value="energetic">Energetic & Motivational</MenuItem>
                      <MenuItem value="humorous">Humorous & Entertaining</MenuItem>
                      <MenuItem value="luxury">Luxury & Premium</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Box sx={{ p: 3, bgcolor: 'blue.50', borderRadius: '8px' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'blue.900' }}>Analysis Includes:</Typography>
                    <Box component="ul" sx={{ fontSize: '0.875rem', color: 'blue.800', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box component="li">• Engagement rate predictions</Box>
                      <Box component="li">• Reach and impressions forecast</Box>
                      <Box component="li">• Competitive benchmarking</Box>
                      <Box component="li">• Optimization recommendations</Box>
                      <Box component="li">• Risk assessment</Box>
                      <Box component="li">• ROI predictions</Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Analyze Button */}
          <Button
            onClick={analyzePerformance}
            disabled={isAnalyzing || (!content.trim() && !industry.trim())}
            sx={{ width: '100%' }}
            size="large"
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold' }}>
              Performance Prediction
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`${prediction.confidence_score}% Confidence`}
                color="success" 
                icon={<CheckCircle size={16} />}
                sx={{ bgcolor: 'green.100', color: 'green.800' }}
              />
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Overview" />
              <Tab label="Detailed Predictions" />
              <Tab label="Optimization" />
              <Tab label="Analysis" />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ mt: 3 }}>
              {/* Key Metrics */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
                <Card>
                  <CardContent sx={{ pt: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(prediction.predicted_engagement) }}>
                        {getScoreIcon(prediction.predicted_engagement)}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Engagement Rate</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{prediction.predicted_engagement}%</Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent sx={{ pt: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'blue.600' }}>
                        <Users className="w-6 h-6 mx-auto" />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Predicted Reach</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{prediction.predicted_reach.toLocaleString()}</Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent sx={{ pt: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'purple.600' }}>
                        <Eye className="w-6 h-6 mx-auto" />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Impressions</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{prediction.predicted_impressions.toLocaleString()}</Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent sx={{ pt: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'green.600' }}>
                        <DollarSign className="w-6 h-6 mx-auto" />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Estimated Value</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${prediction.roi_prediction.estimated_value}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Performance Factors */}
              <Card>
                <CardHeader>
                  <Typography variant="h6">Performance Factors</Typography>
                </CardHeader>
                <CardContent>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: 'green.600', mb: 2 }}>Positive Factors</Typography>
                      <Box component="ul" sx={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', p: 0 }}>
                        {prediction.factors.positive.map((factor, index) => (
                          <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {factor}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: 'red.600', mb: 2 }}>Negative Factors</Typography>
                      <Box component="ul" sx={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', p: 0 }}>
                        {prediction.factors.negative.map((factor, index) => (
                          <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            {factor}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: 'gray.600', mb: 2 }}>Neutral Factors</Typography>
                      <Box component="ul" sx={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', p: 0 }}>
                        {prediction.factors.neutral.map((factor, index) => (
                          <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Info className="w-3 h-3 text-gray-600" />
                            {factor}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ mt: 3 }}>
              <Card>
                <CardHeader>
                  <Typography variant="h6">Detailed Performance Predictions</Typography>
                </CardHeader>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>Engagement Metrics</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Comments</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{prediction.predicted_comments}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Shares</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{prediction.predicted_shares}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Saves</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{prediction.predicted_saves}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Clicks</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{prediction.predicted_clicks}</Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>Audience Insights</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Primary Audience:</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{prediction.audience_insights.primary_audience}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Secondary Audience:</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{prediction.audience_insights.secondary_audience}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Engagement Drivers:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {prediction.audience_insights.engagement_drivers.map((driver, index) => (
                                <Chip key={index} label={driver} variant="outlined" size="small" />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ mt: 3 }}>
              <Card>
                <CardHeader>
                  <Typography variant="h6">Optimization Recommendations</Typography>
                </CardHeader>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: 'red.600', mb: 2 }}>High Impact</Typography>
                        <Box component="ul" sx={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', p: 0 }}>
                          {prediction.recommendations.high_impact.map((rec, index) => (
                            <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Zap className="w-3 h-3 text-red-600" />
                              {rec}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: 'yellow.600', mb: 2 }}>Medium Impact</Typography>
                        <Box component="ul" sx={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', p: 0 }}>
                          {prediction.recommendations.medium_impact.map((rec, index) => (
                            <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Target className="w-3 h-3 text-yellow-600" />
                              {rec}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', color: 'green.600', mb: 2 }}>Low Impact</Typography>
                        <Box component="ul" sx={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', p: 0 }}>
                          {prediction.recommendations.low_impact.map((rec, index) => (
                            <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              {rec}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>Content Optimization</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Hashtag Strategy</Typography>
                          <Box component="ul" sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 1, display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', p: 0 }}>
                            {prediction.optimization_suggestions.hashtag_strategy.map((suggestion, index) => (
                              <Box component="li" key={index}>
                                • {suggestion}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Caption Enhancements</Typography>
                          <Box component="ul" sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 1, display: 'flex', flexDirection: 'column', gap: 1, listStyle: 'none', p: 0 }}>
                            {prediction.optimization_suggestions.caption_enhancements.map((suggestion, index) => (
                              <Box component="li" key={index}>
                                • {suggestion}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 6 }}>
                <Card>
                  <CardHeader>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BarChart3 className="w-5 h-5" />
                      Competitive Analysis
                    </Typography>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Similar Content Performance</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{prediction.competitive_analysis.similar_content_performance}%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Market Gap Opportunity</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{prediction.competitive_analysis.market_gap_opportunity}%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Avg Industry Engagement</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{prediction.competitive_analysis.competitor_benchmarks.avg_engagement}%</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TrendingUp className="w-5 h-5" />
                      Seasonal Factors
                    </Typography>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {getTrendIcon(prediction.seasonal_factors.current_trend)}
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Current Trend: {prediction.seasonal_factors.current_trend}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Seasonal Boost</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>+{prediction.seasonal_factors.seasonal_boost}%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Timing Advantage</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>+{prediction.seasonal_factors.timing_advantage}%</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
} 