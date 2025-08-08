'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Chip,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { BarChart3, TrendingUp, Activity, Settings } from 'lucide-react';

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

  if (loading) return <div className="p-8">Loading analytics data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">AI-powered insights and predictive analytics</p>
        </div>
        <div className="flex gap-2">
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
          <Button onClick={refreshData} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportInsights} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      {realTimeMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      )}

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Insights
              </Typography>
              <CardDescription>
                Intelligent recommendations and trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No insights available
                  </div>
                ) : (
                  insights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{insight.title}</h3>
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
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {insight.description}
                          </p>
                          {insight.recommendations && insight.recommendations.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Recommendations:</h4>
                              <ul className="text-sm space-y-1">
                                {insight.recommendations.map((rec, recIndex) => (
                                  <li key={recIndex} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictive Analytics
              </Typography>
              <CardDescription>
                AI-powered predictions and trend forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.filter(i => i.type === 'trend' || i.type === 'opportunity' || i.type === 'risk').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No predictive insights available
                  </div>
                ) : (
                  insights
                    .filter(i => i.type === 'trend' || i.type === 'opportunity' || i.type === 'risk')
                    .map((insight, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{insight.title}</h3>
                              {insight.impact && (
                                <Badge className={getImpactColor(insight.impact)}>
                                  {insight.impact.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Segments
              </Typography>
              <CardDescription>
                AI-identified user groups and behavior patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.filter(i => i.type === 'segment').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No user segments available
                  </div>
                ) : (
                  insights
                    .filter(i => i.type === 'segment')
                    .map((insight, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{insight.title}</h3>
                              <Badge variant="outline">
                                {insight.data?.userCount || 0} users
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {insight.description}
                            </p>
                            {insight.data && (
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Engagement:</span>
                                  <div className="font-medium">
                                    {Math.round((insight.data.engagementScore || 0) * 100)}%
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">LTV:</span>
                                  <div className="font-medium">
                                    ${(insight.data.lifetimeValue || 0).toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Churn Risk:</span>
                                  <div className="font-medium">
                                    {Math.round((insight.data.churnRisk || 0) * 100)}%
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <Typography variant="h6" className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Conversion Funnel
              </Typography>
              <CardDescription>
                User journey analysis and conversion optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.filter(i => i.type === 'funnel').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No funnel analysis available
                  </div>
                ) : (
                  insights
                    .filter(i => i.type === 'funnel')
                    .map((insight, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {insight.description}
                            </p>
                            {insight.data?.funnel && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Signup:</span>
                                    <div className="font-medium">{insight.data.funnel.signup}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">First Post:</span>
                                    <div className="font-medium">{insight.data.funnel.firstPost}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Platform Connect:</span>
                                    <div className="font-medium">{insight.data.funnel.platformConnection}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Content Created:</span>
                                    <div className="font-medium">{insight.data.funnel.contentCreation}</div>
                                  </div>
                                </div>
                                {insight.data.conversionRates && (
                                  <div className="pt-3 border-t">
                                    <h4 className="text-sm font-medium mb-2">Conversion Rates:</h4>
                                    <div className="space-y-1 text-sm">
                                      {Object.entries(insight.data.conversionRates).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                          <span className="text-muted-foreground capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                          </span>
                                          <span className="font-medium">{value.toFixed(1)}%</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 