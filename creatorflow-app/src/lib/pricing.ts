export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  limits: {
    socialAccounts: number;
    postsPerMonth: number;
    teamMembers: number;
    apiCallsPerMonth: number;
    storageGB: number;
    customBranding: boolean;
    whiteLabel: boolean;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
    aiContentGeneration: boolean;
    customIntegrations: boolean;
  };
  popular?: boolean;
  enterprise?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for individual creators getting started',
    price: {
      monthly: 0,
      yearly: 0,
    },
    stripePriceId: {
      monthly: '',
      yearly: '',
    },
    features: [
      '3 Social Media Accounts',
      '10 Posts per Month',
      'Basic Analytics',
      'Content Calendar',
      'Free Tools Suite',
      'Mobile App Access',
      'Email Support',
    ],
    limits: {
      socialAccounts: 3,
      postsPerMonth: 10,
      teamMembers: 1,
      apiCallsPerMonth: 1000,
      storageGB: 1,
      customBranding: false,
      whiteLabel: false,
      prioritySupport: false,
      advancedAnalytics: false,
      aiContentGeneration: false,
      customIntegrations: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing creators and small businesses',
    price: {
      monthly: 29,
      yearly: 290, // 2 months free
    },
    stripePriceId: {
      monthly: 'price_1RVNbpFRpVaglkHnlxpaqpsh',
      yearly: 'price_1RVO1UFRpVaglkHnchzxF4jM',
    },
    features: [
      '10 Social Media Accounts',
      'Unlimited Posts',
      'Advanced Analytics',
      'AI Content Generation',
      'Team Collaboration (5 members)',
      'Priority Support',
      'Custom Branding',
      'API Access',
      'Advanced Scheduling',
      'Content Templates',
      'Performance Insights',
    ],
    limits: {
      socialAccounts: 10,
      postsPerMonth: -1, // unlimited
      teamMembers: 5,
      apiCallsPerMonth: 10000,
      storageGB: 10,
      customBranding: true,
      whiteLabel: false,
      prioritySupport: true,
      advancedAnalytics: true,
      aiContentGeneration: true,
      customIntegrations: false,
    },
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For agencies and large organizations',
    price: {
      monthly: 99,
      yearly: 990, // 2 months free
    },
    stripePriceId: {
      monthly: 'price_1RVP48FRpVaglkHnAv9qKnGI',
      yearly: 'price_1RVP48FRpVaglkHnAv9qKnGI',
    },
    features: [
      'Unlimited Social Media Accounts',
      'Unlimited Posts',
      'White-Label Solution',
      'Custom Integrations',
      'Unlimited Team Members',
      'Dedicated Account Manager',
      'Custom Analytics',
      'Advanced AI Features',
      'SSO Integration',
      'Custom Workflows',
      '24/7 Phone Support',
      'SLA Guarantee',
    ],
    limits: {
      socialAccounts: -1, // unlimited
      postsPerMonth: -1, // unlimited
      teamMembers: -1, // unlimited
      apiCallsPerMonth: 100000,
      storageGB: 100,
      customBranding: true,
      whiteLabel: true,
      prioritySupport: true,
      advancedAnalytics: true,
      aiContentGeneration: true,
      customIntegrations: true,
    },
    enterprise: true,
  },
];

export const getPricingTier = (tierId: string): PricingTier | undefined => {
  return PRICING_TIERS.find(tier => tier.id === tierId);
};

export const getPricingTierByStripePriceId = (stripePriceId: string): PricingTier | undefined => {
  return PRICING_TIERS.find(tier => 
    tier.stripePriceId.monthly === stripePriceId || 
    tier.stripePriceId.yearly === stripePriceId
  );
};

export const calculateYearlySavings = (monthlyPrice: number): number => {
  const yearlyPrice = monthlyPrice * 10; // 2 months free
  const monthlyTotal = monthlyPrice * 12;
  return monthlyTotal - yearlyPrice;
};

export const formatPrice = (price: number): string => {
  if (price === 0) return 'Free';
  return `$${price}`;
};

export const getBillingPeriod = (stripePriceId: string): 'monthly' | 'yearly' => {
  return stripePriceId.includes('yearly') ? 'yearly' : 'monthly';
};
