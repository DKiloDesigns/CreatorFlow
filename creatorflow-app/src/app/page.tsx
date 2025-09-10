'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

// Dynamically import the theme-aware content with SSR disabled
const ThemeAwareContent = dynamic(() => import('@/components/ThemeAwareContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Home() {
  return (
    <>
      <ThemeAwareContent />
      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{ height: { xs: 32, sm: 10 }, width: '100%' }} />
    </>
  );
}
