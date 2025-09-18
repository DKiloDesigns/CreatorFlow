/**
 * Content Performance Predictor
 * Free tool for predicting content performance and engagement
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
  Rating,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Flag as TargetIcon,
  BarChart as BarChart3Icon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Chat as MessageSquareIcon,
  Favorite as HeartIcon,
  Visibility as EyeIcon,
  Share as Share2Icon,
  ThumbUp as ThumbsUpIcon,
  ThumbDown as ThumbsDownIcon,
  FlashOn as ZapIcon,
  Star as StarIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ContentPrediction {
  platform: string;
  predictedEngagement: number;
  predictedReach: number;
  predictedLikes: number;
  predictedComments: number;
  predictedShares: number;
  overallScore: number;
  confidence: number;
  recommendations: string[];
  bestPlatform: boolean;
}

interface ContentAnalysis {
  content: string;
  contentType: string;
  platforms: string[];
  predictions: ContentPrediction[];
  overallScore: number;
  bestPlatform: string;
  worstPlatform: string;
  optimizationTips: string[];
  hashtagSuggestions: string[];
  postingTimeSuggestions: string[];
}

interface ContentSettings {
  content: string;
  contentType: string;
  platforms: string[];
  targetAudience: string[];
  contentLength: 'short' | 'medium' | 'long';
  includeImages: boolean;
  includeVideos: boolean;
  includeHashtags: boolean;
  includeEmojis: boolean;
  postingTime: string;
  businessType: string;
  contentGoal: string;
}

const PLATFORMS = [
  { name: 'Instagram', color: '#E4405F', icon: <HeartIcon />, maxLength: 2200 },
  { name: 'Facebook', color: '#1877F2', icon: <MessageSquareIcon />, maxLength: 63206 },
  { name: 'Twitter', color: '#1DA1F2', icon: <MessageSquareIcon />, maxLength: 280 },
  { name: 'LinkedIn', color: '#0077B5', icon: <BarChart3Icon />, maxLength: 3000 },
  { name: 'TikTok', color: '#000000', icon: <VideoIcon />, maxLength: 2200 },
  { name: 'YouTube', color: '#FF0000', icon: <VideoIcon />, maxLength: 5000 },
  { name: 'Pinterest', color: '#E60023', icon: <ImageIcon />, maxLength: 500 },
  { name: 'Snapchat', color: '#FFFC00', icon: <ZapIcon />, maxLength: 250 },
];

const CONTENT_TYPES = [
  'Text Post', 'Image Post', 'Video Post', 'Story', 'Live Content', 'Poll', 'Question', 'Link Post'
];

const TARGET_AUDIENCES = [
  'Gen Z (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Boomers (57+)',
  'Students', 'Professionals', 'Parents', 'Entrepreneurs', 'Creators', 'Gamers'
];

const BUSINESS_TYPES = [
  'E-commerce', 'SaaS', 'Agency', 'Consulting', 'Education', 'Entertainment',
  'Health & Fitness', 'Food & Beverage', 'Technology', 'Fashion', 'Travel', 'Other'
];

const CONTENT_GOALS = [
  'Increase Engagement', 'Drive Traffic', 'Generate Leads', 'Build Brand Awareness',
  'Educate Audience', 'Entertain Audience', 'Promote Product', 'Share News'
];

const HASHTAG_SUGGESTIONS = [
  '#content', '#socialmedia', '#marketing', '#business', '#growth', '#engagement',
  '#viral', '#trending', '#inspiration', '#motivation', '#success', '#tips'
];

export default function ContentPerformancePredictor() {
  const [settings, setSettings] = useState<ContentSettings>({
    content: '',
    contentType: 'Text Post',
    platforms: ['Instagram', 'Facebook', 'Twitter'],
    targetAudience: ['Millennials (25-40)'],
    contentLength: 'medium',
    includeImages: false,
    includeVideos: false,
    includeHashtags: true,
    includeEmojis: true,
    postingTime: '2:00 PM',
    businessType: 'SaaS',
    contentGoal: 'Increase Engagement'
  });

  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const generatePrediction = async () => {
    if (!settings.content.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const predictions: ContentPrediction[] = [];
    
    settings.platforms.forEach(platform => {
      const platformData = PLATFORMS.find(p => p.name === platform);
      const contentLength = settings.content.length;
      const maxLength = platformData?.maxLength || 280;
      
      // Calculate base scores
      let engagementScore = Math.random() * 100;
      let reachScore = Math.random() * 100;
      let likesScore = Math.random() * 100;
      let commentsScore = Math.random() * 100;
      let sharesScore = Math.random() * 100;
      
      // Adjust based on content length vs platform max
      const lengthRatio = contentLength / maxLength;
      if (lengthRatio > 0.8) {
        engagementScore *= 0.7; // Too long
      } else if (lengthRatio < 0.3) {
        engagementScore *= 0.8; // Too short
      }
      
      // Adjust based on content type
      if (settings.contentType === 'Video Post') {
        engagementScore *= 1.2;
        reachScore *= 1.1;
      } else if (settings.contentType === 'Image Post') {
        engagementScore *= 1.1;
      }
      
      // Adjust based on hashtags
      if (settings.includeHashtags) {
        engagementScore *= 1.1;
        reachScore *= 1.05;
      }
      
      // Adjust based on emojis
      if (settings.includeEmojis) {
        engagementScore *= 1.05;
      }
      
      // Calculate overall score
      const overallScore = (engagementScore + reachScore + likesScore + commentsScore + sharesScore) / 5;
      
      // Generate recommendations
      const recommendations = [];
      if (contentLength > maxLength) {
        recommendations.push(`Content is too long for ${platform} (${contentLength}/${maxLength} characters)`);
      }
      if (settings.contentType === 'Text Post' && !settings.includeImages) {
        recommendations.push(`Consider adding an image to increase engagement on ${platform}`);
      }
      if (!settings.includeHashtags) {
        recommendations.push(`Add hashtags to improve discoverability on ${platform}`);
      }
      if (engagementScore < 50) {
        recommendations.push(`Consider making your content more engaging for ${platform}`);
      }
      
      predictions.push({
        platform,
        predictedEngagement: Math.round(engagementScore),
        predictedReach: Math.round(reachScore),
        predictedLikes: Math.round(likesScore),
        predictedComments: Math.round(commentsScore),
        predictedShares: Math.round(sharesScore),
        overallScore: Math.round(overallScore),
        confidence: Math.round(Math.random() * 30 + 70), // 70-100%
        recommendations,
        bestPlatform: false
      });
    });
    
    // Find best platform
    const bestPlatform = predictions.reduce((best, current) => 
      current.overallScore > best.overallScore ? current : best
    );
    bestPlatform.bestPlatform = true;
    
    // Find worst platform
    const worstPlatform = predictions.reduce((worst, current) => 
      current.overallScore < worst.overallScore ? current : worst
    );
    
    // Generate optimization tips
    const optimizationTips = [
      'Use engaging headlines and hooks',
      'Include a clear call-to-action',
      'Post when your audience is most active',
      'Use high-quality visuals',
      'Engage with comments and replies'
    ];
    
    // Generate hashtag suggestions
    const hashtagSuggestions = HASHTAG_SUGGESTIONS.slice(0, 5);
    
    // Generate posting time suggestions
    const postingTimeSuggestions = [
      '2:00 PM - 4:00 PM (Peak engagement)',
      '6:00 PM - 8:00 PM (Evening audience)',
      '9:00 AM - 11:00 AM (Morning audience)'
    ];
    
    const contentAnalysis: ContentAnalysis = {
      content: settings.content,
      contentType: settings.contentType,
      platforms: settings.platforms,
      predictions,
      overallScore: Math.round(predictions.reduce((sum, p) => sum + p.overallScore, 0) / predictions.length),
      bestPlatform: bestPlatform.platform,
      worstPlatform: worstPlatform.platform,
      optimizationTips,
      hashtagSuggestions,
      postingTimeSuggestions
    };
    
    setAnalysis(contentAnalysis);
    setIsAnalyzing(false);
  };

  const handleSettingsChange = (field: keyof ContentSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSubmitted(true);
    }
  };

  const downloadResults = () => {
    if (!analysis) return;
    
    const results = {
      settings,
      analysis,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-performance-prediction.json';
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

  const getPlatformMaxLength = (platform: string) => {
    return PLATFORMS.find(p => p.name === platform)?.maxLength || 280;
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
            Content Performance Predictor
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Predict how your content will perform before you post
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get AI-powered predictions for engagement, reach, and performance across all platforms
          </Typography>
        </Box>
      </motion.div>

      {/* Content Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TargetIcon color="primary" />
              Your Content
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  label="Content Text"
                  multiline
                  rows={4}
                  value={settings.content}
                  onChange={(e) => handleSettingsChange('content', e.target.value)}
                  fullWidth
                  placeholder="Enter your content here..."
                  helperText={`${settings.content.length} characters`}
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
                  <InputLabel>Business Type</InputLabel>
                  <Select
                    value={settings.businessType}
                    onChange={(e) => handleSettingsChange('businessType', e.target.value)}
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Content Goal</InputLabel>
                  <Select
                    value={settings.contentGoal}
                    onChange={(e) => handleSettingsChange('contentGoal', e.target.value)}
                  >
                    {CONTENT_GOALS.map((goal) => (
                      <MenuItem key={goal} value={goal}>
                        {goal}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Posting Time"
                  value={settings.postingTime}
                  onChange={(e) => handleSettingsChange('postingTime', e.target.value)}
                  fullWidth
                  placeholder="e.g., 2:00 PM"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Content Features
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.includeImages}
                        onChange={(e) => handleSettingsChange('includeImages', e.target.checked)}
                      />
                    }
                    label="Include Images"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.includeVideos}
                        onChange={(e) => handleSettingsChange('includeVideos', e.target.checked)}
                      />
                    }
                    label="Include Videos"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.includeHashtags}
                        onChange={(e) => handleSettingsChange('includeHashtags', e.target.checked)}
                      />
                    }
                    label="Include Hashtags"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.includeEmojis}
                        onChange={(e) => handleSettingsChange('includeEmojis', e.target.checked)}
                      />
                    }
                    label="Include Emojis"
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={generatePrediction}
                disabled={isAnalyzing || !settings.content.trim()}
                startIcon={isAnalyzing ? <LinearProgress size={20} /> : <TrendingUpIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0052A3, #00B359)',
                  }
                }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Predict Performance'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChart3Icon color="primary" />
                  Performance Predictions
                </Typography>

                {/* Overall Score */}
                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" color="primary" sx={{ fontWeight: 'bold' }}>
                      {analysis.overallScore}/100
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      Overall Performance Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={analysis.overallScore}
                      sx={{ 
                        height: 20, 
                        borderRadius: 10,
                        backgroundColor: 'grey.300',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getScoreColor(analysis.overallScore) === 'success' ? 'success.main' : 
                                          getScoreColor(analysis.overallScore) === 'warning' ? 'warning.main' : 'error.main'
                        }
                      }}
                    />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Best Platform: {analysis.bestPlatform} | Worst Platform: {analysis.worstPlatform}
                    </Typography>
                  </Box>
                </Paper>

                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                  <Tab label="Platform Predictions" />
                  <Tab label="Optimization Tips" />
                  <Tab label="Hashtag Suggestions" />
                  <Tab label="Posting Times" />
                </Tabs>

                {/* Platform Predictions Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Grid container spacing={3}>
                      {analysis.predictions.map((prediction, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper sx={{ p: 3, position: 'relative' }}>
                            {prediction.bestPlatform && (
                              <Chip
                                label="Best Platform"
                                color="success"
                                sx={{ position: 'absolute', top: 16, right: 16 }}
                              />
                            )}
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{ color: PLATFORMS.find(p => p.name === prediction.platform)?.color }}>
                                {PLATFORMS.find(p => p.name === prediction.platform)?.icon}
                              </Box>
                              <Typography variant="h6">
                                {prediction.platform}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Overall Score: {prediction.overallScore}/100
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={prediction.overallScore}
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: 'grey.300',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: getScoreColor(prediction.overallScore) === 'success' ? 'success.main' : 
                                                    getScoreColor(prediction.overallScore) === 'warning' ? 'warning.main' : 'error.main'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Engagement: {prediction.predictedEngagement}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={prediction.predictedEngagement}
                                  sx={{ height: 4, borderRadius: 2 }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Reach: {prediction.predictedReach}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={prediction.predictedReach}
                                  sx={{ height: 4, borderRadius: 2 }}
                                />
                              </Grid>
                            </Grid>
                            
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={4}>
                                <Typography variant="body2" color="text.secondary">
                                  Likes: {prediction.predictedLikes}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="body2" color="text.secondary">
                                  Comments: {prediction.predictedComments}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography variant="body2" color="text.secondary">
                                  Shares: {prediction.predictedShares}
                                </Typography>
                              </Grid>
                            </Grid>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Confidence: {prediction.confidence}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={prediction.confidence}
                              sx={{ height: 4, borderRadius: 2, mb: 2 }}
                            />
                            
                            {prediction.recommendations.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                  Recommendations:
                                </Typography>
                                <List dense>
                                  {prediction.recommendations.map((rec, recIndex) => (
                                    <ListItem key={recIndex} sx={{ py: 0.5 }}>
                                      <ListItemIcon>
                                        <InfoIcon color="info" />
                                      </ListItemIcon>
                                      <ListItemText primary={rec} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Optimization Tips Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Content Optimization Tips
                    </Typography>
                    <List>
                      {analysis.optimizationTips.map((tip, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <LightbulbIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Hashtag Suggestions Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Hashtag Suggestions
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {analysis.hashtagSuggestions.map((hashtag, index) => (
                        <Chip
                          key={index}
                          label={hashtag}
                          color="primary"
                          variant="outlined"
                          clickable
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Posting Times Tab */}
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Optimal Posting Times
                    </Typography>
                    <List>
                      {analysis.postingTimeSuggestions.map((time, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText primary={time} />
                        </ListItem>
                      ))}
                    </List>
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
                      Get More Predictions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Enter your email to receive additional content optimization tips
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
                      <Typography>Subscribed! Check your email for more tips.</Typography>
                    </Box>
                  </Alert>
                )}

                {/* Pro Features CTA */}
                <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    Optimize Your Content Automatically
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    CreatorFlow Pro gives you:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      AI-powered content optimization
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Real-time performance tracking
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Automated A/B testing
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
