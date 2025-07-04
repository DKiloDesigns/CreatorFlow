import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

export function useAnnouncementSocket(onAnnouncement: (announcement: any) => void) {
  useEffect(() => {
    if (!socket && connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
      try {
        socket = io('http://localhost:4001', { 
          transports: ['websocket'],
          timeout: 5000,
          reconnection: false // Disable auto-reconnection to prevent spam
        });
        
        socket.on('connect', () => {
          console.log('🔗 Connected to announcement socket');
          connectionAttempts = 0; // Reset on successful connection
        });
        
        socket.on('connect_error', (error) => {
          console.log('❌ Announcement socket connection failed (this is normal if socket server is not running)');
          connectionAttempts++;
          socket = null;
        });
        
        socket.on('announcement', onAnnouncement);
      } catch (error) {
        console.log('❌ Failed to initialize announcement socket');
        connectionAttempts++;
      }
    }
    
    if (socket) {
      socket.on('announcement', onAnnouncement);
    }
    
    return () => {
      if (socket) {
        socket.off('announcement', onAnnouncement);
      }
    };
  }, [onAnnouncement]);
} 