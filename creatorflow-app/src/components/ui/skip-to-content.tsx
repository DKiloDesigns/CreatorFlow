'use client';

import React, { useEffect, useState } from 'react';

export function SkipToContent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const main = document.querySelector('main');
      if (main) {
        main.focus();
        main.scrollIntoView();
      }
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <a
      href="#main-content"
      className="skip-to-content"
      onClick={handleSkip}
      style={{
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: '#000',
        color: '#fff',
        padding: '8px',
        textDecoration: 'none',
        zIndex: 1000,
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'top 0.3s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '6px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      Skip to main content
    </a>
  );
}

export default SkipToContent;
