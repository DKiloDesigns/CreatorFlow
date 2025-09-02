'use client';

export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getSession } from "@/auth"
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress,
  Container,
  Paper,
  Chip,
  Alert,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Plus, 
  Calendar, 
  FileText, 
  Image, 
  Video, 
  Upload, 
  Clock, 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Sparkles, 
  Zap,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Users,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

// Mock data for now - will be replaced with real API calls
const mockPosts: Post[] = [
  {
    id: '1',
    contentText: 'Excited to share our latest product launch! 🚀',
    platforms: ['Instagram', 'Twitter'],
    status: 'scheduled' as const,
    scheduledAt: '2024-01-15T10:00:00Z',
    views: 1200,
    likes: 89,
    comments: 12
  },
  {
    id: '2',
    contentText: 'Behind the scenes of our creative process ✨',
    platforms: ['Instagram'],
    status: 'published' as const,
    publishedAt: '2024-01-14T15:30:00Z',
    views: 2100,
    likes: 156,
    comments: 23
  }
];

interface Post {
  id: string;
  contentText: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: string;
  publishedAt?: string;
  views?: number;
  likes?: number;
  comments?: number;
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [bulkScheduleModalOpen, setBulkScheduleModalOpen] = useState(false);
  const [contentHubExpanded, setContentHubExpanded] = useState(true);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(true);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calendar data state
  const [calendarPosts, setCalendarPosts] = useState<Record<string, Post[]>>({});
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Fetch calendar data
  const fetchCalendarData = async () => {
    setCalendarLoading(true);
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
      
      const response = await fetch(`/api/posts/calendar?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
        credentials: 'include', // Include cookies for session auth
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCalendarPosts(data.posts);
      } else if (response.status === 401) {
        console.log('Calendar API: User not authenticated, using mock data');
        // For now, use mock data if not authenticated
        setCalendarPosts({
          [new Date().toISOString().split('T')[0]]: mockPosts
        });
      } else {
        console.error('Failed to fetch calendar data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      // Fallback to mock data on error
      setCalendarPosts({
        [new Date().toISOString().split('T')[0]]: mockPosts
      });
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCalendarData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderCalendarHeader = () => (
    <Box sx={{ 
      mb: 2,
      p: 2,
      backgroundColor: 'background.paper',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      {/* Row 1: Title + Create Button */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Content Calendar
        </Typography>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Bulk Schedule Button */}
          <Tooltip title="Bulk Schedule">
            <IconButton 
              onClick={() => setBulkScheduleModalOpen(true)}
              sx={{ 
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Calendar size={20} />
            </IconButton>
          </Tooltip>

          {/* Create Content Button */}
          <Tooltip title="Create Content">
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => setCreateModalOpen(true)}
              size="small"
            >
              Create
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Row 2: View Switcher + Other Actions */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        {/* View Switcher */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {(['day', 'week'] as const).map((view) => (
            <Tooltip key={view} title={`${view.charAt(0).toUpperCase() + view.slice(1)} View`}>
              <IconButton
                size="small"
                onClick={() => setCalendarView(view)}
                sx={{
                  backgroundColor: calendarView === view ? 'primary.main' : 'transparent',
                  color: calendarView === view ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: calendarView === view ? 'primary.dark' : 'action.hover'
                  }
                }}
              >
                <Calendar size={16} />
              </IconButton>
            </Tooltip>
          ))}
        </Box>

        {/* Other Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Today Button */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
        </Box>
      </Box>
    </Box>
  );

    const renderCalendar = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    return (
      <Box sx={{ 
        height: 350, // Reduced from 600px to 350px
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.paper'
      }}>
        {/* Calendar Header */}
        {renderCalendarHeader()}
        
        {/* Loading State */}
        {calendarLoading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 'calc(100% - 80px)',
            p: 3
          }}>
            <CircularProgress size={40} />
            <Typography sx={{ ml: 2 }}>Loading calendar...</Typography>
          </Box>
        )}
        
        {/* Calendar Content Based on View */}
        {!calendarLoading && (
          <>
            {calendarView === 'day' && renderDayView(now)}
            {calendarView === 'week' && renderWeekView(now)}
          </>
        )}
                  </Box>
    );
  };

  const renderDayView = (date: Date) => (
    <Box sx={{ 
      height: 'calc(100% - 80px)',
      overflow: 'auto',
      p: 1,
      pb: 2
    }}>
      <Grid container spacing={0.5}>
        {/* Time Column */}
        <Grid item xs={3}>
          <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Time
            </Typography>
                  </Box>
          {Array.from({ length: 24 }, (_, hour) => (
            <Box
              key={hour}
                    sx={{ 
                height: 60,
                      display: 'flex', 
                      alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: hour === date.getHours() ? 'action.hover' : 'transparent'
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </Typography>
            </Box>
          ))}
        </Grid>

        {/* Single Day Column */}
        <Grid item xs={9}>
          <Box sx={{ 
            height: 60, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'action.hover'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </Typography>
              </Box>

          {Array.from({ length: 24 }, (_, hour) => {
            const dateKey = date.toISOString().split('T')[0];
            const dayPosts = calendarPosts[dateKey] || [];
            const hourPosts = dayPosts.filter(post => {
              const postHour = post.scheduledAt ? new Date(post.scheduledAt).getHours() : 0;
              return postHour === hour;
            });
            
            return (
              <Box
                key={hour}
                sx={{
                  height: 60,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
                onClick={() => {
                  if (hourPosts.length > 0) {
                    console.log('Posts at this time:', hourPosts);
                  }
                }}
              >
                {hourPosts.map((post, postIndex) => (
                  <Box
                    key={post.id}
                    sx={{ 
                      position: 'absolute',
                      top: postIndex * 20 + 2,
                      left: 2,
                      right: 2,
                      height: 16,
                      backgroundColor: post.status === 'scheduled' ? 'primary.main' : 
                                    post.status === 'published' ? 'success.main' : 'warning.main',
                      borderRadius: 1,
                      p: 0.5,
                      zIndex: 1
                    }}
                  >
                    <Typography variant="caption" sx={{ 
                      color: 'white', 
                      fontSize: '0.6rem',
                      lineHeight: 1,
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {post.contentText?.substring(0, 15)}...
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );

  const renderWeekView = (date: Date) => (
    <Box sx={{ 
      height: 'calc(100% - 80px)',
      overflow: 'auto',
      p: 1,
      pb: 2
    }}>
      <Grid container spacing={0.5}>
        {/* Time Column */}
        <Grid item xs={2}>
          <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Time
            </Typography>
          </Box>
          {Array.from({ length: 24 }, (_, hour) => (
            <Box
              key={hour}
                    sx={{ 
                height: 60,
                      display: 'flex', 
                      alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: hour === date.getHours() ? 'action.hover' : 'transparent'
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </Typography>
            </Box>
          ))}
        </Grid>

        {/* Week Days Columns */}
        {Array.from({ length: 7 }, (_, dayIndex) => {
          const weekDate = new Date(date);
          weekDate.setDate(date.getDate() - 3 + dayIndex);
          const dateKey = weekDate.toISOString().split('T')[0];
          const dayPosts = calendarPosts[dateKey] || [];
          
          return (
            <Grid item xs key={dayIndex}>
              <Box sx={{ 
                height: 60, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'action.hover'
              }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {weekDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Typography>
              </Box>

              {Array.from({ length: 24 }, (_, hour) => {
                const hourPosts = dayPosts.filter(post => {
                  const postHour = post.scheduledAt ? new Date(post.scheduledAt).getHours() : 0;
                  return postHour === hour;
                });
                
                return (
                  <Box
                    key={hour}
                    sx={{ 
                      height: 60,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      position: 'relative',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => {
                      if (hourPosts.length > 0) {
                        console.log('Posts at this time:', hourPosts);
                      }
                    }}
                  >
                    {hourPosts.map((post, postIndex) => (
                      <Box
                        key={post.id}
                        sx={{
                          position: 'absolute',
                          top: postIndex * 20 + 2,
                          left: 2,
                          right: 2,
                          height: 16,
                          backgroundColor: post.status === 'scheduled' ? 'primary.main' : 
                                        post.status === 'published' ? 'success.main' : 'warning.main',
                          borderRadius: 1,
                          p: 0.5,
                          zIndex: 1
                        }}
                      >
                        <Typography variant="caption" sx={{ 
                          color: 'white', 
                          fontSize: '0.6rem',
                          lineHeight: 1,
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {post.contentText?.substring(0, 15)}...
                    </Typography>
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  

  const renderContentHub = () => (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        action={
          <IconButton onClick={() => setContentHubExpanded(!contentHubExpanded)}>
            {contentHubExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </IconButton>
        }
        title="Content Hub"
        subheader="Quick access to content creation tools"
      />
      <Collapse in={contentHubExpanded}>
                  <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FileText size={20} />}
                onClick={() => setCreateModalOpen(true)}
                sx={{ height: 80, flexDirection: 'column', gap: 1 }}
              >
                <Typography variant="body2">Text Posts</Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Image size={20} />}
                onClick={() => setUploadModalOpen(true)}
                sx={{ height: 80, flexDirection: 'column', gap: 1 }}
              >
                <Typography variant="body2">Image Posts</Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Video size={20} />}
                onClick={() => setUploadModalOpen(true)}
                sx={{ height: 80, flexDirection: 'column', gap: 1 }}
              >
                <Typography variant="body2">Video Posts</Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Upload size={20} />}
                onClick={() => setUploadModalOpen(true)}
                sx={{ height: 80, flexDirection: 'column', gap: 1 }}
              >
                <Typography variant="body2">Media Library</Typography>
              </Button>
            </Grid>
          </Grid>
                  </CardContent>
      </Collapse>
                </Card>
  );

  const renderAnalyticsCenter = () => (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        action={
          <IconButton onClick={() => setAnalyticsExpanded(!analyticsExpanded)}>
            {analyticsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </IconButton>
        }
        title="Analytics Center"
        subheader="Key performance metrics"
      />
      <Collapse in={analyticsExpanded}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Eye size={32} color="#1976d2" />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                  {posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Views
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Heart size={32} color="#e91e63" />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                  {posts.reduce((sum, post) => sum + (post.likes || 0), 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Likes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Share2 size={32} color="#4caf50" />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                  {posts.reduce((sum, post) => sum + (post.comments || 0), 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Comments
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUp size={32} color="#ff9800" />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                  {posts.filter(post => post.status === 'published').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Published Posts
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );

  const renderContentSection = () => {
    switch (activeTab) {
      case 0: // Calendar View
        return (
          <Box sx={{ mt: 3 }}>
            {renderCalendar()}
            </Box>
        );
      
      case 1: // Content Management
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Content Management</Typography>
            <Alert severity="info">
              Content management features will be implemented here. For now, use the calendar above to view and manage your content.
            </Alert>
            </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Content Dashboard
      </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your content calendar and track performance
            </Typography>
          </Box>
          
      {/* Content Hub */}
      {renderContentHub()}

      {/* Analytics Center */}
      {renderAnalyticsCenter()}

      {/* Main Content Area */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 3, pt: 2 }}>
            <Tab label="Calendar View" />
            <Tab label="Content Management" />
          </Tabs>
          <Divider />
          {renderContentSection()}
        </CardContent>
      </Card>

        {/* Modals */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Content</DialogTitle>
        <DialogContent>
          <Typography>Content creation form will be implemented here.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload Media</DialogTitle>
        <DialogContent>
          <Typography>Media upload form will be implemented here.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadModalOpen(false)}>Cancel</Button>
          <Button variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bulkScheduleModalOpen} onClose={() => setBulkScheduleModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Schedule Posts</DialogTitle>
        <DialogContent>
          <Typography>Bulk scheduling form will be implemented here.</Typography>
        </DialogContent>
          <DialogActions>
          <Button onClick={() => setBulkScheduleModalOpen(false)}>Cancel</Button>
          <Button variant="contained">Schedule</Button>
          </DialogActions>
      </Dialog>
    </Container>
  );
} 