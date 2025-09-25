import { Metadata } from 'next';
import MonetizationOptimizer from '@/components/tools/monetization-optimizer';

export const metadata: Metadata = {
  title: 'Monetization Optimizer | CreatorFlow Pro',
  description: 'Maximize your revenue potential with AI-powered monetization strategies. Track performance, identify opportunities, and optimize your income streams.',
};

export default function MonetizationOptimizerPage() {
  return <MonetizationOptimizer />;
}
