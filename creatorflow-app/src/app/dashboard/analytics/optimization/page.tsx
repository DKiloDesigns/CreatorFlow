/**
 * Performance Optimization Dashboard Page
 * Main page for AI-powered optimization and testing
 */

import React from 'react';
import { Metadata } from 'next';
import PerformanceOptimization from '@/components/analytics/performance-optimization';

export const metadata: Metadata = {
  title: 'Performance Optimization - CreatorFlow',
  description: 'AI-powered optimization recommendations and A/B testing for your content.',
  keywords: 'optimization, A/B testing, performance, AI recommendations, testing',
};

export default function PerformanceOptimizationPage() {
  return <PerformanceOptimization />;
}
