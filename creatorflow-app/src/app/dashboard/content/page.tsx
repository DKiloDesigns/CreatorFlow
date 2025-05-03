import React from 'react';
import { Heading } from '@/components/ui/heading'; // Assuming Heading component exists

// Placeholder components (we'll create these next)
import PostComposer from './_components/post-composer';
import ContentCalendar from './_components/content-calendar';

export default function ContentPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Heading title="Content Scheduling" description="Plan, create, and schedule your social media content." />
      <div className="space-y-6">
        {/* TODO: Add PostComposer component here */}
        {/* <p className="text-muted-foreground">[Post Composer Placeholder]</p> */}
        <PostComposer />

        {/* TODO: Add ContentCalendar component here */}
        {/* <p className="text-muted-foreground">[Content Calendar Placeholder]</p> */}
        <ContentCalendar />

        {/* TODO: Add Template Manager link/button later */}
        {/* TODO: Add Post Detail Modal trigger later */}
      </div>
    </div>
  );
} 