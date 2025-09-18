/**
 * Hashtag Research Tool
 * Free tool for hashtag suggestions and trending analysis
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
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Tag as TagIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface HashtagData {
  hashtag: string;
  popularity: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  trend: 'Rising' | 'Stable' | 'Declining';
  platform: string;
}

interface ResearchResults {
  inputHashtag: string;
  suggestions: HashtagData[];
  trending: HashtagData[];
  related: HashtagData[];
  platformSpecific: Record<string, HashtagData[]>;
  analysis: {
    bestTime: string;
    bestPlatform: string;
    engagement: number;
    reach: number;
  };
}

const PLATFORMS = [
  { name: 'Instagram', color: '#E4405F' },
  { name: 'Twitter', color: '#1DA1F2' },
  { name: 'TikTok', color: '#000000' },
  { name: 'LinkedIn', color: '#0077B5' },
  { name: 'Facebook', color: '#1877F2' },
  { name: 'YouTube', color: '#FF0000' },
];

const CATEGORIES = [
  'Technology', 'Business', 'Lifestyle', 'Travel', 'Food', 'Fashion',
  'Fitness', 'Art', 'Music', 'Gaming', 'Education', 'Health'
];

export default function HashtagResearchTool() {
  const [inputHashtag, setInputHashtag] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  const [selectedCategory, setSelectedCategory] = useState('Technology');
  const [results, setResults] = useState<ResearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);

  // Mock hashtag data generator
  const generateMockHashtags = (baseHashtag: string, platform: string, category: string): HashtagData[] => {
    const hashtags = [];
    const baseWords = baseHashtag.toLowerCase().replace('#', '').split(/\s+/);
    
    // Generate related hashtags
    for (let i = 0; i < 15; i++) {
      const variations = [
        `${baseWords[0]}${category.toLowerCase()}`,
        `${baseWords[0]}tips`,
        `${baseWords[0]}guide`,
        `${baseWords[0]}2024`,
        `${baseWords[0]}pro`,
        `${baseWords[0]}life`,
        `${baseWords[0]}daily`,
        `${baseWords[0]}motivation`,
        `${baseWords[0]}inspiration`,
        `${baseWords[0]}success`,
        `${baseWords[0]}growth`,
        `${baseWords[0]}community`,
        `${baseWords[0]}learn`,
        `${baseWords[0]}create`,
        `${baseWords[0]}build`
      ];
      
      const hashtag = variations[i] || `${baseWords[0]}${i}`;
      hashtags.push({
        hashtag: `#${hashtag}`,
        popularity: Math.floor(Math.random() * 1000000) + 1000,
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard',
        category,
        trend: ['Rising', 'Stable', 'Declining'][Math.floor(Math.random() * 3)] as 'Rising' | 'Stable' | 'Declining',
        platform
      });
    }
    
    return hashtags.sort((a, b) => b.popularity - a.popularity);
  };

  const handleSearch = async () => {
    if (!inputHashtag.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const suggestions = generateMockHashtags(inputHashtag, selectedPlatform, selectedCategory);
    const trending = generateMockHashtags('trending', selectedPlatform, selectedCategory).slice(0, 10);
    const related = generateMockHashtags(inputHashtag, selectedPlatform, selectedCategory).slice(0, 8);
    
    const platformSpecific: Record<string, HashtagData[]> = {};
    PLATFORMS.forEach(platform => {
      platformSpecific[platform.name] = generateMockHashtags(inputHashtag, platform.name, selectedCategory).slice(0, 5);
    });
    
    const analysis = {
      bestTime: '2:00 PM - 4:00 PM',
      bestPlatform: selectedPlatform,
      engagement: Math.floor(Math.random() * 20) + 5,
      reach: Math.floor(Math.random() * 50000) + 10000
    };
    
    setResults({
      inputHashtag,
      suggestions,
      trending,
      related,
      platformSpecific,
      analysis
    });
    
    setIsSearching(false);
  };

  const copyHashtag = (hashtag: string) => {
    navigator.clipboard.writeText(hashtag);
    setCopiedHashtag(hashtag);
    setTimeout(() => setCopiedHashtag(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Rising': return <TrendingUpIcon color="success" />;
      case 'Stable': return <CheckCircleIcon color="info" />;
      case 'Declining': return <WarningIcon color="warning" />;
      default: return <InfoIcon />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
            Hashtag Research Tool
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Discover trending hashtags and optimize your content reach
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get AI-powered hashtag suggestions and trending analysis for maximum engagement
          </Typography>
        </Box>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon color="primary" />
              Research Hashtags
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Enter hashtag or keyword"
                  value={inputHashtag}
                  onChange={(e) => setInputHashtag(e.target.value)}
                  fullWidth
                  placeholder="#technology or technology"
                  InputProps={{
                    startAdornment: <TagIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Platform"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  {PLATFORMS.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={isSearching || !inputHashtag.trim()}
                startIcon={isSearching ? <LinearProgress size={20} /> : <SearchIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, #0066CC, #00CC66)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0052A3, #00B359)',
                  }
                }}
              >
                {isSearching ? 'Researching...' : 'Research Hashtags'}
              </Button>
              
              {results && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    // Simulate download
                    const data = JSON.stringify(results, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'hashtag-research-results.json';
                    a.click();
                  }}
                >
                  Download Results
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon color="primary" />
                  Research Results for "{results.inputHashtag}"
                </Typography>

                {/* Analysis Summary */}
                <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {results.analysis.engagement}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Engagement
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {formatNumber(results.analysis.reach)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Potential Reach
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">
                          {results.analysis.bestTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Best Posting Time
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          {results.analysis.bestPlatform}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Best Platform
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Tabs */}
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                  <Tab label="Suggestions" />
                  <Tab label="Trending" />
                  <Tab label="Related" />
                  <Tab label="Platform Specific" />
                </Tabs>

                {/* Suggestions Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Hashtag Suggestions
                    </Typography>
                    <Grid container spacing={2}>
                      {results.suggestions.map((hashtag, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper sx={{ p: 2, position: 'relative' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                                {hashtag.hashtag}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => copyHashtag(hashtag.hashtag)}
                              >
                                {copiedHashtag === hashtag.hashtag ? <CheckCircleIcon color="success" /> : <CopyIcon />}
                              </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <Chip
                                label={hashtag.difficulty}
                                color={getDifficultyColor(hashtag.difficulty) as any}
                                size="small"
                              />
                              <Chip
                                label={hashtag.trend}
                                icon={getTrendIcon(hashtag.trend)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {formatNumber(hashtag.popularity)} posts
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Trending Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Trending Hashtags
                    </Typography>
                    <List>
                      {results.trending.map((hashtag, index) => (
                        <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                          <ListItemIcon>
                            <Badge badgeContent={index + 1} color="primary">
                              <TrendingUpIcon />
                            </Badge>
                          </ListItemIcon>
                          <ListItemText
                            primary={hashtag.hashtag}
                            secondary={`${formatNumber(hashtag.popularity)} posts • ${hashtag.difficulty} • ${hashtag.trend}`}
                          />
                          <IconButton onClick={() => copyHashtag(hashtag.hashtag)}>
                            {copiedHashtag === hashtag.hashtag ? <CheckCircleIcon color="success" /> : <CopyIcon />}
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Related Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Related Hashtags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {results.related.map((hashtag, index) => (
                        <Chip
                          key={index}
                          label={hashtag.hashtag}
                          onClick={() => copyHashtag(hashtag.hashtag)}
                          color={copiedHashtag === hashtag.hashtag ? 'success' : 'default'}
                          icon={copiedHashtag === hashtag.hashtag ? <CheckCircleIcon /> : <TagIcon />}
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Platform Specific Tab */}
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Platform-Specific Hashtags
                    </Typography>
                    <Grid container spacing={3}>
                      {PLATFORMS.map((platform) => (
                        <Grid item xs={12} md={6} key={platform.name}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: platform.color }}>
                              {platform.name}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {results.platformSpecific[platform.name]?.map((hashtag, index) => (
                                <Chip
                                  key={index}
                                  label={hashtag.hashtag}
                                  onClick={() => copyHashtag(hashtag.hashtag)}
                                  size="small"
                                  sx={{ mb: 1 }}
                                />
                              ))}
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Pro Features CTA */}
                <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    Unlock Advanced Hashtag Research
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    CreatorFlow Pro gives you:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      AI-powered hashtag suggestions for all 16 platforms
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Real-time trending analysis and competitor tracking
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Automated hashtag optimization and scheduling
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
