import { Metadata } from 'next';
import CreatorNetworkBuilder from '@/components/tools/creator-network-builder';

export const metadata: Metadata = {
  title: 'Creator Network Builder | CreatorFlow Pro',
  description: 'Build your creator network and find collaboration partners. Discover opportunities, connect with like-minded creators, and grow your community.',
};

export default function CreatorNetworkPage() {
  return <CreatorNetworkBuilder />;
}
