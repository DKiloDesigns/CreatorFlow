'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Typography,
  Box
} from '@mui/material';
import { BarChart3, TrendingUp, Activity, Settings, RefreshCw, AlertTriangle, Eye, Users, Target, Lightbulb, Zap, Download, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'risk': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'trend': return <BarChart3 className="h-5 w-5 text-blue-600" />;
      case 'anomaly': return <Eye className="h-5 w-5 text-orange-600" />;
      case 'segment': return <Users className="h-5 w-5 text-purple-600" />;
      case 'funnel': return <Target className="h-5 w-5 text-indigo-600" />;
      default: return <Lightbulb className="h-5 w-5 text-yellow-600" />;
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
          <Select value={insightType} onValueChange={setInsightType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Insights</SelectItem>
              <SelectItem value="predictive">Predictive</SelectItem>
              <SelectItem value="segments">Segments</SelectItem>
              <SelectItem value="funnel">Funnel</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={refreshing} variant="outlined">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportInsights} variant="outlined">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </Box>
      </Box>

      {/* Real-time Metrics */}
      {realTimeMetrics && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <Typography variant="subtitle2" className="text-sm font-medium">Active Users</Typography>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <Typography variant="subtitle2" className="text-sm font-medium">New Users</Typography>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.newUsers}</div>
              <p className="text-xs text-muted-foreground">
                Last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Typography variant="h6" className="text-sm font-medium">Total Events</Typography>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeMetrics.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Typography variant="h6" className="text-sm font-medium">Platform Usage</Typography>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(realTimeMetrics.platformUsage).map(([platform, count]) => (
                  <div key={platform} className="flex justify-between text-sm">
                    <span className="capitalize">{platform}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Box>
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
                                 <Badge className={getImpactColor('insights')} variant="outline">
                   Insights
                 </Badge>
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
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact.toUpperCase()}
                            </Badge>
                          )}
                          {insight.confidence && (
                            <Badge variant="outline">
                              {Math.round(insight.confidence * 100)}% confidence
                            </Badge>
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
            <TrendingUp className="h-5 w-5" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Predictive Analytics</Typography>
                         <Badge className={getImpactColor('predictive')} variant="outline">
               Predictive
             </Badge>
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
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact.toUpperCase()}
                          </Badge>
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
            <Users className="h-5 w-5" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>User Segments</Typography>
                         <Badge className={getImpactColor('segment')} variant="outline">
               Segments
             </Badge>
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
                        <Badge variant="outline">
                          {insight.data?.userCount || 0} users
                        </Badge>
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
            <Target className="h-5 w-5" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Conversion Funnel</Typography>
                         <Badge className={getImpactColor('funnel')} variant="outline">
               Funnel
             </Badge>
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