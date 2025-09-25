import { Metadata } from 'next';
import ContentRepurposingEngine from '@/components/tools/content-repurposing-engine';

export const metadata: Metadata = {
  title: 'Content Repurposing Engine | CreatorFlow Tools',
  description: 'Automatically create platform-specific versions of your content. Transform one piece of content into multiple optimized posts for different platforms.',
};

export default function ContentRepurposingPage() {
  return <ContentRepurposingEngine />;
}
