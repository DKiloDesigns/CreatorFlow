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
import { UploadMediaModal } from '../content/_components/upload-media-modal';
import { MediaLibrary } from '../content/_components/media-library';
import { CreateVideoModal } from '../content/_components/create-video-modal';
import { UseTemplateModal } from '../content/_components/use-template-modal';
import { BulkScheduleModal } from '../content/_components/bulk-schedule-modal';
import PostComposer from '../content/_components/post-composer';
import ContentCalendar from '../content/_components/content-calendar';
import ContentTable from '../content/_components/content-table';
import EditPostForm from '../content/_components/edit-post-form';

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

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState(0);
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Sample data for demonstration
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      contentText: 'AI-powered content creation strategies for modern marketers',
      status: 'DRAFT',
      platforms: ['LinkedIn', 'Twitter'],
      createdAt: '2025-08-15T10:00:00Z'
    },
    {
      id: '2',
      contentText: 'How to optimize your social media presence in 2025',
      status: 'SCHEDULED',
      platforms: ['Instagram', 'LinkedIn'],
      scheduledAt: '2025-08-16T12:00:00Z',
      createdAt: '2025-08-15T11:00:00Z'
    },
    {
      id: '3',
      contentText: 'The future of content marketing: AI and automation',
      status: 'PUBLISHED',
      platforms: ['LinkedIn', 'Twitter', 'Facebook'],
      publishedAt: '2025-08-14T15:00:00Z',
      createdAt: '2025-08-14T14:00:00Z'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditModalOpen(true);
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast.success('Post deleted successfully');
  };

  const handleDuplicate = (post: Post) => {
    const newPost = {
      ...post,
      id: Date.now().toString(),
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    };
    setPosts([...posts, newPost]);
    toast.success('Post duplicated successfully');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Content Creation
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Quick Actions */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setUploadModalOpen(true)}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Upload size={48} style={{ margin: '0 auto 16px', color: '#3b82f6' }} />
                    <Typography variant="h6" gutterBottom>Upload Media</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload images, videos, and other media files
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setCreateVideoModalOpen(true)}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Video size={48} style={{ margin: '0 auto 16px', color: '#ef4444' }} />
                    <Typography variant="h6" gutterBottom>Create Video</Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI-powered video creation tools
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setUseTemplateModalOpen(true)}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <FileText size={48} style={{ margin: '0 auto 16px', color: '#10b981' }} />
                    <Typography variant="h6" gutterBottom>Use Template</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose from pre-designed templates
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setBulkScheduleModalOpen(true)}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Calendar size={48} style={{ margin: '0 auto 16px', color: '#f59e0b' }} />
                    <Typography variant="h6" gutterBottom>Bulk Schedule</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Schedule multiple posts at once
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* AI Content Tools */}
            <Card>
              <CardHeader 
                title="AI-Powered Content Tools" 
                avatar={<Brain size={24} style={{ color: '#8b5cf6' }} />}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <AIContentOptimizer />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <AutomatedPublisher />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      case 1: // Content Calendar
        return <ContentCalendar />;

      case 2: // Content Library
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Content Library</Typography>
              <Button
                variant="contained"
                startIcon={<Upload size={16} />}
                onClick={() => setMediaLibraryOpen(true)}
              >
                Upload New Media
              </Button>
            </Box>
            <MediaLibrary />
          </Box>
        );

      case 3: // Content Table
        return (
          <Box sx={{ pb: { xs: 16, sm: 8 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Content Management</Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setEditModalOpen(true)}
              >
                Create New Post
              </Button>
            </Box>
            <ContentTable
              posts={posts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              loading={loading}
              error={error}
            />
            
            {/* Dedicated spacer for Content Table to clear bottom navigation */}
            <Box sx={{
              height: { xs: '140px', sm: '60px' },
              width: '100%'
            }} />
          </Box>
        );

      default:
        return <Typography>Select a tab to get started</Typography>;
    }
  };

  if (!isClient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: { xs: 24, sm: 12 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Content Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Create, manage, and schedule your content across all platforms
            </Typography>
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Content Creation" />
              <Tab label="Content Calendar" />
              <Tab label="Content Library" />
              <Tab label="Content Table" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ mb: { xs: 16, sm: 12 } }}>
            {renderTabContent()}
          </Box>
        </Box>
      </Container>

      {/* Modals */}
      <UploadMediaModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <MediaLibrary open={mediaLibraryOpen} onClose={() => setMediaLibraryOpen(false)} />
      <CreateVideoModal open={createVideoModalOpen} onClose={() => setCreateVideoModalOpen(false)} />
      <UseTemplateModal open={useTemplateModalOpen} onClose={() => setUseTemplateModalOpen(false)} />
      <BulkScheduleModal open={bulkScheduleModalOpen} onClose={() => setBulkScheduleModalOpen(false)} />
      
      {editingPost && (
        <EditPostForm
          post={editingPost}
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingPost(null);
          }}
          onSave={(updatedPost) => {
            setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
            setEditModalOpen(false);
            setEditingPost(null);
            toast.success('Post updated successfully');
          }}
        />
      )}

      {/* Spacer to Clear Bottom Navigation */}
      <Box sx={{ 
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
}
