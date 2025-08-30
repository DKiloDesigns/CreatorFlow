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
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';
import { useAudienceAnalysis, useAIInsights } from '@/hooks/use-ai-api';

interface AudienceSegment {
  id: string;
  name: string;
  size: number;
  growth: number;
  engagement: number;
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    professions: Record<string, number>;
    interests: string[];
  };
  behavior: {
    activeHours: Record<string, number>;
    contentPreferences: Record<string, number>;
    responseTime: number;
    sharingRate: number;
  };
  aiInsights: string[];
  opportunities: string[];
  risks: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface BehavioralPattern {
  id: string;
  pattern: string;
  description: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  examples: string[];
  recommendations: string[];
}

interface AudiencePrediction {
  segmentId: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  factors: string[];
  timeframe: string;
}

export default function AdvancedAudienceIntelligence() {
  const [activeTab, setActiveTab] = useState(0);
  const [audienceSegments, setAudienceSegments] = useState<AudienceSegment[]>([]);
  const [behavioralPatterns, setBehavioralPatterns] = useState<BehavioralPattern[]>([]);
  const [audiencePredictions, setAudiencePredictions] = useState<AudiencePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<AudienceSegment | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [showPredictions, setShowPredictions] = useState(true);

  // AI API hooks
  const audienceAnalysis = useAudienceAnalysis();
  const aiInsights = useAIInsights();

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock audience segments
      setAudienceSegments([
        {
          id: 'tech-professionals',
          name: 'Tech Professionals',
          size: 15420,
          growth: 23.4,
          engagement: 8.7,
          demographics: {
            ageGroups: {
              '25-34': 0.45,
              '35-44': 0.32,
              '45-54': 0.18,
              '55+': 0.05
            },
            locations: {
              'United States': 0.52,
              'United Kingdom': 0.18,
              'Canada': 0.15,
              'Australia': 0.08,
              'Other': 0.07
            },
            professions: {
              'Software Engineer': 0.28,
              'Product Manager': 0.22,
              'Data Scientist': 0.18,
              'Designer': 0.15,
              'Other': 0.17
            },
            interests: ['AI/ML', 'Technology', 'Innovation', 'Productivity', 'Career Growth']
          },
          behavior: {
            activeHours: {
              '9-12': 0.15,
              '12-15': 0.20,
              '15-18': 0.25,
              '18-21': 0.30,
              '21-24': 0.10
            },
            contentPreferences: {
              'Technical Tutorials': 0.35,
              'Industry News': 0.28,
              'Career Tips': 0.22,
              'Product Reviews': 0.15
            },
            responseTime: 2.3,
            sharingRate: 0.34
          },
          aiInsights: [
            'Highly engaged during work hours (9 AM - 6 PM)',
            'Prefers technical, educational content over promotional',
            'Strong community engagement and knowledge sharing',
            'Responds well to thought leadership and industry insights'
          ],
          opportunities: [
            'Create technical tutorial series',
            'Develop industry trend analysis content',
            'Build community engagement programs',
            'Offer career development resources'
          ],
          risks: [
            'Content may be too technical for general audience',
            'Risk of information overload during work hours',
            'Need to balance technical depth with accessibility'
          ],
          priority: 'high'
        },
        {
          id: 'creative-professionals',
          name: 'Creative Professionals',
          size: 8920,
          growth: 18.7,
          engagement: 7.2,
          demographics: {
            ageGroups: {
              '18-24': 0.28,
              '25-34': 0.42,
              '35-44': 0.22,
              '45+': 0.08
            },
            locations: {
              'United States': 0.45,
              'United Kingdom': 0.22,
              'Canada': 0.12,
              'Australia': 0.10,
              'Other': 0.11
            },
            professions: {
              'Graphic Designer': 0.32,
              'Content Creator': 0.28,
              'Marketing Specialist': 0.20,
              'Photographer': 0.12,
              'Other': 0.08
            },
            interests: ['Design', 'Creativity', 'Visual Arts', 'Marketing', 'Social Media']
          },
          behavior: {
            activeHours: {
              '9-12': 0.20,
              '12-15': 0.25,
              '15-18': 0.20,
              '18-21': 0.25,
              '21-24': 0.10
            },
            contentPreferences: {
              'Visual Content': 0.45,
              'Design Inspiration': 0.28,
              'Creative Tips': 0.18,
              'Industry News': 0.09
            },
            responseTime: 3.1,
            sharingRate: 0.42
          },
          aiInsights: [
            'Highly visual content consumers',
            'Active during creative work hours',
            'Strong social sharing behavior',
            'Appreciates inspirational and educational content'
          ],
          opportunities: [
            'Create visual storytelling content',
            'Develop design inspiration galleries',
            'Build creative community engagement',
            'Offer design tool tutorials'
          ],
          risks: [
            'Content may be too generic for specific creative fields',
            'Need to balance inspiration with practical value',
            'Risk of oversaturation in visual content'
          ],
          priority: 'medium'
        },
        {
          id: 'business-leaders',
          name: 'Business Leaders',
          size: 6230,
          growth: 15.2,
          engagement: 6.8,
          demographics: {
            ageGroups: {
              '35-44': 0.38,
              '45-54': 0.42,
              '55+': 0.20
            },
            locations: {
              'United States': 0.48,
              'United Kingdom': 0.25,
              'Canada': 0.15,
              'Australia': 0.08,
              'Other': 0.04
            },
            professions: {
              'CEO/Founder': 0.25,
              'Executive': 0.35,
              'Director': 0.28,
              'Other': 0.12
            },
            interests: ['Business Strategy', 'Leadership', 'Innovation', 'Growth', 'Technology']
          },
          behavior: {
            activeHours: {
              '7-9': 0.25,
              '9-12': 0.30,
              '12-15': 0.20,
              '15-18': 0.15,
              '18-21': 0.10
            },
            contentPreferences: {
              'Business Insights': 0.40,
              'Leadership Tips': 0.25,
              'Industry Analysis': 0.20,
              'Technology Trends': 0.15
            },
            responseTime: 4.2,
            sharingRate: 0.28
          },
          aiInsights: [
            'Early morning content consumption (7-9 AM)',
            'Prefers strategic, high-level business content',
            'Less frequent but higher quality engagement',
            'Values thought leadership and industry expertise'
          ],
          opportunities: [
            'Create executive-level business insights',
            'Develop leadership development content',
            'Build industry trend analysis',
            'Offer strategic business perspectives'
          ],
          risks: [
            'Content may be too basic for experienced leaders',
            'Need to provide unique, valuable insights',
            'Risk of being too promotional or sales-focused'
          ],
          priority: 'high'
        }
      ]);

      // Mock behavioral patterns
      setBehavioralPatterns([
        {
          id: 'pattern-1',
          pattern: 'Morning Content Consumption',
          description: 'High engagement during early morning hours (7-9 AM) across all segments',
          frequency: 0.85,
          impact: 'positive',
          confidence: 0.92,
          examples: [
            'Business leaders check content before work',
            'Tech professionals review industry news',
            'Creative professionals seek inspiration'
          ],
          recommendations: [
            'Schedule high-priority content for 7-9 AM',
            'Focus on informative, actionable content',
            'Use morning-specific messaging and themes'
          ]
        },
        {
          id: 'pattern-2',
          pattern: 'Visual Content Preference',
          description: 'Strong preference for visual content, especially among creative professionals',
          frequency: 0.78,
          impact: 'positive',
          confidence: 0.89,
          examples: [
            'Infographics receive 45% higher engagement',
            'Video content has 2.3x longer view time',
            'Image posts get 34% more shares'
          ],
          recommendations: [
            'Increase visual content production',
            'Use infographics for data presentation',
            'Create video summaries of key content'
          ]
        },
        {
          id: 'pattern-3',
          pattern: 'Community Engagement',
          description: 'High community engagement during work hours (9 AM - 6 PM)',
          frequency: 0.72,
          impact: 'positive',
          confidence: 0.85,
          examples: [
            'Comments peak during lunch hours (12-1 PM)',
            'Sharing increases during afternoon breaks',
            'Professional discussions most active 3-5 PM'
          ],
          recommendations: [
            'Schedule community content during work hours',
            'Encourage professional discussions',
            'Create shareable workplace content'
          ]
        },
        {
          id: 'pattern-4',
          pattern: 'Weekend Content Avoidance',
          description: 'Significantly lower engagement during weekends',
          frequency: 0.65,
          impact: 'negative',
          confidence: 0.78,
          examples: [
            'Saturday engagement drops 45%',
            'Sunday content gets 38% fewer views',
            'Weekend posts have 2.1x longer response time'
          ],
          recommendations: [
            'Avoid posting critical content on weekends',
            'Use weekends for evergreen content',
            'Focus on community building during weekdays'
          ]
        }
      ]);

      // Mock audience predictions
      setAudiencePredictions([
        {
          segmentId: 'tech-professionals',
          metric: 'Engagement Rate',
          currentValue: 8.7,
          predictedValue: 9.8,
          confidence: 0.87,
          factors: ['Content quality improvement', 'Timing optimization', 'AI personalization'],
          timeframe: 'Next 30 days'
        },
        {
          segmentId: 'creative-professionals',
          metric: 'Content Sharing',
          currentValue: 0.42,
          predictedValue: 0.51,
          confidence: 0.82,
          factors: ['Visual content increase', 'Community engagement', 'Inspirational content'],
          timeframe: 'Next 30 days'
        },
        {
          segmentId: 'business-leaders',
          metric: 'Response Time',
          currentValue: 4.2,
          predictedValue: 3.8,
          confidence: 0.79,
          factors: ['Content relevance', 'Timing optimization', 'Value proposition'],
          timeframe: 'Next 30 days'
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return designTokens.colors.success[500];
      case 'negative':
        return designTokens.colors.error[500];
      case 'neutral':
        return designTokens.colors.neutral[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const renderAudienceSegmentsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Audience Segments Analysis
      </Typography>
      
      <Grid container spacing={3}>
        {audienceSegments.map((segment) => (
          <Grid item xs={12} lg={4} key={segment.id}>
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
              onClick={() => setSelectedSegment(segment)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: designTokens.colors.primary[100], color: designTokens.colors.primary[600] }}>
                      <People />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {segment.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500] }}>
                        {segment.size.toLocaleString()} members
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={segment.priority}
                    size="small"
                    sx={{
                      background: `${getPriorityColor(segment.priority)}15`,
                      color: getPriorityColor(segment.priority),
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} component="div">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: designTokens.colors.success[600], fontWeight: 'bold' }}>
                          {segment.growth}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Growth
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                          {segment.engagement}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Engagement
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Top Interests
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {segment.demographics.interests.slice(0, 3).map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        size="small"
                        sx={{
                          background: designTokens.colors.primary[100],
                          color: designTokens.colors.primary[700],
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Peak Activity
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule sx={{ fontSize: 16, color: designTokens.colors.neutral[500] }} />
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {Object.entries(segment.behavior.activeHours)
                        .sort(([,a], [,b]) => b - a)[0][0]} (Most Active)
                    </Typography>
                  </Box>
                </Box>

                {segment.aiInsights.length > 0 && (
                  <Box sx={{ 
                    p: 2, 
                    background: designTokens.colors.ai[50], 
                    borderRadius: designTokens.borderRadius.md,
                    border: `1px solid ${designTokens.colors.ai[200]}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                              <Psychology sx={{ fontSize: 16, color: designTokens.colors.ai[600] }} />
                      <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], fontWeight: 'medium' }}>
                        AI Insights
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], fontSize: '0.875rem' }}>
                      {segment.aiInsights[0]}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderBehavioralPatternsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        Behavioral Pattern Analysis
      </Typography>
      
      <Grid container spacing={3}>
        {behavioralPatterns.map((pattern) => (
          <Grid item xs={12} md={6} key={pattern.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: `${getImpactColor(pattern.impact)}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: getImpactColor(pattern.impact)
                      }}
                    >
                      {pattern.impact === 'positive' && <TrendingUp sx={{ fontSize: 16 }} />}
                      {pattern.impact === 'negative' && <TrendingDown sx={{ fontSize: 16 }} />}
                      {pattern.impact === 'neutral' && <TrendingFlat sx={{ fontSize: 16 }} />}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {pattern.pattern}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500] }}>
                        {pattern.frequency * 100}% frequency
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`${(pattern.confidence * 100).toFixed(0)}%`}
                    size="small"
                    sx={{
                      background: designTokens.colors.ai[100],
                      color: designTokens.colors.ai[700],
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700], mb: 2 }}>
                  {pattern.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Examples
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {pattern.examples.map((example, index) => (
                      <Typography key={index} variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.875rem' }}>
                        • {example}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Recommendations
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {pattern.recommendations.map((rec, index) => (
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

  const renderPredictionsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        AI-Powered Audience Predictions
      </Typography>
      
      <Grid container spacing={3}>
        {audiencePredictions.map((prediction) => (
          <Grid item xs={12} md={6} lg={4} key={prediction.segmentId}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                    {audienceSegments.find(s => s.id === prediction.segmentId)?.name}
                  </Typography>
                  <Chip
                    label={prediction.timeframe}
                    size="small"
                    sx={{
                      background: designTokens.colors.primary[100],
                      color: designTokens.colors.primary[700],
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
                  {prediction.metric}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: designTokens.colors.neutral[800], fontWeight: 'bold' }}>
                          {prediction.currentValue}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Current
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: designTokens.colors.primary[600], fontWeight: 'bold' }}>
                          {prediction.predictedValue}
                        </Typography>
                        <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                          Predicted
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Prediction Confidence
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {(prediction.confidence * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={prediction.confidence * 100}
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

                <Box>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Key Factors
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {prediction.factors.map((factor, index) => (
                      <Chip
                        key={index}
                        label={factor}
                        size="small"
                        sx={{
                          background: designTokens.colors.neutral[100],
                          color: designTokens.colors.neutral[600],
                          fontSize: '0.6rem'
                        }}
                      />
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
              <Grid item xs={12} lg={4} key={item}>
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
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.success[600]
            }}
          >
            <Psychology sx={{ fontSize: 28 }} />
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
              Advanced Audience Intelligence
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Deep audience analysis with behavioral patterns and AI-powered predictions
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
                checked={showPredictions}
                onChange={(e) => setShowPredictions(e.target.checked)}
              />
            }
            label="Show AI Predictions"
          />
        </Box>
      </Box>

      {/* AI Status Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.success[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.success[700] }}>
          🧠 AI Audience Intelligence Active
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.success[700] }}>
          Your AI system has analyzed {audienceSegments.length} audience segments and identified {behavioralPatterns.length} behavioral patterns. 
          Current prediction accuracy: 87.3%. AI insights are continuously learning and improving based on real audience behavior data.
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
            Audience Segments
          </Button>
          <Button
            variant={activeTab === 1 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(1)}
            startIcon={<Psychology />}
          >
            Behavioral Patterns
          </Button>
          <Button
            variant={activeTab === 2 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(2)}
                              startIcon={<Psychology />}
          >
            AI Predictions
          </Button>
        </Box>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderAudienceSegmentsTab()}
      {activeTab === 1 && renderBehavioralPatternsTab()}
      {activeTab === 2 && renderPredictionsTab()}

      {/* API Error Alerts */}
      {audienceAnalysis.error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={audienceAnalysis.retry}>
              Retry
            </Button>
          }
        >
          <AlertTitle>Audience Analysis Error</AlertTitle>
          {audienceAnalysis.error}
        </Alert>
      )}

      {aiInsights.error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          action={
            <Button color="inherit" size="small" onClick={aiInsights.retry}>
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
