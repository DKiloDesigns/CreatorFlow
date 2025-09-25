/**
 * Creator Tier Tools Landing Page
 * Showcase all Creator tier ($19/month) CreatorFlow tools
 */

import React from 'react';
import { Metadata } from 'next';
import MobileToolsPage from '@/components/mobile/mobile-tools-page';
import { 
  Psychology as PsychologyIcon, 
  AutoAwesome as AutoAwesomeIcon, 
  Refresh as RefreshIcon, 
  TrackChanges as TrackChangesIcon,
  Schedule as ScheduleIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

export const metadata: Metadata = {
  title: 'Creator Tier Tools - CreatorFlow',
  description: 'Advanced AI-powered tools for content creators. Unlock unlimited features and grow your audience faster.',
  keywords: 'creator tools, AI content creation, voice analysis, content repurposing, hashtag tracking',
};

const creatorTools = [
  {
    title: 'Voice & Tone Analyzer',
    description: 'Analyze your content\'s voice and tone to ensure brand consistency',
    icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
    href: '/tools/voice-tone-analyzer',
    features: [
      'Advanced brand voice matching',
      'Tone consistency analysis',
      'AI-powered suggestions',
      'Multi-platform optimization',
      'Custom voice profiles'
    ],
    color: 'primary',
    comingSoon: false,
    tier: 'creator',
    price: '$19/month'
  },
  {
    title: 'AI Content Creation Suite',
    description: 'Complete AI-powered content generation and optimization',
    icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
    href: '/tools/ai-content-creation',
    features: [
      'AI caption generation',
      'Platform-specific optimization',
      'Brand voice integration',
      'Content variations',
      'Performance predictions'
    ],
    color: 'secondary',
    comingSoon: false,
    tier: 'creator',
    price: '$19/month'
  },
  {
    title: 'Content Repurposing Engine',
    description: 'Automatically create platform-specific versions of your content',
    icon: <RefreshIcon sx={{ fontSize: 40 }} />,
    href: '/tools/content-repurposing',
    features: [
      'Auto-create platform versions',
      'Format optimization',
      'Length adjustments',
      'Hashtag adaptation',
      'Bulk processing'
    ],
    color: 'success',
    comingSoon: false,
    tier: 'creator',
    price: '$19/month'
  },
  {
    title: 'Hashtag Performance Tracker',
    description: 'Track which hashtags work best for your content',
    icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
    href: '/tools/hashtag-tracker',
    features: [
      'Performance analytics',
      'Trend tracking',
      'ROI measurement',
      'Competitor analysis',
      'Optimization suggestions'
    ],
    color: 'warning',
    comingSoon: false,
    tier: 'creator',
    price: '$19/month'
  },
  {
    title: 'Content Calendar Optimizer',
    description: 'AI-powered scheduling for maximum engagement',
    icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
    href: '/tools/calendar-optimizer',
    features: [
      'Optimal timing analysis',
      'Content mix optimization',
      'Engagement predictions',
      'Automated scheduling',
      'Performance tracking'
    ],
    color: 'info',
    comingSoon: false,
    tier: 'creator',
    price: '$19/month'
  },
  {
    title: 'Brand Voice Builder',
    description: 'Create and refine your unique brand voice profile',
    icon: <PaletteIcon sx={{ fontSize: 40 }} />,
    href: '/tools/brand-voice-builder',
    features: [
      'Voice profile creation',
      'Tone analysis',
      'Consistency tracking',
      'Brand guidelines',
      'Team collaboration'
    ],
    color: 'error',
    comingSoon: true,
    tier: 'creator',
    price: '$19/month'
  }
];

export default function CreatorToolsPage() {
  return <MobileToolsPage tools={creatorTools} title="Creator Tier Tools" subtitle="Advanced AI-powered tools for content creators" />;
}
