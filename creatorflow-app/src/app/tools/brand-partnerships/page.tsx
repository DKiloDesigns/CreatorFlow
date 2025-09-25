import { Metadata } from 'next';
import BrandPartnershipMatcher from '@/components/tools/brand-partnership-matcher';

export const metadata: Metadata = {
  title: 'Brand Partnership Matcher | CreatorFlow Pro',
  description: 'Connect with brands and find partnership opportunities. Discover sponsorships, collaborations, and affiliate programs that match your content and audience.',
};

export default function BrandPartnershipsPage() {
  return <BrandPartnershipMatcher />;
}
