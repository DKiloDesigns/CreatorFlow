/**
 * CreatorFlow Template Marketplace Page
 * Main page for the template marketplace
 */

import React from 'react';
import { Metadata } from 'next';
import TemplateMarketplace from '@/components/marketplace/template-marketplace';

export const metadata: Metadata = {
  title: 'Template Marketplace - CreatorFlow',
  description: 'Discover and sell professional content templates created by the CreatorFlow community.',
  keywords: 'content templates, social media templates, design templates, marketplace, community content',
};

export default function MarketplacePage() {
  return <TemplateMarketplace />;
}
