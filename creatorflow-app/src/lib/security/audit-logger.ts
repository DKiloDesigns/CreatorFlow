import { getRedisClient } from '../redis';
import crypto from 'crypto';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  ip: string;
  userAgent: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  outcome: 'success' | 'failure' | 'error';
  tags: string[];
}

export interface AuditQuery {
  userId?: string;
  action?: string;
  resource?: string;
  severity?: string;
  outcome?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class AuditLogger {
  private static readonly AUDIT_KEY_PREFIX = 'audit:';
  private static readonly AUDIT_INDEX_PREFIX = 'audit_index:';
  private static readonly MAX_RETENTION_DAYS = 90;

  static async log(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<string> {
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...event,
    };

    try {
      const client = await getRedisClient();
      if (!client) {
        console.warn('Redis not available, audit event not logged:', auditEvent);
        return auditEvent.id;
      }

      const key = `${this.AUDIT_KEY_PREFIX}${auditEvent.id}`;
      const eventData = {
        id: auditEvent.id,
        timestamp: auditEvent.timestamp.toISOString(),
        userId: auditEvent.userId || '',
        sessionId: auditEvent.sessionId || '',
        ip: auditEvent.ip,
        userAgent: auditEvent.userAgent,
        action: auditEvent.action,
        resource: auditEvent.resource,
        resourceId: auditEvent.resourceId || '',
        details: JSON.stringify(auditEvent.details),
        severity: auditEvent.severity,
        outcome: auditEvent.outcome,
        tags: JSON.stringify(auditEvent.tags),
      };

      // Store the audit event
      await client.hset(key, eventData);
      
      // Set expiration
      await client.expire(key, this.MAX_RETENTION_DAYS * 24 * 60 * 60);

      // Create indexes for efficient querying
      await this.createIndexes(client, auditEvent);

      return auditEvent.id;
    } catch (error) {
      console.error('Failed to log audit event:', error);
      return auditEvent.id;
    }
  }

  private static async createIndexes(client: any, event: AuditEvent): Promise<void> {
    const timestamp = event.timestamp.getTime();
    
    // Index by user
    if (event.userId) {
      await client.zadd(`${this.AUDIT_INDEX_PREFIX}user:${event.userId}`, timestamp, event.id);
    }

    // Index by action
    await client.zadd(`${this.AUDIT_INDEX_PREFIX}action:${event.action}`, timestamp, event.id);

    // Index by resource
    await client.zadd(`${this.AUDIT_INDEX_PREFIX}resource:${event.resource}`, timestamp, event.id);

    // Index by severity
    await client.zadd(`${this.AUDIT_INDEX_PREFIX}severity:${event.severity}`, timestamp, event.id);

    // Index by outcome
    await client.zadd(`${this.AUDIT_INDEX_PREFIX}outcome:${event.outcome}`, timestamp, event.id);

    // Index by date (for time-based queries)
    const dateKey = event.timestamp.toISOString().split('T')[0];
    await client.zadd(`${this.AUDIT_INDEX_PREFIX}date:${dateKey}`, timestamp, event.id);

    // Set expiration for indexes
    const indexExpiry = this.MAX_RETENTION_DAYS * 24 * 60 * 60;
    await client.expire(`${this.AUDIT_INDEX_PREFIX}user:${event.userId}`, indexExpiry);
    await client.expire(`${this.AUDIT_INDEX_PREFIX}action:${event.action}`, indexExpiry);
    await client.expire(`${this.AUDIT_INDEX_PREFIX}resource:${event.resource}`, indexExpiry);
    await client.expire(`${this.AUDIT_INDEX_PREFIX}severity:${event.severity}`, indexExpiry);
    await client.expire(`${this.AUDIT_INDEX_PREFIX}outcome:${event.outcome}`, indexExpiry);
    await client.expire(`${this.AUDIT_INDEX_PREFIX}date:${dateKey}`, indexExpiry);
  }

  static async query(query: AuditQuery): Promise<AuditEvent[]> {
    try {
      const client = await getRedisClient();
      if (!client) return [];

      // Start with all events (this is inefficient for large datasets)
      let eventIds: string[] = [];
      
      if (query.userId) {
        const userEvents = await client.zrevrange(`${this.AUDIT_INDEX_PREFIX}user:${query.userId}`, 0, -1);
        eventIds = userEvents;
      } else if (query.action) {
        const actionEvents = await client.zrevrange(`${this.AUDIT_INDEX_PREFIX}action:${query.action}`, 0, -1);
        eventIds = actionEvents;
      } else if (query.resource) {
        const resourceEvents = await client.zrevrange(`${this.AUDIT_INDEX_PREFIX}resource:${query.resource}`, 0, -1);
        eventIds = resourceEvents;
      } else {
        // Get recent events from date index
        const today = new Date().toISOString().split('T')[0];
        eventIds = await client.zrevrange(`${this.AUDIT_INDEX_PREFIX}date:${today}`, 0, -1);
      }

      // Filter and limit results
      const limit = query.limit || 100;
      const offset = query.offset || 0;
      const paginatedIds = eventIds.slice(offset, offset + limit);

      // Fetch event details
      const events: AuditEvent[] = [];
      for (const id of paginatedIds) {
        const eventData = await client.hgetall(`${this.AUDIT_KEY_PREFIX}${id}`);
        if (eventData && Object.keys(eventData).length > 0) {
          const event: AuditEvent = {
            id: eventData.id,
            timestamp: new Date(eventData.timestamp),
            userId: eventData.userId || undefined,
            sessionId: eventData.sessionId || undefined,
            ip: eventData.ip,
            userAgent: eventData.userAgent,
            action: eventData.action,
            resource: eventData.resource,
            resourceId: eventData.resourceId || undefined,
            details: JSON.parse(eventData.details || '{}'),
            severity: eventData.severity as any,
            outcome: eventData.outcome as any,
            tags: JSON.parse(eventData.tags || '[]'),
          };

          // Apply additional filters
          if (query.severity && event.severity !== query.severity) continue;
          if (query.outcome && event.outcome !== query.outcome) continue;
          if (query.startDate && event.timestamp < query.startDate) continue;
          if (query.endDate && event.timestamp > query.endDate) continue;

          events.push(event);
        }
      }

      return events;
    } catch (error) {
      console.error('Failed to query audit events:', error);
      return [];
    }
  }

  static async getEventById(id: string): Promise<AuditEvent | null> {
    try {
      const client = await getRedisClient();
      if (!client) return null;

      const eventData = await client.hgetall(`${this.AUDIT_KEY_PREFIX}${id}`);
      if (!eventData || Object.keys(eventData).length === 0) return null;

      return {
        id: eventData.id,
        timestamp: new Date(eventData.timestamp),
        userId: eventData.userId || undefined,
        sessionId: eventData.sessionId || undefined,
        ip: eventData.ip,
        userAgent: eventData.userAgent,
        action: eventData.action,
        resource: eventData.resource,
        resourceId: eventData.resourceId || undefined,
        details: JSON.parse(eventData.details || '{}'),
        severity: eventData.severity as any,
        outcome: eventData.outcome as any,
        tags: JSON.parse(eventData.tags || '[]'),
      };
    } catch (error) {
      console.error('Failed to get audit event:', error);
      return null;
    }
  }

  static async getStats(timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<{
    total: number;
    bySeverity: Record<string, number>;
    byOutcome: Record<string, number>;
    byAction: Record<string, number>;
  }> {
    try {
      const client = await getRedisClient();
      if (!client) return { total: 0, bySeverity: {}, byOutcome: {}, byAction: {} };

      const now = new Date();
      let startTime: number;
      
      switch (timeframe) {
        case 'hour':
          startTime = now.getTime() - 60 * 60 * 1000;
          break;
        case 'day':
          startTime = now.getTime() - 24 * 60 * 60 * 1000;
          break;
        case 'week':
          startTime = now.getTime() - 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          startTime = now.getTime() - 30 * 24 * 60 * 60 * 1000;
          break;
        default:
          startTime = now.getTime() - 24 * 60 * 60 * 1000;
      }

      // This is a simplified implementation
      // In production, you'd want more sophisticated aggregation
      const events = await this.query({
        startDate: new Date(startTime),
        endDate: now,
        limit: 10000,
      });

      const stats = {
        total: events.length,
        bySeverity: {} as Record<string, number>,
        byOutcome: {} as Record<string, number>,
        byAction: {} as Record<string, number>,
      };

      events.forEach(event => {
        stats.bySeverity[event.severity] = (stats.bySeverity[event.severity] || 0) + 1;
        stats.byOutcome[event.outcome] = (stats.byOutcome[event.outcome] || 0) + 1;
        stats.byAction[event.action] = (stats.byAction[event.action] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get audit stats:', error);
      return { total: 0, bySeverity: {}, byOutcome: {}, byAction: {} };
    }
  }

  // Predefined audit events for common actions
  static async logLogin(userId: string, ip: string, userAgent: string, success: boolean): Promise<string> {
    return this.log({
      userId,
      ip,
      userAgent,
      action: 'user.login',
      resource: 'user',
      resourceId: userId,
      details: { success },
      severity: success ? 'low' : 'medium',
      outcome: success ? 'success' : 'failure',
      tags: ['authentication', 'security'],
    });
  }

  static async logLogout(userId: string, ip: string, userAgent: string): Promise<string> {
    return this.log({
      userId,
      ip,
      userAgent,
      action: 'user.logout',
      resource: 'user',
      resourceId: userId,
      details: {},
      severity: 'low',
      outcome: 'success',
      tags: ['authentication'],
    });
  }

  static async logDataAccess(userId: string, ip: string, userAgent: string, resource: string, resourceId: string): Promise<string> {
    return this.log({
      userId,
      ip,
      userAgent,
      action: 'data.access',
      resource,
      resourceId,
      details: {},
      severity: 'low',
      outcome: 'success',
      tags: ['data_access'],
    });
  }

  static async logDataModification(userId: string, ip: string, userAgent: string, resource: string, resourceId: string, changes: Record<string, any>): Promise<string> {
    return this.log({
      userId,
      ip,
      userAgent,
      action: 'data.modify',
      resource,
      resourceId,
      details: { changes },
      severity: 'medium',
      outcome: 'success',
      tags: ['data_modification'],
    });
  }

  static async logSecurityEvent(userId: string | undefined, ip: string, userAgent: string, action: string, details: Record<string, any>): Promise<string> {
    return this.log({
      userId,
      ip,
      userAgent,
      action: `security.${action}`,
      resource: 'security',
      details,
      severity: 'high',
      outcome: 'success',
      tags: ['security', 'monitoring'],
    });
  }
}
