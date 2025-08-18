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
      {/* Bottom Spacer to Clear Bottom Navigation */}
      <div className="h-32 sm:h-10 w-full"></div>
