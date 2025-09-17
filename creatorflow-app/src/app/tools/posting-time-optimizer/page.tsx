/**
 * Posting Time Optimizer Page
 * Free tool for finding optimal posting times and engagement analysis
 */

import React from 'react';
import { Metadata } from 'next';
import PostingTimeOptimizer from '@/components/tools/posting-time-optimizer';

export const metadata: Metadata = {
  title: 'Posting Time Optimizer - CreatorFlow',
  description: 'Find the best times to post for maximum engagement and reach across all social media platforms',
  keywords: 'posting time optimizer, optimal posting times, social media timing, engagement optimization',
};

export default function PostingTimeOptimizerPage() {
  return <PostingTimeOptimizer />;
}
