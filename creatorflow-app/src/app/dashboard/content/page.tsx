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
  Alert
} from '@mui/material';
import { 
  Card,
  CardHeader,
  CardContent,
  Button as MuiButton,
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions
} from '@/components/ui/mui-components';
import { Plus, Calendar, FileText, Image, Video, Upload, Clock, Brain, TrendingUp, Lightbulb, Target } from 'lucide-react';
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
  title: string;
  content: string;
  status: string;
  platform: string;
  createdAt: string;
  scheduledAt?: string;
  publishedAt?: string;
}

export default function ContentPage() {
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
        title: `${post.title} (Copy)`,
        status: 'DRAFT',
        createdAt: new Date().toISOString()
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
        
        // Check AI key
        const checkAiKey = async () => {
          try {
            const response = await fetch('/api/ai/check-key');
            if (response.ok) {
              const data = await response.json();
              setHasAiKey(data.hasKey);
            }
          } catch (error) {
            console.error('Error checking AI key:', error);
            setHasAiKey(false);
          }
        };

        // Fetch AI insights
        const fetchAiInsights = async () => {
          if (!hasAiKey) return;
          
          try {
            setAiInsightsLoading(true);
            const response = await fetch('/api/ai/insights');
            if (response.ok) {
              const data = await response.json();
              setAiInsights(data.insights);
            }
          } catch (error) {
            console.error('Error fetching AI insights:', error);
          } finally {
            setAiInsightsLoading(false);
          }
        };

        // Fetch posts
        const fetchPosts = async () => {
          try {
            const response = await fetch(`/api/posts?page=${page}&pageSize=${pageSize}&status=${statusFilter}&platform=${platformFilter}&search=${search}`);
            if (response.ok) {
              const data = await response.json();
              setPosts(data.posts);
              setTotal(data.total);
              setOverview(data.overview);
            }
          } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load posts');
          }
        };

        await Promise.all([
          checkAiKey(),
          fetchPosts()
        ]);

        // Fetch AI insights after posts are loaded
        await fetchAiInsights();
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, pageSize, statusFilter, platformFilter, search, hasAiKey]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 400 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: { sm: 'center' }, 
        justifyContent: 'space-between', 
        gap: 2 
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
        </Box>
      </Box>

      {/* Overview Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        <Box>
          <Card>
            <CardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Drafts
              </Typography>
              <FileText style={{ width: 16, height: 16, color: 'text.secondary' }} />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {overview.drafts}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Scheduled
              </Typography>
              <Clock style={{ width: 16, height: 16, color: 'text.secondary' }} />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {overview.scheduled}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Published
              </Typography>
              <TrendingUp style={{ width: 16, height: 16, color: 'text.secondary' }} />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {overview.published}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardHeader
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 1
              }}
            >
              <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                AI Insights
              </Typography>
              <Brain style={{ width: 16, height: 16, color: 'text.secondary' }} />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {aiInsights?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <Typography variant="h6">Quick Actions</Typography>
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

      {/* Content Table */}
      <ContentTable 
        posts={posts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        loading={loading}
      />

      {/* Modals */}
      <UploadMediaModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        isUploading={isUploading}
      />

      <CreateVideoModal
        open={createVideoModalOpen}
        onClose={() => setCreateVideoModalOpen(false)}
        onVideoCreated={handleVideoCreated}
        isCreating={isCreatingVideo}
      />

      <UseTemplateModal
        open={useTemplateModalOpen}
        onClose={() => setUseTemplateModalOpen(false)}
        onTemplateUsed={handleTemplateUsed}
        isUsing={isUsingTemplate}
      />

      <BulkScheduleModal
        open={bulkScheduleModalOpen}
        onClose={() => setBulkScheduleModalOpen(false)}
        onBulkScheduled={handleBulkScheduled}
        isScheduling={isBulkScheduling}
      />

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
            Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
          </Typography>
        </MuiDialogContent>
        <MuiDialogActions>
          <MuiButton onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </MuiButton>
          <MuiButton onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </MuiButton>
        </MuiDialogActions>
      </MuiDialog>

      {/* AI Onboarding */}
      {isClient && !hasAiKey && (
        <AIOnboarding />
      )}
    </Box>
  );
} 