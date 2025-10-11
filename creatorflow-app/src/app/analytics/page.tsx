'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as ActivityIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Warning as AlertTriangleIcon,
  Visibility as EyeIcon,
  Group as UsersIcon,
  Adjust as TargetIcon,
  LightbulbOutlined as LightbulbIcon,
  Bolt as ZapIcon,
  Download as DownloadIcon,
  PsychologyOutlined as BrainIcon
} from '@mui/icons-material';

import { TabsContent } from '@/components/ui/tabs';


interface AnalyticsInsight {
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk' | 'segment' | 'funnel';
  title: string;
  description: string;
  confidence?: number;
  impact?: 'high' | 'medium' | 'low';
  recommendations?: string[];
  data?: any;
}

interface RealTimeMetrics {
  activeUsers: number;
  newUsers: number;
  totalEvents: number;
  platformUsage: Record<string, number>;
  topContent: any[];
  timestamp: string;
}

export default function AnalyticsPage() {
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [insightType, setInsightType] = useState('all');
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAnalyticsData();
  }, [insightType, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [insightsRes, metricsRes] = await Promise.all([
        fetch(`/api/analytics/insights?type=${insightType}&timeRange=${timeRange}`),
        fetch('/api/analytics/realtime'),
      ]);

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData.insights || []);
      }

      if (metricsRes.ok) {
        const metrics = await metricsRes.json();
        setRealTimeMetrics(metrics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUpIcon sx={{ width: 20, height: 20, color: 'success.main' }} />;
      case 'risk': return <AlertTriangleIcon sx={{ width: 20, height: 20, color: 'error.main' }} />;
      case 'trend': return <BarChartIcon sx={{ width: 20, height: 20, color: 'primary.main' }} />;
      case 'anomaly': return <EyeIcon sx={{ width: 20, height: 20, color: 'warning.main' }} />;
      case 'segment': return <UsersIcon sx={{ width: 20, height: 20, color: 'secondary.main' }} />;
      case 'funnel': return <TargetIcon sx={{ width: 20, height: 20, color: 'info.main' }} />;
      default: return <LightbulbIcon sx={{ width: 20, height: 20, color: 'warning.main' }} />;
    }
  };

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportInsights = () => {
    const csvData = [
      ['Type', 'Title', 'Description', 'Confidence', 'Impact'],
      ...insights.map(insight => [
        insight.type,
        insight.title,
        insight.description,
        insight.confidence?.toFixed(2) || 'N/A',
        insight.impact || 'N/A',
      ]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-insights-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <Box sx={{ p: 4 }}>Loading analytics data...</Box>;

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            Advanced Analytics
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            AI-powered insights and predictive analytics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Insight Type</InputLabel>
            <MuiSelect
              value={insightType}
              onChange={(e) => setInsightType(e.target.value)}
              label="Insight Type"
            >
              <MenuItem value="all">All Insights</MenuItem>
              <MenuItem value="predictive">Predictive</MenuItem>
              <MenuItem value="segments">Segments</MenuItem>
              <MenuItem value="funnel">Funnel</MenuItem>
            </MuiSelect>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 128 }}>
            <InputLabel>Time Range</InputLabel>
            <MuiSelect
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7">7 days</MenuItem>
              <MenuItem value="30">30 days</MenuItem>
              <MenuItem value="90">90 days</MenuItem>
            </MuiSelect>
          </FormControl>
          <Button onClick={refreshData} disabled={refreshing} variant="outlined">
            <RefreshIcon sx={{ width: 16, height: 16, marginRight: 8 }} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button onClick={exportInsights} variant="outlined">
            <DownloadIcon sx={{ width: 16, height: 16, marginRight: 8 }} />
            Export
          </Button>
        </Box>
      </Box>

      {/* Real-time Metrics */}
      {realTimeMetrics && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Active Users</Typography>
                <ActivityIcon sx={{ height: 16, width: 16, color: 'var(--mui-palette-text-secondary)' }} />
              </CardHeader>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{realTimeMetrics.activeUsers}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Last hour
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>New Users</Typography>
                <UsersIcon sx={{ height: 16, width: 16, color: 'var(--mui-palette-text-secondary)' }} />
              </CardHeader>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{realTimeMetrics.newUsers}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Last hour
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Events</Typography>
                <BarChartIcon sx={{ height: 16, width: 16, color: 'var(--mui-palette-text-secondary)' }} />
              </CardHeader>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{realTimeMetrics.totalEvents}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Last hour
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Platform Usage</Typography>
                <ZapIcon sx={{ height: 16, width: 16, color: 'var(--mui-palette-text-secondary)' }} />
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(realTimeMetrics.platformUsage).map(([platform, count]) => (
                    <Box key={platform} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{platform}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{count}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs and Content */}
      {/* The original code had Tabs, TabsList, TabsTrigger, TabsContent, CardDescription.
          These are not directly available in MUI Material-UI.
          For now, I'm keeping the structure but acknowledging the missing components.
          The content of the tabs will be rendered directly as Box components. */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button value="insights" variant="outlined">AI Insights</Button>
          <Button value="predictive" variant="outlined">Predictive</Button>
          <Button value="segments" variant="outlined">Segments</Button>
          <Button value="funnel" variant="outlined">Funnel</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ p: 2, border: 1, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            {getInsightIcon('insights')}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>AI-Powered Insights</Typography>
                                 <Chip label="Insights" variant="outlined" size="small" />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                Intelligent recommendations and trend analysis
              </Typography>
              {insights.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No insights available
                </Box>
              ) : (
                insights.map((insight, index) => (
                  <Box key={index} sx={{ p: 2, border: 1, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      {getInsightIcon(insight.type)}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>{insight.title}</Typography>
                          {insight.impact && (
                            <Chip 
                              label={insight.impact.toUpperCase()}
                              color={insight.impact === 'high' ? 'error' : insight.impact === 'medium' ? 'warning' : 'success'}
                              size="small"
                            />
                          )}
                          {insight.confidence && (
                            <Chip 
                              label={`${Math.round(insight.confidence * 100)}% confidence`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                          {insight.description}
                        </Typography>
                        {insight.recommendations && insight.recommendations.length > 0 && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                              Recommendations:
                            </Typography>
                            <Box component="ul" sx={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {insight.recommendations.map((rec, recIndex) => (
                                <Box component="li" key={recIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                  <Box sx={{ width: 6, height: 6, bgcolor: 'blue.500', borderRadius: '50%', mt: 1 }} />
                                  {rec}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 2, border: 1, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUpIcon sx={{ width: 20, height: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Predictive Analytics</Typography>
                         <Chip label="Predictive" variant="outlined" size="small" />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            AI-powered predictions and trend forecasting
          </Typography>
          {insights.filter(i => i.type === 'trend' || i.type === 'opportunity' || i.type === 'risk').length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              No predictive insights available
            </Box>
          ) : (
            insights
              .filter(i => i.type === 'trend' || i.type === 'opportunity' || i.type === 'risk')
              .map((insight, index) => (
                <Box key={index} sx={{ p: 2, border: 1, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {getInsightIcon(insight.type)}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{insight.title}</Typography>
                        {insight.impact && (
                          <Chip 
                            label={insight.impact.toUpperCase()}
                            color={insight.impact === 'high' ? 'error' : insight.impact === 'medium' ? 'warning' : 'success'}
                            size="small"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {insight.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
          )}
        </Box>

        <Box sx={{ p: 2, border: 1, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <UsersIcon sx={{ width: 20, height: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>User Segments</Typography>
                         <Chip label="Segments" variant="outlined" size="small" />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            AI-identified user groups and behavior patterns
          </Typography>
          {insights.filter(i => i.type === 'segment').length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              No user segments available
            </Box>
          ) : (
            insights
              .filter(i => i.type === 'segment')
              .map((insight, index) => (
                <Box key={index} sx={{ p: 2, border: 1, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {getInsightIcon(insight.type)}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{insight.title}</Typography>
                        <Chip label={`${insight.data?.userCount || 0} users`} variant="outlined" size="small" />
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        {insight.description}
                      </Typography>
                      {insight.data && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Engagement:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {Math.round((insight.data.engagementScore || 0) * 100)}%
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>LTV:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              ${(insight.data.lifetimeValue || 0).toFixed(2)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Churn Risk:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {Math.round((insight.data.churnRisk || 0) * 100)}%
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))
          )}
        </Box>

        <Box sx={{ p: 2, border: 1, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TargetIcon sx={{ width: 20, height: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Conversion Funnel</Typography>
                         <Chip label="Funnel" variant="outlined" size="small" />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            User journey analysis and conversion optimization
          </Typography>
          {insights.filter(i => i.type === 'funnel').length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              No funnel analysis available
            </Box>
          ) : (
            insights
              .filter(i => i.type === 'funnel')
              .map((insight, index) => (
                <Box key={index} sx={{ p: 2, border: 1, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {getInsightIcon(insight.type)}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{insight.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                        {insight.description}
                      </Typography>
                      {insight.data?.funnel && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                            <Box>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Signup:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {insight.data.funnel.signup}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>First Post:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {insight.data.funnel.firstPost}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Platform Connect:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {insight.data.funnel.platformConnection}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Content Created:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {insight.data.funnel.contentCreation}
                              </Typography>
                            </Box>
                          </Box>
                          {insight.data.conversionRates && (
                            <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>Conversion Rates:</Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                 {Object.entries(insight.data.conversionRates).map(([key, value]) => (
                                   <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                     <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                                       {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                     </Typography>
                                     <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                       {(value as number).toFixed(1)}%
                                     </Typography>
                                   </Box>
                                 ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))
          )}
        </Box>
      </Box>
    </Box>
  );
} 