'use client';

import React from 'react';
import { Box } from '@mui/material';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

interface PublicPageLayoutProps {
  children: React.ReactNode;
}

export function PublicPageLayout({ children }: PublicPageLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{ height: { xs: 32, sm: 10 }, width: '100%' }}></Box>
    </Box>
  );
}
