"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  Container,
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
  Collapse,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AutoAwesome,
  FlashOn,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  ExpandLess,
  Refresh,
  Settings,
  Notifications,
  Psychology,
  Analytics,
  ContentCopy,
  Schedule,
  Users,
  Target,
  Speed,
  Visibility,
  ThumbUp,
  Share,
  Message,
  CalendarToday,
  AccessTime,
  TrendingFlat,
  Rocket,
  Monitor,
  BarChart,
  Language,
  TrackChanges,
  Insights,
  Lightbulb,
  Target as TargetIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Share as ShareIcon,
  Message as MessageIcon
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';
import ConnectedAccountsStory from './connected-accounts-story';
import EnhancedBottomNavigation from './enhanced-bottom-navigation';

// Dashboard section interface
interface DashboardSection {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  content: ReactNode;
  priority: number;
  aiEnhanced?: boolean;
  proFeature?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  status?: 'success' | 'warning' | 'error' | 'info';
  actions?: ReactNode;
}

// Quick stats interface
interface QuickStat {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'flat';
  icon: React.ComponentType<any>;
  color: string;
  aiInsight?: string;
}

// AI insight interface
interface AIInsight {
  type: 'success' | 'warning' | 'info' | 'tip';
  message: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
}

// Unified dashboard layout props
interface UnifiedDashboardLayoutProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  quickStats?: QuickStat[];
  aiInsights?: AIInsight[];
  sections?: DashboardSection[];
  loading?: boolean;
  error?: string | null;
  showConnectedAccounts?: boolean;
  showBottomNavigation?: boolean;
  compact?: boolean;
  proStatus?: 'free' | 'pro' | 'enterprise';
  onRefresh?: () => void;
  onSettings?: () => void;
  className?: string;
}

