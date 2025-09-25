import { Metadata } from 'next';
import VoiceToneAnalyzer from '@/components/tools/voice-tone-analyzer';

export const metadata: Metadata = {
  title: 'Voice & Tone Analyzer | CreatorFlow Tools',
  description: 'Analyze your content\'s voice and tone to ensure it matches your brand personality. Get AI-powered suggestions to improve consistency and engagement.',
};

export default function VoiceToneAnalyzerPage() {
  return <VoiceToneAnalyzer />;
}
