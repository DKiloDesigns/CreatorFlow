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
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Skeleton,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  AutoAwesome,
  Psychology,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  Refresh,
  Settings,
  ContentCopy,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
  Rocket,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

interface TrendAnalysis {
  period: string;
  data: Array<{
    date: string;
    value: number;
    predicted?: number;
    confidence?: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  seasonality: 'none' | 'weekly' | 'monthly' | 'quarterly';
  forecast: {
    nextPeriod: number;
    confidence: number;
    factors: string[];
  };
}

export default function TrendAnalysis() {
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrend, setSelectedTrend] = useState<TrendAnalysis | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [showForecasts, setShowForecasts] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock trend analysis data
      setTrendAnalysis([
        {
          period: 'Engagement Rate',
          data: [
            { date: '2024-01-01', value: 5.2 },
            { date: '2024-01-08', value: 5.8 },
            { date: '2024-01-15', value: 6.1 },
            { date: '2024-01-22', value: 6.5 },
            { date: '2024-01-29', value: 7.2 },
            { date: '2024-02-05', value: 7.8 },
            { date: '2024-02-12', value: 8.1 },
            { date: '2024-02-19', value: 8.4 },
            { date: '2024-02-26', value: 8.7, predicted: 8.7, confidence: 0.89 }
          ],
          trend: 'increasing',
          seasonality: 'weekly',
          forecast: {
            nextPeriod: 9.2,
            confidence: 0.85,
            factors: ['Content quality improvement', 'Peak posting times', 'Hashtag optimization']
          }
        },
        {
          period: 'Reach Growth',
          data: [
            { date: '2024-01-01', value: 8.5 },
            { date: '2024-01-08', value: 9.2 },
            { date: '2024-01-15', value: 10.1 },
            { date: '2024-01-22', value: 11.3 },
            { date: '2024-01-29', value: 12.8 },
            { date: '2024-02-05', value: 13.9 },
            { date: '2024-02-12', value: 14.7 },
            { date: '2024-02-19', value: 15.2 },
            { date: '2024-02-26', value: 15.6, predicted: 15.6, confidence: 0.92 }
          ],
          trend: 'increasing',
          seasonality: 'monthly',
          forecast: {
            nextPeriod: 17.1,
            confidence: 0.88,
            factors: ['Viral content potential', 'Cross-platform promotion', 'Audience expansion']
          }
        },
        {
          period: 'Conversion Rate',
          data: [
            { date: '2024-01-01', value: 1.8 },
            { date: '2024-01-08', value: 1.9 },
            { date: '2024-01-15', value: 2.0 },
            { date: '2024-01-22', value: 2.1 },
            { date: '2024-01-29', value: 2.0 },
            { date: '2024-02-05', value: 2.2 },
            { date: '2024-02-12', value: 2.1 },
            { date: '2024-02-19', value: 2.3 },
            { date: '2024-02-26', value: 2.3, predicted: 2.3, confidence: 0.76 }
          ],
          trend: 'stable',
          seasonality: 'none',
          forecast: {
            nextPeriod: 2.5,
            confidence: 0.72,
            factors: ['CTA optimization', 'Landing page improvements', 'Audience targeting']
          }
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return designTokens.colors.success[500];
      case 'decreasing': return designTokens.colors.error[500];
      case 'stable': return designTokens.colors.primary[500];
      case 'volatile': return designTokens.colors.warning[500];
      default: return designTokens.colors.neutral[500];
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUpIcon style={{ color: designTokens.colors.success[500] }} />;
      case 'decreasing': return <TrendingDownIcon style={{ color: designTokens.colors.error[500] }} />;
      case 'stable': return <TrendingFlatIcon style={{ color: designTokens.colors.primary[500] }} />;
      case 'volatile': return <ShowChart style={{ color: designTokens.colors.warning[500] }} />;
      default: return <TrendingFlatIcon />;
    }
  };

  const getSeasonalityIcon = (seasonality: string) => {
    switch (seasonality) {
      case 'weekly': return <Schedule />;
      case 'monthly': return <CalendarToday />;
      case 'quarterly': return <Timeline />;
      default: return <Info />;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
          Trend Analysis & Forecasting
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
        Trend Analysis & Forecasting
      </Typography>
      
      {/* Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
        
        <FormControlLabel
          control={
            <Switch
              checked={showForecasts}
              onChange={(e) => setShowForecasts(e.target.checked)}
            />
          }
          label="Show AI Forecasts"
        />
      </Box>

      {/* Trend Cards */}
      <Grid container spacing={3}>
        {trendAnalysis.map((trend, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Fade in={true} timeout={500 + index * 100}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => setSelectedTrend(trend)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      {trend.period}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTrendIcon(trend.trend)}
                      <Chip 
                        label={trend.trend.toUpperCase()} 
                        size="small"
                        sx={{ 
                          backgroundColor: getTrendColor(trend.trend),
                          color: 'primary.contrastText',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Current Value */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      {trend.data[trend.data.length - 1].value}
                    </Typography>
                    <Typography variant="h6" sx={{ ml: 1, color: 'text.secondary' }}>
                      %
                    </Typography>
                  </Box>

                  {/* Trend Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSeasonalityIcon(trend.seasonality)}
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {trend.seasonality} pattern
                      </Typography>
                    </Box>
                  </Box>

                  {/* Forecast */}
                  {showForecasts && (
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: designTokens.colors.ai[50], 
                      borderRadius: 2,
                      border: `1px solid ${designTokens.colors.ai[200]}`
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: designTokens.colors.ai[800] }}>
                        🔮 AI Forecast
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {trend.forecast.nextPeriod}%
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.ai[700] }}>
                        Confidence: {(trend.forecast.confidence * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                  )}

                  {/* Key Factors */}
                  {showForecasts && trend.forecast.factors.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: designTokens.colors.neutral[700] }}>
                        Key Factors:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {trend.forecast.factors.slice(0, 2).map((factor, idx) => (
                          <Chip 
                            key={idx}
                            label={factor} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Selected Trend Details */}
      {selectedTrend && (
        <Zoom in={true}>
          <Card sx={{ mt: 3, backgroundColor: designTokens.colors.primary[50] }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {selectedTrend.period} - Detailed Analysis
                </Typography>
                <IconButton onClick={() => setSelectedTrend(null)}>
                  <ExpandLess />
                </IconButton>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[700] }}>
                    Historical Data
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Value</TableCell>
                          {showForecasts && <TableCell align="right">Predicted</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedTrend.data.slice(-5).map((point, index) => (
                          <TableRow key={index}>
                            <TableCell>{new Date(point.date).toLocaleDateString()}</TableCell>
                            <TableCell align="right">{point.value}%</TableCell>
                            {showForecasts && (
                              <TableCell align="right">
                                {point.predicted ? `${point.predicted}%` : '-'}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: designTokens.colors.neutral[700] }}>
                    Forecast Details
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: designTokens.colors.ai[100], borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {selectedTrend.forecast.nextPeriod}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.ai[700], mb: 2 }}>
                      Next period prediction
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[700] }}>
                        Confidence Level
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedTrend.forecast.confidence * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: designTokens.colors.neutral[200],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: designTokens.colors.ai[500]
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: designTokens.colors.ai[600] }}>
                        {(selectedTrend.forecast.confidence * 100).toFixed(0)}%
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 1, color: designTokens.colors.neutral[700] }}>
                      Key Factors:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedTrend.forecast.factors.map((factor, idx) => (
                        <Chip 
                          key={idx}
                          label={factor} 
                          size="small" 
                          sx={{ 
                            backgroundColor: designTokens.colors.ai[200],
                            color: designTokens.colors.ai[800]
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Zoom>
      )}
    </Box>
  );
}
