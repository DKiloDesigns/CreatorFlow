import React from 'react';
import { Metadata } from 'next';
import BrandPartnershipFinderFree from '@/components/tools/brand-partnership-finder-free';

export const metadata: Metadata = {
  title: 'Brand Partnership Finder - CreatorFlow',
  description: 'Discover brand partnership opportunities that match your audience and content. Find sponsorships, collaborations, and affiliate programs.',
  keywords: 'brand partnerships, sponsorship opportunities, brand collaboration, affiliate programs, influencer marketing',
};

export default function BrandPartnershipFinderPage() {
  return <BrandPartnershipFinderFree />;
}
