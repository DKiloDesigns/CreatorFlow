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
  Chip,
  Paper,
  Fade,
  Zoom,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  CalendarToday,
  Schedule,
  PlayArrow,
  Edit,
  Share,
  Analytics,
  CheckCircle,
  ArrowForward,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';

const SAMPLE_POSTS = [
  {
    id: 1,
    title: 'Morning Motivation Monday',
    platform: 'Instagram',
    type: 'Post',
    time: '9:00 AM',
    status: 'scheduled',
    engagement: '2.3k likes',
    color: '#E4405F'
  },
  {
    id: 2,
    title: 'Tech Tuesday Tutorial',
    platform: 'YouTube',
    type: 'Video',
    time: '2:00 PM',
    status: 'published',
    engagement: '15.2k views',
    color: '#FF0000'
  },
  {
    id: 3,
    title: 'Behind the Scenes',
    platform: 'TikTok',
    type: 'Reel',
    time: '6:00 PM',
    status: 'draft',
    engagement: '0 views',
    color: '#000000'
  },
  {
    id: 4,
    title: 'Weekly Roundup',
    platform: 'LinkedIn',
    type: 'Article',
    time: '8:00 AM',
    status: 'scheduled',
    engagement: '0 views',
    color: '#0A66C2'
  },
  {
    id: 5,
    title: 'Quick Tip',
    platform: 'Twitter',
    type: 'Tweet',
    time: '12:00 PM',
    status: 'published',
    engagement: '892 retweets',
    color: '#000000'
  },
  {
    id: 6,
    title: 'Product Launch',
    platform: 'Facebook',
    type: 'Live',
    time: '3:00 PM',
    status: 'scheduled',
    engagement: '0 views',
    color: '#1877F2'
  }
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function ContentCalendarPreview() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'primary';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle />;
      case 'scheduled': return <Schedule />;
      case 'draft': return <Edit />;
      default: return <Edit />;
    }
  };

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.default',
      borderTop: 1,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Content Calendar Preview
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            See how easy it is to plan and schedule your content across all platforms
          </Typography>
        </Box>

        {/* Calendar Header */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'week' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('week')}
                size="small"
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('month')}
                size="small"
              >
                Month
              </Button>
            </Box>
          </Box>

          {/* Calendar Grid */}
          <Grid container spacing={1}>
            {/* Time Column */}
            <Grid item xs={1}>
              <Box sx={{ height: 40 }} />
              {HOURS.slice(8, 20).map(hour => (
                <Box 
                  key={hour}
                  sx={{ 
                    height: 60, 
                    display: 'flex', 
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    color: 'text.secondary'
                  }}
                >
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </Box>
              ))}
            </Grid>

            {/* Days */}
            {DAYS_OF_WEEK.map((day, dayIndex) => (
              <Grid item xs={1.5} key={day}>
                <Box sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  mb: 1,
                  color: 'text.primary'
                }}>
                  {day}
                </Box>
                <Box sx={{ 
                  height: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'primary.50',
                  borderRadius: 1,
                  mb: 1
                }}>
                  {dayIndex + 1}
                </Box>
                {HOURS.slice(8, 20).map(hour => (
                  <Box 
                    key={hour}
                    sx={{ 
                      height: 60, 
                      border: '1px solid',
                      borderColor: 'divider',
                      position: 'relative',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                ))}
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Sample Posts */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Sample Content Schedule
        </Typography>
        
        <Grid container spacing={3}>
          {SAMPLE_POSTS.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Fade in={true} timeout={500 + index * 100}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: post.color 
                        }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {post.platform}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(post.status)}
                        label={post.status}
                        color={getStatusColor(post.status) as any}
                        size="small"
                      />
                    </Box>

                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      color: 'text.primary'
                    }}>
                      {post.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.type} • {post.time}
                    </Typography>

                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold',
                      color: post.status === 'published' ? 'success.main' : 'text.secondary'
                    }}>
                      {post.engagement}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      mt: 2,
                      justifyContent: 'flex-end'
                    }}>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton size="small">
                          <Share />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Analytics">
                        <IconButton size="small">
                          <Analytics />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Features */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Calendar Features
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: <Schedule />,
                title: 'Smart Scheduling',
                description: 'AI-powered optimal posting times'
              },
              {
                icon: <PlayArrow />,
                title: 'Bulk Upload',
                description: 'Upload and schedule multiple posts at once'
              },
              {
                icon: <Edit />,
                title: 'Content Editor',
                description: 'Edit and preview posts before publishing'
              },
              {
                icon: <Analytics />,
                title: 'Performance Tracking',
                description: 'Track engagement and optimize your strategy'
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
            Try the Calendar Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
