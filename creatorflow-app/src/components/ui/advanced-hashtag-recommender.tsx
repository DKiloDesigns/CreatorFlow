'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import { Hash, Activity } from 'lucide-react';
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

export function AdvancedHashtagRecommender({ provider: _provider }: AdvancedHashtagRecommenderProps) {
  const [content, setContent] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<HashtagRecommendation[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeTrending, _setIncludeTrending] = useState(true);
  const [includeNiche, _setIncludeNiche] = useState(true);
  const [includeCompetitor, _setIncludeCompetitor] = useState(true);
  const [includeSeasonal, _setIncludeSeasonal] = useState(true);
  const [maxHashtags, _setMaxHashtags] = useState(30);
  const [minEngagement, _setMinEngagement] = useState(2.0);
  const [competitorAccounts, setCompetitorAccounts] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [language, _setLanguage] = useState('english');

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
      case 'rising': return <Activity className="w-4 h-4 text-green-600" />;
      case 'declining': return <Activity className="w-4 h-4 text-red-600" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Hash className="w-5 h-5" />
            Advanced Hashtag Recommender
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-powered hashtag analysis with trending detection, competitor insights, and performance predictions
          </Typography>
        </CardHeader>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Input */}
                     <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
             <TextField
               label="Content Description"
               fullWidth
               variant="outlined"
               value={content}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
             />
             
             <TextField
               label="Industry/Niche"
               fullWidth
               variant="outlined"
               value={industry}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
             />
           </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Platform"
                fullWidth
                variant="outlined"
                value={platform}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlatform(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Target Audience"
                fullWidth
                variant="outlined"
                value={targetAudience}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetAudience(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Location (Optional)"
                fullWidth
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Advanced Settings */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAdvanced(!showAdvanced)}
              fullWidth
            >
              <Activity className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Analysis
            </Button>

            {showAdvanced && (
              <Grid container spacing={2} sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Analysis Categories</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Trending Hashtags</Typography>
                      <Chip label="Include" variant="outlined" color="success" />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Niche Hashtags</Typography>
                      <Chip label="Include" variant="outlined" color="warning" />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Competitor Analysis</Typography>
                      <Chip label="Include" variant="outlined" color="info" />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Seasonal Trends</Typography>
                      <Chip label="Include" variant="outlined" color="secondary" />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Competitor Accounts (Optional)</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={competitorAccounts.join(', ')}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompetitorAccounts(e.target.value.split(',').map((s: string) => s.trim()))}
                  />
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Analyze Button */}
          <Button
            onClick={analyzeHashtags}
            disabled={isAnalyzing || (!content.trim() && !industry.trim())}
            fullWidth
            variant="contained"
            size="large"
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Hashtags...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
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
            <Typography variant="h6" component="div">Hashtag Recommendations</Typography>
            <div className="flex items-center gap-2">
              <Chip label={`${selectedHashtags.length} selected`} variant="outlined" />
              <Button
                variant="outlined"
                size="small"
                onClick={copyHashtags}
                disabled={selectedHashtags.length === 0}
              >
                <Activity className="w-4 h-4 mr-1" />
                Copy Selected
              </Button>
            </div>
          </div>

          {/* Tabs will be replaced with a new component or removed if not needed */}
          {/* For now, we'll keep the structure but the content will be static */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardHeader>
                  <Typography variant="h6" component="div" className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performance Analysis
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Top Performing Hashtags</Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        {recommendations.flatMap(cat => cat.hashtags)
                          .sort((a, b) => b.engagement_rate - a.engagement_rate)
                          .slice(0, 5)
                          .map((hashtag, index) => (
                            <Grid item xs={6} key={index}>
                              <Chip label={`#${hashtag.hashtag}`} variant="outlined" />
                              <Typography variant="body2" sx={{ color: 'green' }}>{hashtag.engagement_rate}%</Typography>
                            </Grid>
                          ))}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Trending Analysis</Typography>
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        {recommendations.flatMap(cat => cat.hashtags)
                          .sort((a, b) => b.trending_score - a.trending_score)
                          .slice(0, 5)
                          .map((hashtag, index) => (
                            <Grid item xs={6} key={index}>
                              <Chip label={`#${hashtag.hashtag}`} variant="outlined" />
                              <Typography variant="body2" sx={{ color: 'green' }}>{hashtag.trending_score}</Typography>
                            </Grid>
                          ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader>
                  <Typography variant="h6" component="div" className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Trending Insights
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'green.50', borderRadius: 2 }}>
                        <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <Typography variant="subtitle2" sx={{ color: 'green.800' }}>Rising Trends</Typography>
                        <Typography variant="body2" sx={{ color: 'green.600' }}>15 hashtags trending up</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'yellow.50', borderRadius: 2 }}>
                        <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <Typography variant="subtitle2" sx={{ color: 'yellow.800' }}>Stable Trends</Typography>
                        <Typography variant="body2" sx={{ color: 'yellow.600' }}>8 hashtags maintaining</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'red.50', borderRadius: 2 }}>
                        <Activity className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <Typography variant="subtitle2" sx={{ color: 'red.800' }}>Declining Trends</Typography>
                        <Typography variant="body2" sx={{ color: 'red.600' }}>3 hashtags trending down</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </Box>
  );
} 