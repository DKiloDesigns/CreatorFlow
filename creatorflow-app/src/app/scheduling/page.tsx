'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Box,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  AlertTitle
} from '@mui/material';
import { Calendar, Activity, Edit, Trash2, Play, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardDescription } from '@/components/ui/base/Card';

interface ScheduledPost {
  id: string;
  content: any;
  platforms: string[];
  scheduledAt: string;
  metadata: any;
  scheduleType: string;
}

interface OptimalTime {
  hour: number;
  engagement: number;
}

export default function SchedulingPage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  // Form states
  const [scheduleType, setScheduleType] = useState('single');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date>();
  const [frequency, setFrequency] = useState('daily');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    fetchScheduledPosts();
    fetchOptimalTimes();
    fetchAnalytics();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('/api/scheduling?action=get_scheduled_posts');
      if (response.ok) {
        const data = await response.json();
        setScheduledPosts(data.scheduledPosts || []);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
    }
  };

  const fetchOptimalTimes = async () => {
    try {
      const response = await fetch('/api/scheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_optimal_times',
          data: { count: 5 }
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setOptimalTimes(data.optimalTimes || []);
      }
    } catch (error) {
      console.error('Failed to fetch optimal times:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/scheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_schedule_analytics',
          data: {}
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || {});
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!content || platforms.length === 0 || !scheduledAt) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/scheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_schedule',
          data: {
            content,
            platforms,
            scheduledAt: scheduledAt.toISOString(),
            scheduleType,
            frequency: scheduleType === 'recurring' ? frequency : undefined,
            startDate: scheduleType === 'recurring' ? startDate?.toISOString() : undefined,
            endDate: scheduleType === 'recurring' ? endDate?.toISOString() : undefined,
          }
        }),
      });

      if (response.ok) {
        alert('Schedule created successfully!');
        setContent('');
        setPlatforms([]);
        setScheduledAt(undefined);
        fetchScheduledPosts();
      } else {
        const error = await response.json();
        alert(`Failed to create schedule: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('Failed to create schedule. Please try again.');
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const response = await fetch('/api/scheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_schedule',
          data: { scheduleId }
        }),
      });

      if (response.ok) {
        alert('Schedule deleted successfully!');
        fetchScheduledPosts();
      } else {
        const error = await response.json();
        alert(`Failed to delete schedule: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      alert('Failed to delete schedule. Please try again.');
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <Typography>Loading scheduling data...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Content Scheduling
        </Typography>
        <Button variant="contained" onClick={handleCreateSchedule} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calendar className="h-4 w-4" />
          New Schedule
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="optimal">Optimal Times</TabsTrigger>
            </TabsList>
          </Tabs>
        </Box>

        <div>
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Schedule Form */}
              <Card>
                <CardHeader>
                  <Typography variant="h6" className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Create Schedule
                  </Typography>
                  <CardDescription>
                    Schedule your content with AI-powered optimal timing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <TextField
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter your content here..."
                      multiline
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Platforms</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['instagram', 'twitter', 'youtube', 'tiktok', 'linkedin', 'facebook'].map(platform => (
                        <Button
                          key={platform}
                          variant={platforms.includes(platform) ? "contained" : "outlined"}
                          size="small"
                          onClick={() => handlePlatformToggle(platform)}
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Schedule Type</label>
                    <Select value={scheduleType} onChange={(e) => setScheduleType(e.target.value as string)}>
                      <MenuItem value="single">Single Post</MenuItem>
                      <MenuItem value="recurring">Recurring</MenuItem>
                      <MenuItem value="bulk">Bulk Schedule</MenuItem>
                    </Select>
                  </div>

                  {scheduleType === 'single' && (
                    <div>
                      <label className="text-sm font-medium">Scheduled Date & Time</label>
                      <div className="flex gap-2 mt-2">
                        <Calendar
                          mode="single"
                          selected={scheduledAt}
                          onSelect={setScheduledAt}
                          className="rounded-md border"
                        />
                        <TextField
                          type="time"
                          onChange={(e) => {
                            if (scheduledAt) {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(scheduledAt);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              setScheduledAt(newDate);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {scheduleType === 'recurring' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Frequency</label>
                        <Select value={frequency} onChange={(e) => setFrequency(e.target.value as string)}>
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          className="rounded-md border"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="contained" 
                    onClick={handleCreateSchedule}
                    className="w-full"
                    disabled={!content || platforms.length === 0 || !scheduledAt}
                  >
                    Create Schedule
                  </Button>
                </CardContent>
              </Card>

              {/* Schedule Preview */}
              <Card>
                <CardHeader>
                  <Typography variant="h6">Schedule Preview</Typography>
                  <CardDescription>
                    Preview your scheduled content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {content ? (
                    <div className="space-y-4">
                      <div>
                        <Typography variant="subtitle2" className="text-gray-600">Content:</Typography>
                        <Typography className="text-sm">{content}</Typography>
                      </div>
                      <div>
                        <Typography variant="subtitle2" className="text-gray-600">Platforms:</Typography>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {platforms.map(platform => (
                            <Badge key={platform} variant="secondary">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {scheduledAt && (
                        <div>
                          <Typography variant="subtitle2" className="text-gray-600">Scheduled for:</Typography>
                          <Typography className="text-sm">{format(scheduledAt, 'PPP p')}</Typography>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Typography className="text-gray-500 text-center py-8">
                      Fill in the form to see a preview
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <Typography variant="h6">Scheduled Posts</Typography>
                <CardDescription>
                  Manage your scheduled content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scheduledPosts.length === 0 ? (
                  <Typography className="text-gray-500 text-center py-8">
                    No scheduled posts found
                  </Typography>
                ) : (
                  <div className="space-y-4">
                    {scheduledPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <Typography variant="subtitle1" className="font-medium">
                            {post.content.substring(0, 100)}...
                          </Typography>
                          <div className="flex items-center gap-2 mt-2">
                            <Typography variant="caption" className="text-gray-600">
                              {format(new Date(post.scheduledAt), 'PPP p')}
                            </Typography>
                            <div className="flex gap-1">
                              {post.platforms.map(platform => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="small" variant="outlined">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleDeleteSchedule(post.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <Typography variant="h6">Schedule Analytics</Typography>
                <CardDescription>
                  Track your scheduling performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <Typography variant="h4" className="text-blue-600">
                        {analytics.totalScheduled || 0}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Total Scheduled
                      </Typography>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Typography variant="h4" className="text-green-600">
                        {analytics.completedPosts || 0}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Completed Posts
                      </Typography>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Typography variant="h4" className="text-orange-600">
                        {analytics.pendingPosts || 0}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Pending Posts
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <Typography className="text-gray-500 text-center py-8">
                    No analytics data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimal" className="space-y-6">
            <Card>
              <CardHeader>
                <Typography variant="h6">Optimal Posting Times</Typography>
                <CardDescription>
                  AI-recommended times for maximum engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimalTimes.length > 0 ? (
                  <div className="space-y-4">
                    {optimalTimes.map((time, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Play className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <Typography variant="subtitle1" className="font-medium">
                              {time.hour}:00
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              {time.hour < 12 ? 'AM' : 'PM'}
                            </Typography>
                          </div>
                        </div>
                        <div className="text-right">
                          <Typography variant="h6" className="text-green-600">
                            {time.engagement}%
                          </Typography>
                          <Typography variant="caption" className="text-gray-600">
                            Engagement Rate
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography className="text-gray-500 text-center py-8">
                    No optimal time data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Box>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{ height: { xs: '128px', sm: '40px' }, width: '100%' }} />
    </Container>
  );
} 