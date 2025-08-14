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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Divider,
  Skeleton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Insights,
  CheckCircle,
  Warning,
  Info,
  Settings,
  BarChart,
  PieChart,
  Timeline,
  Assessment,
  Business,
  AttachMoney,
  People,
  Speed
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'positive' | 'negative' | 'neutral';
  category: 'revenue' | 'cost' | 'efficiency' | 'growth';
  target: number;
  actual: number;
  priority: 'high' | 'medium' | 'low';
}

interface BusinessInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  recommendation: string;
  estimatedValue: number;
}

export default function BusinessIntelligence() {
  const [activeTab, setActiveTab] = useState(0);
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<BusinessMetric | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMetrics([
        {
          id: 'metric-1',
          name: 'Monthly Recurring Revenue',
          value: 125000,
          unit: 'USD',
          trend: 'up',
          change: 15.7,
          status: 'positive',
          category: 'revenue',
          target: 120000,
          actual: 125000,
          priority: 'high'
        },
        {
          id: 'metric-2',
          name: 'Customer Acquisition Cost',
          value: 89,
          unit: 'USD',
          trend: 'down',
          change: -8.2,
          status: 'positive',
          category: 'cost',
          target: 95,
          actual: 89,
          priority: 'medium'
        },
        {
          id: 'metric-3',
          name: 'Customer Lifetime Value',
          value: 1250,
          unit: 'USD',
          trend: 'up',
          change: 12.3,
          status: 'positive',
          category: 'revenue',
          target: 1100,
          actual: 1250,
          priority: 'high'
        },
        {
          id: 'metric-4',
          name: 'Churn Rate',
          value: 3.2,
          unit: '%',
          trend: 'down',
          change: -15.8,
          status: 'positive',
          category: 'efficiency',
          target: 4.0,
          actual: 3.2,
          priority: 'high'
        },
        {
          id: 'metric-5',
          name: 'Content ROI',
          value: 4.8,
          unit: 'x',
          trend: 'up',
          change: 8.5,
          status: 'positive',
          category: 'efficiency',
          target: 4.5,
          actual: 4.8,
          priority: 'medium'
        },
        {
          id: 'metric-6',
          name: 'Team Productivity',
          value: 87,
          unit: '%',
          trend: 'up',
          change: 5.2,
          status: 'positive',
          category: 'efficiency',
          target: 85,
          actual: 87,
          priority: 'medium'
        }
      ]);

      setInsights([
        {
          id: 'insight-1',
          title: 'High-Performing Content Strategy',
          description: 'Video content shows 3.2x higher engagement than static posts',
          impact: 'high',
          category: 'Content Optimization',
          recommendation: 'Increase video content production by 40%',
          estimatedValue: 25000
        },
        {
          id: 'insight-2',
          title: 'Optimal Posting Times',
          description: 'Posts published between 6-8 PM show 25% higher reach',
          impact: 'medium',
          category: 'Timing Optimization',
          recommendation: 'Schedule 60% of posts during peak hours',
          estimatedValue: 15000
        },
        {
          id: 'insight-3',
          title: 'Audience Growth Opportunity',
          description: 'Untapped potential in LinkedIn audience (estimated 40% growth)',
          impact: 'high',
          category: 'Audience Expansion',
          recommendation: 'Launch LinkedIn-focused content campaign',
          estimatedValue: 35000
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: designTokens.colors.success[600] }} />;
      case 'down': return <TrendingDown sx={{ color: designTokens.colors.error[600] }} />;
      case 'stable': return <TrendingFlat sx={{ color: designTokens.colors.info[600] }} />;
      default: return <TrendingFlat />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return designTokens.colors.success[600];
      case 'negative': return designTokens.colors.error[600];
      case 'neutral': return designTokens.colors.info[600];
      default: return designTokens.colors.grey[600];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return designTokens.colors.error[600];
      case 'medium': return designTokens.colors.warning[600];
      case 'low': return designTokens.colors.success[600];
      default: return designTokens.colors.grey[600];
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return designTokens.colors.error[600];
      case 'medium': return designTokens.colors.warning[600];
      case 'low': return designTokens.colors.success[600];
      default: return designTokens.colors.grey[600];
    }
  };

  const handleMetricClick = (metric: BusinessMetric) => {
    setSelectedMetric(metric);
  };

  const handleCloseDialog = () => {
    setSelectedMetric(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Business Intelligence</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid key={item} xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="50%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Business Intelligence Dashboard
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Key Metrics" icon={<BarChart />} />
        <Tab label="Business Insights" icon={<Insights />} />
        <Tab label="Performance Trends" icon={<Timeline />} />
        <Tab label="ROI Analysis" icon={<AttachMoney />} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {metrics.map((metric) => (
            <Grid key={metric.id} xs={12} md={6} lg={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => handleMetricClick(metric)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, flex: 1 }}>
                      {metric.name}
                    </Typography>
                    <Chip 
                      label={metric.priority} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getPriorityColor(metric.priority),
                        color: 'white',
                        fontSize: '0.75rem'
                      }} 
                    />
                  </Box>
                  
                  <Typography variant="h4" sx={{ color: getStatusColor(metric.status), mb: 2 }}>
                    {metric.value.toLocaleString()} {metric.unit}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {getTrendIcon(metric.trend)}
                    <Typography variant="body2" sx={{ color: getStatusColor(metric.status) }}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Target: {metric.target.toLocaleString()} {metric.unit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {((metric.actual / metric.target) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((metric.actual / metric.target) * 100, 100)} 
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {insights.map((insight) => (
            <Grid key={insight.id} xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, flex: 1 }}>
                      {insight.title}
                    </Typography>
                    <Chip 
                      label={insight.impact} 
                      size="small" 
                      sx={{ 
                        backgroundColor: getImpactColor(insight.impact),
                        color: 'white'
                      }} 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {insight.description}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Category:</strong> {insight.category}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Recommendation:</strong> {insight.recommendation}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Value:
                    </Typography>
                    <Typography variant="h6" sx={{ color: designTokens.colors.success[600] }}>
                      ${insight.estimatedValue.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Performance Trends Overview</Typography>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Revenue Growth</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp sx={{ fontSize: 48, color: designTokens.colors.success[600] }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: designTokens.colors.success[600] }}>
                        +15.7%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Month over month growth
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Efficiency Metrics</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Speed sx={{ fontSize: 48, color: designTokens.colors.info[600] }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: designTokens.colors.info[600] }}>
                        87%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Team productivity score
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>ROI Analysis & Forecasting</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Current ROI</TableCell>
                  <TableCell align="right">Target ROI</TableCell>
                  <TableCell align="right">Forecast (3 months)</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Content Marketing</TableCell>
                  <TableCell align="right">4.8x</TableCell>
                  <TableCell align="right">5.0x</TableCell>
                  <TableCell align="right">5.2x</TableCell>
                  <TableCell align="right">
                    <Chip label="On Track" size="small" color="success" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Social Media Ads</TableCell>
                  <TableCell align="right">3.2x</TableCell>
                  <TableCell align="right">3.5x</TableCell>
                  <TableCell align="right">3.8x</TableCell>
                  <TableCell align="right">
                    <Chip label="Improving" size="small" color="warning" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email Marketing</TableCell>
                  <TableCell align="right">6.1x</TableCell>
                  <TableCell align="right">5.5x</TableCell>
                  <TableCell align="right">6.5x</TableCell>
                  <TableCell align="right">
                    <Chip label="Exceeding" size="small" color="success" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Metric Detail Dialog */}
      <Dialog open={!!selectedMetric} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedMetric && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BarChart sx={{ color: designTokens.colors.primary[600] }} />
                {selectedMetric.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Current Performance</Typography>
                  <Typography variant="h3" sx={{ color: getStatusColor(selectedMetric.status), mb: 2 }}>
                    {selectedMetric.value.toLocaleString()} {selectedMetric.unit}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {getTrendIcon(selectedMetric.trend)}
                    <Typography variant="h6" sx={{ color: getStatusColor(selectedMetric.status) }}>
                      {selectedMetric.change > 0 ? '+' : ''}{selectedMetric.change}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Target vs Actual</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Target</Typography>
                    <Typography variant="h6">{selectedMetric.target.toLocaleString()} {selectedMetric.unit}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Actual</Typography>
                    <Typography variant="h6" sx={{ color: getStatusColor(selectedMetric.status) }}>
                      {selectedMetric.actual.toLocaleString()} {selectedMetric.unit}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Performance</Typography>
                    <Typography variant="h6" sx={{ color: getStatusColor(selectedMetric.status) }}>
                      {((selectedMetric.actual / selectedMetric.target) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" onClick={handleCloseDialog}>
                View Detailed Report
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
