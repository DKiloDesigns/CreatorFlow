/**
 * WebSocket Notification Server
 * Handles real-time notification delivery to connected clients
 */

import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/auth';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

interface NotificationData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

interface MessageData {
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

interface ConversationData {
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
  lastMessage?: MessageData;
  unreadCount: number;
}

class NotificationWebSocketServer {
  private io: SocketIOServer | null = null;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXTAUTH_URL 
          : "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true
      },
      path: '/api/socketio'
    });

    this.setupEventHandlers();
    console.log('🔌 WebSocket Notification Server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`📱 Client connected: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', async (data: { sessionToken?: string }) => {
        try {
          // In a real implementation, you'd validate the session token
          // For now, we'll use a simple approach
          if (data.sessionToken) {
            // You could decode and validate the JWT token here
            // For now, we'll assume authentication is handled by the client
            console.log(`🔐 Client authenticated: ${socket.id}`);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('auth_error', { message: 'Authentication failed' });
        }
      });

      // Handle user identification
      socket.on('identify_user', (data: { userId: string, userEmail: string }) => {
        socket.userId = data.userId;
        socket.userEmail = data.userEmail;
        this.connectedUsers.set(data.userId, socket.id);
        console.log(`👤 User identified: ${data.userEmail} (${data.userId})`);
        
        // Join user-specific room
        socket.join(`user_${data.userId}`);
        
        // Send confirmation
        socket.emit('user_identified', { 
          success: true, 
          userId: data.userId,
          message: 'Successfully connected to real-time notifications'
        });
      });

      // Handle notification read status updates
      socket.on('mark_notification_read', async (data: { notificationId: string }) => {
        try {
          // Update notification in database
          const { prisma } = await import('@/lib/prisma');
          await prisma.notification.update({
            where: { id: data.notificationId },
            data: { read: true }
          });

          // Broadcast to user that notification was read
          socket.emit('notification_read', { 
            notificationId: data.notificationId,
            success: true 
          });

          console.log(`✅ Notification ${data.notificationId} marked as read`);
        } catch (error) {
          console.error('Error marking notification as read:', error);
          socket.emit('notification_read_error', { 
            notificationId: data.notificationId,
            error: 'Failed to mark notification as read'
          });
        }
      });

      // Handle bulk notification actions
      socket.on('mark_all_read', async (data: { userId: string }) => {
        try {
          const { prisma } = await import('@/lib/prisma');
          await prisma.notification.updateMany({
            where: { 
              userId: data.userId,
              read: false 
            },
            data: { read: true }
          });

          // Broadcast to user that all notifications were read
          socket.emit('all_notifications_read', { 
            success: true,
            message: 'All notifications marked as read'
          });

          console.log(`✅ All notifications marked as read for user ${data.userId}`);
        } catch (error) {
          console.error('Error marking all notifications as read:', error);
          socket.emit('bulk_action_error', { 
            error: 'Failed to mark all notifications as read'
          });
        }
      });

      // MESSENGER EVENTS
      
      // Handle joining conversation room
      socket.on('join_conversation', (data: { conversationId: string }) => {
        if (!socket.userId) {
          socket.emit('error', { message: 'User not authenticated' });
          return;
        }

        socket.join(`conversation_${data.conversationId}`);
        console.log(`💬 User ${socket.userId} joined conversation ${data.conversationId}`);
        
        socket.emit('conversation_joined', { 
          conversationId: data.conversationId,
          success: true 
        });
      });

      // Handle leaving conversation room
      socket.on('leave_conversation', (data: { conversationId: string }) => {
        socket.leave(`conversation_${data.conversationId}`);
        console.log(`💬 User ${socket.userId} left conversation ${data.conversationId}`);
        
        socket.emit('conversation_left', { 
          conversationId: data.conversationId,
          success: true 
        });
      });

      // Handle typing indicators
      socket.on('typing_start', (data: { conversationId: string }) => {
        if (!socket.userId) return;
        
        socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
          conversationId: data.conversationId,
          userId: socket.userId,
          isTyping: true
        });
      });

      socket.on('typing_stop', (data: { conversationId: string }) => {
        if (!socket.userId) return;
        
        socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
          conversationId: data.conversationId,
          userId: socket.userId,
          isTyping: false
        });
      });

      // Handle message reactions
      socket.on('message_reaction', async (data: { 
        conversationId: string; 
        messageId: string; 
        emoji: string; 
        action: 'add' | 'remove' 
      }) => {
        if (!socket.userId) return;

        try {
          const { prisma } = await import('@/lib/prisma');
          
          if (data.action === 'add') {
            await prisma.messageReaction.create({
              data: {
                messageId: data.messageId,
                userId: socket.userId,
                emoji: data.emoji
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    displayName: true,
                    image: true
                  }
                }
              }
            });
          } else {
            await prisma.messageReaction.deleteMany({
              where: {
                messageId: data.messageId,
                userId: socket.userId,
                emoji: data.emoji
              }
            });
          }

          // Broadcast reaction to conversation participants
          socket.to(`conversation_${data.conversationId}`).emit('message_reaction_updated', {
            conversationId: data.conversationId,
            messageId: data.messageId,
            emoji: data.emoji,
            action: data.action,
            userId: socket.userId
          });

        } catch (error) {
          console.error('Error handling message reaction:', error);
          socket.emit('reaction_error', { 
            messageId: data.messageId,
            error: 'Failed to update reaction'
          });
        }
      });

      // Handle message read status
      socket.on('mark_message_read', async (data: { messageId: string }) => {
        if (!socket.userId) return;

        try {
          const { prisma } = await import('@/lib/prisma');
          
          await prisma.messageRead.create({
            data: {
              messageId: data.messageId,
              userId: socket.userId
            }
          });

          console.log(`✅ Message ${data.messageId} marked as read by user ${socket.userId}`);
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`📱 Client disconnected: ${socket.id}`);
        
        // Remove user from connected users map
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`❌ Socket error for ${socket.id}:`, error);
      });
    });
  }

  /**
   * Send notification to a specific user
   */
  async sendNotificationToUser(userId: string, notification: NotificationData) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return false;
    }

    const socketId = this.connectedUsers.get(userId);
    if (!socketId) {
      console.log(`User ${userId} not connected, notification queued`);
      return false;
    }

    try {
      this.io.to(`user_${userId}`).emit('new_notification', notification);
      console.log(`📨 Notification sent to user ${userId}: ${notification.title}`);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  /**
   * Send notification to all connected users (for system-wide notifications)
   */
  async broadcastNotification(notification: Omit<NotificationData, 'userId'>) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return false;
    }

    try {
      this.io.emit('system_notification', notification);
      console.log(`📢 System notification broadcasted: ${notification.title}`);
      return true;
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      return false;
    }
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get all connected user IDs
   */
  getConnectedUserIds(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // MESSENGER METHODS

  /**
   * Send new message to conversation participants
   */
  async sendMessageToConversation(conversationId: string, message: MessageData) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return false;
    }

    try {
      this.io.to(`conversation_${conversationId}`).emit('new_message', message);
      console.log(`💬 Message sent to conversation ${conversationId}: ${message.content.substring(0, 50)}...`);
      return true;
    } catch (error) {
      console.error('Error sending message to conversation:', error);
      return false;
    }
  }

  /**
   * Send conversation update to participants
   */
  async sendConversationUpdate(conversationId: string, conversation: ConversationData) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return false;
    }

    try {
      this.io.to(`conversation_${conversationId}`).emit('conversation_updated', conversation);
      console.log(`💬 Conversation ${conversationId} updated`);
      return true;
    } catch (error) {
      console.error('Error sending conversation update:', error);
      return false;
    }
  }

  /**
   * Send typing indicator to conversation participants
   */
  async sendTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return false;
    }

    try {
      this.io.to(`conversation_${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        isTyping
      });
      return true;
    } catch (error) {
      console.error('Error sending typing indicator:', error);
      return false;
    }
  }

  /**
   * Send message reaction update to conversation participants
   */
  async sendMessageReactionUpdate(conversationId: string, messageId: string, emoji: string, action: 'add' | 'remove', userId: string) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return false;
    }

    try {
      this.io.to(`conversation_${conversationId}`).emit('message_reaction_updated', {
        conversationId,
        messageId,
        emoji,
        action,
        userId
      });
      return true;
    } catch (error) {
      console.error('Error sending reaction update:', error);
      return false;
    }
  }

  /**
   * Send message read status to conversation participants
   */
  async sendMessageReadStatus(conversationId: string, messageId: string, userId: string) {
    if (!this.io) {
      console.warn('WebSocket server not initialized');
      return false;
    }

    try {
      this.io.to(`conversation_${conversationId}`).emit('message_read', {
        conversationId,
        messageId,
        userId
      });
      return true;
    } catch (error) {
      console.error('Error sending read status:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationWebSocket = new NotificationWebSocketServer();
