/**
 * AI Insights Component
 * Displays AI-powered insights and recommendations
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

interface AIInsight {
  type: 'performance' | 'optimization' | 'trend' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
  relatedMetrics: string[];
  timeframe: string;
}

interface AIInsightsProps {
  insights: AIInsight[];
  loading?: boolean;
  onRefresh?: () => void;
  onActionItemClick?: (actionItem: string) => void;
}

export default function AIInsights({ 
  insights, 
  loading = false, 
  onRefresh, 
  onActionItemClick 
}: AIInsightsProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | false>(false);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUpIcon color="success" />;
      case 'optimization':
        return <WarningIcon color="warning" />;
      case 'trend':
        return <AnalyticsIcon color="info" />;
      case 'recommendation':
        return <LightbulbIcon color="primary" />;
      default:
        return <AutoAwesomeIcon />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <ErrorIcon />;
      case 'medium':
        return <WarningIcon />;
      case 'low':
        return <CheckCircleIcon />;
      default:
        return <CheckCircleIcon />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const handleInsightExpand = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? false : insightId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesomeIcon sx={{ mr: 1 }} />
            <Typography variant="h6">AI Insights</Typography>
          </Box>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Analyzing your data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesomeIcon sx={{ mr: 1 }} />
            <Typography variant="h6">AI Insights</Typography>
            {onRefresh && (
              <Tooltip title="Refresh Insights">
                <IconButton onClick={onRefresh} size="small" sx={{ ml: 'auto' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Alert severity="info">
            No insights available yet. Start posting content to get AI-powered recommendations.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoAwesomeIcon sx={{ mr: 1 }} />
          <Typography variant="h6">AI Insights</Typography>
          {onRefresh && (
            <Tooltip title="Refresh Insights">
              <IconButton onClick={onRefresh} size="small" sx={{ ml: 'auto' }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          AI-powered insights and recommendations based on your content performance
        </Typography>

        {insights.map((insight, index) => (
          <Accordion
            key={index}
            expanded={expandedInsight === `insight-${index}`}
            onChange={() => handleInsightExpand(`insight-${index}`)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {getInsightIcon(insight.type)}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {insight.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {insight.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                  <Chip
                    icon={getImpactIcon(insight.impact)}
                    label={insight.impact.toUpperCase()}
                    color={getImpactColor(insight.impact)}
                    size="small"
                  />
                  <Chip
                    label={`${getConfidenceLabel(insight.confidence)} Confidence`}
                    color={getConfidenceColor(insight.confidence)}
                    size="small"
                  />
                  {insight.actionable && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Actionable"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {insight.description}
                </Typography>
              </Box>

              {insight.actionItems && insight.actionItems.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Action Items:
                  </Typography>
                  <List dense>
                    {insight.actionItems.map((item, itemIndex) => (
                      <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                        {onActionItemClick && (
                          <Button
                            size="small"
                            onClick={() => onActionItemClick(item)}
                            sx={{ ml: 1 }}
                          >
                            Apply
                          </Button>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Related Metrics: {insight.relatedMetrics.join(', ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Timeframe: {insight.timeframe}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Confidence: {(insight.confidence * 100).toFixed(0)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={insight.confidence * 100}
                    sx={{ width: 60, height: 4 }}
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        {insights.length > 3 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<AutoAwesomeIcon />}
              onClick={onRefresh}
            >
              Get More Insights
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// Insight Summary Component
interface InsightSummaryProps {
  insights: AIInsight[];
}

export function InsightSummary({ insights }: InsightSummaryProps) {
  const highImpactInsights = insights.filter(i => i.impact === 'high').length;
  const actionableInsights = insights.filter(i => i.actionable).length;
  const avgConfidence = insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length;

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Chip
        icon={<ErrorIcon />}
        label={`${highImpactInsights} High Impact`}
        color="error"
        variant="outlined"
      />
      <Chip
        icon={<CheckCircleIcon />}
        label={`${actionableInsights} Actionable`}
        color="success"
        variant="outlined"
      />
      <Chip
        icon={<StarIcon />}
        label={`${(avgConfidence * 100).toFixed(0)}% Avg Confidence`}
        color="info"
        variant="outlined"
      />
    </Box>
  );
}

// Quick Actions Component
interface QuickActionsProps {
  insights: AIInsight[];
  onActionClick?: (action: string) => void;
}

export function QuickActions({ insights, onActionClick }: QuickActionsProps) {
  const actionableInsights = insights.filter(i => i.actionable && i.actionItems);
  const allActionItems = actionableInsights.flatMap(i => i.actionItems || []);

  // Get unique action items
  const uniqueActions = [...new Set(allActionItems)];

  if (uniqueActions.length === 0) {
    return null;
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Apply AI recommendations with one click
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {uniqueActions.slice(0, 5).map((action, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={() => onActionClick?.(action)}
            >
              {action}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