export default function UnifiedDashboardLayout({
  children,
  title = "CreatorFlow Dashboard",
  subtitle = "AI-Powered Content Creation & Analytics",
  quickStats = [],
  aiInsights = [],
  sections = [],
  loading = false,
  error = null,
  showConnectedAccounts = true,
  showBottomNavigation = true,
  compact = false,
  proStatus = 'free',
  onRefresh,
  onSettings,
  className
}: UnifiedDashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showAllInsights, setShowAllInsights] = useState(false);

  // Mock quick stats if none provided
  const defaultQuickStats: QuickStat[] = [
    {
      label: 'Total Posts',
      value: '247',
      change: 12,
      trend: 'up',
      icon: ContentCopy,
      color: designTokens.colors.primary[500],
      aiInsight: 'Posts with videos perform 2.3x better'
    },
    {
      label: 'Engagement Rate',
      value: '4.2%',
      change: 0.8,
      trend: 'up',
      icon: ThumbUp,
      color: designTokens.colors.success[500],
      aiInsight: 'Your engagement is 15% above average'
    },
    {
      label: 'Reach',
      value: '89.2K',
      change: -2.1,
      trend: 'down',
      icon: Visibility,
      color: designTokens.colors.warning[500],
      aiInsight: 'Consider posting during peak hours (2-4 PM)'
    },
    {
      label: 'Scheduled',
      value: '12',
      change: 3,
      trend: 'up',
      icon: Schedule,
      color: designTokens.colors.secondary[500],
      aiInsight: 'Consistent posting improves algorithm favorability'
    }
  ];

  // Mock AI insights if none provided
  const defaultAIInsights: AIInsight[] = [
    {
      type: 'success',
      message: 'Your Instagram posts are performing 23% above average this week',
      action: 'View insights',
      priority: 'high',
      timestamp: new Date()
    },
    {
      type: 'tip',
      message: 'Posts with questions in captions get 40% more engagement',
      action: 'Learn more',
      priority: 'medium',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      type: 'warning',
      message: 'Your Twitter engagement dropped 15% - consider trending hashtags',
      action: 'Optimize now',
      priority: 'high',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];

  const displayStats = quickStats.length > 0 ? quickStats : defaultQuickStats;
  const displayInsights = aiInsights.length > 0 ? aiInsights : defaultAIInsights;

  useEffect(() => {
    // Initialize expanded sections
    const initialExpanded = new Set<string>();
    sections.forEach(section => {
      if (section.defaultExpanded) {
        initialExpanded.add(section.id);
      }
    });
    setExpandedSections(initialExpanded);
  }, [sections]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return <TrendingUp fontSize="small" />;
      case 'down':
        return <TrendingDown fontSize="small" />;
      case 'flat':
        return <TrendingFlat fontSize="small" />;
      default:
        return <TrendingFlat fontSize="small" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'flat') => {
    switch (trend) {
      case 'up':
        return designTokens.colors.success[500];
      case 'down':
        return designTokens.colors.error[500];
      case 'flat':
        return designTokens.colors.neutral[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle fontSize="small" />;
      case 'warning':
        return <Warning fontSize="small" />;
      case 'info':
        return <Info fontSize="small" />;
      case 'tip':
        return <Lightbulb fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return designTokens.colors.success[500];
      case 'warning':
        return designTokens.colors.warning[500];
      case 'info':
        return designTokens.colors.info[500];
      case 'tip':
        return designTokens.colors.ai[500];
      default:
        return designTokens.colors.info[500];
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} component="div">
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: designTokens.colors.neutral[50],
        pb: showBottomNavigation ? (compact ? 8 : 9) : 0
      }}
      className={className}
    >
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
        borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
        mb: 3
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            p: { xs: 2, md: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography 
                variant={compact ? "h5" : "h4"} 
                sx={{ 
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.neutral[900],
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <AutoAwesome sx={{ color: designTokens.colors.ai[500] }} />
                {title}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: designTokens.colors.neutral[600],
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Psychology fontSize="small" sx={{ color: designTokens.colors.secondary[500] }} />
                {subtitle}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onRefresh && (
                <Tooltip title="Refresh dashboard">
                  <IconButton 
                    onClick={onRefresh}
                    sx={{ 
                      color: designTokens.colors.neutral[600],
                      '&:hover': { 
                        color: designTokens.colors.primary[500],
                        background: designTokens.colors.primary[50]
                      }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
              
              {onSettings && (
                <Tooltip title="Dashboard settings">
                  <IconButton 
                    onClick={onSettings}
                    sx={{ 
                      color: designTokens.colors.neutral[600],
                      '&:hover': { 
                        color: designTokens.colors.primary[500],
                        background: designTokens.colors.primary[50]
                      }
                    }}
                  >
                    <Settings />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Error Display */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={onRefresh}>
                Retry
              </Button>
            }
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* AI Insights Section */}
        {displayInsights.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Paper 
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: `1px solid ${designTokens.colors.ai[200]}`,
                borderRadius: designTokens.borderRadius.xl,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                p: 2,
                borderBottom: `1px solid ${designTokens.colors.ai[200]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology sx={{ color: designTokens.colors.ai[600] }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: designTokens.typography.fontWeight.semibold,
                      color: designTokens.colors.neutral[800]
                    }}
                  >
                    AI Insights
                  </Typography>
                  <Chip 
                    label={displayInsights.length} 
                    size="small" 
                    sx={{ 
                      background: designTokens.colors.ai[100],
                      color: designTokens.colors.ai[700]
                    }}
                  />
                </Box>
                
                <Button
                  size="small"
                  onClick={() => setShowAllInsights(!showAllInsights)}
                  endIcon={showAllInsights ? <ExpandLess /> : <ExpandMore />}
                  sx={{ color: designTokens.colors.ai[600] }}
                >
                  {showAllInsights ? 'Show Less' : 'Show All'}
                </Button>
              </Box>
              
              <Collapse in={showAllInsights}>
                <Box sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    {displayInsights.map((insight, index) => (
                      <Box 
                        key={index}
                        sx={{
                          p: 2,
                          background: 'white',
                          borderRadius: designTokens.borderRadius.lg,
                          border: `1px solid ${designTokens.colors.neutral[200]}`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2
                        }}
                      >
                        <Box
                          sx={{
                            color: getInsightColor(insight.type),
                            display: 'flex',
                            alignItems: 'center',
                            mt: 0.5
                          }}
                        >
                          {getInsightIcon(insight.type)}
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: designTokens.colors.neutral[800],
                              mb: 1
                            }}
                          >
                            {insight.message}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {insight.action && (
                              <Button 
                                size="small" 
                                variant="outlined"
                                sx={{ 
                                  borderColor: getInsightColor(insight.type),
                                  color: getInsightColor(insight.type),
                                  fontSize: '0.75rem'
                                }}
                              >
                                {insight.action}
                              </Button>
                            )}
                            
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: designTokens.colors.neutral[500],
                                fontSize: '0.7rem'
                              }}
                            >
                              {insight.timestamp.toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Collapse>
            </Paper>
          </Box>
        )}

        {/* Quick Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {displayStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} component="div">
              <Fade in={true} timeout={300 + index * 100}>
                <Card 
                  elevation={0}
                  sx={{
                    background: 'white',
                    border: `1px solid ${designTokens.colors.neutral[200]}`,
                    borderRadius: designTokens.borderRadius.xl,
                    transition: designTokens.animation.micro.cardHover,
                    '&:hover': {
                      boxShadow: designTokens.shadows.md,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: `${stat.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.color
                        }}
                      >
                        <stat.icon sx={{ fontSize: 24 }} />
                      </Box>
                      
                      {stat.change !== undefined && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          color: getTrendColor(stat.trend || 'flat')
                        }}>
                          {getTrendIcon(stat.trend || 'flat')}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: designTokens.typography.fontWeight.medium,
                              fontSize: '0.75rem'
                            }}
                          >
                            {stat.change > 0 ? '+' : ''}{stat.change}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: designTokens.typography.fontWeight.bold,
                        color: designTokens.colors.neutral[900],
                        mb: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: designTokens.colors.neutral[600],
                        mb: 1
                      }}
                    >
                      {stat.label}
                    </Typography>
                    
                    {stat.aiInsight && (
                      <Box sx={{ 
                        p: 1.5,
                        background: designTokens.colors.ai[50],
                        borderRadius: designTokens.borderRadius.md,
                        border: `1px solid ${designTokens.colors.ai[200]}`
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: designTokens.colors.ai[700],
                            fontSize: '0.7rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <AutoAwesome fontSize="inherit" />
                          {stat.aiInsight}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Connected Accounts Section */}
        {showConnectedAccounts && (
          <Box sx={{ mb: 3 }}>
            <ConnectedAccountsStory 
              compact={compact}
              showStats={!compact}
              maxVisible={isMobile ? 4 : 6}
            />
          </Box>
        )}

        {/* Dashboard Sections */}
        {sections.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {sections
              .sort((a, b) => a.priority - b.priority)
              .map((section, index) => (
                <Fade in={true} key={section.id} timeout={400 + index * 100}>
                  <Paper 
                    elevation={0}
                    sx={{
                      background: 'white',
                      border: `1px solid ${designTokens.colors.neutral[200]}`,
                      borderRadius: designTokens.borderRadius.xl,
                      overflow: 'hidden',
                      mb: 2,
                      transition: designTokens.animation.micro.cardHover,
                      '&:hover': {
                        boxShadow: designTokens.shadows.md
                      }
                    }}
                  >
                    {/* Section Header */}
                    <Box sx={{ 
                      p: 3,
                      background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)',
                      borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
                      cursor: section.collapsible ? 'pointer' : 'default'
                    }}
                    onClick={() => section.collapsible && toggleSection(section.id)}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: `${designTokens.colors.primary[500]}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: designTokens.colors.primary[600]
                            }}
                          >
                            <section.icon sx={{ fontSize: 20 }} />
                          </Box>
                          
                          <Box>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: designTokens.typography.fontWeight.semibold,
                                color: designTokens.colors.neutral[800],
                                mb: 0.5
                              }}
                            >
                              {section.title}
                            </Typography>
                            
                            {section.subtitle && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: designTokens.colors.neutral[600]
                                }}
                              >
                                {section.subtitle}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {/* AI Enhancement Badge */}
                          {section.aiEnhanced && (
                            <Chip
                              label="AI Enhanced"
                              size="small"
                              icon={<AutoAwesome />}
                              sx={{
                                background: designTokens.colors.ai[100],
                                color: designTokens.colors.ai[700],
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                          
                          {/* Pro Feature Badge */}
                          {section.proFeature && proStatus === 'free' && (
                            <Chip
                              label="PRO"
                              size="small"
                              sx={{
                                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: designTokens.typography.fontWeight.bold
                              }}
                            />
                          )}
                          
                          {/* Status Badge */}
                          {section.status && (
                            <Chip
                              label={section.status}
                              size="small"
                              sx={{
                                background: `${getInsightColor(section.status)}15`,
                                color: getInsightColor(section.status),
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                          
                          {/* Collapse/Expand Icon */}
                          {section.collapsible && (
                            <IconButton size="small">
                              {expandedSections.has(section.id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          )}
                          
                          {/* Custom Actions */}
                          {section.actions}
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Section Content */}
                    <Collapse in={!section.collapsible || expandedSections.has(section.id)}>
                      <Box sx={{ p: 3 }}>
                        {section.content}
                      </Box>
                    </Collapse>
                  </Paper>
                </Fade>
              ))}
          </Box>
        )}

        {/* Children Content */}
        {children && (
          <Box sx={{ mb: 3 }}>
            {children}
          </Box>
        )}
      </Container>

      {/* Enhanced Bottom Navigation */}
      {showBottomNavigation && (
        <EnhancedBottomNavigation
          compact={compact}
          aiInsights={true}
          notifications={3}
          proStatus={proStatus}
        />
      )}
    </Box>
  );
}

// Export types for external use
export type { DashboardSection, QuickStat, AIInsight, UnifiedDashboardLayoutProps };
