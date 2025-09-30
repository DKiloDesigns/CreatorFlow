'use client';

import { ReactNode } from 'react';
import { BottomNavigation } from '@/components/navigation/bottom-nav';
import { Box } from '@mui/material';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top navigation and main content */}
      <Box sx={{ 
        flexGrow: 1,
        pb: { xs: 25, md: 0 } // 25 = 100px for bottom nav on mobile, 0 on desktop
      }}>
        {children}
      </Box>
      
      {/* Bottom navigation - only shows on mobile (hidden on md and up) */}
      <BottomNavigation />
    </Box>
  );
} 