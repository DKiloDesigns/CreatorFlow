import { monitoring } from '@/lib/monitoring';

export interface CollaborationSession {
  id: string;
  title: string;
  participants: string[];
  content: string;
  cursors: Record<string, CursorPosition>;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'paused' | 'completed';
}

export interface CursorPosition {
  userId: string;
  username: string;
  position: number;
  selection?: { start: number; end: number };
  timestamp: Date;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  position: number;
  timestamp: Date;
  replies: Comment[];
}

export interface CollaborationEvent {
  type: 'cursor_move' | 'content_change' | 'comment_add' | 'comment_reply' | 'user_join' | 'user_leave';
  sessionId: string;
  userId: string;
  username: string;
  data: any;
  timestamp: Date;
}

class CollaborationManager {
  private static instance: CollaborationManager;
  private sessions: Map<string, CollaborationSession> = new Map();
  private subscribers: Map<string, ((event: CollaborationEvent) => void)[]> = new Map();
  private userSessions: Map<string, string[]> = new Map(); // userId -> sessionIds

  static getInstance(): CollaborationManager {
    if (!CollaborationManager.instance) {
      CollaborationManager.instance = new CollaborationManager();
    }
    return CollaborationManager.instance;
  }

  // Create a new collaboration session
  createSession(title: string, creatorId: string, creatorName: string): CollaborationSession {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session: CollaborationSession = {
      id: sessionId,
      title,
      participants: [creatorId],
      content: '',
      cursors: {},
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
    };

    this.sessions.set(sessionId, session);
    this.addUserToSession(creatorId, sessionId);

    monitoring.info('Collaboration session created', {
      sessionId,
      title,
      creatorId,
    });

    return session;
  }

  // Join a collaboration session
  joinSession(sessionId: string, userId: string, username: string): CollaborationSession | null {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') {
      return null;
    }

    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      session.updatedAt = new Date();
    }

    this.addUserToSession(userId, sessionId);

    // Notify other participants
    this.broadcastEvent({
      type: 'user_join',
      sessionId,
      userId,
      username,
      data: { username },
      timestamp: new Date(),
    });

    monitoring.info('User joined collaboration session', {
      sessionId,
      userId,
      username,
    });

    return session;
  }

  // Leave a collaboration session
  leaveSession(sessionId: string, userId: string, username: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.participants = session.participants.filter(id => id !== userId);
    session.updatedAt = new Date();

    // Remove user's cursor
    delete session.cursors[userId];

    this.removeUserFromSession(userId, sessionId);

    // Notify other participants
    this.broadcastEvent({
      type: 'user_leave',
      sessionId,
      userId,
      username,
      data: { username },
      timestamp: new Date(),
    });

    monitoring.info('User left collaboration session', {
      sessionId,
      userId,
      username,
    });
  }

  // Update cursor position
  updateCursor(sessionId: string, userId: string, username: string, position: number, selection?: { start: number; end: number }): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.cursors[userId] = {
      userId,
      username,
      position,
      selection,
      timestamp: new Date(),
    };

    session.updatedAt = new Date();

    this.broadcastEvent({
      type: 'cursor_move',
      sessionId,
      userId,
      username,
      data: { position, selection },
      timestamp: new Date(),
    });
  }

  // Update content
  updateContent(sessionId: string, userId: string, username: string, content: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.content = content;
    session.updatedAt = new Date();

    this.broadcastEvent({
      type: 'content_change',
      sessionId,
      userId,
      username,
      data: { content },
      timestamp: new Date(),
    });

    monitoring.info('Content updated in collaboration session', {
      sessionId,
      userId,
      contentLength: content.length,
    });
  }

  // Add a comment
  addComment(sessionId: string, userId: string, username: string, content: string, position: number, parentId?: string): Comment {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const comment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      username,
      content,
      position,
      timestamp: new Date(),
      replies: [],
    };

    if (parentId) {
      // Add as reply to existing comment
      const parentComment = this.findComment(session.comments, parentId);
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    } else {
      // Add as top-level comment
      session.comments.push(comment);
    }

    session.updatedAt = new Date();

    this.broadcastEvent({
      type: parentId ? 'comment_reply' : 'comment_add',
      sessionId,
      userId,
      username,
      data: { comment, parentId },
      timestamp: new Date(),
    });

    monitoring.info('Comment added to collaboration session', {
      sessionId,
      userId,
      commentId: comment.id,
      isReply: !!parentId,
    });

    return comment;
  }

  // Get session by ID
  getSession(sessionId: string): CollaborationSession | null {
    return this.sessions.get(sessionId) || null;
  }

  // Get sessions for a user
  getUserSessions(userId: string): CollaborationSession[] {
    const sessionIds = this.userSessions.get(userId) || [];
    return sessionIds
      .map(id => this.sessions.get(id))
      .filter((session): session is CollaborationSession => session !== undefined);
  }

  // Subscribe to session events
  subscribe(sessionId: string, callback: (event: CollaborationEvent) => void): () => void {
    if (!this.subscribers.has(sessionId)) {
      this.subscribers.set(sessionId, []);
    }

    this.subscribers.get(sessionId)!.push(callback);

    return () => {
      const callbacks = this.subscribers.get(sessionId);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Get session statistics
  getSessionStats(sessionId: string): {
    participantCount: number;
    contentLength: number;
    commentCount: number;
    activeTime: number; // minutes
  } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const activeTime = Math.floor((session.updatedAt.getTime() - session.createdAt.getTime()) / (1000 * 60));

    return {
      participantCount: session.participants.length,
      contentLength: session.content.length,
      commentCount: this.countComments(session.comments),
      activeTime,
    };
  }

  // Pause or resume session
  updateSessionStatus(sessionId: string, status: CollaborationSession['status']): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.status = status;
    session.updatedAt = new Date();

    monitoring.info('Collaboration session status updated', {
      sessionId,
      status,
    });

    return true;
  }

  // Clean up inactive sessions
  cleanupInactiveSessions(maxInactiveMinutes: number = 60): number {
    const cutoffTime = new Date(Date.now() - maxInactiveMinutes * 60 * 1000);
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.updatedAt < cutoffTime && session.status === 'active') {
        session.status = 'paused';
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      monitoring.info('Cleaned up inactive collaboration sessions', {
        cleanedCount,
        maxInactiveMinutes,
      });
    }

    return cleanedCount;
  }

  private addUserToSession(userId: string, sessionId: string): void {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, []);
    }

    const userSessions = this.userSessions.get(userId)!;
    if (!userSessions.includes(sessionId)) {
      userSessions.push(sessionId);
    }
  }

  private removeUserFromSession(userId: string, sessionId: string): void {
    const userSessions = this.userSessions.get(userId);
    if (userSessions) {
      const index = userSessions.indexOf(sessionId);
      if (index > -1) {
        userSessions.splice(index, 1);
      }
    }
  }

  private broadcastEvent(event: CollaborationEvent): void {
    const callbacks = this.subscribers.get(event.sessionId);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          monitoring.error('Error in collaboration event callback', {
            sessionId: event.sessionId,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
    }
  }

  private findComment(comments: Comment[], commentId: string): Comment | null {
    for (const comment of comments) {
      if (comment.id === commentId) return comment;
      
      const found = this.findComment(comment.replies, commentId);
      if (found) return found;
    }
    return null;
  }

  private countComments(comments: Comment[]): number {
    return comments.reduce((count, comment) => {
      return count + 1 + this.countComments(comment.replies);
    }, 0);
  }
}

export const collaborationManager = CollaborationManager.getInstance(); 