/**
 * Free Tools Landing Page
 * Showcase all free CreatorFlow tools with mobile optimization
 */

import React from 'react';
import { Metadata } from 'next';
import MobileToolsPage from '@/components/mobile/mobile-tools-page';
import { Calculate as CalculateIcon, Tag as TagIcon, Schedule as ScheduleIcon, Assessment as AssessmentIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

export const metadata: Metadata = {
  title: 'Free Social Media Tools - CreatorFlow',
  description: 'Powerful free tools to optimize your social media strategy and grow your audience',
  keywords: 'free social media tools, social media calculator, hashtag research, content optimization',
};

const tools = [
  {
    title: 'Social Media ROI Calculator',
    description: 'Calculate the true value of your social media presence and discover your ROI',
    icon: <CalculateIcon sx={{ fontSize: 40 }} />,
    href: '/tools/social-media-calculator',
    features: [
      'Calculate annual social media value',
      'Time investment analysis',
      'Engagement value calculation',
      'ROI percentage breakdown',
      'Personalized recommendations'
    ],
    color: 'primary',
    comingSoon: false
  },
  {
    title: 'Hashtag Research Tool',
    description: 'Discover trending hashtags and optimize your content reach',
    icon: <TagIcon sx={{ fontSize: 40 }} />,
    href: '/tools/hashtag-research',
    features: [
      'AI-powered hashtag suggestions',
      'Trending hashtag analysis',
      'Platform-specific recommendations',
      'Difficulty and popularity metrics',
      'One-click hashtag copying'
    ],
    color: 'secondary',
    comingSoon: false
  },
  {
    title: 'Content Calendar Templates',
    description: 'Download professional content calendar templates for your industry',
    icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
    href: '/tools/calendar-templates',
    features: [
      'Industry-specific templates',
      'Multiple format options',
      'Customizable layouts',
      'Best practices included',
      'Free downloads'
    ],
    color: 'success',
    comingSoon: false
  },
  {
    title: 'Social Media Audit Tool',
    description: 'Get a comprehensive analysis of your social media strategy',
    icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
    href: '/tools/social-media-audit',
    features: [
      'Strategy assessment',
      'Performance analysis',
      'Improvement recommendations',
      'PDF report generation',
      'Actionable insights'
    ],
    color: 'warning',
    comingSoon: false
  },
  {
    title: 'Posting Time Optimizer',
    description: 'Find the best times to post for maximum engagement',
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    href: '/tools/posting-time-optimizer',
    features: [
      'Optimal timing analysis',
      'Platform-specific recommendations',
      'Timezone handling',
      'Engagement predictions',
      'Schedule optimization'
    ],
    color: 'info',
    comingSoon: false
  },
  {
    title: 'Content Performance Predictor',
    description: 'Predict how your content will perform before you post',
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    href: '/tools/content-predictor',
    features: [
      'Engagement predictions',
      'Best platform suggestions',
      'Content optimization tips',
      'Performance scoring',
      'AI-powered insights'
    ],
    color: 'error',
    comingSoon: false
  }
];

export default function ToolsPage() {
  return <MobileToolsPage />;
}
