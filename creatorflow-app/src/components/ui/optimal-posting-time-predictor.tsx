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
  Clock, 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3, 
  Search, 
  Copy, 
  RefreshCw,
  Zap,
  Eye,
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
  MapPin,
  CalendarDays,
  Clock3,
  Target,
  Zap,
  Rocket,
  Crown,
  Trophy,
  Medal,
  Sun,
  Moon,
  Coffee,
  Briefcase,
  Home,
  Bed,
  Utensils,
  Car,
  Train,
  Plane,
  Wifi,
  Smartphone,
  Laptop,
  Tv
} from 'lucide-react';
import { toast } from 'sonner';

interface OptimalTime {
  time: string;
  day: string;
  platform: string;
  engagement_score: number;
  reach_potential: number;
  competition_level: 'low' | 'medium' | 'high';
  audience_activity: number;
  content_performance: number;
  reasoning: string;
  timezone: string;
  local_time: string;
  best_content_types: string[];
  audience_demographics: {
    age_groups: { [key: string]: number };
    locations: { [key: string]: number };
    interests: string[];
    behaviors: string[];
  };
  seasonal_factors: string[];
  trending_topics: string[];
  competitor_activity: {
    posting_frequency: number;
    engagement_rates: number;
    best_times: string[];
  };
  recommendations: string[];
  risks: string[];
  opportunities: string[];
}

interface AudienceBehavior {
  time_slot: string;
  activity_level: number;
  content_preference: string;
  engagement_type: string;
  device_usage: string;
  location_context: string;
}

interface OptimalPostingTimePredictorProps {
  provider: string;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸', timezone: 'UTC' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', timezone: 'UTC' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', timezone: 'UTC' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', timezone: 'UTC' },
  { id: 'facebook', name: 'Facebook', icon: '📘', timezone: 'UTC' },
  { id: 'youtube', name: 'YouTube', icon: '📺', timezone: 'UTC' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', timezone: 'UTC' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', timezone: 'UTC' }
];

