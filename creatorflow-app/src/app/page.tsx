'use client';

import dynamic from 'next/dynamic';

// Dynamically import the theme-aware content with SSR disabled
const ThemeAwareContent = dynamic(() => import('@/components/ThemeAwareContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Home() {
  return <ThemeAwareContent />;
}
