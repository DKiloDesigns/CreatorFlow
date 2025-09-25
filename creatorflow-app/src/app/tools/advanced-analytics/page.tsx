import { Metadata } from 'next';
import AdvancedAnalyticsDashboard from '@/components/tools/advanced-analytics-dashboard';

export const metadata: Metadata = {
  title: 'Advanced Analytics Dashboard | CreatorFlow Pro',
  description: 'Comprehensive cross-platform analytics with AI-powered insights. Track performance, understand your audience, and optimize your content strategy.',
};

export default function AdvancedAnalyticsPage() {
  return <AdvancedAnalyticsDashboard />;
}
