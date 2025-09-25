import { Metadata } from 'next';
import HashtagPerformanceTracker from '@/components/tools/hashtag-performance-tracker';

export const metadata: Metadata = {
  title: 'Hashtag Performance Tracker | CreatorFlow Tools',
  description: 'Track which hashtags work best for your content. Analyze performance, discover trends, and optimize your hashtag strategy for maximum engagement.',
};

export default function HashtagTrackerPage() {
  return <HashtagPerformanceTracker />;
}
