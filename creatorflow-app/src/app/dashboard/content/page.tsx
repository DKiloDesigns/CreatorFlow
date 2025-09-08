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
  Share2,
  CalendarDays
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
  const [contentHubExpanded, setContentHubExpanded] = useState(false);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [aiIntelligenceModalOpen, setAiIntelligenceModalOpen] = useState(false);
  
  // State for individual AI tool modals
  const [contentAnalysisModalOpen, setContentAnalysisModalOpen] = useState(false);
  const [competitorIntelligenceModalOpen, setCompetitorIntelligenceModalOpen] = useState(false);
  const [trendPredictionModalOpen, setTrendPredictionModalOpen] = useState(false);
  const [contentOptimizationModalOpen, setContentOptimizationModalOpen] = useState(false);

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
        mb: 3,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Content Calendar
        </Typography>
        
        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 },
          flexWrap: 'wrap'
        }}>
          {/* Bulk Schedule Button */}
          <Tooltip title="Bulk Schedule">
            <IconButton 
              onClick={() => setBulkScheduleModalOpen(true)}
              size="small"
              sx={{ 
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Calendar size={18} />
            </IconButton>
          </Tooltip>

          {/* Create Content Button */}
          <Tooltip title="Create Content">
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={() => setCreateModalOpen(true)}
              size="small"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Create</Box>
              <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>+</Box>
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Row 2: View Switcher + Other Actions */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: { xs: 2, sm: 0 }
      }}>
        {/* View Switcher */}
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1 },
          flexWrap: 'wrap'
        }}>
          {(['day', 'week', 'month'] as const).map((view) => (
            <Tooltip key={view} title={`${view.charAt(0).toUpperCase() + view.slice(1)} View`}>
              <IconButton
                size="small"
                onClick={() => setCalendarView(view)}
                sx={{
                  backgroundColor: calendarView === view ? 'primary.main' : 'transparent',
                  color: calendarView === view ? 'white' : 'text.primary',
                  minWidth: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  '&:hover': {
                    backgroundColor: calendarView === view ? 'primary.dark' : 'action.hover'
                  }
                }}
              >
                {view === 'day' && <Calendar size={14} />}
                {view === 'week' && <CalendarDays size={14} />}
                {view === 'month' && <Calendar size={14} />}
              </IconButton>
            </Tooltip>
          ))}
        </Box>

        {/* Other Actions */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 }
        }}>
          {/* Today Button */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedDate(new Date())}
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Today</Box>
            <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Now</Box>
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
        height: { xs: 300, sm: 400 },
        minHeight: 300,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Calendar Header */}
        <Box sx={{ flexShrink: 0 }}>
          {renderCalendarHeader()}
        </Box>
        
        {/* Calendar Content Area */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Loading State */}
          {calendarLoading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flex: 1,
              p: 3
            }}>
              <CircularProgress size={40} />
              <Typography sx={{ ml: 2 }}>Loading calendar...</Typography>
            </Box>
          )}
          
          {/* Calendar Content Based on View */}
          {!calendarLoading && (
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {calendarView === 'day' && renderDayView(now)}
              {calendarView === 'week' && renderWeekView(now)}
              {calendarView === 'month' && renderMonthView(now)}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const renderDayView = (date: Date) => (
    <Box sx={{ 
      height: '100%',
      overflow: 'auto',
      p: 1,
      pb: 2
    }}>
      <Grid container spacing={0.5}>
        {/* Time Column */}
        <Grid item xs={3}>
          <Box sx={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Time
            </Typography>
          </Box>
          {Array.from({ length: 24 }, (_, hour) => (
            <Box
              key={hour}
              sx={{ 
                height: 40,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: hour === date.getHours() ? 'action.hover' : 'transparent'
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </Typography>
            </Box>
          ))}
        </Grid>

        {/* Single Day Column */}
        <Grid item xs={9}>
          <Box sx={{ 
            height: 40, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'action.hover'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: 'text.primary' }}>
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
                  height: 40,
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
                      top: postIndex * 18 + 2,
                      left: 2,
                      right: 2,
                      height: 14,
                      backgroundColor: post.status === 'scheduled' ? 'primary.main' : 
                                    post.status === 'published' ? 'success.main' : 'warning.main',
                      borderRadius: 0.5,
                      p: 0.25,
                      zIndex: 1
                    }}
                  >
                    <Typography variant="caption" sx={{ 
                      color: 'white', 
                      fontSize: '0.55rem',
                      lineHeight: 1,
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {post.contentText?.substring(0, 20)}...
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
      height: '100%',
      overflow: 'auto',
      p: 1,
      pb: 2
    }}>
      <Grid container spacing={0.5}>
        {/* Time Column */}
        <Grid item xs={2}>
          <Box sx={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Time
            </Typography>
          </Box>
          {Array.from({ length: 24 }, (_, hour) => (
            <Box
              key={hour}
              sx={{ 
                height: 40,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: hour === date.getHours() ? 'action.hover' : 'transparent'
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
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
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'action.hover'
              }}>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
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
                      height: 40,
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
                          top: postIndex * 18 + 2,
                          left: 2,
                          right: 2,
                          height: 14,
                          backgroundColor: post.status === 'scheduled' ? 'primary.main' : 
                                        post.status === 'published' ? 'success.main' : 'warning.main',
                          borderRadius: 0.5,
                          p: 0.25,
                          zIndex: 1
                        }}
                      >
                        <Typography variant="caption" sx={{ 
                          color: 'white', 
                          fontSize: '0.55rem',
                          lineHeight: 1,
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {post.contentText?.substring(0, 18)}...
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

  const renderMonthView = (date: Date) => (
    <Box sx={{ 
      height: '100%',
      overflow: 'auto',
      p: 1,
      pb: 2
    }}>
      <Grid container spacing={0.5}>
        {/* Month Header */}
        <Grid item xs={12}>
          <Box sx={{ 
            height: 40, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'action.hover'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
          </Box>
        </Grid>

        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid item xs key={day}>
            <Box sx={{ 
              height: 40, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'action.hover'
            }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {day}
              </Typography>
            </Box>
          </Grid>
        ))}

        {/* Month Days */}
        {Array.from({ length: 42 }, (_, dayIndex) => {
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const firstDay = monthStart.getDay();
          const dayDate = new Date(monthStart);
          dayDate.setDate(dayIndex - firstDay + 1);
          
          const dateKey = dayDate.toISOString().split('T')[0];
          const dayPosts = calendarPosts[dateKey] || [];
          const isCurrentMonth = dayDate.getMonth() === date.getMonth();
          const isToday = dayDate.toDateString() === new Date().toDateString();
          
          return (
            <Grid item xs key={dayIndex}>
              <Box
                sx={{
                  height: 80,
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 0.5,
                  cursor: 'pointer',
                  backgroundColor: isToday ? 'primary.light' : 
                                 isCurrentMonth ? 'background.paper' : 'action.hover',
                  '&:hover': {
                    backgroundColor: isToday ? 'primary.main' : 'action.hover'
                  }
                }}
                onClick={() => {
                  setSelectedDate(dayDate);
                  if (dayPosts.length > 0) {
                    console.log('Posts for this day:', dayPosts);
                  }
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isCurrentMonth ? 'text.primary' : 'text.secondary',
                    fontWeight: isToday ? 600 : 400
                  }}
                >
                  {dayDate.getDate()}
                </Typography>
                
                {/* Show posts for this day */}
                {dayPosts.slice(0, 2).map((post, postIndex) => (
                  <Box
                    key={post.id}
                    sx={{
                      mt: 0.5,
                      p: 0.5,
                      backgroundColor: post.status === 'scheduled' ? 'primary.main' : 
                                     post.status === 'published' ? 'success.main' : 'warning.main',
                      borderRadius: 0.5,
                      overflow: 'hidden'
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'white',
                        fontSize: '0.65rem',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {post.contentText?.substring(0, 15)}...
                    </Typography>
                  </Box>
                ))}
                
                {dayPosts.length > 2 && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
                    +{dayPosts.length - 2} more
                  </Typography>
                )}
              </Box>
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
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Brain size={20} />}
                onClick={() => setAiIntelligenceModalOpen(true)}
                sx={{ 
                  height: 80, 
                  flexDirection: 'column', 
                  gap: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>AI Intelligence</Typography>
              </Button>
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
          <Box sx={{ 
            mt: 3,
            height: { xs: 300, sm: 400 },
            minHeight: 300
          }}>
            {renderCalendar()}
          </Box>
        );
      
      case 1: // Content Management
        return (
          <Box sx={{ 
            mt: 3,
            height: { xs: 300, sm: 400 },
            minHeight: 300,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Content Management Header */}
            <Box sx={{ 
              mb: 2,
              p: 2,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Content Management
              </Typography>
              
              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.5, sm: 1 },
                flexWrap: 'wrap'
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Upload size={16} />}
                  onClick={() => setUploadModalOpen(true)}
                  size="small"
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 }
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Upload Media</Box>
                  <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Upload</Box>
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setCreateModalOpen(true)}
                  size="small"
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1, sm: 2 }
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Create Content</Box>
                  <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Create</Box>
                </Button>
              </Box>
            </Box>

            {/* Content List */}
            <Box sx={{ 
              flex: 1,
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor: 'background.paper'
            }}>
              {posts.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  p: 4,
                  textAlign: 'center'
                }}>
                  <FileText size={48} style={{ color: '#9e9e9e', marginBottom: 16 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No content yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your first post to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Create Content
                  </Button>
                </Box>
              ) : (
                <Box sx={{ p: 2 }}>
                  {posts.map((post) => (
                    <Card key={post.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              {post.contentText}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              {post.platforms.map((platform) => (
                                <Chip 
                                  key={platform} 
                                  label={platform} 
                                  size="small" 
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Chip 
                                label={post.status} 
                                size="small" 
                                color={post.status === 'published' ? 'success' : 
                                       post.status === 'scheduled' ? 'primary' : 'warning'}
                              />
                              {post.scheduledAt && (
                                <Typography variant="caption" color="text.secondary">
                                  Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                                </Typography>
                              )}
                              {post.publishedAt && (
                                <Typography variant="caption" color="text.secondary">
                                  Published: {new Date(post.publishedAt).toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          
                          {/* Post Stats */}
                          {post.views && (
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Eye size={16} />
                                <Typography variant="caption">{post.views}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Heart size={16} />
                                <Typography variant="caption">{post.likes}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Share2 size={16} />
                                <Typography variant="caption">{post.comments}</Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Edit</Button>
                        <Button size="small" color="error">Delete</Button>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, pb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Content Dashboard
      </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your content calendar and track performance
            </Typography>
          </Box>
          
      {/* Content Hub */}
      {renderContentHub()}

      {/* Main Content Area */}
      <Card sx={{ minHeight: 500 }}>
        <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 3, pt: 2, flexShrink: 0 }}>
            <Tab label="Calendar View" />
            <Tab label="Content Management" />
          </Tabs>
          <Divider />
          <Box sx={{ flex: 1 }}>
            {renderContentSection()}
          </Box>
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

      {/* AI Intelligence Modal */}
      <Dialog 
        open={aiIntelligenceModalOpen} 
        onClose={() => setAiIntelligenceModalOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          AI Intelligence Suite
        </DialogTitle>
        <DialogContent sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Grid container spacing={3}>
            {/* Advanced Content Analysis */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }}>
                    <Brain size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Advanced Content Analysis
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Deep analysis of content performance, engagement patterns, and optimization opportunities.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setContentAnalysisModalOpen(true)}
                >
                  Analyze Content
                </Button>
              </Card>
            </Grid>

            {/* Competitor Intelligence */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText'
                  }}>
                    <Target size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Competitor Intelligence
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Monitor competitor content strategies, trending topics, and market positioning.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setCompetitorIntelligenceModalOpen(true)}
                >
                  Monitor Competitors
                </Button>
              </Card>
            </Grid>

            {/* Trend Prediction */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    color: 'success.contrastText'
                  }}>
                    <TrendingUp size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Trend Prediction
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  AI-powered forecasting of content trends and viral potential.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setTrendPredictionModalOpen(true)}
                >
                  Predict Trends
                </Button>
              </Card>
            </Grid>

            {/* Content Optimization */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText'
                  }}>
                    <Zap size={20} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Content Optimization
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Real-time suggestions for improving content performance across platforms.
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setContentOptimizationModalOpen(true)}
                >
                  Optimize Content
                </Button>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAiIntelligenceModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Content Analysis Modal */}
      <Dialog
        open={contentAnalysisModalOpen}
        onClose={() => setContentAnalysisModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Advanced Content Analysis
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Analyze your content performance with AI-powered insights:
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Engagement Analysis</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Deep dive into likes, comments, shares, and engagement rates across all platforms.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Content Performance</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Identify your top-performing content types, optimal posting times, and audience preferences.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Optimization Recommendations</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get personalized suggestions to improve your content strategy and increase engagement.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setContentAnalysisModalOpen(false)}>Close</Button>
          <Button variant="contained">Start Analysis</Button>
        </DialogActions>
      </Dialog>

      {/* Competitor Intelligence Modal */}
      <Dialog
        open={competitorIntelligenceModalOpen}
        onClose={() => setCompetitorIntelligenceModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Competitor Intelligence
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Monitor your competitors and stay ahead of the competition:
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Competitor Tracking</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Track competitor content strategies, posting frequency, and engagement patterns.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Trending Topics</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Discover what topics and hashtags are trending in your industry.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Market Positioning</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Understand how your content compares to competitors and identify opportunities.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCompetitorIntelligenceModalOpen(false)}>Close</Button>
          <Button variant="contained">Start Monitoring</Button>
        </DialogActions>
      </Dialog>

      {/* Trend Prediction Modal */}
      <Dialog
        open={trendPredictionModalOpen}
        onClose={() => setTrendPredictionModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Trend Prediction
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Predict future trends and viral content opportunities:
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Viral Potential</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              AI-powered analysis to predict which content has the highest viral potential.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Trend Forecasting</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get early insights into emerging trends before they become mainstream.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Content Timing</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Optimal timing recommendations for maximum reach and engagement.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTrendPredictionModalOpen(false)}>Close</Button>
          <Button variant="contained">Start Prediction</Button>
        </DialogActions>
      </Dialog>

      {/* Content Optimization Modal */}
      <Dialog
        open={contentOptimizationModalOpen}
        onClose={() => setContentOptimizationModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          Content Optimization
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 3 },
          maxWidth: '100%',
          overflow: 'hidden',
          '& *': { maxWidth: '100%' }
        }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Get real-time suggestions to improve your content performance:
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Real-time Suggestions</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Live recommendations for improving your content as you create it.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Platform Optimization</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tailored suggestions for each social media platform's best practices.
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>Performance Boost</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Proven strategies to increase engagement, reach, and conversion rates.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setContentOptimizationModalOpen(false)}>Close</Button>
          <Button variant="contained">Start Optimization</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 