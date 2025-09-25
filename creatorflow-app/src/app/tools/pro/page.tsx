/**
 * Pro Tier Tools Landing Page
 * Showcase all Pro tier ($49/month) CreatorFlow tools
 */

import React from 'react';
import { Metadata } from 'next';
import MobileToolsPage from '@/components/mobile/mobile-tools-page';
import { 
  Analytics as AnalyticsIcon, 
  TrendingUp as TrendingUpIcon, 
  Search as SearchIcon, 
  Psychology as PsychologyIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Calculate as CalculateIcon,
  TrackChanges as TrackChangesIcon,
  Timeline as TimelineIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';

export const metadata: Metadata = {
  title: 'Pro Tier Tools - CreatorFlow',
  description: 'Advanced AI-powered tools for professional content creators. Unlock enterprise-level features and grow your business faster.',
  keywords: 'pro tools, advanced analytics, trend prediction, content analysis, monetization, creator tools',
};

const proTools = [
  {
    title: 'Advanced Analytics Dashboard',
    description: 'Comprehensive cross-platform analytics with AI-powered insights',
    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
    href: '/tools/advanced-analytics',
    features: [
      'Cross-platform performance tracking',
      'AI-powered insights and recommendations',
      'Advanced audience demographics',
      'Revenue and ROI analysis',
      'Custom reporting and exports'
    ],
    color: 'primary',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Trend Prediction Tool',
    description: 'AI-powered trend forecasting and analysis for content strategy',
    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    href: '/tools/trend-prediction',
    features: [
      'AI trend forecasting',
      'Content opportunity identification',
      'Viral content prediction',
      'Market analysis',
      'Strategic recommendations'
    ],
    color: 'secondary',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Content Gap Analyzer',
    description: 'Competitor analysis and content opportunity identification',
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
    href: '/tools/content-gap-analyzer',
    features: [
      'Competitor content analysis',
      'Gap identification',
      'Opportunity scoring',
      'Content recommendations',
      'Market positioning insights'
    ],
    color: 'success',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Audience Sentiment Tracker',
    description: 'Emotional analysis and brand monitoring across platforms',
    icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
    href: '/tools/sentiment-tracker',
    features: [
      'Emotional analysis',
      'Brand sentiment monitoring',
      'Crisis detection',
      'Mood tracking',
      'Engagement optimization'
    ],
    color: 'warning',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Monetization Optimizer',
    description: 'Revenue strategy recommendations and tracking',
    icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
    href: '/tools/monetization-optimizer',
    features: [
      'Revenue strategy recommendations',
      'Monetization tracking',
      'Pricing optimization',
      'Revenue forecasting',
      'Profit analysis'
    ],
    color: 'info',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Creator Network Builder',
    description: 'Find collaboration partners and build your creator network',
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    href: '/tools/creator-network',
    features: [
      'Creator discovery',
      'Collaboration matching',
      'Network analysis',
      'Partnership opportunities',
      'Community building'
    ],
    color: 'error',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Brand Partnership Matcher',
    description: 'Connect with brands and find sponsorship opportunities',
    icon: <BusinessIcon sx={{ fontSize: 40 }} />,
    href: '/tools/brand-partnerships',
    features: [
      'Brand discovery',
      'Partnership matching',
      'Deal negotiation',
      'Contract management',
      'Revenue tracking'
    ],
    color: 'primary',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Advanced ROI Calculator',
    description: 'Detailed financial projections and business analysis',
    icon: <CalculateIcon sx={{ fontSize: 40 }} />,
    href: '/tools/advanced-roi',
    features: [
      'Financial projections',
      'ROI analysis',
      'Cost-benefit analysis',
      'Investment tracking',
      'Profit optimization'
    ],
    color: 'secondary',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Competitive Intelligence',
    description: 'Track competitors and analyze market positioning',
    icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
    href: '/tools/competitive-intelligence',
    features: [
      'Competitor tracking',
      'Market analysis',
      'Positioning insights',
      'Strategy recommendations',
      'Performance benchmarking'
    ],
    color: 'success',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  },
  {
    title: 'Content Lifecycle Analyzer',
    description: 'Long-term content performance tracking and optimization',
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    href: '/tools/content-lifecycle',
    features: [
      'Long-term performance tracking',
      'Content aging analysis',
      'Repurposing opportunities',
      'Lifecycle optimization',
      'Evergreen content identification'
    ],
    color: 'warning',
    comingSoon: false,
    tier: 'pro',
    price: '$49/month'
  }
];

export default function ProToolsPage() {
  return <MobileToolsPage tools={proTools} title="Pro Tier Tools" subtitle="Advanced AI-powered tools for professional content creators" />;
}
