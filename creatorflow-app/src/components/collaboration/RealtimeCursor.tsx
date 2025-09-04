'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, Avatar, Typography, Tooltip } from '@mui/material';
import { useCollaboration } from '@/contexts/CollaborationContext';

interface RealtimeCursorProps {
  containerRef: React.RefObject<HTMLElement>;
}

export function RealtimeCursor({ containerRef }: RealtimeCursorProps) {
  const { users } = useCollaboration();
  const [cursors, setCursors] = useState<Array<{
    id: string;
    x: number;
    y: number;
    user: any;
    isVisible: boolean;
  }>>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateCursors = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      
      setCursors(users
        .filter(u => u.isActive && u.user.id !== 'current-user')
        .map(u => ({
          id: u.user.id,
          x: u.cursor.x - containerRect.left,
          y: u.cursor.y - containerRect.top,
          user: u.user,
          isVisible: u.cursor.x >= containerRect.left && 
                    u.cursor.x <= containerRect.right &&
                    u.cursor.y >= containerRect.top && 
                    u.cursor.y <= containerRect.bottom,
        }))
      );
    };

    updateCursors();

    const handleScroll = () => updateCursors();
    const handleResize = () => updateCursors();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [users, containerRef]);

  return (
    <>
      {cursors.map(cursor => (
        <Box
          key={cursor.id}
          sx={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: cursor.isVisible ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <Tooltip title={cursor.user.name} placement="top">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: cursor.user.color,
                  fontSize: '0.75rem',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {cursor.user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: `6px solid ${cursor.user.color}`,
                  ml: -1,
                }}
              />
            </Box>
          </Tooltip>
        </Box>
      ))}
    </>
  );
}
