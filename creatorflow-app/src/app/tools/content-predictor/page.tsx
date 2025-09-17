/**
 * Content Performance Predictor Page
 * Free tool for predicting content performance and engagement
 */

import React from 'react';
import { Metadata } from 'next';
import ContentPerformancePredictor from '@/components/tools/content-performance-predictor';

export const metadata: Metadata = {
  title: 'Content Performance Predictor - CreatorFlow',
  description: 'Predict how your content will perform before you post with AI-powered engagement predictions',
  keywords: 'content performance predictor, engagement prediction, content optimization, social media analytics',
};

export default function ContentPredictorPage() {
  return <ContentPerformancePredictor />;
}
