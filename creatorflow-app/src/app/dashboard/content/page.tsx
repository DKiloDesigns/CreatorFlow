import { redirect } from 'next/navigation';
import { getSession } from "@/auth"
import React from 'react';
import { Heading } from '@/components/ui/heading';
import { EnhancedComposer } from '@/components/dashboard/enhanced-composer';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, FileText, Image, Video } from 'lucide-react';

// Placeholder components (we'll create these next)
import PostComposer from './_components/post-composer';
import ContentCalendar from './_components/content-calendar';

export default async function ContentPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Dashboard</h1>
          <p className="text-muted-foreground">
            Plan, create, and schedule your social media content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Enhanced Content Composer */}
      <EnhancedComposer 
        onSubmit={(content, platforms) => {
          console.log('Content submitted:', content, platforms);
          // Handle content submission
        }}
      />

      {/* Content Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Draft Posts</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Image className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Published</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Calendar */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Content Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Visualize your content schedule across all platforms.
          </p>
        </div>
        <div className="p-6">
          <ContentCalendar />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
          <Image className="h-6 w-6" />
          <span>Upload Media</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
          <Video className="h-6 w-6" />
          <span>Create Video</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
          <FileText className="h-6 w-6" />
          <span>Use Template</span>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
          <Calendar className="h-6 w-6" />
          <span>Bulk Schedule</span>
        </Button>
      </div>

      {/* Empty State for no content */}
      <EmptyState
        title="No content yet"
        description="Start creating your first post to get your social media presence going."
        action={{
          label: "Create Post",
          onClick: () => {
            // Focus on the composer
            document.querySelector('textarea')?.focus();
          }
        }}
      />
    </div>
  );
} 