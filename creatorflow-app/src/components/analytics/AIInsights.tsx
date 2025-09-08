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
  Button
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
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

interface AIInsight {
  id: string;
  type: 'performance' | 'trend' | 'opportunity' | 'risk' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  action?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  tags: string[];
}

export default function AIInsights() {
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock AI insights data
      setAiInsights([
        {
          id: 'insight-1',
          type: 'opportunity',
          title: 'Peak Engagement Window Identified',
          description: 'Your content performs 40% better when posted between 6-8 PM on weekdays. This pattern has been consistent over the past 30 days.',
          impact: 'high',
          confidence: 0.92,
          actionable: true,
          action: 'Schedule 70% of your content during 6-8 PM weekday slots',
          priority: 'high',
          category: 'Timing Optimization',
          tags: ['timing', 'engagement', 'scheduling']
        },
        {
          id: 'insight-2',
          type: 'performance',
          title: 'Visual Content Outperforming Text',
          description: 'Posts with images or videos generate 2.3x more engagement than text-only posts. Your visual content averages 8.7% engagement vs 3.8% for text.',
          impact: 'high',
          confidence: 0.89,
          actionable: true,
          action: 'Increase visual content ratio to 80% of total posts',
          priority: 'high',
          category: 'Content Strategy',
          tags: ['visual', 'content', 'engagement']
        },
        {
          id: 'insight-3',
          title: 'Hashtag Strategy Optimization',
          description: 'Using 5-7 hashtags per post maximizes reach. Your current average of 3.2 hashtags is limiting potential reach by approximately 25%.',
          impact: 'medium',
          confidence: 0.85,
          actionable: true,
          action: 'Increase hashtag usage to 5-7 per post using trending and niche tags',
          priority: 'medium',
          category: 'Hashtag Strategy',
          tags: ['hashtags', 'reach', 'discovery']
        },
        {
          id: 'insight-4',
          type: 'risk',
          title: 'Engagement Drop on Weekends',
          description: 'Weekend posts show 35% lower engagement compared to weekday content. This suggests your audience is less active on weekends.',
          impact: 'medium',
          confidence: 0.78,
          actionable: true,
          action: 'Reduce weekend posting frequency or adjust content type for weekend audience',
          priority: 'medium',
          category: 'Audience Behavior',
          tags: ['weekend', 'engagement', 'timing']
        },
        {
          id: 'insight-5',
          type: 'optimization',
          title: 'Story Engagement Peak Times',
          description: 'Stories posted between 7-9 AM and 5-7 PM generate 60% more views and interactions than other times.',
          impact: 'medium',
          confidence: 0.81,
          actionable: true,
          action: 'Schedule stories during morning and evening commute times',
          priority: 'medium',
          category: 'Story Strategy',
          tags: ['stories', 'timing', 'engagement']
        },
        {
          id: 'insight-6',
          type: 'trend',
          title: 'Video Content Trend Rising',
          description: 'Video content engagement is increasing by 15% month-over-month. This trend is expected to continue based on platform algorithm changes.',
          impact: 'high',
          confidence: 0.88,
          actionable: true,
          action: 'Increase video content production by 50% over next quarter',
          priority: 'high',
          category: 'Content Trends',
          tags: ['video', 'trends', 'algorithm']
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity': return designTokens.colors.success[500];
      case 'performance': return designTokens.colors.primary[500];
      case 'optimization': return designTokens.colors.info[500];
      case 'risk': return designTokens.colors.error[500];
      case 'trend': return designTokens.colors.warning[500];
      default: return designTokens.colors.neutral[500];
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <FlashOn />;
      case 'performance': return <Analytics />;
      case 'optimization': return <Settings />;
      case 'risk': return <Warning />;
      case 'trend': return <TrendingUp />;
      default: return <Info />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return designTokens.colors.error[500];
      case 'medium': return designTokens.colors.warning[500];
      case 'low': return designTokens.colors.success[500];
      default: return designTokens.colors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return designTokens.colors.error[700];
      case 'high': return designTokens.colors.error[500];
      case 'medium': return designTokens.colors.warning[500];
      case 'low': return designTokens.colors.success[500];
      default: return designTokens.colors.neutral[500];
    }
  };

  const filteredInsights = aiInsights.filter(insight => {
    const typeMatch = filterType === 'all' || insight.type === filterType;
    const priorityMatch = filterPriority === 'all' || insight.priority === filterPriority;
    return typeMatch && priorityMatch;
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
          AI-Powered Insights & Recommendations
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={250} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
        AI-Powered Insights & Recommendations
      </Typography>
      
      {/* Filters */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="opportunity">Opportunities</MenuItem>
            <MenuItem value="performance">Performance</MenuItem>
            <MenuItem value="optimization">Optimization</MenuItem>
            <MenuItem value="risk">Risks</MenuItem>
            <MenuItem value="trend">Trends</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filterPriority}
            label="Priority"
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <MenuItem value="all">All Priorities</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Insights Grid */}
      <Grid container spacing={3}>
        {filteredInsights.map((insight, index) => (
          <Grid item xs={12} sm={6} md={4} key={insight.id}>
            <Fade in={true} timeout={500 + index * 100}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => setSelectedInsight(insight)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTypeIcon(insight.type)}
                      <Typography variant="h6" sx={{ color: 'text.primary' }}>
                        {insight.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip 
                        label={insight.type.toUpperCase()} 
                        size="small"
                        sx={{ 
                          backgroundColor: getTypeColor(insight.type),
                          color: 'primary.contrastText',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {insight.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={insight.impact.toUpperCase()} 
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: getImpactColor(insight.impact),
                          color: getImpactColor(insight.impact)
                        }}
                      />
                      <Chip 
                        label={insight.priority.toUpperCase()} 
                        size="small"
                        sx={{ 
                          backgroundColor: getPriorityColor(insight.priority),
                          color: 'primary.contrastText',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {(insight.confidence * 100).toFixed(0)}% confidence
                    </Typography>
                  </Box>

                  <LinearProgress 
                    variant="determinate" 
                    value={insight.confidence * 100}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getTypeColor(insight.type)
                      }
                    }}
                  />

                  {insight.actionable && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 1.5, 
                      backgroundColor: designTokens.colors.ai[50], 
                      borderRadius: 2,
                      border: `1px solid ${designTokens.colors.ai[200]}`
                    }}>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                        💡 Actionable
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Selected Insight Details */}
      {selectedInsight && (
        <Zoom in={true}>
          <Card sx={{ mt: 3, backgroundColor: designTokens.colors.primary[50] }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {selectedInsight.title} - Detailed Analysis
                </Typography>
                <IconButton onClick={() => setSelectedInsight(null)}>
                  <ExpandLess />
                </IconButton>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary' }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.primary', mb: 3 }}>
                    {selectedInsight.description}
                  </Typography>

                  {selectedInsight.action && (
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: designTokens.colors.ai[100], 
                      borderRadius: 2,
                      border: `1px solid ${designTokens.colors.ai[300]}`
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary' }}>
                        🎯 Recommended Action
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {selectedInsight.action}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.primary' }}>
                    Insight Details
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Type
                    </Typography>
                    <Chip 
                      label={selectedInsight.type.toUpperCase()} 
                      sx={{ 
                        backgroundColor: getTypeColor(selectedInsight.type),
                        color: 'primary.contrastText',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Impact Level
                    </Typography>
                    <Chip 
                      label={selectedInsight.impact.toUpperCase()} 
                      variant="outlined"
                      sx={{ 
                        borderColor: getImpactColor(selectedInsight.impact),
                        color: getImpactColor(selectedInsight.impact)
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Priority
                    </Typography>
                    <Chip 
                      label={selectedInsight.priority.toUpperCase()} 
                      sx={{ 
                        backgroundColor: getPriorityColor(selectedInsight.priority),
                        color: 'primary.contrastText',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Confidence Level
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedInsight.confidence * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: designTokens.colors.neutral[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getTypeColor(selectedInsight.type)
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {(selectedInsight.confidence * 100).toFixed(0)}%
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Category
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.primary' }}>
                      {selectedInsight.category}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedInsight.tags.map((tag, idx) => (
                        <Chip 
                          key={idx}
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Zoom>
      )}
    </Box>
  );
}
