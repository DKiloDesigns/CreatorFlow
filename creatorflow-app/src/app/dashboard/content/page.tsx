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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Draft Posts</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{overview.drafts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Scheduled</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{overview.scheduled}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Image className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">Media Files</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{uploadedMedia.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Content Calendar</h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Visualize your content schedule across all platforms.
          </p>
        </div>
        <div className="p-4 sm:p-6">
          <ContentCalendar />
        </div>
      </div>

      {/* Content Table/Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
            <button disabled={page * pageSize >= total} onClick={() => setPage(page + 1)} className="ml-2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <ContentTable
            posts={posts}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </div>
      </div>

      {/* AI Analytics Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">AI Analytics Summary</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            AI-powered insights about your content performance and recommendations.
          </p>
        </div>
        <div className="p-4 sm:p-6">
          {aiInsightsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generating AI insights...</p>
            </div>
          ) : aiInsights ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Performance Overview */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">Performance Overview</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg. Engagement:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{aiInsights.avgEngagement || '8.2%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Best Time:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{aiInsights.bestTime || '2-4 PM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Top Platform:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{aiInsights.topPlatform || 'Instagram'}</span>
                  </div>
                </div>
              </div>

              {/* Content Recommendations */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">Content Recommendations</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {aiInsights.recommendations ? (
                    aiInsights.recommendations.slice(0, 3).map((rec: any, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600 dark:text-gray-400">{rec}</span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>• Post more video content</div>
                      <div>• Use trending hashtags</div>
                      <div>• Engage with followers</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audience Insights */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">Audience Insights</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Peak Activity:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{aiInsights.peakActivity || 'Weekends'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Content Type:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{aiInsights.contentType || 'Video'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Growth Rate:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{aiInsights.growthRate || '+12%'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No AI insights available yet. Create some content to get started!</p>
            </div>
          )}
        </div>
      </div>

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