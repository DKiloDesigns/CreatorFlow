'use client';

import React from 'react';
import { TouchInteractions } from './touch-interactions';

export const TouchInteractionsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleSwipeLeft = () => {
    console.log('Swipe left');
  };

  const handleSwipeRight = () => {
    console.log('Swipe right');
  };

  const handleSwipeUp = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSwipeDown = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handlePullToRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <TouchInteractions
      enableSwipeNavigation={true}
      enablePullToRefresh={true}
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onSwipeUp={handleSwipeUp}
      onSwipeDown={handleSwipeDown}
      onPullToRefresh={handlePullToRefresh}
    >
      {children}
    </TouchInteractions>
  );
};
