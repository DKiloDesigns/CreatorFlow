'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Play,
  Pause,
  Settings,
  Smartphone,
  Users,
  Target
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

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
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!content || platforms.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const scheduleData = scheduleType === 'single' ? {
        scheduledAt: scheduledAt?.toISOString()
      } : {
        frequency,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        times: optimalTimes.map(time => ({ hour: time.hour, minute: 0 }))
      };

      const response = await fetch('/api/scheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_schedule',
          data: {
            content: { text: content },
            platforms,
            scheduleType,
            scheduleData,
            metadata: { createdVia: 'dashboard' }
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully scheduled ${result.count} posts`);
        fetchScheduledPosts();
        setContent('');
        setPlatforms([]);
      } else {
        alert('Failed to create schedule');
      }
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('Failed to create schedule');
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
        alert('Schedule deleted successfully');
        fetchScheduledPosts();
      } else {
        alert('Failed to delete schedule');
      }
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      alert('Failed to delete schedule');
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  if (loading) return <div className="p-8">Loading scheduling data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Scheduling</h1>
          <p className="text-muted-foreground">AI-powered content scheduling with optimal timing</p>
        </div>
        <Button onClick={() => setActiveTab('schedule')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Schedule
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimal">Optimal Times</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Schedule Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Create Schedule
                </CardTitle>
                <CardDescription>
                  Schedule your content with AI-powered optimal timing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your content here..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Platforms</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['instagram', 'twitter', 'youtube', 'tiktok', 'linkedin', 'facebook'].map(platform => (
                      <Button
                        key={platform}
                        variant={platforms.includes(platform) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePlatformToggle(platform)}
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Schedule Type</label>
                  <Select value={scheduleType} onValueChange={setScheduleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Post</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="bulk">Bulk Schedule</SelectItem>
                    </SelectContent>
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
                      <Input
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
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                  </div>
                )}

                <Button onClick={handleCreateSchedule} className="w-full">
                  Create Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Optimal Times Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Optimal Posting Times
                </CardTitle>
                <CardDescription>
                  AI-recommended times based on your audience engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimalTimes.map((time, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {format(new Date().setHours(time.hour, 0, 0, 0), 'h:mm a')}
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {time.engagement}% engagement
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>
                Manage your scheduled content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="flex justify-between items-center p-4 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{post.content.text}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(post.scheduledAt), 'PPP p')}
                      </div>
                      <div className="flex gap-1 mt-2">
                        {post.platforms.map((platform: string) => (
                          <Badge key={platform} variant="outline">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteSchedule(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {scheduledPosts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No scheduled posts found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.scheduled?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Total scheduled posts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.published?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.published?.averageEngagement?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all platforms
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="optimal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimal Posting Times Analysis</CardTitle>
              <CardDescription>
                AI-powered analysis of your best performing posting times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimalTimes.map((time, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">
                          {format(new Date().setHours(time.hour, 0, 0, 0), 'h:mm a')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {time.engagement}% engagement rate
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Use This Time
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 