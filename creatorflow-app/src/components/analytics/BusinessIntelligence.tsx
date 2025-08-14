"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Refresh,
  Info,
  AttachMoney,
  Target,
  Analytics,
  AutoAwesome,
  TrendingFlat,
  Warning,
  CheckCircle,
  Schedule,
  PlayArrow,
  Pause
} from '@mui/icons-material';

interface BusinessMetrics {
  roi: {
    totalInvestment: number;
    totalRevenue: number;
    overallROI: number;
    monthlyROI: number[];
    platformROI: {
      [key: string]: {
        investment: number;
        revenue: number;
        roi: number;
        cpa: number;
        ltv: number;
      };
    };
  };
  forecasting: {
    nextMonthPrediction: number;
    confidence: number;
    factors: string[];
    recommendations: string[];
  };
  optimization: {
    topOpportunities: Array<{
      id: string;
      type: 'content' | 'timing' | 'platform' | 'audience';
      impact: 'high' | 'medium' | 'low';
      description: string;
      potentialGain: number;
      effort: 'low' | 'medium' | 'high';
    }>;
    automatedRules: Array<{
      id: string;
      name: string;
      description: string;
      active: boolean;
      lastTriggered: string;
      successRate: number;
    }>;
  };
  lastUpdated: string;
}

