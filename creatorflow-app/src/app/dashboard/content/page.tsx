'use client';

export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getSession } from "@/auth"
import React, { useState, useEffect } from 'react';
import { Heading } from '@/components/ui/heading';
import { EnhancedComposer } from '@/components/dashboard/enhanced-composer';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, FileText, Image, Video, Upload, Clock, Brain, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import dynamicImport from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  loading: () => <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">Loading AI setup...</div>
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);
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
    setUploadModalOpen(true);
  };

  const handleUploadComplete = (files: any[]) => {
    // Convert uploaded files to MediaItem format
    const newMediaItems: MediaItem[] = files.map(file => ({
      id: file.id,
      name: file.name,
      url: file.uploadedUrl || file.preview,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      tags: file.tags,
      description: file.description,
      thumbnail: file.preview
    }));
    
    setUploadedMedia(prev => [...prev, ...newMediaItems]);
    toast.success(`Successfully uploaded ${files.length} files`);
  };

  const handleMediaSelect = (media: MediaItem) => {
    toast.success(`Selected: ${media.name}`);
    // Here you would typically add the media to a post or content
  };

  const handleCreateVideo = async () => {
    setCreateVideoModalOpen(true);
  };

  const handleVideoCreated = (videoData: any) => {
    toast.success(`Video "${videoData.title}" created successfully!`);
    // Here you would typically save the video data or add it to a list
    console.log('Video created:', videoData);
  };

  const handleUseTemplate = async () => {
    setUseTemplateModalOpen(true);
  };

  const handleTemplateUsed = (templateData: any) => {
    toast.success(`Template "${templateData.template.name}" applied successfully!`);
    // Here you would typically create content based on the template
    console.log('Template used:', templateData);
  };

  const handleBulkSchedule = async () => {
    setBulkScheduleModalOpen(true);
  };

  const handleBulkScheduled = (scheduleData: any) => {
    toast.success(`Successfully scheduled ${scheduleData.totalPosts} posts across ${scheduleData.platforms.length} platforms!`);
    // Here you would typically save the schedule data
    console.log('Bulk schedule data:', scheduleData);
  };

  // Action handlers
  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedData: any) => {
    if (!selectedPost) return;
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        toast.success('Post updated successfully');
        setEditModalOpen(false);
        setSelectedPost(null);
        // Refresh posts
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update post');
      }
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const handleDelete = (post: any) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      const response = await fetch(`/api/posts/${postToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Post deleted successfully');
        setDeleteDialogOpen(false);
        setPostToDelete(null);
        // Refresh posts
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete post');
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleDuplicate = async (post: any) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'POST'
      });

      if (response.ok) {
        const duplicatedPost = await response.json();
        toast.success('Post duplicated successfully');
        // Refresh posts
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to duplicate post');
      }
    } catch (error) {
      toast.error('Failed to duplicate post');
    }
  };

  // Check if user has AI key
  useEffect(() => {
    const checkAiKey = async () => {
      try {
        const response = await fetch('/api/ai/check-key');
        if (response.ok) {
          const data = await response.json();
          setHasAiKey(data.hasKey);
        }
      } catch (error) {
        console.error('Failed to check AI key:', error);
      }
    };

    checkAiKey();
  }, []);

  // Fetch posts and overview counts
  useEffect(() => {
    setLoading(true);
    let url = `/api/posts?status=${statusFilter}&platform=${platformFilter}&search=${encodeURIComponent(search)}&page=${page}&pageSize=${pageSize}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
    // Fetch overview counts
    fetch('/api/posts/overview')
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(() => {});
  }, [statusFilter, platformFilter, search, page, pageSize]);

  // Fetch AI insights
  useEffect(() => {
    const fetchAiInsights = async () => {
      setAiInsightsLoading(true);
      try {
        const response = await fetch('/api/ai/analytics-summary');
        if (response.ok) {
          const data = await response.json();
          setAiInsights(data);
        }
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
      } finally {
        setAiInsightsLoading(false);
      }
    };

    fetchAiInsights();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Content Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Plan, create, and schedule your social media content.
          </p>
        </div>
        
        {/* Quick Actions - Moved to composer */}
      </div>

      {/* AI Onboarding Reminder */}
      {!hasAiKey && isClient && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <AIOnboarding 
            className="max-w-none"
          />
        </div>
      )}

      {/* Enhanced Content Composer */}
      <EnhancedComposer />

      {/* Content Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Draft Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{overview.drafts}</div>
            <p className="text-xs text-muted-foreground">
              Ready to publish
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{overview.scheduled}</div>
            <p className="text-xs text-muted-foreground">
              Waiting to publish
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Media Files</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{uploadedMedia.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for use
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Calendar */}
      <div>
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Content Calendar</h2>
          <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
            Visualize your content schedule across all platforms.
          </p>
        </div>
        <ContentCalendar />
      </div>

      {/* Content Table/Grid */}
      <div>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHING">Publishing</option>
              <option value="PUBLISHED">Published</option>
              <option value="FAILED">Failed</option>
            </select>
            <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option value="ALL">All Platforms</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search content..."
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Page {page} of {Math.ceil(total / pageSize) || 1}</span>
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
            <button disabled={page * pageSize >= total} onClick={() => setPage(page + 1)} className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
        <ContentTable
          posts={posts}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      </div>

      {/* AI Analytics Summary */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-foreground">AI Analytics Summary</CardTitle>
          <p className="text-xs sm:text-sm text-foreground">
            AI-powered insights about your content performance and recommendations.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Engagement Rate</h4>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">4.2%</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">+0.8% from last week</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100">Reach</h4>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">12.5K</p>
                <p className="text-sm text-green-700 dark:text-green-300">+2.1K from last week</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Best Time</h4>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">2-4 PM</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">Based on your audience</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Media Modal */}
      {isClient && (
        <UploadMediaModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Media Library Modal */}
      {isClient && (
        <Dialog open={mediaLibraryOpen} onOpenChange={setMediaLibraryOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Media Library</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[70vh]">
              <MediaLibrary
                onSelect={handleMediaSelect}
                selectedMedia={[]}
                multiple={false}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Video Modal */}
      {isClient && (
        <CreateVideoModal
          open={createVideoModalOpen}
          onOpenChange={setCreateVideoModalOpen}
          onVideoCreated={handleVideoCreated}
        />
      )}

      {/* Use Template Modal */}
      {isClient && (
        <UseTemplateModal
          open={useTemplateModalOpen}
          onOpenChange={setUseTemplateModalOpen}
          onTemplateUsed={handleTemplateUsed}
        />
      )}

      {/* Bulk Schedule Modal */}
      {isClient && (
        <BulkScheduleModal
          open={bulkScheduleModalOpen}
          onOpenChange={setBulkScheduleModalOpen}
          onBulkScheduled={handleBulkScheduled}
        />
      )}

      {/* Edit Post Modal */}
      {isClient && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <EditPostForm
                post={selectedPost}
                onSave={handleEditSave}
                onCancel={() => {
                  setEditModalOpen(false);
                  setSelectedPost(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {isClient && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
} 