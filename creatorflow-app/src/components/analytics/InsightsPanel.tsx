'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/mui-card';
import { Button, Typography, Box, Grid, Chip } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, Info, Clock } from 'lucide-react';

interface Insight {
  id: string;
  type: 'performance' | 'timing' | 'content' | 'engagement' | 'growth';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  data: Record<string, any>;
  recommendations: string[];
  createdAt: Date;
}

interface UserInsights {
  userId: string;
  insights: Insight[];
  lastGenerated: Date;
  nextUpdate: Date;
}

interface InsightsPanelProps {
  insights: UserInsights | null;
  onRefresh: () => void;
}

export function InsightsPanel({ insights, onRefresh }: InsightsPanelProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Activity className="h-5 w-5" />;
      case 'timing':
        return <Activity className="h-5 w-5" />;
      case 'content':
        return <Activity className="h-5 w-5" />;
      case 'engagement':
        return <Activity className="h-5 w-5" />;
      case 'growth':
        return <Activity className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success.main';
    if (confidence >= 60) return 'warning.main';
    return 'error.main';
  };

  // Safe access to insights array with fallback
  const insightsArray = insights?.insights || [];
  const lastGenerated = insights?.lastGenerated || new Date();
  const nextUpdate = insights?.nextUpdate || new Date(Date.now() + 24 * 60 * 60 * 1000);

  if (!insights || insightsArray.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ color: 'grey.400', mb: 2 }}>
          <Activity className="h-12 w-12" />
        </Box>
        <Typography variant="h5" component="h3" sx={{ fontWeight: 500, color: 'grey.900', mb: 1 }}>No Insights Available</Typography>
        <Typography variant="body1" sx={{ color: 'grey.500', mb: 2 }}>Generate AI-powered insights to get personalized recommendations.</Typography>
        <Button onClick={onRefresh}>
          <Box sx={{ mr: 1 }}>
            <Activity className="h-4 w-4" />
          </Box>
          Generate Insights
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'grey.900' }}>AI Insights</Typography>
          <Typography variant="body2" sx={{ color: 'grey.600', mt: 0.5 }}>
            Last generated: {new Date(lastGenerated).toLocaleString()}
          </Typography>
        </Box>
        <Button onClick={onRefresh} variant="outlined">
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </Box>

      {/* Insights Grid */}
      <Grid container spacing={3}>
        {insightsArray.map((insight) => (
          <Grid item xs={12} lg={6} key={insight.id}>
            <Card sx={{ 
              '&:hover': { 
                boxShadow: 3, 
                transform: 'translateY(-4px)',
                transition: 'all 0.2s'
              }
            }}>
              <CardHeader sx={{ pb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ p: 1, bgcolor: 'blue.100', borderRadius: 2 }}>
                      {getInsightIcon(insight.type)}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1.125rem' }}>{insight.title}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={`${insight.impact} impact`} 
                          color={getImpactColor(insight.impact) as any}
                          size="small"
                        />
                        <Typography variant="body2" sx={{ 
                          fontSize: '0.875rem',
                          color: getConfidenceColor(insight.confidence)
                        }}>
                          {insight.confidence}% confidence
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardHeader>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'grey.600', mb: 2 }}>{insight.description}</Typography>
                
                {insight.recommendations && insight.recommendations.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'grey.900' }}>Recommendations:</Typography>
                    <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {insight.recommendations.map((recommendation, index) => (
                        <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: '0.875rem', color: 'grey.600' }}>
                          <Box sx={{ color: 'green.500', mt: 0.5, flexShrink: 0 }}>
                            <CheckCircle className="h-4 w-4" />
                          </Box>
                          <span>{recommendation}</span>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {insight.data && Object.keys(insight.data).length > 0 && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'grey.900', mb: 1 }}>Key Data:</Typography>
                    <Grid container spacing={1} sx={{ fontSize: '0.875rem' }}>
                      {Object.entries(insight.data).map(([key, value]) => (
                        <Grid item xs={6} key={key}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: 'grey.600' }}>{key}:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{String(value)}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Next Update Info */}
      <Card sx={{ bgcolor: 'blue.50', border: '1px solid', borderColor: 'blue.200' }}>
        <CardContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: 'blue.600' }}>
              <Clock className="h-5 w-5" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'blue.900' }}>
                Next insights update: {new Date(nextUpdate).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'blue.700' }}>
                Insights are automatically updated every 24 hours
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 