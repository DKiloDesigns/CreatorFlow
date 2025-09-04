'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
}

interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
}

interface UserPresence {
  user: User;
  cursor: CursorPosition;
  isActive: boolean;
  lastSeen: Date;
}

interface CollaborationState {
  users: UserPresence[];
  isConnected: boolean;
  currentRoom: string | null;
  socket: Socket | null;
}

interface CollaborationContextType extends CollaborationState {
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  updateCursor: (position: CursorPosition) => void;
  broadcastChange: (type: string, data: any) => void;
  onReceiveChange: (callback: (type: string, data: any, userId: string) => void) => void;
  offReceiveChange: (callback: (type: string, data: any, userId: string) => void) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

// Generate a random color for the user
const generateUserColor = (userId: string): string => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ];
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
};

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!session?.user) return;

    try {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        autoConnect: false,
        auth: {
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
        },
      });

    newSocket.on('connect', () => {
      console.log('Connected to collaboration server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
      setIsConnected(false);
    });

    newSocket.on('userJoined', (user: User) => {
      console.log('User joined:', user);
      setUsers(prev => {
        const existing = prev.find(u => u.user.id === user.id);
        if (existing) return prev;
        return [...prev, {
          user,
          cursor: { x: 0, y: 0 },
          isActive: true,
          lastSeen: new Date(),
        }];
      });
    });

    newSocket.on('userLeft', (userId: string) => {
      console.log('User left:', userId);
      setUsers(prev => prev.filter(u => u.user.id !== userId));
    });

    newSocket.on('cursorUpdate', (data: { userId: string; cursor: CursorPosition }) => {
      setUsers(prev => prev.map(u => 
        u.user.id === data.userId 
          ? { ...u, cursor: data.cursor, isActive: true, lastSeen: new Date() }
          : u
      ));
    });

    newSocket.on('userActivity', (data: { userId: string; isActive: boolean }) => {
      setUsers(prev => prev.map(u => 
        u.user.id === data.userId 
          ? { ...u, isActive: data.isActive, lastSeen: new Date() }
          : u
      ));
    });

    newSocket.on('roomUsers', (roomUsers: UserPresence[]) => {
      setUsers(roomUsers);
    });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } catch (error) {
      console.error('Failed to initialize collaboration socket:', error);
      setIsConnected(false);
    }
  }, [session]);

  // Clean up inactive users
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setUsers(prev => prev.filter(u => {
        const timeSinceLastSeen = now.getTime() - u.lastSeen.getTime();
        return timeSinceLastSeen < 30000; // Remove users inactive for 30 seconds
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    if (!socket) return;
    
    socket.emit('joinRoom', roomId);
    setCurrentRoom(roomId);
  }, [socket]);

  const leaveRoom = useCallback(() => {
    if (!socket || !currentRoom) return;
    
    socket.emit('leaveRoom', currentRoom);
    setCurrentRoom(null);
    setUsers([]);
  }, [socket, currentRoom]);

  const updateCursor = useCallback((position: CursorPosition) => {
    if (!socket || !currentRoom) return;
    
    socket.emit('cursorUpdate', {
      roomId: currentRoom,
      cursor: position,
    });
  }, [socket, currentRoom]);

  const broadcastChange = useCallback((type: string, data: any) => {
    if (!socket || !currentRoom) return;
    
    socket.emit('broadcastChange', {
      roomId: currentRoom,
      type,
      data,
      userId: session?.user?.id,
    });
  }, [socket, currentRoom, session]);

  const onReceiveChange = useCallback((callback: (type: string, data: any, userId: string) => void) => {
    if (!socket) return;
    
    socket.on('receiveChange', (data: { type: string; data: any; userId: string }) => {
      callback(data.type, data.data, data.userId);
    });
  }, [socket]);

  const offReceiveChange = useCallback((callback: (type: string, data: any, userId: string) => void) => {
    if (!socket) return;
    
    socket.off('receiveChange', callback);
  }, [socket]);

  const value: CollaborationContextType = {
    users,
    isConnected,
    currentRoom,
    socket,
    joinRoom,
    leaveRoom,
    updateCursor,
    broadcastChange,
    onReceiveChange,
    offReceiveChange,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}
