'use client';

import { ReactNode } from 'react';
import { BottomNavigation } from '@/components/navigation/bottom-nav';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation and main content */}
      <div className="pb-20 md:pb-0">
        {children}
      </div>
      
      {/* Bottom navigation - only shows on mobile */}
      <BottomNavigation />
    </div>
  );
} 