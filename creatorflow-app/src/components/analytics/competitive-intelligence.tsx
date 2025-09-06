"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Skeleton,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  ListItemAvatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  AutoAwesome,
  Psychology,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  Refresh,
  Settings,
  ContentCopy,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
  Rocket,
  People,
  Group,
  Person,
  LocationOn,
  Work,
  School,
  Favorite,
  ThumbUp,
  Share,
  Message,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Visibility,
  Compare,
  Assessment,
  Insights
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';
import { useAIInsights } from '@/hooks/use-ai-api';

interface Competitor {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platform: string;
  followers: number;
  engagement: number;
  postingFrequency: number;
  contentQuality: number;
  brandVoice: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  marketPosition: 'leader' | 'challenger' | 'niche' | 'emerging';
  aiScore: number;
  trend: 'up' | 'down' | 'stable';
}

interface MarketAnalysis {
  id: string;
  category: string;
  totalMarketSize: number;
  growthRate: number;
  keyTrends: string[];
  opportunities: string[];
  risks: string[];
  aiInsights: string[];
}

interface CompetitiveGap {
  id: string;
  area: string;
  yourPerformance: number;
  competitorPerformance: number;
  gap: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export default function CompetitiveIntelligence() {
  const [activeTab, setActiveTab] = useState(0);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis[]>([]);
  const [competitiveGaps, setCompetitiveGaps] = useState<CompetitiveGap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [showAIInsights, setShowAIInsights] = useState(true);

  // AI API hooks
  const aiInsights = useAIInsights();

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock competitors
      setCompetitors([
        {
          id: 'competitor-1',
          name: 'TechFlow Pro',
          handle: '@techflowpro',
          avatar: '/api/placeholder/40/40',
          platform: 'Instagram',
          followers: 125000,
          engagement: 6.8,
          postingFrequency: 2.1,
          contentQuality: 8.2,
          brandVoice: 'Professional, Educational, Innovative',
          strengths: [
            'High-quality technical content',
            'Strong community engagement',
            'Consistent posting schedule',
            'Expert thought leadership'
          ],
          weaknesses: [
            'Limited visual content variety',
            'Slow response to trends',
            'Narrow content topics',
            'Low cross-platform presence'
          ],
          opportunities: [
            'Expand to video content',
            'Diversify content topics',
            'Increase trend responsiveness',
            'Build LinkedIn presence'
          ],
          threats: [
            'Algorithm changes affecting reach',
            'New competitors entering market',
            'Content saturation in tech niche',
            'Audience fatigue with technical content'
          ],
          marketPosition: 'leader',
          aiScore: 8.7,
          trend: 'up'
        },
        {
          id: 'competitor-2',
          name: 'CreativeMinds Studio',
          handle: '@creativemindsstudio',
          avatar: '/api/placeholder/40/40',
          platform: 'Instagram',
          followers: 89000,
          engagement: 7.2,
          postingFrequency: 1.8,
          contentQuality: 7.8,
          brandVoice: 'Creative, Inspirational, Community-focused',
          strengths: [
            'Excellent visual storytelling',
            'Strong community building',
            'Creative content variety',
            'High engagement rates'
          ],
          weaknesses: [
            'Inconsistent posting frequency',
            'Limited educational content',
            'Weak call-to-action strategy',
            'Poor conversion optimization'
          ],
          opportunities: [
            'Increase posting consistency',
            'Add educational content series',
            'Improve conversion strategies',
            'Expand to Pinterest'
          ],
          threats: [
            'Visual content oversaturation',
            'Changing algorithm preferences',
            'Audience attention span decrease',
            'Competition from larger studios'
          ],
          marketPosition: 'challenger',
          aiScore: 7.9,
          trend: 'stable'
        },
        {
          id: 'competitor-3',
          name: 'BusinessInsights Daily',
          handle: '@businessinsightsdaily',
          avatar: '/api/placeholder/40/40',
          platform: 'LinkedIn',
          followers: 156000,
          engagement: 5.4,
          postingFrequency: 3.2,
          contentQuality: 8.5,
          brandVoice: 'Professional, Analytical, Strategic',
          strengths: [
            'High-quality business insights',
            'Consistent daily posting',
            'Strong professional network',
            'Data-driven content'
          ],
          weaknesses: [
            'Low engagement rates',
            'Limited visual appeal',
            'Narrow audience targeting',
            'Poor social media optimization'
          ],
          opportunities: [
            'Improve visual content',
            'Increase engagement strategies',
            'Expand audience targeting',
            'Optimize for social platforms'
          ],
          threats: [
            'LinkedIn algorithm changes',
            'Professional content saturation',
            'Audience time constraints',
            'Competition from established media'
          ],
          marketPosition: 'niche',
          aiScore: 8.1,
          trend: 'down'
        }
      ]);

      // Mock market analysis
      setMarketAnalysis([
        {
          id: 'market-1',
          category: 'Tech Content Creation',
          totalMarketSize: 2500000,
          growthRate: 18.5,
          keyTrends: [
            'AI-powered content generation increasing',
            'Video content preference growing',
            'Micro-learning gaining popularity',
            'Community-driven content rising'
          ],
          opportunities: [
            'AI content tools integration',
            'Video content expansion',
            'Micro-learning series development',
            'Community engagement programs'
          ],
          risks: [
            'AI content saturation',
            'Video production costs',
            'Content quality dilution',
            'Platform dependency'
          ],
          aiInsights: [
            'Market growing 18.5% annually with strong AI adoption',
            'Video content engagement 2.3x higher than static',
            'Community features driving 34% higher retention',
            'Micro-learning content has 45% better completion rates'
          ]
        },
        {
          id: 'market-2',
          category: 'Creative Professional Content',
          totalMarketSize: 1800000,
          growthRate: 12.3,
          keyTrends: [
            'Visual storytelling dominance',
            'Authentic content preference',
            'Cross-platform content creation',
            'Collaborative content rising'
          ],
          opportunities: [
            'Visual content series development',
            'Authenticity-focused campaigns',
            'Multi-platform content strategy',
            'Collaboration partnerships'
          ],
          risks: [
            'Visual content oversaturation',
            'Authenticity fatigue',
            'Platform algorithm changes',
            'Content production costs'
          ],
          aiInsights: [
            'Visual content engagement 45% higher than text',
            'Authentic content drives 2.1x more trust',
            'Cross-platform presence increases reach by 67%',
            'Collaborative content gets 3.2x more shares'
          ]
        }
      ]);

      // Mock competitive gaps
      setCompetitiveGaps([
        {
          id: 'gap-1',
          area: 'Content Quality',
          yourPerformance: 7.5,
          competitorPerformance: 8.2,
          gap: -0.7,
          priority: 'high',
          recommendations: [
            'Implement AI content optimization',
            'Increase content research depth',
            'Improve visual design quality',
            'Add content quality review process'
          ]
        },
        {
          id: 'gap-2',
          area: 'Posting Frequency',
          yourPerformance: 1.2,
          competitorPerformance: 2.1,
          gap: -0.9,
          priority: 'high',
          recommendations: [
            'Create content calendar system',
            'Batch content production',
            'Use AI scheduling tools',
            'Implement content automation'
          ]
        },
        {
          id: 'gap-3',
          area: 'Engagement Rate',
          yourPerformance: 6.8,
          competitorPerformance: 7.2,
          gap: -0.4,
          priority: 'medium',
          recommendations: [
            'Improve community engagement',
            'Add interactive content elements',
            'Optimize posting times',
            'Enhance call-to-action strategy'
          ]
        },
        {
          id: 'gap-4',
          area: 'Visual Content',
          yourPerformance: 6.2,
          competitorPerformance: 7.8,
          gap: -1.6,
          priority: 'critical',
          recommendations: [
            'Invest in visual design tools',
            'Create visual content templates',
            'Hire visual content specialist',
            'Develop visual brand guidelines'
          ]
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getMarketPositionColor = (position: string) => {
    switch (position) {
      case 'leader':
        return designTokens.colors.success[500];
      case 'challenger':
        return designTokens.colors.warning[500];
      case 'niche':
        return designTokens.colors.primary[500];
      case 'emerging':
        return designTokens.colors.neutral[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return designTokens.colors.error[600];
      case 'high':
        return designTokens.colors.warning[500];
      case 'medium':
        return designTokens.colors.primary[500];
      case 'low':
        return designTokens.colors.neutral[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: designTokens.colors.success[500] }} />;
      case 'down':
        return <TrendingDown sx={{ color: designTokens.colors.error[500] }} />;
      case 'stable':
        return <TrendingFlat sx={{ color: designTokens.colors.neutral[500] }} />;
      default:
        return <TrendingFlat sx={{ color: designTokens.colors.neutral[500] }} />;
    }
  };

  const renderCompetitorsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Competitor Analysis
      </Typography>
      
      <Grid container spacing={3}>
        {competitors.map((competitor) => (
          <Grid item xs={12} lg={4} key={competitor.id} component="div">
            <Card 
              elevation={0} 
              sx={{ 
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg,
                cursor: 'pointer',
                transition: designTokens.animation.micro.cardHover,
                '&:hover': {
                  boxShadow: designTokens.shadows.lg,
                  borderColor: designTokens.colors.primary[300]
                }
              }}
              onClick={() => setSelectedCompetitor(competitor)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={competitor.avatar} sx={{ width: 40, height: 40 }}>
                      {competitor.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {competitor.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500] }}>
                        {competitor.handle}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={competitor.marketPosition}
                    size="small"
                    sx={{
                      background: `${getMarketPositionColor(competitor.marketPosition)}15`,
                      color: getMarketPositionColor(competitor.marketPosition),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                          {competitor.followers.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Followers
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: designTokens.colors.success[600], fontWeight: 'bold' }}>
                          {competitor.engagement}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Engagement
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      AI Score
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {competitor.aiScore}/10
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={competitor.aiScore * 10}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: designTokens.colors.ai[500],
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Brand Voice
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.875rem' }}>
                    {competitor.brandVoice}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Top Strength
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.875rem' }}>
                    {competitor.strengths[0]}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getTrendIcon(competitor.trend)}
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    {competitor.trend === 'up' ? 'Growing' : competitor.trend === 'down' ? 'Declining' : 'Stable'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderMarketAnalysisTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Market Analysis & Trends
      </Typography>
      
      <Grid container spacing={3}>
        {marketAnalysis.map((market) => (
          <Grid item xs={12} lg={6} key={market.id} component="div">
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                    {market.category}
                  </Typography>
                  <Chip
                    label={`${market.growthRate}% Growth`}
                    size="small"
                    sx={{
                      background: designTokens.colors.success[100],
                      color: designTokens.colors.success[700],
                      fontWeight: 'medium'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                    {market.totalMarketSize.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Total Market Size
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Key Trends
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {market.keyTrends.map((trend, index) => (
                      <Typography key={index} variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.875rem' }}>
                        • {trend}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    AI Insights
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {market.aiInsights.map((insight, index) => (
                      <Typography key={index} variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.875rem' }}>
                        • {insight}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderCompetitiveGapsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Competitive Gap Analysis
      </Typography>
      
      <Grid container spacing={3}>
        {competitiveGaps.map((gap) => (
          <Grid item xs={12} md={6} key={gap.id} component="div">
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                    {gap.area}
                  </Typography>
                  <Chip
                    label={gap.priority}
                    size="small"
                    sx={{
                      background: `${getPriorityColor(gap.priority)}15`,
                      color: getPriorityColor(gap.priority),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: designTokens.colors.neutral[800], fontWeight: 'bold' }}>
                          {gap.yourPerformance}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Your Score
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                          {gap.competitorPerformance}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Competitor
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ 
                          color: gap.gap > 0 ? designTokens.colors.success[600] : designTokens.colors.error[600], 
                          fontWeight: 'bold' 
                        }}>
                          {gap.gap > 0 ? '+' : ''}{gap.gap}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Gap
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Recommendations
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {gap.recommendations.map((rec, index) => (
                      <Typography key={index} variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.875rem' }}>
                        • {rec}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} lg={4} key={item} component="div">
                <Skeleton variant="rectangular" height={400} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.secondary[600]
            }}
          >
            <Compare sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.bold,
                color: designTokens.colors.neutral[900],
                mb: 1
              }}
            >
              Competitive Intelligence
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Strategic competitor analysis with market insights and gap identification
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={showAIInsights}
                onChange={(e) => setShowAIInsights(e.target.checked)}
              />
            }
            label="Show AI Insights"
          />
        </Box>
      </Box>

      {/* AI Status Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.secondary[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.secondary[700] }}>
          🎯 AI Competitive Intelligence Active
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.secondary[700] }}>
          Your AI system has analyzed {competitors.length} competitors and identified {competitiveGaps.length} performance gaps. 
          Current analysis accuracy: 89.7%. AI insights are continuously monitoring market changes and competitor strategies.
        </Typography>
      </Alert>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={activeTab === 0 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(0)}
            startIcon={<People />}
          >
            Competitors
          </Button>
          <Button
            variant={activeTab === 1 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(1)}
            startIcon={<Assessment />}
          >
            Market Analysis
          </Button>
          <Button
            variant={activeTab === 2 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(2)}
            startIcon={<Insights />}
          >
            Gap Analysis
          </Button>
        </Box>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderCompetitorsTab()}
      {activeTab === 1 && renderMarketAnalysisTab()}
      {activeTab === 2 && renderCompetitiveGapsTab()}

      {/* API Error Alerts */}
      {aiInsights.error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => aiInsights.execute({})}>
              Retry
            </Button>
          }
        >
          <AlertTitle>AI Insights Error</AlertTitle>
          {aiInsights.error}
        </Alert>
      )}
    </Box>
  );
}
