/**
 * Social Media Analytics Calculator
 * Free tool to calculate social media ROI and value
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculatorInputs {
  followers: number;
  engagementRate: number;
  timeSpent: number; // hours per week
  hourlyRate: number; // hourly rate for time calculation
  platforms: string[];
}

interface CalculatorResults {
  totalValue: number;
  timeValue: number;
  engagementValue: number;
  roi: number;
  recommendations: string[];
  proFeatures: string[];
}

const PLATFORMS = [
  'Instagram', 'Facebook', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn',
  'Pinterest', 'Snapchat', 'Reddit', 'Discord', 'Twitch', 'Vimeo'
];

export default function SocialMediaCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    followers: 1000,
    engagementRate: 3.5,
    timeSpent: 10,
    hourlyRate: 25,
    platforms: ['Instagram', 'Facebook']
  });

  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateROI = (inputs: CalculatorInputs): CalculatorResults => {
    const { followers, engagementRate, timeSpent, hourlyRate, platforms } = inputs;
    
    // Time value calculation
    const timeValue = timeSpent * hourlyRate * 52; // Annual time value
    
    // Engagement value calculation (simplified model)
    const engagementValue = (followers * engagementRate / 100) * 0.50 * 12; // Monthly engagement value
    
    // Platform multiplier
    const platformMultiplier = platforms.length * 0.8 + 0.2;
    
    // Total value
    const totalValue = (timeValue + engagementValue) * platformMultiplier;
    
    // ROI calculation
    const roi = ((totalValue - (timeSpent * hourlyRate * 52)) / (timeSpent * hourlyRate * 52)) * 100;
    
    // Generate recommendations
    const recommendations = [];
    if (engagementRate < 3) {
      recommendations.push('Focus on creating more engaging content to increase your engagement rate');
    }
    if (platforms.length < 3) {
      recommendations.push('Expand to more platforms to increase your reach and value');
    }
    if (timeSpent > 20) {
      recommendations.push('Consider using automation tools to reduce time spent on social media');
    }
    if (roi < 100) {
      recommendations.push('Optimize your content strategy to improve ROI');
    }
    
    // Pro features that could help
    const proFeatures = [
      'Advanced analytics for all 16 platforms',
      'AI-powered content optimization',
      'Automated posting and scheduling',
      'Team collaboration features',
      'White-label customization options'
    ];

    return {
      totalValue,
      timeValue,
      engagementValue,
      roi,
      recommendations,
      proFeatures
    };
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const calculatedResults = calculateROI(inputs);
    setResults(calculatedResults);
    setIsCalculating(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate email submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSubmitted(true);
    }
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setInputs(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ 
            color: 'primary.main',
            background: 'linear-gradient(45deg, #0066CC, #00CC66)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Social Media ROI Calculator
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Discover the true value of your social media presence
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calculate your social media ROI and see how CreatorFlow Pro can help you maximize your impact
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalculateIcon color="primary" />
                  Your Social Media Data
                </Typography>

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Followers */}
                  <TextField
                    label="Total Followers"
                    type="number"
                    value={inputs.followers}
                    onChange={(e) => handleInputChange('followers', parseInt(e.target.value) || 0)}
                    fullWidth
                    InputProps={{
                      startAdornment: <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    helperText="Total followers across all platforms"
                  />

                  {/* Engagement Rate */}
                  <TextField
                    label="Average Engagement Rate (%)"
                    type="number"
                    value={inputs.engagementRate}
                    onChange={(e) => handleInputChange('engagementRate', parseFloat(e.target.value) || 0)}
                    fullWidth
                    InputProps={{
                      startAdornment: <TrendingUpIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    helperText="Average engagement rate across platforms"
                  />

                  {/* Time Spent */}
                  <TextField
                    label="Hours Spent Per Week"
                    type="number"
                    value={inputs.timeSpent}
                    onChange={(e) => handleInputChange('timeSpent', parseInt(e.target.value) || 0)}
                    fullWidth
                    InputProps={{
                      startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    helperText="Time spent managing social media"
                  />

                  {/* Hourly Rate */}
                  <TextField
                    label="Your Hourly Rate ($)"
                    type="number"
                    value={inputs.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value) || 0)}
                    fullWidth
                    InputProps={{
                      startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    helperText="Your time value for ROI calculation"
                  />

                  {/* Platforms */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Active Platforms
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {PLATFORMS.map((platform) => (
                        <Chip
                          key={platform}
                          label={platform}
                          clickable
                          color={inputs.platforms.includes(platform) ? 'primary' : 'default'}
                          onClick={() => handlePlatformToggle(platform)}
                          variant={inputs.platforms.includes(platform) ? 'filled' : 'outlined'}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Calculate Button */}
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    startIcon={isCalculating ? <LinearProgress size={20} /> : <CalculateIcon />}
                    sx={{ 
                      py: 1.5,
                      background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0052A3, #00B359)',
                      }
                    }}
                  >
                    {isCalculating ? 'Calculating...' : 'Calculate My ROI'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon color="primary" />
                  Your Social Media Value
                </Typography>

                <AnimatePresence>
                  {results && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Value Breakdown */}
                      <Box sx={{ mb: 3 }}>
                        <Paper sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                          <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                            ${results.totalValue.toLocaleString()}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary">
                            Annual Social Media Value
                          </Typography>
                        </Paper>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h6" color="success.main">
                                ${results.timeValue.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Time Value
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h6" color="info.main">
                                ${results.engagementValue.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Engagement Value
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* ROI */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Return on Investment
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(results.roi, 500)}
                          sx={{ 
                            height: 20, 
                            borderRadius: 10,
                            backgroundColor: 'grey.300',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: results.roi > 100 ? 'success.main' : results.roi > 0 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                        <Typography variant="h5" sx={{ mt: 1, textAlign: 'center' }}>
                          {results.roi.toFixed(1)}% ROI
                        </Typography>
                      </Box>

                      {/* Recommendations */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Recommendations
                        </Typography>
                        {results.recommendations.map((rec, index) => (
                          <Alert key={index} severity="info" sx={{ mb: 1 }}>
                            {rec}
                          </Alert>
                        ))}
                      </Box>

                      {/* Email Capture */}
                      {!emailSubmitted ? (
                        <Box component="form" onSubmit={handleEmailSubmit} sx={{ mb: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Get Your Detailed Report
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Enter your email to receive a detailed PDF report with your results
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              fullWidth
                              size="small"
                            />
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<EmailIcon />}
                              disabled={!email}
                            >
                              Get Report
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Alert severity="success" sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleIcon />
                            <Typography>Report sent to {email}!</Typography>
                          </Box>
                        </Alert>
                      )}

                      {/* Pro Features CTA */}
                      <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <Typography variant="h6" gutterBottom>
                          Maximize Your Social Media Value
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          CreatorFlow Pro can help you:
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {results.proFeatures.slice(0, 3).map((feature, index) => (
                            <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <CheckCircleIcon sx={{ fontSize: 16 }} />
                              {feature}
                            </Typography>
                          ))}
                        </Box>
                        <Button
                          variant="contained"
                          color="inherit"
                          fullWidth
                          startIcon={<ShareIcon />}
                          sx={{ 
                            backgroundColor: 'white',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'grey.100'
                            }
                          }}
                        >
                          Try CreatorFlow Pro Free
                        </Button>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!results && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CalculateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Enter your data and calculate your ROI
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
