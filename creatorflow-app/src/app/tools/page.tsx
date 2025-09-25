/**
 * Free Tools Landing Page
 * Showcase all free CreatorFlow tools with mobile optimization
 */

import React from 'react';
import { Metadata } from 'next';
import MobileToolsPage from '@/components/mobile/mobile-tools-page';
import { 
  Calculate as CalculateIcon, 
  Tag as TagIcon, 
  Schedule as ScheduleIcon, 
  Assessment as AssessmentIcon, 
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

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
    title: 'Brand Partnership Finder',
    description: 'Discover brand partnership opportunities that match your audience',
    icon: <BusinessIcon sx={{ fontSize: 40 }} />,
    href: '/tools/brand-partnership-finder',
    features: [
      'Partnership opportunity discovery',
      'Brand matching algorithm',
      'Compensation insights',
      'Requirements analysis',
      'Free basic opportunities'
    ],
    color: 'error',
    comingSoon: false
  },
  {
    title: 'Content Ideas Generator',
    description: 'Get unlimited content ideas tailored to your audience and platform',
    icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
    href: '/tools/content-ideas-generator',
    features: [
      'AI-powered content suggestions',
      'Platform-specific ideas',
      'Trending topic integration',
      'Difficulty level filtering',
      'Pro tips and optimization'
    ],
    color: 'primary',
    comingSoon: false
  }
];

export default function ToolsPage() {
  return <MobileToolsPage tools={tools} title="Free Social Media Tools" subtitle="Powerful tools to optimize your social media strategy and grow your audience" />;
}
