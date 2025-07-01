import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useAnnouncementSocket(onAnnouncement: (announcement: any) => void) {
  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:4001', { transports: ['websocket'] });
    }
    socket.on('announcement', onAnnouncement);
    return () => {
      socket?.off('announcement', onAnnouncement);
    };
  }, [onAnnouncement]);
} 