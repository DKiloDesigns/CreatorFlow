/**
 * Advanced Analytics Dashboard Enhanced
 * More sophisticated analytics and reporting
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Compare as CompareIcon,
  Insights as InsightsIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface AnalyticsData {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  trend: number[];
  category: string;
  platform: string;
  timestamp: Date;
}

interface AdvancedMetrics {
  engagementRate: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  costPerClick: number;
  costPerConversion: number;
  lifetimeValue: number;
  churnRate: number;
  retentionRate: number;
  viralityCoefficient: number;
}

interface BenchmarkData {
  industry: string;
  average: number;
  topQuartile: number;
  bottomQuartile: number;
  yourValue: number;
}

interface AdvancedAnalyticsEnhancedProps {
  data?: AnalyticsData[];
  metrics?: AdvancedMetrics;
  benchmarks?: BenchmarkData[];
  onDataRefresh?: () => void;
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
  className?: string;
}

export function AdvancedAnalyticsEnhanced({
  data = [],
  metrics,
  benchmarks = [],
  onDataRefresh,
  onExport,
  className,
}: AdvancedAnalyticsEnhancedProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');
  const [platform, setPlatform] = useState('all');
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'comparison'>('chart');
  const [isLoading, setIsLoading] = useState(false);
  const [savedReports, setSavedReports] = useState<string[]>([]);
  const theme = useTheme();

  // Mock data for demonstration
  const mockMetrics: AdvancedMetrics = {
    engagementRate: 4.2,
    reach: 125000,
    impressions: 450000,
    clicks: 18500,
    conversions: 1250,
    roi: 340,
    costPerClick: 0.85,
    costPerConversion: 12.50,
    lifetimeValue: 245.80,
    churnRate: 2.1,
    retentionRate: 78.5,
    viralityCoefficient: 1.8,
  };

  const mockBenchmarks: BenchmarkData[] = [
    {
      industry: 'Social Media Marketing',
      average: 3.2,
      topQuartile: 5.8,
      bottomQuartile: 1.4,
      yourValue: 4.2,
    },
    {
      industry: 'Content Marketing',
      average: 2.8,
      topQuartile: 4.9,
      bottomQuartile: 1.1,
      yourValue: 4.2,
    },
  ];

  const chartData = [
    { name: 'Jan', engagement: 3.2, reach: 45000, impressions: 180000, clicks: 7200 },
    { name: 'Feb', engagement: 3.8, reach: 52000, impressions: 210000, clicks: 8400 },
    { name: 'Mar', engagement: 4.1, reach: 61000, impressions: 245000, clicks: 9800 },
    { name: 'Apr', engagement: 4.2, reach: 68000, impressions: 275000, clicks: 11000 },
    { name: 'May', engagement: 4.5, reach: 75000, impressions: 300000, clicks: 12000 },
    { name: 'Jun', engagement: 4.2, reach: 82000, impressions: 330000, clicks: 13200 },
    { name: 'Jul', engagement: 4.8, reach: 89000, impressions: 360000, clicks: 14400 },
    { name: 'Aug', engagement: 4.2, reach: 95000, impressions: 380000, clicks: 15200 },
    { name: 'Sep', engagement: 4.6, reach: 102000, impressions: 410000, clicks: 16400 },
    { name: 'Oct', engagement: 4.2, reach: 110000, impressions: 440000, clicks: 17600 },
    { name: 'Nov', engagement: 4.9, reach: 118000, impressions: 470000, clicks: 18800 },
    { name: 'Dec', engagement: 4.2, reach: 125000, impressions: 500000, clicks: 20000 },
  ];

  const platformData = [
    { name: 'Instagram', value: 35, color: '#E4405F' },
    { name: 'Facebook', value: 28, color: '#1877F2' },
    { name: 'Twitter', value: 20, color: '#1DA1F2' },
    { name: 'LinkedIn', value: 12, color: '#0077B5' },
    { name: 'TikTok', value: 5, color: '#000000' },
  ];

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    onDataRefresh?.();
    setIsLoading(false);
  }, [onDataRefresh]);

  const handleExport = useCallback((format: 'pdf' | 'excel' | 'csv') => {
    onExport?.(format);
  }, [onExport]);

  const handleSaveReport = useCallback(() => {
    const reportName = `Analytics Report ${new Date().toLocaleDateString()}`;
    setSavedReports(prev => [...prev, reportName]);
  }, []);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUpIcon color="success" />;
    if (change < 0) return <TrendingDownIcon color="error" />;
    return <TrendingUpIcon color="action" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'success';
    if (change < 0) return 'error';
    return 'default';
  };

  const MetricCard = ({ title, value, change, icon, format = 'number' }: {
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
    format?: 'number' | 'percentage' | 'currency';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'percentage': return `${val.toFixed(1)}%`;
        case 'currency': return `$${val.toLocaleString()}`;
        default: return val.toLocaleString();
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" color="text.secondary">
                {title}
              </Typography>
              <IconButton size="small">
                {icon}
              </IconButton>
            </Box>
            
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {formatValue(value)}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getChangeIcon(change)}
              <Chip
                label={`${change > 0 ? '+' : ''}${change.toFixed(1)}%`}
                color={getChangeColor(change) as any}
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const BenchmarkCard = ({ benchmark }: { benchmark: BenchmarkData }) => {
    const performance = benchmark.yourValue / benchmark.average;
    const isAboveAverage = performance > 1;
    const percentile = benchmark.yourValue >= benchmark.topQuartile ? 'Top 25%' : 
                     benchmark.yourValue >= benchmark.average ? 'Above Average' : 'Below Average';

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {benchmark.industry}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" fontWeight="bold" color={isAboveAverage ? 'success.main' : 'error.main'}>
              {benchmark.yourValue.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs {benchmark.average.toFixed(1)}% industry average
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={(benchmark.yourValue / benchmark.topQuartile) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: isAboveAverage ? theme.palette.success.main : theme.palette.error.main,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={percentile}
              color={isAboveAverage ? 'success' : 'error'}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {performance > 1 ? '+' : ''}{((performance - 1) * 100).toFixed(0)}% vs avg
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className={className}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Advanced Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights and performance metrics
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Platform</InputLabel>
            <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <MenuItem value="all">All Platforms</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
          
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
            variant="outlined"
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" icon={<AssessmentIcon />} />
          <Tab label="Performance" icon={<TimelineIcon />} />
          <Tab label="Benchmarks" icon={<CompareIcon />} />
          <Tab label="Insights" icon={<InsightsIcon />} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Engagement Rate"
                  value={mockMetrics.engagementRate}
                  change={12.5}
                  icon={<TrendingUpIcon />}
                  format="percentage"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Total Reach"
                  value={mockMetrics.reach}
                  change={8.2}
                  icon={<VisibilityIcon />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="ROI"
                  value={mockMetrics.roi}
                  change={15.3}
                  icon={<SpeedIcon />}
                  format="percentage"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Cost per Click"
                  value={mockMetrics.costPerClick}
                  change={-5.7}
                  icon={<TrendingDownIcon />}
                  format="currency"
                />
              </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Performance Over Time
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="engagement" stroke="#1976d2" strokeWidth={2} />
                        <Line type="monotone" dataKey="reach" stroke="#9c27b0" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Platform Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Detailed Performance Metrics
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="impressions" stackId="1" stroke="#1976d2" fill="#1976d2" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="clicks" stackId="2" stroke="#9c27b0" fill="#9c27b0" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            key="benchmarks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {mockBenchmarks.map((benchmark, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <BenchmarkCard benchmark={benchmark} />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {activeTab === 3 && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    AI-Powered Insights
                  </Typography>
                  <Typography>
                    Based on your performance data, here are some key insights and recommendations:
                  </Typography>
                </Alert>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Top Performing Content
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your video content performs 23% better than image posts. Consider increasing video content ratio.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Optimal Posting Times
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posts published between 2-4 PM on weekdays generate 15% more engagement.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default AdvancedAnalyticsEnhanced;
