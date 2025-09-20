'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Chip, 
  Paper,
  LinearProgress,
  Fade,
  Zoom
} from '@mui/material';
import { 
  AutoAwesome, 
  ContentCopy, 
  Refresh, 
  TrendingUp, 
  Image, 
  VideoLibrary, 
  Article,
  SmartToy,
  Psychology,
  Speed
} from '@mui/icons-material';

const AI_FEATURES = [
  {
    icon: <SmartToy />,
    title: 'AI Content Writer',
    description: 'Generate engaging posts, captions, and descriptions',
    color: '#6366F1'
  },
  {
    icon: <Image />,
    title: 'AI Image Generator',
    description: 'Create stunning visuals with AI-powered image generation',
    color: '#EC4899'
  },
  {
    icon: <VideoLibrary />,
    title: 'AI Video Editor',
    description: 'Auto-generate video content and captions',
    color: '#8B5CF6'
  },
  {
    icon: <Article />,
    title: 'AI Blog Writer',
    description: 'Generate long-form content and articles',
    color: '#06B6D4'
  }
];

const SAMPLE_CONTENT = [
  {
    type: 'Instagram Post',
    content: '🌟 Just discovered the most amazing sunset spot! The colors were absolutely breathtaking. Sometimes the best moments happen when you least expect them. #SunsetVibes #NaturePhotography #Wanderlust',
    engagement: 'High',
    platforms: ['Instagram', 'Facebook', 'Twitter']
  },
  {
    type: 'LinkedIn Article',
    content: 'The future of social media marketing is here, and it\'s powered by AI. In this comprehensive guide, we explore how artificial intelligence is revolutionizing content creation, audience targeting, and engagement strategies...',
    engagement: 'Very High',
    platforms: ['LinkedIn', 'Twitter', 'Facebook']
  },
  {
    type: 'YouTube Description',
    content: 'In this video, we dive deep into the world of AI-powered social media management. Learn how to automate your content creation, optimize your posting schedule, and maximize your engagement rates...',
    engagement: 'High',
    platforms: ['YouTube', 'Facebook', 'Twitter']
  }
];

export function AIContentGeneration() {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomContent = SAMPLE_CONTENT[Math.floor(Math.random() * SAMPLE_CONTENT.length)];
      setGeneratedContent(JSON.stringify(randomContent, null, 2));
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
        zIndex: 0
      }} />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI-Powered Content Creation
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Generate high-quality content for all platforms in seconds with our advanced AI technology
          </Typography>
        </Box>

        {/* AI Features Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {AI_FEATURES.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedFeature === index ? 2 : 1,
                borderColor: selectedFeature === index ? feature.color : 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }} onClick={() => setSelectedFeature(index)}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ 
                    color: feature.color,
                    mb: 2,
                    '& .MuiSvgIcon-root': {
                      fontSize: '3rem'
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Interactive Demo */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Try AI Content Generation
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Describe what you want to create... (e.g., 'A motivational post about productivity for LinkedIn')"
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<AutoAwesome />}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5B5BD6 0%, #D946AA 100%)'
                    }
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => setGeneratedContent('')}
                >
                  Clear
                </Button>
              </Box>

              {isGenerating && (
                <Box sx={{ mb: 3 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    AI is crafting your content...
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Generated Content
              </Typography>
              
              {generatedContent ? (
                <Fade in={true}>
                  <Box>
                    <Box sx={{ 
                      bgcolor: 'grey.50', 
                      p: 2, 
                      borderRadius: 1, 
                      mb: 2,
                      border: 1,
                      borderColor: 'divider'
                    }}>
                      <pre style={{ 
                        margin: 0, 
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace'
                      }}>
                        {generatedContent}
                      </pre>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<ContentCopy />} 
                        label="Copy" 
                        size="small" 
                        color="primary" 
                        clickable 
                      />
                      <Chip 
                        icon={<TrendingUp />} 
                        label="High Engagement" 
                        size="small" 
                        color="success" 
                      />
                    </Box>
                  </Box>
                </Fade>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <AutoAwesome sx={{ fontSize: '3rem', mb: 2, opacity: 0.3 }} />
                  <Typography variant="body1">
                    Click "Generate Content" to see AI magic in action
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Stats */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Zoom in={true} style={{ transitionDelay: '0.1s' }}>
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main',
                    mb: 1
                  }}>
                    95%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Content Quality Score
                  </Typography>
                </Box>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Zoom in={true} style={{ transitionDelay: '0.2s' }}>
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main',
                    mb: 1
                  }}>
                    10x
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Faster Content Creation
                  </Typography>
                </Box>
              </Zoom>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Zoom in={true} style={{ transitionDelay: '0.3s' }}>
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main',
                    mb: 1
                  }}>
                    50+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Content Templates
                  </Typography>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
