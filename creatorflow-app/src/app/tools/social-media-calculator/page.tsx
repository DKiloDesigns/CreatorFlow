/**
 * Social Media Calculator Page
 * Free tool for calculating social media ROI
 */

import React from 'react';
import { Metadata } from 'next';
import SocialMediaCalculator from '@/components/tools/social-media-calculator';

export const metadata: Metadata = {
  title: 'Social Media ROI Calculator - CreatorFlow',
  description: 'Calculate your social media ROI and discover the true value of your social media presence',
  keywords: 'social media calculator, ROI calculator, social media value, engagement calculator',
};

export default function SocialMediaCalculatorPage() {
  return <SocialMediaCalculator />;
}
