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
  Tab
} from '@mui/material';
import { 
  Card,
  CardHeader,
  CardContent,
  Button as MuiButton,
  MuiDialog,
  MuiDialogTitle,
  MuiDialogContent,
  DialogActions
} from '@/components/ui/mui-components';
import { Plus, Calendar, FileText, Image, Video, Upload, Clock, Brain, TrendingUp, Lightbulb, Target, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import dynamicImport from 'next/dynamic';

// Import new components
import { UploadMediaModal } from './_components/upload-media-modal';
import { MediaLibrary } from './_components/media-library';
import { CreateVideoModal } from './_components/create-video-modal';
import { UseTemplateModal } from './_components/use-template-modal';
import { BulkScheduleModal } from './_components/bulk-schedule-modal';
import PostComposer from './_components/post-composer';
import ContentCalendar from './_components/content-calendar';
import ContentTable from './_components/content-table';
import EditPostForm from './_components/edit-post-form';

// Import Phase 5 AI components
import AIContentOptimizer from '@/components/ai/AIContentOptimizer';
import AutomatedPublisher from '@/components/ai/AutomatedPublisher';

// Dynamically import AIOnboarding to prevent SSR issues
const AIOnboarding = dynamicImport(() => import('@/components/ui/ai-onboarding').then(mod => ({ default: mod.AIOnboarding })), {
  ssr: false,
  loading: () => (
    <Box sx={{ 
      background: 'linear-gradient(45deg, #f3e8ff 30%, #dbeafe 90%)',
      border: 1,
      borderColor: 'purple.200',
      borderRadius: 2,
      p: 2
    }}>
      Loading AI setup...
    </Box>
  )
});

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
  tags: string[];
  description: string;
  thumbnail?: string;
}

