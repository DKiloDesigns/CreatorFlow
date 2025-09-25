import { Metadata } from 'next';
import CompetitiveIntelligence from '@/components/tools/competitive-intelligence';

export const metadata: Metadata = {
  title: 'Competitive Intelligence | CreatorFlow Pro',
  description: 'Track competitors and analyze market positioning. Get insights on competitor strategies, market trends, and opportunities to stay ahead of the competition.',
};

export default function CompetitiveIntelligencePage() {
  return <CompetitiveIntelligence />;
}
