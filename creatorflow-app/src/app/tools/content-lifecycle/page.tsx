import { Metadata } from 'next';
import ContentLifecycleAnalyzer from '@/components/tools/content-lifecycle-analyzer';

export const metadata: Metadata = {
  title: 'Content Lifecycle Analyzer | CreatorFlow Pro',
  description: 'Long-term content performance tracking and optimization. Analyze content lifecycles, identify evergreen opportunities, and maximize content value over time.',
};

export default function ContentLifecyclePage() {
  return <ContentLifecycleAnalyzer />;
}