interface Post {
  id: string;
  contentText?: string;
  status: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState(0); // Default to calendar view
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [isUsingTemplate, setIsUsingTemplate] = useState(false);
  const [isBulkScheduling, setIsBulkScheduling] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Upload Media Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [createVideoModalOpen, setCreateVideoModalOpen] = useState(false);
  const [useTemplateModalOpen, setUseTemplateModalOpen] = useState(false);
  const [bulkScheduleModalOpen, setBulkScheduleModalOpen] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);

  // Add state for posts, loading, error, filters, search, pagination
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [overview, setOverview] = useState({ drafts: 0, scheduled: 0, published: 0 });
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [hasAiKey, setHasAiKey] = useState(true); // Default to true, will check API

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle responsive tab behavior
  useEffect(() => {
    const handleResize = () => {
      // On mobile, ensure we start with calendar view
      if (window.innerWidth < 768) {
        // Keep current tab, but ensure calendar is accessible
        return;
      }
    };

    // Set initial tab based on screen size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug modal state
  useEffect(() => {
    console.log('Modal state changed:', {
      uploadModalOpen,
      createVideoModalOpen,
      useTemplateModalOpen,
      bulkScheduleModalOpen
    });
  }, [uploadModalOpen, createVideoModalOpen, useTemplateModalOpen, bulkScheduleModalOpen]);

  // Listen for custom events from the composer
  useEffect(() => {
    const handleUploadModal = () => setUploadModalOpen(true);
    const handleCreateVideoModal = () => setCreateVideoModalOpen(true);
    const handleUseTemplateModal = () => setUseTemplateModalOpen(true);
    const handleBulkScheduleModal = () => setBulkScheduleModalOpen(true);

    window.addEventListener('openUploadModal', handleUploadModal);
    window.addEventListener('openCreateVideoModal', handleCreateVideoModal);
    window.addEventListener('openUseTemplateModal', handleUseTemplateModal);
    window.addEventListener('openBulkScheduleModal', handleBulkScheduleModal);

    return () => {
      window.removeEventListener('openUploadModal', handleUploadModal);
      window.removeEventListener('openCreateVideoModal', handleCreateVideoModal);
      window.removeEventListener('openUseTemplateModal', handleUseTemplateModal);
      window.removeEventListener('openBulkScheduleModal', handleBulkScheduleModal);
    };
  }, []);

  const handleUploadMedia = async () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => setIsUploading(false), 2000);
  };

  const handleUploadComplete = (files: any[]) => {
    const newMedia: MediaItem[] = files.map((file, index) => ({
      id: `media-${Date.now()}-${index}`,
      name: file.name,
      url: file.url,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      tags: [],
      description: '',
      thumbnail: file.type.startsWith('image/') ? file.url : undefined
    }));

    setUploadedMedia(prev => [...prev, ...newMedia]);
    setUploadModalOpen(false);
    toast.success(`${files.length} media file(s) uploaded successfully!`);
  };

  const handleMediaSelect = (media: MediaItem) => {
    // Handle media selection
    console.log('Selected media:', media);
  };

  const handleCreateVideo = async () => {
    setIsCreatingVideo(true);
    // Simulate video creation process
    setTimeout(() => setIsCreatingVideo(false), 3000);
  };

  const handleVideoCreated = (videoData: any) => {
    setCreateVideoModalOpen(false);
    toast.success('Video created successfully!');
    // Handle the created video data
    console.log('Video created:', videoData);
  };

  const handleUseTemplate = async () => {
    setIsUsingTemplate(true);
    // Simulate template usage process
    setTimeout(() => setIsUsingTemplate(false), 2000);
  };

  const handleTemplateUsed = (templateData: any) => {
    setUseTemplateModalOpen(false);
    toast.success('Template applied successfully!');
    // Handle the template data
    console.log('Template used:', templateData);
  };

  const handleBulkSchedule = async () => {
    setIsBulkScheduling(true);
    // Simulate bulk scheduling process
    setTimeout(() => setIsBulkScheduling(false), 3000);
  };

  const handleBulkScheduled = (scheduleData: any) => {
    setBulkScheduleModalOpen(false);
    toast.success('Posts scheduled successfully!');
    // Handle the schedule data
    console.log('Bulk scheduled:', scheduleData);
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedData: any) => {
    try {
      // Simulate API call to update post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prev => prev.map(post => 
        post.id === updatedData.id ? { ...post, ...updatedData } : post
      ));
      
      setEditModalOpen(false);
      setSelectedPost(null);
      toast.success('Post updated successfully!');
    } catch (error) {
      toast.error('Failed to update post');
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      // Simulate API call to delete post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prev => prev.filter(post => post.id !== postToDelete.id));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  };

  const handleDuplicate = async (post: Post) => {
    try {
      // Simulate API call to duplicate post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const duplicatedPost: Post = {
        ...post,
        id: `duplicate-${Date.now()}`,
        contentText: `${post.contentText || 'Content'} (Copy)`,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPosts(prev => [duplicatedPost, ...prev]);
      toast.success('Post duplicated successfully!');
    } catch (error) {
      toast.error('Failed to duplicate post');
      console.error('Error duplicating post:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Mock data for now since API doesn't exist
        const mockPosts: Post[] = [
          {
            id: '1',
            contentText: 'AI-powered content creation strategies for modern marketers',
            status: 'DRAFT',
            platforms: ['LinkedIn', 'Twitter'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            contentText: 'How to optimize your social media presence in 2025',
            status: 'SCHEDULED',
            platforms: ['Instagram', 'LinkedIn'],
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            contentText: 'The future of content marketing: AI and automation',
            status: 'PUBLISHED',
            platforms: ['LinkedIn', 'Twitter', 'Facebook'],
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        
        setPosts(mockPosts);
        setTotal(mockPosts.length);
        setOverview({ 
          drafts: mockPosts.filter(p => p.status === 'DRAFT').length,
          scheduled: mockPosts.filter(p => p.status === 'SCHEDULED').length,
          published: mockPosts.filter(p => p.status === 'PUBLISHED').length
        });
        
        setLoading(false);
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, [page, pageSize, statusFilter, platformFilter, search]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Calendar View
        return <ContentCalendar />;
      case 1: // Content Management
        return (
          <>
            {/* Quick Actions - Content Creation Tools - Hidden on mobile since we have mobile buttons above */}
            <Card sx={{ mb: 4, display: { xs: 'none', md: 'block' } }}>
              <CardHeader>
                <Typography variant="h6">Content Creation Tools</Typography>
              </CardHeader>
              <CardContent>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                  <Box>
                    <MuiButton
                      variant="outline"
                      fullWidth
                      startIcon={<Upload style={{ width: 16, height: 16 }} />}
                      onClick={() => setUploadModalOpen(true)}
                      sx={{ height: 48 }}
                    >
                      Upload Media
                    </MuiButton>
                  </Box>
                  <Box>
                    <MuiButton
                      variant="outline"
                      fullWidth
                      startIcon={<Video style={{ width: 16, height: 16 }} />}
                      onClick={() => setCreateVideoModalOpen(true)}
                      sx={{ height: 48 }}
                    >
                      Create Video
                    </MuiButton>
                  </Box>
                  <Box>
                    <MuiButton
                      variant="outline"
                      fullWidth
                      startIcon={<FileText style={{ width: 16, height: 16 }} />}
                      onClick={() => setUseTemplateModalOpen(true)}
                      sx={{ height: 48 }}
                    >
                      Use Template
                    </MuiButton>
                  </Box>
                  <Box>
                    <MuiButton
                      variant="outline"
                      fullWidth
                      startIcon={<Calendar style={{ width: 16, height: 16 }} />}
                      onClick={() => setBulkScheduleModalOpen(true)}
                      sx={{ height: 48 }}
                    >
                      Bulk Schedule
                    </MuiButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Overview Cards */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <Card sx={{ minWidth: 120, flex: '1 1 auto' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      Drafts
                    </Typography>
                    <FileText style={{ width: 14, height: 14, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {overview?.drafts || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {overview?.drafts === 1 ? 'draft post' : 'draft posts'}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ minWidth: 120, flex: '1 1 auto' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      Scheduled
                    </Typography>
                    <Clock style={{ width: 14, height: 14, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {overview?.scheduled || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {overview?.scheduled === 1 ? 'scheduled post' : 'scheduled posts'}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ minWidth: 120, flex: '1 1 auto' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      Published
                    </Typography>
                    <TrendingUp style={{ width: 14, height: 14, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {overview?.published || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {overview?.published === 1 ? 'published post' : 'published posts'}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ minWidth: 120, flex: '1 1 auto' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      AI Insights
                    </Typography>
                    <Brain style={{ width: 14, height: 14, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {aiInsights?.length || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {(aiInsights?.length || 0) === 1 ? 'AI insight' : 'AI insights'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Content Table */}
            <Box sx={{ mb: { xs: 8, sm: 6 } }}>
              <ContentTable 
                posts={posts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                loading={loading}
                error={error}
              />
            </Box>
          </>
        );
      case 2: // AI Content Optimization
        return <AIContentOptimizer />;
      case 3: // Automated Publishing
        return <AutomatedPublisher />;
      default:
        return null;
    }
  };

  // Temporarily disable loading state to see content
  // if (loading) {
  //   return (
  //     <Box sx={{ 
  //       display: 'flex', 
  //       alignItems: 'center', 
  //       justifyContent: 'center', 
  //       minHeight: 400 
  //     }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ pb: { xs: 12, sm: 8 } }}>
      <Typography variant="h4" gutterBottom>
        Content Hub
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { sm: 'center' }, 
          justifyContent: 'space-between', 
          gap: 2,
          mb: 2
        }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'text.primary',
                wordBreak: 'break-word'
              }}
            >
              Content Management
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                mt: 0.5
              }}
            >
              Create, schedule, and manage your content across all platforms
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 1,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <MuiButton
              variant="default"
              startIcon={<Plus style={{ width: 16, height: 16 }} />}
              onClick={() => setUploadModalOpen(true)}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                minWidth: 44,
                minHeight: 44
              }}
            >
              Create Post
            </MuiButton>
            
            <MuiButton
              variant="outline"
              startIcon={<Sparkles style={{ width: 16, height: 16 }} />}
              onClick={() => window.location.href = '/dashboard/content/smart-workflow'}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                minWidth: 44,
                minHeight: 44,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'primary.50'
                }
              }}
            >
              Smart Workflow
            </MuiButton>
          </Box>
        </Box>

        {/* Mobile Action Buttons - Only visible on mobile */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          flexDirection: 'column', 
          gap: 2, 
          mb: 3 
        }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Quick Actions
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 2 
          }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Upload style={{ width: 16, height: 16 }} />}
              onClick={() => {
                console.log('Upload button clicked, setting modal to open');
                setUploadModalOpen(true);
              }}
              sx={{ height: 48 }}
            >
              Upload Media
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Video style={{ width: 16, height: 16 }} />}
              onClick={() => setCreateVideoModalOpen(true)}
              sx={{ height: 48 }}
            >
              Create Video
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<FileText style={{ width: 16, height: 16 }} />}
              onClick={() => setUseTemplateModalOpen(true)}
              sx={{ height: 48 }}
            >
              Use Template
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Calendar style={{ width: 16, height: 16 }} />}
              onClick={() => setBulkScheduleModalOpen(true)}
              sx={{ height: 48 }}
            >
              Bulk Schedule
          </Button>
          </Box>
        </Box>

        {/* Navigation Tabs - Now visible on mobile */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'block'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: { xs: 1, md: 3 },
              pt: 2,
              flexShrink: 0,
              '& .MuiTabs-flexContainer': {
                flexWrap: 'nowrap',
                gap: { xs: 0.5, md: 1 }
              },
              '& .MuiTab-root': {
                minWidth: 'auto',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 },
                py: 1,
                whiteSpace: 'nowrap'
              }
            }}
          >
            <Tab label="Calendar" />
            <Tab label="Content" />
            <Tab label="AI Tools" />
            <Tab label="Publishing" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Modals */}
        {/* Modals */}
        <UploadMediaModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUploadComplete={handleUploadComplete}
        />

        {/* Original Modals - Commented out for testing */}
        {/*
        <UploadMediaModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUploadComplete={handleUploadComplete}
        />
        */}

        {/* Create Video Modal */}
        <MuiDialog
          open={createVideoModalOpen}
          onClose={() => setCreateVideoModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <MuiDialogTitle>Create Video</MuiDialogTitle>
          <MuiDialogContent>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Create New Video Content
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Use AI-powered tools to create engaging video content for your audience.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Video />}
                  fullWidth
                  onClick={() => {
                    toast.info('Video creation feature coming soon!');
                    setCreateVideoModalOpen(false);
                  }}
                >
                  AI Video Generator
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Image />}
                  fullWidth
                  onClick={() => {
                    toast.info('Image to video feature coming soon!');
                    setCreateVideoModalOpen(false);
                  }}
                >
                  Image to Video
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileText />}
                  fullWidth
                  onClick={() => {
                    toast.info('Text to video feature coming soon!');
                    setCreateVideoModalOpen(false);
                  }}
                >
                  Text to Video
                </Button>
              </Box>
            </Box>
          </MuiDialogContent>
          <DialogActions>
            <MuiButton onClick={() => setCreateVideoModalOpen(false)} variant="outline">
              Cancel
            </MuiButton>
          </DialogActions>
        </MuiDialog>

        {/* Test Use Template Modal */}
        <MuiDialog
          open={useTemplateModalOpen}
          onClose={() => setUseTemplateModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <MuiDialogTitle>Test Use Template Modal</MuiDialogTitle>
          <MuiDialogContent>
            <Typography>
              This is a test modal for using templates.
            </Typography>
          </MuiDialogContent>
          <DialogActions>
            <MuiButton onClick={() => setUseTemplateModalOpen(false)} variant="outline">
              Close
            </MuiButton>
          </DialogActions>
        </MuiDialog>

        {/* Test Bulk Schedule Modal */}
        <MuiDialog
          open={bulkScheduleModalOpen}
          onClose={() => setBulkScheduleModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <MuiDialogTitle>Test Bulk Schedule Modal</MuiDialogTitle>
          <MuiDialogContent>
            <Typography>
              This is a test modal for bulk scheduling.
            </Typography>
          </MuiDialogContent>
          <DialogActions>
            <MuiButton onClick={() => setBulkScheduleModalOpen(false)} variant="outline">
              Close
            </MuiButton>
          </DialogActions>
        </MuiDialog>

        {/* Original Modals - Commented out for testing */}
        {/*
        <CreateVideoModal
          open={createVideoModalOpen}
          onClose={() => setCreateVideoModalOpen(false)}
          onVideoCreated={handleVideoCreated}
        />

        <UseTemplateModal
          open={useTemplateModalOpen}
          onClose={() => setUseTemplateModalOpen(false)}
          onTemplateUsed={handleTemplateUsed}
        />

        <BulkScheduleModal
          open={bulkScheduleModalOpen}
          onClose={() => setBulkScheduleModalOpen(false)}
          onBulkScheduled={handleBulkScheduled}
        />
        */}

        <MuiDialog
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <MuiDialogTitle>Edit Post</MuiDialogTitle>
          <MuiDialogContent>
            {selectedPost && (
              <EditPostForm
                post={selectedPost}
                onSave={handleEditSave}
                onCancel={() => setEditModalOpen(false)}
              />
            )}
          </MuiDialogContent>
        </MuiDialog>

        {/* Delete Confirmation Dialog */}
        <MuiDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <MuiDialogTitle>Delete Post</MuiDialogTitle>
          <MuiDialogContent>
            <Typography>
              Are you sure you want to delete this post? This action cannot be undone.
            </Typography>
          </MuiDialogContent>
          <DialogActions>
            <MuiButton onClick={() => setDeleteDialogOpen(false)} variant="outline">
              Cancel
            </MuiButton>
            <MuiButton onClick={handleDeleteConfirm} variant="default" color="error">
              Delete
            </MuiButton>
          </DialogActions>
        </MuiDialog>

        {/* AI Onboarding */}
        {isClient && !hasAiKey && (
          <AIOnboarding />
        )}

        {/* Bottom Spacer to Clear Bottom Navigation */}
        <Box sx={{
          height: { xs: '120px', sm: '40px' },
          width: '100%'
        }} />
      </Box>
    </Box>
  );
} 