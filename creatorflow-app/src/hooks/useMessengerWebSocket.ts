import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    displayName: string;
    image: string;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      displayName: string;
    };
  };
  reactions?: Array<{
    id: string;
    emoji: string;
    user: {
      id: string;
      name: string;
      displayName: string;
    };
  }>;
}

interface Conversation {
  id: string;
  name?: string;
  type: string;
  lastMessageAt?: string;
  participants: Array<{
    id: string;
    userId: string;
    role: string;
    isActive: boolean;
    lastReadAt?: string;
    user: {
      id: string;
      name: string;
      displayName: string;
      image: string;
    };
  }>;
  lastMessage?: Message;
  unreadCount: number;
}

interface TypingUser {
  userId: string;
  isTyping: boolean;
}

export function useMessengerWebSocket() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'offline'>('offline');
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;

  // Initialize WebSocket connection
  useEffect(() => {
    if (!session?.user?.id) return;

    // Add a small delay to ensure the server is ready
    const connectionTimeout = setTimeout(() => {
      console.log('🔌 Initializing Messenger WebSocket connection...');
      
      const newSocket = io(process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL || 'https://creatorflow.app'
        : 'http://localhost:3001', {
        path: '/api/socketio',
        transports: ['websocket', 'polling'],
        autoConnect: true,
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: baseReconnectDelay,
        reconnectionDelayMax: 10000,
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('🔌 Messenger WebSocket connected');
        setIsConnected(true);
        setConnectionQuality('excellent');
        reconnectAttempts.current = 0;
        
        // Identify user
        newSocket.emit('identify_user', {
          userId: session.user.id,
          userEmail: session.user.email
        });
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 Messenger WebSocket disconnected:', reason);
        setIsConnected(false);
        setConnectionQuality('offline');
      });

      newSocket.on('connect_error', (error) => {
        console.warn('⚠️ Messenger WebSocket connection error:', error.message);
        setIsConnected(false);
        setConnectionQuality('offline');
      });

      newSocket.on('connect_timeout', () => {
        console.warn('⏰ Messenger WebSocket connection timeout');
        setIsConnected(false);
        setConnectionQuality('offline');
      });

      // User identification confirmation
      newSocket.on('user_identified', (data) => {
        console.log('👤 User identified for messenger:', data);
      });

      // Message events
      newSocket.on('new_message', (message: Message) => {
        console.log('💬 New message received:', message);
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m.id === message.id)) return prev;
          return [...prev, message].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      });

      newSocket.on('conversation_updated', (conversation: Conversation) => {
        console.log('💬 Conversation updated:', conversation);
        setConversations(prev => 
          prev.map(conv => conv.id === conversation.id ? conversation : conv)
        );
      });

      // Typing indicators
      newSocket.on('user_typing', (data: { conversationId: string; userId: string; isTyping: boolean }) => {
        setTypingUsers(prev => {
          const filtered = prev.filter(t => !(t.userId === data.userId && t.isTyping === data.isTyping));
          if (data.isTyping) {
            return [...filtered, { userId: data.userId, isTyping: true }];
          }
          return filtered;
        });
      });

      // Message reactions
      newSocket.on('message_reaction_updated', (data: {
        conversationId: string;
        messageId: string;
        emoji: string;
        action: 'add' | 'remove';
        userId: string;
      }) => {
        console.log('💬 Message reaction updated:', data);
        // Update message reactions in state
        setMessages(prev => prev.map(msg => {
          if (msg.id === data.messageId) {
            const reactions = msg.reactions || [];
            if (data.action === 'add') {
              // Add reaction (simplified - in real app you'd fetch the full reaction data)
              return {
                ...msg,
                reactions: [...reactions, {
                  id: `${data.userId}-${data.emoji}`,
                  emoji: data.emoji,
                  user: { id: data.userId, name: '', displayName: '' }
                }]
              };
            } else {
              // Remove reaction
              return {
                ...msg,
                reactions: reactions.filter(r => !(r.user.id === data.userId && r.emoji === data.emoji))
              };
            }
          }
          return msg;
        }));
      });

      // Error handling
      newSocket.on('error', (error) => {
        console.error('❌ Messenger WebSocket error:', error);
      });

      setSocket(newSocket);
    }, 1000);

    return () => {
      clearTimeout(connectionTimeout);
      console.log('🔌 Cleaning up Messenger WebSocket connection...');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [session?.user?.id, session?.user?.email]);

  // Join conversation room
  const joinConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('join_conversation', { conversationId });
    }
  }, [socket, isConnected]);

  // Leave conversation room
  const leaveConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_conversation', { conversationId });
    }
  }, [socket, isConnected]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((conversationId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      if (isTyping) {
        socket.emit('typing_start', { conversationId });
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit('typing_stop', { conversationId });
        }, 3000);
      } else {
        socket.emit('typing_stop', { conversationId });
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    }
  }, [socket, isConnected]);

  // Send message reaction
  const sendMessageReaction = useCallback((conversationId: string, messageId: string, emoji: string, action: 'add' | 'remove') => {
    if (socket && isConnected) {
      socket.emit('message_reaction', {
        conversationId,
        messageId,
        emoji,
        action
      });
    }
  }, [socket, isConnected]);

  // Mark message as read
  const markMessageAsRead = useCallback((messageId: string) => {
    if (socket && isConnected) {
      socket.emit('mark_message_read', { messageId });
    }
  }, [socket, isConnected]);

  // Send message (this would typically call the API endpoint)
  const sendMessage = useCallback(async (conversationId: string, content: string, type: string = 'TEXT') => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data.conversations);
      return data.conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string, limit: number = 50, offset: number = 0) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.messages);
      return data.messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }, []);

  return {
    socket,
    isConnected,
    connectionQuality,
    messages,
    conversations,
    typingUsers,
    joinConversation,
    leaveConversation,
    sendTypingIndicator,
    sendMessageReaction,
    markMessageAsRead,
    sendMessage,
    fetchConversations,
    fetchMessages,
    setMessages,
    setConversations
  };
}
