import { Metadata } from 'next';
import ContentCalendarOptimizer from '@/components/tools/content-calendar-optimizer';

export const metadata: Metadata = {
  title: 'Content Calendar Optimizer | CreatorFlow Tools',
  description: 'AI-powered scheduling for maximum engagement. Optimize your content calendar with intelligent timing, audience analysis, and performance predictions.',
};

export default function CalendarOptimizerPage() {
  return <ContentCalendarOptimizer />;
}
