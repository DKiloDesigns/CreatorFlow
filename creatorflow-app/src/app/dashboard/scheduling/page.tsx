/**
 * Advanced Scheduling Dashboard
 * Comprehensive scheduling interface with calendar, analytics, and bulk operations
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
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Repeat as RepeatIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AdvancedCalendar from '@/components/scheduling/advanced-calendar';

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
      id={`scheduling-tabpanel-${index}`}
      aria-labelledby={`scheduling-tab-${index}`}
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

export default function SchedulingDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);
  const [optimalTimings, setOptimalTimings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOptimalTimingDialog, setShowOptimalTimingDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load scheduling analytics
      const analyticsResponse = await fetch('/api/scheduling/analytics');
      const analyticsData = await analyticsResponse.json();
      
      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetOptimalTiming = async () => {
    try {
      const response = await fetch('/api/scheduling/optimal-timing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Sample content for timing analysis',
          platforms: ['instagram', 'twitter', 'linkedin'],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOptimalTimings(data.optimalTimings);
        setShowOptimalTimingDialog(true);
      }
    } catch (error) {
      console.error('Failed to get optimal timing:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading scheduling dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Advanced Scheduling Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Schedule content across all platforms with advanced calendar features, 
        recurring posts, and AI-powered optimal timing suggestions.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Calendar View" icon={<CalendarIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
          <Tab label="Optimal Timing" icon={<AutoAwesomeIcon />} />
          <Tab label="Bulk Operations" icon={<RepeatIcon />} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <AdvancedCalendar
          onEventClick={(event) => console.log('Event clicked:', event)}
          onEventCreate={(event) => console.log('Event created:', event)}
          onEventUpdate={(event) => console.log('Event updated:', event)}
          onEventDelete={(eventId) => console.log('Event deleted:', eventId)}
          onBulkSchedule={(events) => console.log('Bulk scheduled:', events)}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Scheduling Analytics
        </Typography>
        
        {analytics ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {analytics.totalScheduled}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Scheduled
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main">
                    {analytics.published}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Published
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="warning.main">
                    {analytics.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="error.main">
                    {analytics.failed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Failed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Engagement
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {analytics.averageEngagement.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average engagement per post
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Best Performing Times
                  </Typography>
                  <List>
                    {analytics.bestPerformingTimes.map((time: any, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TrendingUpIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${time.hour}:00`}
                          secondary={`${time.engagement.toFixed(1)} avg engagement`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Platform Performance
                  </Typography>
                  {Object.entries(analytics.platformBreakdown).map(([platform, stats]: [string, any]) => (
                    <Box key={platform} sx={{ mb: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={`${stats.scheduled} scheduled`}
                          color="default"
                          size="small"
                        />
                        <Chip
                          label={`${stats.published} published`}
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
            No analytics data available yet. Start scheduling content to see your performance metrics.
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          AI-Powered Optimal Timing
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Get Optimal Timing Suggestions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Our AI analyzes your content and historical performance to suggest 
                  the best times to post for maximum engagement.
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={handleGetOptimalTiming}
                  sx={{ mb: 2 }}
                >
                  Analyze Optimal Timing
                </Button>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>How it works:</strong> Our AI analyzes your content type, 
                    target audience, and historical performance data to suggest the 
                    optimal posting times for each platform.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Timing Factors
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Historical Performance"
                      secondary="Your past post performance"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="AI Analysis"
                      secondary="Content and audience analysis"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Platform Best Practices"
                      secondary="Platform-specific optimal times"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Bulk Operations
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recurring Posts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Set up recurring posts with custom patterns and schedules.
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<RepeatIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Create Recurring Posts
                </Button>
                
                <Alert severity="info">
                  <Typography variant="body2">
                    Create daily, weekly, or monthly recurring posts with 
                    custom intervals and end dates.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bulk Schedule
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Schedule multiple posts at once with bulk operations.
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Bulk Schedule Posts
                </Button>
                
                <Alert severity="info">
                  <Typography variant="body2">
                    Schedule multiple posts across different platforms 
                    with a single operation.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Optimal Timing Dialog */}
      <Dialog
        open={showOptimalTimingDialog}
        onClose={() => setShowOptimalTimingDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Optimal Timing Suggestions</DialogTitle>
        <DialogContent>
          {optimalTimings.map((timing, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {timing.platform.charAt(0).toUpperCase() + timing.platform.slice(1)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {timing.reasoning}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Confidence:</strong> {(timing.confidence * 100).toFixed(0)}%
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Best Times:</strong>
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {timing.bestTimes.map((time, timeIndex) => (
                    <Chip
                      key={timeIndex}
                      label={time.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOptimalTimingDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
