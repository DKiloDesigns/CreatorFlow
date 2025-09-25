'use client';

import React from 'react';
import MobileToolsPage from '@/components/mobile/mobile-tools-page';
import {
  AutoAwesome,
  Analytics,
  Group,
  Palette,
  Api,
  Extension,
  Support,
  Security
} from '@mui/icons-material';

const enterpriseTools = [
  {
    title: 'AI Content Creation Suite',
    description: 'Advanced AI-powered content generation for enterprise teams',
    icon: <AutoAwesome sx={{ fontSize: 40 }} />,
    href: '/tools/ai-content-suite',
    features: [
      'Advanced AI content generation',
      'Multi-platform content adaptation',
      'Brand voice consistency',
      'Team collaboration features',
      'Custom templates and workflows'
    ],
    color: 'primary',
    comingSoon: false,
    tier: 'enterprise',
    price: '$99/month'
  },
  {
    title: 'Enterprise Analytics',
    description: 'Comprehensive analytics and reporting for enterprise teams',
    icon: <Analytics sx={{ fontSize: 40 }} />,
    href: '/tools/enterprise-analytics',
    features: [
      'Advanced cross-platform analytics',
      'Team performance metrics',
      'Custom reporting and exports',
      'Real-time dashboards',
      'Data visualization tools'
    ],
    color: 'secondary',
    comingSoon: false,
    tier: 'enterprise',
    price: '$99/month'
  },
  {
    title: 'Team Collaboration',
    description: 'Advanced team management and collaboration tools',
    icon: <Group sx={{ fontSize: 40 }} />,
    href: '/tools/team-collaboration',
    features: [
      'Team member management',
      'Project and task tracking',
      'Real-time messaging',
      'File sharing and collaboration',
      'Permission and role management'
    ],
    color: 'success',
    comingSoon: false,
    tier: 'enterprise',
    price: '$99/month'
  },
  {
    title: 'White-label Solutions',
    description: 'Customize CreatorFlow with your brand identity',
    icon: <Palette sx={{ fontSize: 40 }} />,
    href: '/tools/white-label-solutions',
    features: [
      'Custom branding and themes',
      'White-label domain support',
      'Custom logo and colors',
      'Branded user interface',
      'Custom email templates'
    ],
    color: 'warning',
    comingSoon: false,
    tier: 'enterprise',
    price: '$99/month'
  },
  {
    title: 'API Access',
    description: 'Developer tools and API management for enterprise integration',
    icon: <Api sx={{ fontSize: 40 }} />,
    href: '/tools/api-access',
    features: [
      'RESTful API access',
      'API key management',
      'Rate limiting and monitoring',
      'Webhook support',
      'SDK and documentation'
    ],
    color: 'info',
    comingSoon: false,
    tier: 'enterprise',
    price: '$99/month'
  },
  {
    title: 'Custom Integrations',
    description: 'Connect CreatorFlow with your favorite tools and platforms',
    icon: <Extension sx={{ fontSize: 40 }} />,
    href: '/tools/custom-integrations',
    features: [
      'Third-party integrations',
      'Custom workflow automation',
      'Webhook management',
      'Integration marketplace',
      'Custom connector development'
    ],
    color: 'error',
    comingSoon: false,
    tier: 'enterprise',
    price: '$99/month'
  },
  {
    title: 'Priority Support',
    description: 'Dedicated support and account management for enterprise customers',
    icon: <Support sx={{ fontSize: 40 }} />,
    href: '/tools/priority-support',
    features: [
      'Dedicated account manager',
      'Priority support tickets',
      'Live chat and phone support',
      'Custom training sessions',
      'SLA guarantees'
    ],
    color: 'primary',
    comingSoon: false,
    tier: 'enterprise',
    price: '$99/month'
  },
  {
    title: 'Advanced Security',
    description: 'Enterprise-grade security and compliance management',
    icon: <Security sx={{ fontSize: 40 }} />,
    href: '/tools/advanced-security',
    features: [
      'Advanced security monitoring',
      'Compliance management',
      'Security policy enforcement',
      'Audit logging and reporting',
      'Data encryption and protection'
    ],
    color: 'secondary',
    comingSoon: false,
    tier: 'enterprise',
    price: '$99/month'
  }
];

export default function EnterpriseToolsPage() {
  return (
    <MobileToolsPage 
      tools={enterpriseTools} 
      title="Enterprise Tier Tools" 
      subtitle="Advanced AI-powered tools and enterprise features for large organizations" 
    />
  );
}