export default function BusinessIntelligence() {
  const [businessData, setBusinessData] = useState<BusinessMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('90d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoOptimization, setAutoOptimization] = useState(true);

  useEffect(() => {
    fetchBusinessData();
  }, [timeRange]);

  const fetchBusinessData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock business intelligence data - in production this would come from AI analysis
      const mockData: BusinessMetrics = {
        roi: {
          totalInvestment: 2500,
          totalRevenue: 8750,
          overallROI: 250,
          monthlyROI: [180, 220, 195, 250, 280, 320, 250],
          platformROI: {
            'Instagram': {
              investment: 1000,
              revenue: 3800,
              roi: 280,
              cpa: 2.50,
              ltv: 45.00
            },
            'LinkedIn': {
              investment: 800,
              revenue: 2800,
              roi: 250,
              cpa: 3.20,
              ltv: 52.00
            },
            'Twitter': {
              investment: 400,
              revenue: 1200,
              roi: 200,
              cpa: 4.50,
              ltv: 38.00
            },
            'Facebook': {
              investment: 300,
              revenue: 950,
              roi: 217,
              cpa: 3.80,
              ltv: 42.00
            }
          }
        },
        forecasting: {
          nextMonthPrediction: 320,
          confidence: 85,
          factors: [
            'Seasonal content performance trends',
            'Platform algorithm changes',
            'Audience growth rate',
            'Content quality improvements'
          ],
          recommendations: [
            'Increase Instagram investment by 20%',
            'Focus on video content for LinkedIn',
            'Optimize posting times based on engagement data',
            'A/B test new content formats'
          ]
        },
        optimization: {
          topOpportunities: [
            {
              id: '1',
              type: 'content',
              impact: 'high',
              description: 'Video content shows 3.2x higher engagement',
              potentialGain: 45,
              effort: 'medium'
            },
            {
              id: '2',
              type: 'timing',
              impact: 'high',
              description: 'Posts at 2-4 PM generate 2.8x more engagement',
              potentialGain: 38,
              effort: 'low'
            },
            {
              id: '3',
              type: 'platform',
              impact: 'medium',
              description: 'LinkedIn Stories have 40% higher conversion rate',
              potentialGain: 25,
              effort: 'medium'
            },
            {
              id: '4',
              type: 'audience',
              impact: 'medium',
              description: 'Targeting decision-makers increases LTV by 60%',
              potentialGain: 30,
              effort: 'high'
            }
          ],
          automatedRules: [
            {
              id: '1',
              name: 'Content Performance Auto-Optimization',
              description: 'Automatically adjusts content strategy based on performance data',
              active: true,
              lastTriggered: '2 hours ago',
              successRate: 92
            },
            {
              id: '2',
              name: 'Budget Reallocation',
              description: 'Redistributes budget to best-performing platforms',
              active: true,
              lastTriggered: '1 day ago',
              successRate: 88
            },
            {
              id: '3',
              name: 'Audience Targeting Optimization',
              description: 'Refines audience segments based on conversion data',
              active: false,
              lastTriggered: '3 days ago',
              successRate: 85
            }
          ]
        },
        lastUpdated: new Date().toISOString()
      };

      setBusinessData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const toggleAutomationRule = (ruleId: string) => {
    if (businessData) {
      setBusinessData({
        ...businessData,
        optimization: {
          ...businessData.optimization,
          automatedRules: businessData.optimization.automatedRules.map(rule =>
            rule.id === ruleId ? { ...rule, active: !rule.active } : rule
          )
        }
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading business intelligence...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <IconButton size="small" onClick={fetchBusinessData} sx={{ ml: 1 }}>
          <Refresh />
        </IconButton>
      </Alert>
    );
  }

  if (!businessData) {
    return (
      <Alert severity="warning">
        No business intelligence data available. Please check your analytics and try again.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Business Intelligence
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(businessData.lastUpdated).toLocaleString()}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="6m">Last 6 months</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={autoOptimization}
                onChange={(e) => setAutoOptimization(e.target.checked)}
                color="primary"
              />
            }
            label="Auto-Optimization"
          />
          
          <Tooltip title="Refresh data">
            <IconButton onClick={fetchBusinessData}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ROI Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Investment
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(businessData.roi.totalInvestment)}
                  </Typography>
                </Box>
                <AttachMoney color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(businessData.roi.totalRevenue)}
                  </Typography>
                </Box>
                <TrendingUp color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Overall ROI
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4">
                      {formatPercentage(businessData.roi.overallROI)}
                    </Typography>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${businessData.roi.overallROI}%`}
                      color="success"
                      size="small"
                    />
                  </Box>
                </Box>
                <ShowChart color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Platform ROI Breakdown */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Platform ROI Performance
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Platform</TableCell>
                  <TableCell align="right">Investment</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">ROI</TableCell>
                  <TableCell align="right">CPA</TableCell>
                  <TableCell align="right">LTV</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(businessData.roi.platformROI).map(([platform, data]) => (
                  <TableRow key={platform}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">{platform}</Typography>
                        <Chip
                          label={`${data.roi}%`}
                          size="small"
                          color={data.roi >= 250 ? 'success' : data.roi >= 200 ? 'warning' : 'error'}
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(data.investment)}</TableCell>
                    <TableCell align="right">{formatCurrency(data.revenue)}</TableCell>
                    <TableCell align="right">
                      <Typography color={data.roi >= 250 ? 'success.main' : 'inherit'}>
                        {formatPercentage(data.roi)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(data.cpa)}</TableCell>
                    <TableCell align="right">{formatCurrency(data.ltv)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Forecasting and Optimization */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Revenue Forecasting
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {formatPercentage(businessData.forecasting.nextMonthPrediction)} ROI
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Predicted for next month (85% confidence)
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Key Factors:
              </Typography>
              <Stack spacing={1}>
                {businessData.forecasting.factors.map((factor, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info fontSize="small" color="action" />
                    <Typography variant="body2">{factor}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Optimization Opportunities
              </Typography>
              <Stack spacing={2}>
                {businessData.optimization.topOpportunities.map((opportunity) => (
                  <Box key={opportunity.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={opportunity.impact.toUpperCase()} 
                          size="small" 
                          color={getImpactColor(opportunity.impact) as any}
                        />
                        <Typography variant="subtitle2">
                          {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`+${opportunity.potentialGain}%`} 
                        size="small" 
                        color="success"
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {opportunity.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={`Effort: ${opportunity.effort}`} 
                        size="small" 
                        color={getEffortColor(opportunity.effort) as any}
                        variant="outlined"
                      />
                      <Button size="small" variant="outlined">
                        Implement
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Automated Rules */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Automated Optimization Rules
          </Typography>
          <Grid container spacing={2}>
            {businessData.optimization.automatedRules.map((rule) => (
              <Grid item xs={12} md={6} key={rule.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          {rule.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {rule.description}
                        </Typography>
                      </Box>
                      <Switch
                        checked={rule.active}
                        onChange={() => toggleAutomationRule(rule.id)}
                        color="primary"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Last triggered: {rule.lastTriggered}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Success rate: {rule.successRate}%
                        </Typography>
                      </Box>
                      <Chip
                        icon={rule.active ? <PlayArrow /> : <Pause />}
                        label={rule.active ? 'Active' : 'Paused'}
                        color={rule.active ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI-Powered Recommendations
          </Typography>
          <Grid container spacing={2}>
            {businessData.forecasting.recommendations.map((recommendation, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Alert severity="info" icon={<AutoAwesome />}>
                  <Typography variant="body2">
                    {recommendation}
                  </Typography>
                </Alert>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
