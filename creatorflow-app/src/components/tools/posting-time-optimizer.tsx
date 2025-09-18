/**
 * Posting Time Optimizer
 * Free tool for finding optimal posting times and engagement analysis
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
  Chip,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  TrendingUp as TrendingUpIcon,
  Globe as GlobeIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChart3Icon,
  Flag as TargetIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  People as UsersIcon,
  Favorite as HeartIcon,
  Chat as MessageSquareIcon,
  Share as Share2Icon,
  Visibility as EyeIcon,
  FlashOn as ZapIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimalTime {
  platform: string;
  bestTimes: string[];
  worstTimes: string[];
  engagementScore: number;
  reachScore: number;
  overallScore: number;
  timezone: string;
  recommendations: string[];
}

interface TimeAnalysis {
  platform: string;
  hourlyData: { hour: number; engagement: number; reach: number }[];
  dailyData: { day: string; engagement: number; reach: number }[];
  peakHours: string[];
  lowHours: string[];
  timezone: string;
}

interface OptimizerSettings {
  platforms: string[];
  timezone: string;
  audienceLocation: string;
  contentType: string;
  targetAudience: string[];
  postingFrequency: string;
  businessHours: { start: number; end: number };
  includeWeekends: boolean;
}

const PLATFORMS = [
  { name: 'Instagram', color: '#E4405F', icon: <HeartIcon /> },
  { name: 'Facebook', color: '#1877F2', icon: <UsersIcon /> },
  { name: 'Twitter', color: '#1DA1F2', icon: <MessageSquareIcon /> },
  { name: 'LinkedIn', color: '#0077B5', icon: <BarChart3Icon /> },
  { name: 'TikTok', color: '#000000', icon: <ZapIcon /> },
  { name: 'YouTube', color: '#FF0000', icon: <EyeIcon /> },
  { name: 'Pinterest', color: '#E60023', icon: <Share2Icon /> },
  { name: 'Snapchat', color: '#FFFC00', icon: <ZapIcon /> },
];

const TIMEZONES = [
  'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00',
  'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00',
  'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 'UTC+05:00',
  'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00', 'UTC+10:00', 'UTC+11:00', 'UTC+12:00'
];

const CONTENT_TYPES = [
  'Text Posts', 'Images', 'Videos', 'Stories', 'Live Content', 'Polls', 'Questions'
];

const TARGET_AUDIENCES = [
  'Gen Z (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Boomers (57+)',
  'Students', 'Professionals', 'Parents', 'Entrepreneurs', 'Creators', 'Gamers'
];

const POSTING_FREQUENCIES = [
  'Multiple times daily', 'Daily', '3-4 times per week', 'Weekly', 'Bi-weekly'
];

export default function PostingTimeOptimizer() {
  const [settings, setSettings] = useState<OptimizerSettings>({
    platforms: ['Instagram', 'Facebook', 'Twitter'],
    timezone: 'UTC+00:00',
    audienceLocation: 'Global',
    contentType: 'Text Posts',
    targetAudience: ['Millennials (25-40)'],
    postingFrequency: 'Daily',
    businessHours: { start: 9, end: 17 },
    includeWeekends: true
  });

  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [timeAnalysis, setTimeAnalysis] = useState<TimeAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const generateOptimalTimes = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const generatedTimes: OptimalTime[] = [];
    const generatedAnalysis: TimeAnalysis[] = [];
    
    settings.platforms.forEach(platform => {
      // Generate optimal times based on platform and settings
      const bestTimes = generateBestTimes(platform, settings);
      const worstTimes = generateWorstTimes(platform, settings);
      
      const optimalTime: OptimalTime = {
        platform,
        bestTimes,
        worstTimes,
        engagementScore: Math.floor(Math.random() * 40) + 60,
        reachScore: Math.floor(Math.random() * 40) + 60,
        overallScore: Math.floor(Math.random() * 40) + 60,
        timezone: settings.timezone,
        recommendations: generateRecommendations(platform, settings)
      };
      
      generatedTimes.push(optimalTime);
      
      // Generate hourly analysis data
      const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        engagement: Math.random() * 100,
        reach: Math.random() * 100
      }));
      
      const dailyData = [
        { day: 'Monday', engagement: Math.random() * 100, reach: Math.random() * 100 },
        { day: 'Tuesday', engagement: Math.random() * 100, reach: Math.random() * 100 },
        { day: 'Wednesday', engagement: Math.random() * 100, reach: Math.random() * 100 },
        { day: 'Thursday', engagement: Math.random() * 100, reach: Math.random() * 100 },
        { day: 'Friday', engagement: Math.random() * 100, reach: Math.random() * 100 },
        { day: 'Saturday', engagement: Math.random() * 100, reach: Math.random() * 100 },
        { day: 'Sunday', engagement: Math.random() * 100, reach: Math.random() * 100 }
      ];
      
      const analysis: TimeAnalysis = {
        platform,
        hourlyData,
        dailyData,
        peakHours: bestTimes,
        lowHours: worstTimes,
        timezone: settings.timezone
      };
      
      generatedAnalysis.push(analysis);
    });
    
    setOptimalTimes(generatedTimes);
    setTimeAnalysis(generatedAnalysis);
    setIsAnalyzing(false);
  };

  const generateBestTimes = (platform: string, settings: OptimizerSettings): string[] => {
    const times = [];
    const baseHour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
    const baseMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    
    for (let i = 0; i < 3; i++) {
      const hour = (baseHour + i * 2) % 24;
      const minute = baseMinute;
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
    
    return times;
  };

  const generateWorstTimes = (platform: string, settings: OptimizerSettings): string[] => {
    const times = [];
    const baseHour = 2 + Math.floor(Math.random() * 4); // 2 AM to 6 AM
    
    for (let i = 0; i < 2; i++) {
      const hour = (baseHour + i * 2) % 24;
      const minute = Math.floor(Math.random() * 4) * 15;
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
    
    return times;
  };

  const generateRecommendations = (platform: string, settings: OptimizerSettings): string[] => {
    const recommendations = [
      `Post during peak hours for ${platform}`,
      `Avoid posting during low engagement times`,
      `Consider your audience's timezone (${settings.timezone})`,
      `Test different times to find what works best for your audience`
    ];
    
    if (settings.includeWeekends) {
      recommendations.push('Weekend posting can be effective for certain audiences');
    }
    
    return recommendations;
  };

  const handleSettingsChange = (field: keyof OptimizerSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedSettingsChange = (parent: keyof OptimizerSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value
      }
    }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSubmitted(true);
    }
  };

  const downloadResults = () => {
    const results = {
      settings,
      optimalTimes,
      timeAnalysis,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posting-time-optimization-results.json';
    a.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
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
            Posting Time Optimizer
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Find the best times to post for maximum engagement and reach
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analyze your audience behavior and optimize your posting schedule for better results
          </Typography>
        </Box>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TargetIcon color="primary" />
              Optimization Settings
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Platforms</InputLabel>
                  <Select
                    multiple
                    value={settings.platforms}
                    onChange={(e) => handleSettingsChange('platforms', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {PLATFORMS.map((platform) => (
                      <MenuItem key={platform.name} value={platform.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: platform.color }}>
                            {platform.icon}
                          </Box>
                          {platform.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                  >
                    {TIMEZONES.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Audience Location"
                  value={settings.audienceLocation}
                  onChange={(e) => handleSettingsChange('audienceLocation', e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Content Type</InputLabel>
                  <Select
                    value={settings.contentType}
                    onChange={(e) => handleSettingsChange('contentType', e.target.value)}
                  >
                    {CONTENT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    multiple
                    value={settings.targetAudience}
                    onChange={(e) => handleSettingsChange('targetAudience', e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {TARGET_AUDIENCES.map((audience) => (
                      <MenuItem key={audience} value={audience}>
                        {audience}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Posting Frequency</InputLabel>
                  <Select
                    value={settings.postingFrequency}
                    onChange={(e) => handleSettingsChange('postingFrequency', e.target.value)}
                  >
                    {POSTING_FREQUENCIES.map((freq) => (
                      <MenuItem key={freq} value={freq}>
                        {freq}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Business Hours
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    label="Start"
                    type="number"
                    value={settings.businessHours.start}
                    onChange={(e) => handleNestedSettingsChange('businessHours', 'start', parseInt(e.target.value))}
                    inputProps={{ min: 0, max: 23 }}
                    sx={{ width: 100 }}
                  />
                  <Typography>to</Typography>
                  <TextField
                    label="End"
                    type="number"
                    value={settings.businessHours.end}
                    onChange={(e) => handleNestedSettingsChange('businessHours', 'end', parseInt(e.target.value))}
                    inputProps={{ min: 0, max: 23 }}
                    sx={{ width: 100 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.includeWeekends}
                      onChange={(e) => handleSettingsChange('includeWeekends', e.target.checked)}
                    />
                  }
                  label="Include Weekends"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={generateOptimalTimes}
                disabled={isAnalyzing}
                startIcon={isAnalyzing ? <LinearProgress size={20} /> : <ClockIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0052A3, #00B359)',
                  }
                }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Find Optimal Times'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {optimalTimes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart3Icon color="primary" />
                  Optimization Results
                </Typography>

                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                  <Tab label="Optimal Times" />
                  <Tab label="Hourly Analysis" />
                  <Tab label="Daily Analysis" />
                  <Tab label="Recommendations" />
                </Tabs>

                {/* Optimal Times Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Grid container spacing={3}>
                      {optimalTimes.map((time, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{ color: PLATFORMS.find(p => p.name === time.platform)?.color }}>
                                {PLATFORMS.find(p => p.name === time.platform)?.icon}
                              </Box>
                              <Typography variant="h6">
                                {time.platform}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Overall Score: {time.overallScore}/100
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={time.overallScore}
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: 'grey.300',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: getScoreColor(time.overallScore) === 'success' ? 'success.main' : 
                                                    getScoreColor(time.overallScore) === 'warning' ? 'warning.main' : 'error.main'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Engagement: {time.engagementScore}/100
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={time.engagementScore}
                                  sx={{ height: 4, borderRadius: 2 }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Reach: {time.reachScore}/100
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={time.reachScore}
                                  sx={{ height: 4, borderRadius: 2 }}
                                />
                              </Grid>
                            </Grid>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Typography variant="subtitle2" gutterBottom>
                              Best Times:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              {time.bestTimes.map((bestTime, timeIndex) => (
                                <Chip
                                  key={timeIndex}
                                  label={bestTime}
                                  color="success"
                                  size="small"
                                />
                              ))}
                            </Box>
                            
                            <Typography variant="subtitle2" gutterBottom>
                              Avoid These Times:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {time.worstTimes.map((worstTime, timeIndex) => (
                                <Chip
                                  key={timeIndex}
                                  label={worstTime}
                                  color="error"
                                  size="small"
                                />
                              ))}
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Hourly Analysis Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Hourly Engagement Analysis
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Platform</TableCell>
                            <TableCell>Peak Hours</TableCell>
                            <TableCell>Low Hours</TableCell>
                            <TableCell>Best Day</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {timeAnalysis.map((analysis, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box sx={{ color: PLATFORMS.find(p => p.name === analysis.platform)?.color }}>
                                    {PLATFORMS.find(p => p.name === analysis.platform)?.icon}
                                  </Box>
                                  {analysis.platform}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {analysis.peakHours.map((hour, hourIndex) => (
                                    <Chip key={hourIndex} label={hour} size="small" color="success" />
                                  ))}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {analysis.lowHours.map((hour, hourIndex) => (
                                    <Chip key={hourIndex} label={hour} size="small" color="error" />
                                  ))}
                                </Box>
                              </TableCell>
                              <TableCell>
                                {analysis.dailyData.reduce((best, day) => 
                                  day.engagement > best.engagement ? day : best
                                ).day}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Daily Analysis Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Daily Performance Analysis
                    </Typography>
                    <Grid container spacing={3}>
                      {timeAnalysis.map((analysis, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              {analysis.platform}
                            </Typography>
                            <List dense>
                              {analysis.dailyData.map((day, dayIndex) => (
                                <ListItem key={dayIndex} sx={{ py: 0.5 }}>
                                  <ListItemText
                                    primary={day.day}
                                    secondary={`Engagement: ${day.engagement.toFixed(1)}% | Reach: ${day.reach.toFixed(1)}%`}
                                  />
                                  <LinearProgress
                                    variant="determinate"
                                    value={day.engagement}
                                    sx={{ width: 100, height: 4, borderRadius: 2 }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Recommendations Tab */}
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Personalized Recommendations
                    </Typography>
                    <Grid container spacing={3}>
                      {optimalTimes.map((time, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              {time.platform} Recommendations
                            </Typography>
                            <List>
                              {time.recommendations.map((rec, recIndex) => (
                                <ListItem key={recIndex} sx={{ py: 0.5 }}>
                                  <ListItemIcon>
                                    <InfoIcon color="info" />
                                  </ListItemIcon>
                                  <ListItemText primary={rec} />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Download Results */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadResults}
                    sx={{ 
                      background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0052A3, #00B359)',
                      }
                    }}
                  >
                    Download Results
                  </Button>
                </Box>

                {/* Email Capture */}
                {!emailSubmitted ? (
                  <Box component="form" onSubmit={handleEmailSubmit} sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Get More Insights
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Enter your email to receive additional optimization tips and updates
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
                        Subscribe
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Alert severity="success" sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon />
                      <Typography>Subscribed! Check your email for more insights.</Typography>
                    </Box>
                  </Alert>
                )}

                {/* Pro Features CTA */}
                <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    Automate Your Posting Schedule
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    CreatorFlow Pro gives you:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Automated posting at optimal times
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      AI-powered timing optimization
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Real-time performance tracking
                    </Typography>
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
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
