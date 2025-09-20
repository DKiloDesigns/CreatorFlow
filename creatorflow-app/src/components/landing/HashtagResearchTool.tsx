'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  TextField,
  Button,
  Chip,
  Paper,
  Fade,
  Zoom,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Search,
  TrendingUp,
  ContentCopy,
  CheckCircle,
  ArrowForward,
  Refresh,
  Star,
  StarBorder,
  Analytics,
  Schedule
} from '@mui/icons-material';

interface Hashtag {
  tag: string;
  posts: number;
  trend: 'up' | 'down' | 'stable';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  isFavorite: boolean;
}

const SAMPLE_HASHTAGS: Hashtag[] = [
  { tag: '#creatorflow', posts: 12500, trend: 'up', difficulty: 'easy', category: 'Brand', isFavorite: false },
  { tag: '#contentcreator', posts: 2500000, trend: 'stable', difficulty: 'medium', category: 'General', isFavorite: false },
  { tag: '#socialmedia', posts: 5000000, trend: 'up', difficulty: 'hard', category: 'General', isFavorite: false },
  { tag: '#marketing', posts: 3000000, trend: 'stable', difficulty: 'medium', category: 'Business', isFavorite: false },
  { tag: '#digitalmarketing', posts: 800000, trend: 'up', difficulty: 'medium', category: 'Business', isFavorite: false },
  { tag: '#entrepreneur', posts: 1500000, trend: 'up', difficulty: 'medium', category: 'Business', isFavorite: false },
  { tag: '#startup', posts: 2000000, trend: 'stable', difficulty: 'medium', category: 'Business', isFavorite: false },
  { tag: '#productivity', posts: 1200000, trend: 'up', difficulty: 'easy', category: 'Lifestyle', isFavorite: false },
  { tag: '#motivation', posts: 4000000, trend: 'stable', difficulty: 'hard', category: 'Lifestyle', isFavorite: false },
  { tag: '#inspiration', posts: 3500000, trend: 'up', difficulty: 'hard', category: 'Lifestyle', isFavorite: false },
  { tag: '#creativity', posts: 1800000, trend: 'up', difficulty: 'medium', category: 'Creative', isFavorite: false },
  { tag: '#design', posts: 2200000, trend: 'stable', difficulty: 'medium', category: 'Creative', isFavorite: false },
  { tag: '#photography', posts: 6000000, trend: 'up', difficulty: 'hard', category: 'Creative', isFavorite: false },
  { tag: '#videography', posts: 800000, trend: 'up', difficulty: 'medium', category: 'Creative', isFavorite: false },
  { tag: '#tech', posts: 3000000, trend: 'up', difficulty: 'medium', category: 'Technology', isFavorite: false },
  { tag: '#ai', posts: 1500000, trend: 'up', difficulty: 'medium', category: 'Technology', isFavorite: false },
  { tag: '#innovation', posts: 900000, trend: 'up', difficulty: 'easy', category: 'Technology', isFavorite: false },
  { tag: '#sustainability', posts: 700000, trend: 'up', difficulty: 'easy', category: 'Environment', isFavorite: false },
  { tag: '#wellness', posts: 2500000, trend: 'up', difficulty: 'medium', category: 'Health', isFavorite: false },
  { tag: '#fitness', posts: 8000000, trend: 'stable', difficulty: 'hard', category: 'Health', isFavorite: false }
];

const CATEGORIES = ['All', 'General', 'Business', 'Lifestyle', 'Creative', 'Technology', 'Health', 'Environment', 'Brand'];

export function HashtagResearchTool() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hashtags, setHashtags] = useState<Hashtag[]>(SAMPLE_HASHTAGS);
  const [filteredHashtags, setFilteredHashtags] = useState<Hashtag[]>(SAMPLE_HASHTAGS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = hashtags.filter(hashtag => 
        hashtag.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hashtag.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHashtags(filtered);
      setIsLoading(false);
    }, 1000);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredHashtags(hashtags);
    } else {
      setFilteredHashtags(hashtags.filter(h => h.category === category));
    }
  };

  const handleCopyHashtag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const toggleFavorite = (tag: string) => {
    setHashtags(prev => prev.map(h => 
      h.tag === tag ? { ...h, isFavorite: !h.isFavorite } : h
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'down': return <TrendingUp sx={{ color: 'error.main', transform: 'rotate(180deg)' }} />;
      case 'stable': return <TrendingUp sx={{ color: 'text.secondary' }} />;
      default: return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.paper'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Hashtag Research Tool
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Discover trending hashtags and optimize your content reach
          </Typography>
        </Box>

        {/* Search Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search hashtags or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isLoading}
              sx={{
                px: 4,
                background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
                }
              }}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </Box>

          {/* Category Filters */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIES.map((category) => (
              <Chip
                key={category}
                label={category}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                color={selectedCategory === category ? 'primary' : 'default'}
                onClick={() => handleCategoryFilter(category)}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Paper>

        {/* Loading */}
        {isLoading && (
          <Box sx={{ mb: 4 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Analyzing hashtags...
            </Typography>
          </Box>
        )}

        {/* Hashtag Results */}
        <Grid container spacing={2}>
          {filteredHashtags.map((hashtag, index) => (
            <Grid item xs={12} sm={6} md={4} key={hashtag.tag}>
              <Fade in={true} timeout={300 + index * 50}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main'
                      }}>
                        {hashtag.tag}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={hashtag.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                          <IconButton 
                            size="small"
                            onClick={() => toggleFavorite(hashtag.tag)}
                          >
                            {hashtag.isFavorite ? <Star sx={{ color: 'warning.main' }} /> : <StarBorder />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy hashtag">
                          <IconButton 
                            size="small"
                            onClick={() => handleCopyHashtag(hashtag.tag)}
                          >
                            {copiedTag === hashtag.tag ? <CheckCircle sx={{ color: 'success.main' }} /> : <ContentCopy />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {getTrendIcon(hashtag.trend)}
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(hashtag.posts)} posts
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={hashtag.difficulty}
                        color={getDifficultyColor(hashtag.difficulty) as any}
                        size="small"
                      />
                      <Chip
                        label={hashtag.category}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Difficulty: {hashtag.difficulty}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Analytics />}
                      >
                        Analyze
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {filteredHashtags.length === 0 && !isLoading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No hashtags found for your search
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setFilteredHashtags(hashtags);
                setSelectedCategory('All');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}

        {/* Features */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Advanced Hashtag Features
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: <TrendingUp />,
                title: 'Trend Analysis',
                description: 'Real-time trending hashtag data'
              },
              {
                icon: <Analytics />,
                title: 'Performance Metrics',
                description: 'Track hashtag engagement and reach'
              },
              {
                icon: <Schedule />,
                title: 'Optimal Timing',
                description: 'Best times to use specific hashtags'
              },
              {
                icon: <Star />,
                title: 'Favorites',
                description: 'Save and organize your hashtags'
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={true} timeout={500 + index * 100}>
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <Box sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.5rem'
                      }
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            Start Researching Hashtags
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
