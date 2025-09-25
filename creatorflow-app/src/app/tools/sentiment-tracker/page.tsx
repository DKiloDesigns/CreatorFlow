import { Metadata } from 'next';
import AudienceSentimentTracker from '@/components/tools/audience-sentiment-tracker';

export const metadata: Metadata = {
  title: 'Audience Sentiment Tracker | CreatorFlow Pro',
  description: 'Monitor audience emotions and brand sentiment across all platforms. Get real-time insights, crisis alerts, and emotional analysis of your content.',
};

export default function SentimentTrackerPage() {
  return <AudienceSentimentTracker />;
}
