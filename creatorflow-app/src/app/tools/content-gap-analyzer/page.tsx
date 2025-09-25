import { Metadata } from 'next';
import ContentGapAnalyzer from '@/components/tools/content-gap-analyzer';

export const metadata: Metadata = {
  title: 'Content Gap Analyzer | CreatorFlow Pro',
  description: 'Identify content opportunities and analyze competitors. Discover gaps in your content strategy and find new ways to engage your audience.',
};

export default function ContentGapAnalyzerPage() {
  return <ContentGapAnalyzer />;
}