const TIMEZONES = [
  'UTC', 'EST', 'PST', 'CST', 'MST', 'GMT', 'CET', 'JST', 'AEST', 'IST'
];

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export function OptimalPostingTimePredictor({ provider }: OptimalPostingTimePredictorProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [targetAudience, setTargetAudience] = useState('');
  const [industry, setIndustry] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [audienceBehavior, setAudienceBehavior] = useState<AudienceBehavior[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeCompetitorAnalysis, setIncludeCompetitorAnalysis] = useState(true);
  const [includeSeasonalFactors, setIncludeSeasonalFactors] = useState(true);
  const [includeAudienceDemographics, setIncludeAudienceDemographics] = useState(true);
  const [contentType, setContentType] = useState('all');
  const [audienceSize, setAudienceSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [engagementGoal, setEngagementGoal] = useState<'reach' | 'engagement' | 'conversions'>('engagement');

  const analyzePostingTimes = async () => {
    if (!targetAudience.trim() && !industry.trim()) {
      toast.error('Please enter target audience or industry to analyze posting times');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis with realistic delays
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const mockOptimalTimes: OptimalTime[] = [
        {
          time: '9:00 AM',
          day: 'Tuesday',
          platform: 'instagram',
          engagement_score: 92,
          reach_potential: 88,
          competition_level: 'medium',
          audience_activity: 85,
          content_performance: 90,
          reasoning: 'Tuesday mornings show high engagement as people check social media during their commute and morning routine',
          timezone: 'UTC',
          local_time: '9:00 AM UTC',
          best_content_types: ['image', 'carousel', 'story'],
          audience_demographics: {
            age_groups: { '18-24': 35, '25-34': 45, '35-44': 15, '45+': 5 },
            locations: { 'North America': 60, 'Europe': 25, 'Asia': 10, 'Other': 5 },
            interests: ['technology', 'lifestyle', 'business', 'entertainment'],
            behaviors: ['morning routine', 'commute', 'coffee break']
          },
          seasonal_factors: ['back to work after weekend', 'fresh start motivation'],
          trending_topics: ['#mondaymotivation', '#tuesdaythoughts', '#morningroutine'],
          competitor_activity: {
            posting_frequency: 75,
            engagement_rates: 82,
            best_times: ['8:00 AM', '9:00 AM', '10:00 AM']
          },
          recommendations: [
            'Post engaging visual content',
            'Use trending hashtags',
            'Include call-to-action',
            'Respond to comments quickly'
          ],
          risks: ['High competition', 'Audience may be rushed'],
          opportunities: ['Capture morning attention', 'Set tone for the day']
        },
        {
          time: '7:00 PM',
          day: 'Wednesday',
          platform: 'instagram',
          engagement_score: 88,
          reach_potential: 92,
          competition_level: 'low',
          audience_activity: 90,
          content_performance: 85,
          reasoning: 'Wednesday evenings show peak social media usage as people unwind after work',
          timezone: 'UTC',
          local_time: '7:00 PM UTC',
          best_content_types: ['video', 'reel', 'story'],
          audience_demographics: {
            age_groups: { '18-24': 40, '25-34': 40, '35-44': 15, '45+': 5 },
            locations: { 'North America': 55, 'Europe': 30, 'Asia': 10, 'Other': 5 },
            interests: ['entertainment', 'lifestyle', 'food', 'fitness'],
            behaviors: ['evening relaxation', 'dinner time', 'entertainment seeking']
          },
          seasonal_factors: ['midweek break', 'entertainment seeking'],
          trending_topics: ['#humpday', '#wednesdaywisdom', '#eveningvibes'],
          competitor_activity: {
            posting_frequency: 60,
            engagement_rates: 78,
            best_times: ['6:00 PM', '7:00 PM', '8:00 PM']
          },
          recommendations: [
            'Post entertaining content',
            'Use video format',
            'Engage with trending topics',
            'Create shareable content'
          ],
          risks: ['Content fatigue', 'Multiple distractions'],
          opportunities: ['Evening entertainment', 'Relaxation content']
        },
        {
          time: '12:00 PM',
          day: 'Friday',
          platform: 'linkedin',
          engagement_score: 85,
          reach_potential: 90,
          competition_level: 'medium',
          audience_activity: 80,
          content_performance: 88,
          reasoning: 'Friday lunch breaks show high professional engagement as people check LinkedIn during work breaks',
          timezone: 'UTC',
          local_time: '12:00 PM UTC',
          best_content_types: ['article', 'carousel', 'image'],
          audience_demographics: {
            age_groups: { '25-34': 50, '35-44': 35, '45+': 15 },
            locations: { 'North America': 70, 'Europe': 20, 'Asia': 8, 'Other': 2 },
            interests: ['business', 'career', 'industry insights', 'networking'],
            behaviors: ['lunch break', 'professional development', 'networking']
          },
          seasonal_factors: ['end of work week', 'weekend planning'],
          trending_topics: ['#fridayfeeling', '#weekendvibes', '#professionaldevelopment'],
          competitor_activity: {
            posting_frequency: 70,
            engagement_rates: 75,
            best_times: ['11:00 AM', '12:00 PM', '1:00 PM']
          },
          recommendations: [
            'Share professional insights',
            'Use industry hashtags',
            'Include data or statistics',
            'Encourage professional discussion'
          ],
          risks: ['Professional competition', 'Limited personal content'],
          opportunities: ['Professional networking', 'Industry thought leadership']
        },
        {
          time: '8:00 PM',
          day: 'Saturday',
          platform: 'tiktok',
          engagement_score: 95,
          reach_potential: 88,
          competition_level: 'high',
          audience_activity: 92,
          content_performance: 90,
          reasoning: 'Saturday evenings show peak TikTok usage with high entertainment engagement',
          timezone: 'UTC',
          local_time: '8:00 PM UTC',
          best_content_types: ['video', 'trending sounds', 'challenges'],
          audience_demographics: {
            age_groups: { '13-17': 25, '18-24': 45, '25-34': 25, '35+': 5 },
            locations: { 'North America': 50, 'Europe': 25, 'Asia': 20, 'Other': 5 },
            interests: ['entertainment', 'music', 'dance', 'comedy', 'trends'],
            behaviors: ['entertainment seeking', 'trend following', 'social sharing']
          },
          seasonal_factors: ['weekend entertainment', 'social activities'],
          trending_topics: ['#saturdaynight', '#weekendvibes', '#trending'],
          competitor_activity: {
            posting_frequency: 90,
            engagement_rates: 85,
            best_times: ['7:00 PM', '8:00 PM', '9:00 PM']
          },
          recommendations: [
            'Use trending sounds',
            'Participate in challenges',
            'Create entertaining content',
            'Engage with trending hashtags'
          ],
          risks: ['High competition', 'Content saturation'],
          opportunities: ['Viral potential', 'Trend participation']
        }
      ];

      const mockAudienceBehavior: AudienceBehavior[] = [
        { time_slot: '6:00 AM', activity_level: 25, content_preference: 'motivational', engagement_type: 'likes', device_usage: 'mobile', location_context: 'home' },
        { time_slot: '9:00 AM', activity_level: 85, content_preference: 'professional', engagement_type: 'comments', device_usage: 'mobile', location_context: 'commute' },
        { time_slot: '12:00 PM', activity_level: 75, content_preference: 'informational', engagement_type: 'shares', device_usage: 'desktop', location_context: 'work' },
        { time_slot: '3:00 PM', activity_level: 60, content_preference: 'entertainment', engagement_type: 'likes', device_usage: 'mobile', location_context: 'work' },
        { time_slot: '6:00 PM', activity_level: 90, content_preference: 'lifestyle', engagement_type: 'comments', device_usage: 'mobile', location_context: 'home' },
        { time_slot: '9:00 PM', activity_level: 95, content_preference: 'entertainment', engagement_type: 'shares', device_usage: 'mobile', location_context: 'home' }
      ];

      setOptimalTimes(mockOptimalTimes);
      setAudienceBehavior(mockAudienceBehavior);
      toast.success('Posting time analysis complete! Found 4 optimal time slots');
    } catch (error) {
      toast.error('Failed to analyze posting times. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (hour >= 12 && hour < 17) return <Briefcase className="w-4 h-4 text-blue-500" />;
    if (hour >= 17 && hour < 21) return <Home className="w-4 h-4 text-green-500" />;
    return <Moon className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Optimal Posting Time Predictor
          </CardTitle>
          <CardDescription>
            AI-powered posting time optimization with audience behavior analysis and platform-specific insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input
                placeholder="e.g., entrepreneurs, fitness enthusiasts..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Industry/Niche</Label>
              <Input
                placeholder="e.g., tech, fitness, business..."
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Switch
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPlatforms([...selectedPlatforms, platform.id]);
                        } else {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                        }
                      }}
                    />
                    <Label className="text-sm flex items-center gap-1">
                      <span>{platform.icon}</span>
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content Types</SelectItem>
                    <SelectItem value="video">Video Content</SelectItem>
                    <SelectItem value="image">Image Content</SelectItem>
                    <SelectItem value="text">Text Content</SelectItem>
                    <SelectItem value="story">Story Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Engagement Goal</Label>
                <Select value={engagementGoal} onValueChange={(value: 'reach' | 'engagement' | 'conversions') => setEngagementGoal(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reach">Maximum Reach</SelectItem>
                    <SelectItem value="engagement">High Engagement</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                        <span className="text-sm">Audience Demographics</span>
                        <Switch checked={includeAudienceDemographics} onCheckedChange={setIncludeAudienceDemographics} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Audience Size</Label>
                    <Select value={audienceSize} onValueChange={(value: 'small' | 'medium' | 'large') => setAudienceSize(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (1K-10K followers)</SelectItem>
                        <SelectItem value="medium">Medium (10K-100K followers)</SelectItem>
                        <SelectItem value="large">Large (100K+ followers)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Analysis Includes:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Audience behavior patterns</li>
                      <li>• Platform-specific algorithms</li>
                      <li>• Competitor posting schedules</li>
                      <li>• Seasonal and trending factors</li>
                      <li>• Timezone optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <Button
            onClick={analyzePostingTimes}
            disabled={isAnalyzing || (!targetAudience.trim() && !industry.trim())}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Posting Times...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Optimal Posting Times
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {optimalTimes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Optimal Posting Times</h2>
            <Badge variant="secondary">
              {optimalTimes.length} time slots analyzed
            </Badge>
          </div>

          <Tabs defaultValue="times" className="space-y-4">
            <TabsList>
              <TabsTrigger value="times">Optimal Times</TabsTrigger>
              <TabsTrigger value="behavior">Audience Behavior</TabsTrigger>
              <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="times" className="space-y-4">
              {optimalTimes.map((time, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getTimeIcon(time.time)}
                        <div>
                          <h3 className="text-lg font-semibold">
                            {time.time} - {time.day}
                          </h3>
                          <p className="text-sm text-gray-600">{time.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCompetitionColor(time.competition_level)}>
                          {time.competition_level} competition
                        </Badge>
                        <Badge variant="outline">{time.local_time}</Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{time.reasoning}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(time.engagement_score)}`}>
                          {getScoreIcon(time.engagement_score)}
                        </div>
                        <p className="text-gray-600">Engagement</p>
                        <p className="font-medium">{time.engagement_score}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(time.reach_potential)}`}>
                          {getScoreIcon(time.reach_potential)}
                        </div>
                        <p className="text-gray-600">Reach</p>
                        <p className="font-medium">{time.reach_potential}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(time.audience_activity)}`}>
                          {getScoreIcon(time.audience_activity)}
                        </div>
                        <p className="text-gray-600">Activity</p>
                        <p className="font-medium">{time.audience_activity}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(time.content_performance)}`}>
                          {getScoreIcon(time.content_performance)}
                        </div>
                        <p className="text-gray-600">Performance</p>
                        <p className="font-medium">{time.content_performance}%</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Best Content Types</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {time.best_content_types.map((type, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Recommendations</Label>
                        <ul className="text-sm text-gray-600 mt-1 space-y-1">
                          {time.recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Audience Behavior Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audienceBehavior.map((behavior, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTimeIcon(behavior.time_slot)}
                          <div>
                            <p className="font-medium">{behavior.time_slot}</p>
                            <p className="text-sm text-gray-600">{behavior.content_preference}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{behavior.activity_level}% activity</p>
                          <p className="text-sm text-gray-600">{behavior.device_usage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Platform Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Top Performing Times</h3>
                      <div className="space-y-2">
                        {optimalTimes
                          .sort((a, b) => b.engagement_score - a.engagement_score)
                          .slice(0, 3)
                          .map((time, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="font-medium">{time.time} - {time.day}</span>
                              <span className="text-green-600 font-semibold">{time.engagement_score}%</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Platform Insights</h3>
                      <div className="space-y-2">
                        {optimalTimes.map((time, index) => (
                          <div key={index} className="p-2 border rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{time.platform}</span>
                              <Badge variant="outline">{time.competition_level}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{time.reasoning}</p>
                          </div>
                        ))}
                      </div>
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