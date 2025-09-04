'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserPresence {
  id: string;
  name: string;
  email: string;
  cursor: { x: number; y: number } | null;
  lastSeen: Date;
  isActive: boolean;
}

interface CollaborationContextType {
  users: UserPresence[];
  isConnected: boolean;
  currentRoom: string | null;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  updateCursor: (x: number, y: number) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function MinimalCollaborationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  // Simulate connection status
  useEffect(() => {
    if (session?.user) {
      setIsConnected(true);
      
      // Add current user to the list
      const currentUser: UserPresence = {
        id: session.user.id,
        name: session.user.name || 'Anonymous',
        email: session.user.email || '',
        cursor: null,
        lastSeen: new Date(),
        isActive: true,
      };
      
      setUsers([currentUser]);
    } else {
      setIsConnected(false);
      setUsers([]);
    }
  }, [session]);

  const joinRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    console.log(`Joined room: ${roomId}`);
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    console.log('Left room');
  };

  const updateCursor = (x: number, y: number) => {
    if (session?.user) {
      setUsers(prev => prev.map(user => 
        user.id === session.user.id 
          ? { ...user, cursor: { x, y }, lastSeen: new Date() }
          : user
      ));
    }
  };

  return (
    <CollaborationContext.Provider value={{
      users,
      isConnected,
      currentRoom,
      joinRoom,
      leaveRoom,
      updateCursor,
    }}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useMinimalCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useMinimalCollaboration must be used within a MinimalCollaborationProvider');
  }
  return context;
}
