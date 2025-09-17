/**
 * Advanced Analytics Dashboard
 * Comprehensive analytics and performance tracking interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box,
  Grid,
  Card, 
  CardContent, 
  Typography,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { 
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Insights as InsightsIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Compare as CompareIcon,
  Timeline as ForecastIcon,
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  TouchApp as TouchAppIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  trend: 'up' | 'down' | 'stable';
  period: string;
  timestamp: string;
}

interface AnalyticsInsight {
    id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'warning' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  action?: string;
  createdAt: string;
}

interface BenchmarkData {
  yourMetrics: Record<string, number>;
  industryMetrics: Record<string, number>;
  percentile: Record<string, number>;
  recommendations: string[];
}

interface PredictiveForecast {
  metric: string;
  currentValue: number;
  forecast: {
    nextWeek: number;
    nextMonth: number;
    nextQuarter: number;
  };
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export default function AdvancedAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [benchmark, setBenchmark] = useState<BenchmarkData | null>(null);
  const [forecast, setForecast] = useState<PredictiveForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [customDashboardOpen, setCustomDashboardOpen] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([
    'engagement_trend',
    'platform_comparison',
    'content_performance'
  ]);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPlatform, dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: 'metrics',
        platform: selectedPlatform !== 'all' ? selectedPlatform : '',
        start: dateRange.start,
        end: dateRange.end
      });

      const response = await fetch(`/api/analytics/advanced?${params}`);
      const result = await response.json();

      if (result.success) {
        setMetrics(result.data.metrics);
        setInsights(result.data.insights);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBenchmarkData = async () => {
    if (selectedPlatform === 'all') return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: 'benchmark',
        platform: selectedPlatform,
        industry: selectedIndustry
      });

      const response = await fetch(`/api/analytics/advanced?${params}`);
      const result = await response.json();

      if (result.success) {
        setBenchmark(result.data);
      }
    } catch (error) {
      console.error('Failed to load benchmark data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadForecastData = async (metric: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: 'forecast',
        metric,
        days: '30'
      });

      const response = await fetch(`/api/analytics/advanced?${params}`);
      const result = await response.json();

      if (result.success) {
        setForecast(result.data);
      }
    } catch (error) {
      console.error('Failed to load forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon color="success" />;
      case 'down': return <TrendingDownIcon color="error" />;
      default: return <TrendingFlatIcon color="action" />;
    }
  };

  // Get change color
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'success';
      case 'decrease': return 'error';
      default: return 'default';
    }
  };

  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TimelineIcon />;
      case 'anomaly': return <WarningIcon />;
      case 'recommendation': return <LightbulbIcon />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'opportunity': return <CheckCircleIcon color="success" />;
      default: return <InfoIcon />;
    }
  };

  // Get insight color
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'info';
      case 'anomaly': return 'warning';
      case 'recommendation': return 'success';
      case 'warning': return 'warning';
      case 'opportunity': return 'success';
      default: return 'info';
    }
  };

  // Format number
  const formatNumber = (num: number, decimals: number = 1) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(decimals)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(decimals)}K`;
    return num.toFixed(decimals);
  };

  // Format percentage
  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Advanced Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive performance tracking and insights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadAnalyticsData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {/* Export functionality */}}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => setCustomDashboardOpen(true)}
          >
            Customize
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
            <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  label="Platform"
                >
                  <MenuItem value="all">All Platforms</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="facebook">Facebook</MenuItem>
                  <MenuItem value="youtube">YouTube</MenuItem>
                  <MenuItem value="tiktok">TikTok</MenuItem>
                  <MenuItem value="twitter">Twitter</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                onClick={loadAnalyticsData}
                disabled={loading}
                fullWidth
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
            </CardContent>
          </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" icon={<DashboardIcon />} />
          <Tab label="Insights" icon={<InsightsIcon />} />
          <Tab label="Benchmarks" icon={<CompareIcon />} />
          <Tab label="Forecasts" icon={<ForecastIcon />} />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {metrics.map((metric) => (
              <Grid item xs={12} sm={6} md={3} key={metric.id}>
          <Card>
            <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {metric.name}
              </Typography>
                      {getTrendIcon(metric.trend)}
                    </Box>
                    <Typography variant="h4" gutterBottom>
                      {formatNumber(metric.value)}
              </Typography>
                    <Chip
                      label={formatPercentage(metric.change)}
                      color={getChangeColor(metric.changeType)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      vs {metric.period}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
            ))}
      </Grid>

          {/* Charts Placeholder */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Trends
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Chart visualization would go here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Performing Content
                  </Typography>
                  <List>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <ListItem key={item}>
                        <ListItemIcon>
                          <VisibilityIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Content ${item}`}
                          secondary={`${Math.floor(Math.random() * 1000)}K views`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </Box>
        )}

      {/* Insights Tab */}
        {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            AI-Powered Insights
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Discover patterns and opportunities in your content performance.
          </Typography>

          {insights.map((insight) => (
            <Card key={insight.id} sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2 }}>
                    {getInsightIcon(insight.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {insight.title}
                      </Typography>
                      <Chip
                        label={insight.impact}
                        color={insight.impact === 'high' ? 'error' : insight.impact === 'medium' ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {insight.description}
                    </Typography>
                    {insight.actionable && insight.action && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {/* Handle action */}}
                      >
                        {insight.action}
                      </Button>
                    )}
                  </Box>
                </Box>
            </CardContent>
          </Card>
          ))}
          </Box>
        )}

      {/* Benchmarks Tab */}
        {activeTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Industry Benchmarks
            </Typography>
            <FormControl sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Industry</InputLabel>
              <Select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                label="Industry"
              >
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="fashion">Fashion</MenuItem>
                <MenuItem value="food">Food & Beverage</MenuItem>
                <MenuItem value="fitness">Fitness</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="entertainment">Entertainment</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={loadBenchmarkData}
              disabled={selectedPlatform === 'all' || loading}
            >
              Load Benchmarks
            </Button>
          </Box>

          {benchmark && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Your Performance vs Industry
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Metric</TableCell>
                            <TableCell align="right">Yours</TableCell>
                            <TableCell align="right">Industry</TableCell>
                            <TableCell align="right">Percentile</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(benchmark.yourMetrics).map(([metric, value]) => (
                            <TableRow key={metric}>
                              <TableCell>{metric}</TableCell>
                              <TableCell align="right">{formatNumber(value)}</TableCell>
                              <TableCell align="right">{formatNumber(benchmark.industryMetrics[metric])}</TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={`${benchmark.percentile[metric]}th`}
                                  color={benchmark.percentile[metric] > 75 ? 'success' : benchmark.percentile[metric] > 50 ? 'warning' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recommendations
                    </Typography>
                    <List>
                      {benchmark.recommendations.map((recommendation, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <LightbulbIcon />
                          </ListItemIcon>
                          <ListItemText primary={recommendation} />
                        </ListItem>
                      ))}
                    </List>
            </CardContent>
          </Card>
              </Grid>
            </Grid>
          )}
          </Box>
        )}

      {/* Forecasts Tab */}
        {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Predictive Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Forecast future performance based on historical data.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Engagement Forecast
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => loadForecastData('engagement')}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    Generate Forecast
                  </Button>
                  {forecast && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current: {formatNumber(forecast.currentValue)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Next Week: {formatNumber(forecast.forecast.nextWeek)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Next Month: {formatNumber(forecast.forecast.nextMonth)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Next Quarter: {formatNumber(forecast.forecast.nextQuarter)}%
                      </Typography>
                      <Chip
                        label={`${forecast.confidence}% confidence`}
                        color={forecast.confidence > 70 ? 'success' : forecast.confidence > 50 ? 'warning' : 'error'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Influencing Factors
                  </Typography>
                  {forecast && (
                    <List>
                      {forecast.factors.map((factor, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <InfoIcon />
                          </ListItemIcon>
                          <ListItemText primary={factor} />
                        </ListItem>
                      ))}
                    </List>
                  )}
            </CardContent>
          </Card>
            </Grid>
          </Grid>
          </Box>
        )}

      {/* Custom Dashboard Dialog */}
      <Dialog
        open={customDashboardOpen}
        onClose={() => setCustomDashboardOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Customize Dashboard</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select which widgets to display on your dashboard.
          </Typography>
          <FormGroup>
            {[
              { id: 'engagement_trend', label: 'Engagement Trend', icon: <TrendingUpIcon /> },
              { id: 'platform_comparison', label: 'Platform Comparison', icon: <CompareIcon /> },
              { id: 'content_performance', label: 'Content Performance', icon: <AssessmentIcon /> },
              { id: 'demographics', label: 'Demographics', icon: <PeopleIcon /> },
              { id: 'hashtag_analysis', label: 'Hashtag Analysis', icon: <TouchAppIcon /> },
              { id: 'timing_analysis', label: 'Timing Analysis', icon: <TimelineIcon /> }
            ].map((widget) => (
              <FormControlLabel
                key={widget.id}
                control={
                  <Switch
                    checked={selectedWidgets.includes(widget.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedWidgets(prev => [...prev, widget.id]);
                      } else {
                        setSelectedWidgets(prev => prev.filter(id => id !== widget.id));
                      }
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {widget.icon}
                    <Typography sx={{ ml: 1 }}>{widget.label}</Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomDashboardOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              // Apply custom dashboard
              setCustomDashboardOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading */}
      {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} />}
    </Box>
  );
} 