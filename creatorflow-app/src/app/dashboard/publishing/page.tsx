/**
 * Unified Publishing Dashboard
 * Showcases the new cross-platform content publishing system
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Publish as PublishIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  MusicNote as TikTokIcon,
} from '@mui/icons-material';
import UnifiedPublisher from '@/components/publishing/unified-publisher';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`publishing-tabpanel-${index}`}
      aria-labelledby={`publishing-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function PublishingDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load platform health
      const platformsResponse = await fetch('/api/platforms/unified?action=supported_platforms');
      const platformsData = await platformsResponse.json();
      
      if (platformsData.success) {
        const platformHealthPromises = platformsData.platforms.map(async (platform: string) => {
          const healthResponse = await fetch(`/api/platforms/unified?action=platform_health&platform=${platform}`);
          const healthData = await healthResponse.json();
          return {
            id: platform,
            name: platform.charAt(0).toUpperCase() + platform.slice(1),
            healthy: healthData.healthy,
            error: healthData.error,
          };
        });
        
        const platformHealth = await Promise.all(platformHealthPromises);
        setPlatforms(platformHealth);
      }

      // Load scheduled posts
      const scheduledResponse = await fetch('/api/publish/unified?action=scheduled_posts');
      const scheduledData = await scheduledResponse.json();
      
      if (scheduledData.success) {
        setScheduledPosts(scheduledData.result);
      }

      // Load analytics
      const analyticsResponse = await fetch('/api/publish/unified?action=analytics');
      const analyticsData = await analyticsResponse.json();
      
      if (analyticsData.success) {
        setAnalytics(analyticsData.result);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = (results: any[]) => {
    console.log('Publish results:', results);
    // Refresh data after publishing
    loadData();
  };

  const handleSchedule = (scheduledPostId: string) => {
    console.log('Scheduled post ID:', scheduledPostId);
    // Refresh data after scheduling
    loadData();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <InstagramIcon />;
      case 'youtube':
        return <YouTubeIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'tiktok':
        return <TikTokIcon />;
      default:
        return <PublishIcon />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '#E4405F';
      case 'youtube':
        return '#FF0000';
      case 'twitter':
        return '#1DA1F2';
      case 'linkedin':
        return '#0077B5';
      case 'tiktok':
        return '#000000';
      default:
        return '#666666';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading publishing dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Unified Publishing Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Publish content across all your connected social media platforms with a single interface.
        Schedule posts, track performance, and manage your content strategy all in one place.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Publish Content" icon={<PublishIcon />} />
          <Tab label="Scheduled Posts" icon={<ScheduleIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
          <Tab label="Platform Status" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <UnifiedPublisher onPublish={handlePublish} onSchedule={handleSchedule} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Scheduled Posts
        </Typography>
        
        {scheduledPosts.length === 0 ? (
          <Alert severity="info">
            No scheduled posts found. Create your first scheduled post using the Publish Content tab.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {scheduledPosts.map((post) => (
              <Grid item xs={12} md={6} key={post.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {post.content.substring(0, 50)}...
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Scheduled for: {new Date(post.scheduledTime).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {post.status}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Platforms:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {post.platforms.map((platform: string) => (
                          <Chip
                            key={platform}
                            label={platform}
                            size="small"
                            icon={getPlatformIcon(platform)}
                            sx={{ backgroundColor: getPlatformColor(platform), color: 'white' }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {post.results && (
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Results:
                        </Typography>
                        {post.results.map((result: any, index: number) => (
                          <Alert
                            key={index}
                            severity={result.success ? 'success' : 'error'}
                            icon={result.success ? <CheckCircleIcon /> : <ErrorIcon />}
                            sx={{ mb: 1 }}
                          >
                            <Typography variant="body2">
                              <strong>{result.platform}:</strong>{' '}
                              {result.success ? 'Published successfully' : result.error}
                            </Typography>
                          </Alert>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Publishing Analytics
        </Typography>
        
        {analytics ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {analytics.totalPosts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Posts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main">
                    {analytics.successfulPosts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Successful Posts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="error.main">
                    {analytics.failedPosts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed Posts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Platform Performance
                  </Typography>
                  {Object.entries(analytics.platformBreakdown).map(([platform, stats]: [string, any]) => (
                    <Box key={platform} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getPlatformIcon(platform)}
                        <Typography variant="body1" sx={{ ml: 1 }}>
                          {platform}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Chip
                          label={`${stats.success} successful`}
                          color="success"
                          size="small"
                        />
                        <Chip
                          label={`${stats.failed} failed`}
                          color="error"
                          size="small"
                        />
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            No analytics data available yet. Start publishing content to see your performance metrics.
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Platform Status
        </Typography>
        
        <Grid container spacing={2}>
          {platforms.map((platform) => (
            <Grid item xs={12} sm={6} md={4} key={platform.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getPlatformIcon(platform.id)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {platform.name}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={platform.healthy ? 'Connected' : 'Disconnected'}
                    color={platform.healthy ? 'success' : 'error'}
                    size="small"
                  />
                  
                  {platform.error && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      {platform.error}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Container>
  );
}
