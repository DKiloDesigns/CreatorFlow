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
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Refresh,
  Info,
  AttachMoney,
  Flag,
  Analytics,
  AutoAwesome,
  TrendingFlat,
  Warning,
  CheckCircle,
  Schedule,
  PlayArrow,
  Pause,
  ExpandMore,
  NavigateNext,
  NavigateBefore
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
  
  // Accordion expansion states
  const [expandedSections, setExpandedSections] = useState({
    forecasting: false,
    opportunities: false,
    rules: false,
    recommendations: false
  });
  
  // Cycling states for collapsed view
  const [currentForecastIndex, setCurrentForecastIndex] = useState(0);
  const [currentOpportunityIndex, setCurrentOpportunityIndex] = useState(0);
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
  
  // Cycling control states
  const [isCycling, setIsCycling] = useState(true);
  const [cyclingSpeed, setCyclingSpeed] = useState(4000); // 4 seconds

  useEffect(() => {
    fetchBusinessData();
  }, [timeRange]);

  // Cycling effect for collapsed view recommendations
  useEffect(() => {
    if (!isCycling || !businessData) return;

    const forecastInterval = setInterval(() => {
      if (!expandedSections.forecasting) {
        setCurrentForecastIndex(prev => 
          prev < businessData.forecasting.recommendations.length - 1 ? prev + 1 : 0
        );
      }
    }, cyclingSpeed);

    const opportunityInterval = setInterval(() => {
      if (!expandedSections.opportunities) {
        setCurrentOpportunityIndex(prev => 
          prev < businessData.optimization.topOpportunities.length - 1 ? prev + 1 : 0
        );
      }
    }, cyclingSpeed);

    const ruleInterval = setInterval(() => {
      if (!expandedSections.rules) {
        setCurrentRuleIndex(prev => 
          prev < businessData.optimization.automatedRules.length - 1 ? prev + 1 : 0
        );
      }
    }, cyclingSpeed);

    const recommendationInterval = setInterval(() => {
      if (!expandedSections.recommendations) {
        setCurrentRecommendationIndex(prev => 
          prev < businessData.forecasting.recommendations.length - 1 ? prev + 1 : 0
        );
      }
    }, cyclingSpeed);

    return () => {
      clearInterval(forecastInterval);
      clearInterval(opportunityInterval);
      clearInterval(ruleInterval);
      clearInterval(recommendationInterval);
    };
  }, [isCycling, cyclingSpeed, expandedSections, businessData]);

  // Handle accordion expansion changes
  const handleAccordionChange = (section: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: isExpanded
    }));
  };

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
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Manual navigation functions for cycling
  const navigateForecast = (direction: 'next' | 'prev') => {
    if (!businessData) return;
    const maxIndex = businessData.forecasting.recommendations.length - 1;
    setCurrentForecastIndex(prev => {
      if (direction === 'next') {
        return prev < maxIndex ? prev + 1 : 0;
      } else {
        return prev > 0 ? prev - 1 : maxIndex;
      }
    });
  };

  const navigateOpportunity = (direction: 'next' | 'prev') => {
    if (!businessData) return;
    const maxIndex = businessData.optimization.topOpportunities.length - 1;
    setCurrentOpportunityIndex(prev => {
      if (direction === 'next') {
        return prev < maxIndex ? prev + 1 : 0;
      } else {
        return prev > 0 ? prev - 1 : maxIndex;
      }
    });
  };

  const navigateRule = (direction: 'next' | 'prev') => {
    if (!businessData) return;
    const maxIndex = businessData.optimization.automatedRules.length - 1;
    setCurrentRuleIndex(prev => {
      if (direction === 'next') {
        return prev < maxIndex ? prev + 1 : 0;
      } else {
        return prev > 0 ? prev - 1 : maxIndex;
      }
    });
  };

  const navigateRecommendation = (direction: 'next' | 'prev') => {
    if (!businessData) return;
    const maxIndex = businessData.forecasting.recommendations.length - 1;
    setCurrentRecommendationIndex(prev => {
      if (direction === 'next') {
        return prev < maxIndex ? prev + 1 : 0;
      } else {
        return prev > 0 ? prev - 1 : maxIndex;
      }
    });
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
    <Box sx={{ p: 2, pb: { xs: 12, sm: 10 } }}>
      {/* Header with Controls */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: 2, 
        mb: 3 
      }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Business Intelligence
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(businessData.lastUpdated).toLocaleString()}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          alignItems: { xs: 'stretch', sm: 'center' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
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
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            justifyContent: { xs: 'space-between', sm: 'flex-end' }
          }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoOptimization}
                onChange={(e) => setAutoOptimization(e.target.checked)}
                color="primary"
              />
            }
            label="Auto-Optimization"
              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          />
          
          <Tooltip title="Refresh data">
              <IconButton 
                onClick={fetchBusinessData}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
              >
              <Refresh />
            </IconButton>
          </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Cycling Controls */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3, 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="body2" color="text.secondary">
          Cycling Speed:
        </Typography>
        <Select
          size="small"
          value={cyclingSpeed}
          onChange={(e) => setCyclingSpeed(Number(e.target.value))}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value={2000}>2 seconds</MenuItem>
          <MenuItem value={4000}>4 seconds</MenuItem>
          <MenuItem value={6000}>6 seconds</MenuItem>
        </Select>
        
        <FormControlLabel
          control={
            <Switch
              checked={isCycling}
              onChange={(e) => setIsCycling(e.target.checked)}
              color="primary"
              size="small"
            />
          }
          label="Auto-cycle"
        />
        
        <Typography variant="caption" color="text.secondary">
          {isCycling ? 'Cycling active' : 'Cycling paused'}
        </Typography>
      </Box>

      {/* ROI Overview */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
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

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Overall ROI
                  </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
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
      </Box>

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

      {/* AI Revenue Forecasting */}
      <Accordion 
        expanded={expandedSections.forecasting}
        onChange={handleAccordionChange('forecasting')}
        sx={{ mb: 3 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="forecasting-content"
          id="forecasting-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <ShowChart color="primary" />
            <Typography variant="h6">
              AI Revenue Forecasting
            </Typography>
            {!expandedSections.forecasting && (
              <Fade in={!expandedSections.forecasting}>
                <Box sx={{ 
                  ml: 'auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  maxWidth: { xs: '100%', sm: 'auto' }
                }}>
                  <Box 
                    component="span"
                    onClick={(e) => { e.stopPropagation(); navigateForecast('prev'); }}
                    sx={{ 
                      p: 0.5, 
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <NavigateBefore fontSize="small" />
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      maxWidth: { xs: '120px', sm: '200px', md: '300px' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexShrink: 1
                    }}
                  >
                    Next Month: {formatCurrency(businessData.forecasting.nextMonthPrediction)}
                  </Typography>
                  <Box 
                    component="span"
                    onClick={(e) => { e.stopPropagation(); navigateForecast('next'); }}
                    sx={{ 
                      p: 0.5, 
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <NavigateNext fontSize="small" />
                  </Box>
                  <Chip 
                    label={`${businessData.forecasting.confidence}% confidence`}
                    color="success"
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />
                </Box>
              </Fade>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                  Next Month Prediction
              </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {formatCurrency(businessData.forecasting.nextMonthPrediction)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Confidence: {businessData.forecasting.confidence}%
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key Factors
              </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {businessData.forecasting.factors.map((factor, index) => (
                    <Chip 
                      key={index}
                      label={factor}
                      variant="outlined"
                      size="small"
                      icon={<Info />}
                    />
                  ))}
                </Box>
            </CardContent>
          </Card>
          </Box>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Recommendations
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                {businessData.forecasting.recommendations.map((rec, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 2, 
                      bgcolor: 'background.default', 
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body2">
                      {rec}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* Top Optimization Opportunities */}
      <Accordion 
        expanded={expandedSections.opportunities}
        onChange={handleAccordionChange('opportunities')}
        sx={{ mb: 3 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="opportunities-content"
          id="opportunities-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Flag color="primary" />
            <Typography variant="h6">
                Top Optimization Opportunities
              </Typography>
            {!expandedSections.opportunities && (
              <Fade in={!expandedSections.opportunities}>
                <Box sx={{ 
                  ml: 'auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  maxWidth: { xs: '100%', sm: 'auto' }
                }}>
                  <Box 
                    component="span"
                    onClick={(e) => { e.stopPropagation(); navigateOpportunity('prev'); }}
                    sx={{ 
                      p: 0.5, 
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <NavigateBefore fontSize="small" />
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      maxWidth: { xs: '120px', sm: '200px', md: '300px' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexShrink: 1
                    }}
                  >
                    Opportunity: {businessData.optimization.topOpportunities[currentOpportunityIndex].description}
                  </Typography>
                  <Box 
                    component="span"
                    onClick={(e) => { e.stopPropagation(); navigateOpportunity('next'); }}
                    sx={{ 
                      p: 0.5, 
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <NavigateNext fontSize="small" />
                  </Box>
                  <Chip 
                    label={`+${businessData.optimization.topOpportunities[currentOpportunityIndex].potentialGain}%`}
                    color="success"
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />
                </Box>
              </Fade>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>

      {/* Automated Rules */}
      <Accordion 
        expanded={expandedSections.rules}
        onChange={handleAccordionChange('rules')}
        sx={{ mb: 3 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="rules-content"
          id="rules-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Schedule color="primary" />
            <Typography variant="h6">
            Automated Optimization Rules
          </Typography>
            {!expandedSections.rules && (
              <Fade in={!expandedSections.rules}>
                <Box sx={{ 
                  ml: 'auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  maxWidth: { xs: '100%', sm: 'auto' }
                }}>
                  <Box 
                    component="span"
                    onClick={(e) => { e.stopPropagation(); navigateRule('prev'); }}
                    sx={{ 
                      p: 0.5, 
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <NavigateBefore fontSize="small" />
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      maxWidth: { xs: '120px', sm: '200px', md: '300px' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexShrink: 1
                    }}
                  >
                    Rule: {businessData.optimization.automatedRules[currentRuleIndex].name}
                  </Typography>
                  <Box 
                    component="span"
                    onClick={(e) => { e.stopPropagation(); navigateRule('next'); }}
                    sx={{ 
                      p: 0.5, 
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <NavigateNext fontSize="small" />
                  </Box>
                  <Chip
                    label={businessData.optimization.automatedRules[currentRuleIndex].active ? 'Active' : 'Paused'}
                    color={businessData.optimization.automatedRules[currentRuleIndex].active ? 'success' : 'default'}
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />
                </Box>
              </Fade>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2 
          }}>
            {businessData.optimization.automatedRules.map((rule) => (
              <Card key={rule.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                      <Typography variant="h6" gutterBottom>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Last triggered: {rule.lastTriggered}
                        </Typography>
                      <Typography variant="caption" color="text.secondary">
                          Success rate: {rule.successRate}%
                        </Typography>
                      </Box>
                      <Chip
                        label={rule.active ? 'Active' : 'Paused'}
                        color={rule.active ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* AI Recommendations */}
      <Accordion 
        expanded={expandedSections.recommendations}
        onChange={handleAccordionChange('recommendations')}
        sx={{ mt: 3, mb: { xs: 10, sm: 8 } }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="recommendations-content"
          id="recommendations-header"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <AutoAwesome color="primary" />
            <Typography variant="h6">
            AI-Powered Recommendations
          </Typography>
            {!expandedSections.recommendations && (
              <Fade in={!expandedSections.recommendations}>
                <Box sx={{ 
                  ml: 'auto', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  maxWidth: { xs: '100%', sm: 'auto' }
                }}>
                  <Box 
                    component="span"
                    onClick={(e) => { e.stopPropagation(); navigateRecommendation('prev'); }}
                    sx={{ 
                      p: 0.5, 
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <NavigateBefore fontSize="small" />
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      maxWidth: { xs: '120px', sm: '200px', md: '300px' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flexShrink: 1
                    }}
                  >
                    Recommendation: {businessData.forecasting.recommendations[currentRecommendationIndex]}
                  </Typography>
                  <Box 
                    component="span"
                    onClick={(e) => { e.stopPropagation(); navigateRecommendation('next'); }}
                    sx={{ 
                      p: 0.5, 
                      flexShrink: 0,
                      cursor: 'pointer',
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <NavigateNext fontSize="small" />
                  </Box>
                  <Chip
                    label="Recommendation"
                    color="info"
                    size="small"
                    sx={{ flexShrink: 0 }}
                  />
                </Box>
              </Fade>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2 
          }}>
            {businessData.forecasting.recommendations.map((recommendation, index) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <AutoAwesome color="primary" sx={{ mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" gutterBottom>
                    {recommendation}
                  </Typography>
                      <Typography variant="caption" color="text.secondary">
                        AI-generated recommendation #{index + 1}
                      </Typography>
                    </Box>
                  </Box>
        </CardContent>
      </Card>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
