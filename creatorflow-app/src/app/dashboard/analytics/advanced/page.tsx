/**
 * Advanced Analytics Dashboard Page
 * Main page for advanced analytics and performance tracking
 */

import React from 'react';
import { Metadata } from 'next';
import AdvancedAnalyticsDashboard from '@/components/analytics/advanced-analytics-dashboard';

export const metadata: Metadata = {
  title: 'Advanced Analytics - CreatorFlow',
  description: 'Comprehensive performance tracking and insights for your social media content.',
  keywords: 'analytics, performance tracking, insights, metrics, social media analytics',
};

export default function AdvancedAnalyticsPage() {
  return <AdvancedAnalyticsDashboard />;
}
