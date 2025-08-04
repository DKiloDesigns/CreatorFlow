import { prisma } from '@/lib/prisma';
import { defaultCache as cache } from './cache';
import { performanceMonitor } from './performance-monitor';
import crypto from 'crypto';

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'oauth' | 'webhook';
  provider: string;
  config: any;
  status: 'active' | 'inactive' | 'error';
  lastSync?: Date;
  errorCount: number;
  metadata: any;
}

interface WebhookEvent {
  id: string;
  integrationId: string;
  eventType: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  timestamp: Date;
  response?: any;
}

interface APICredential {
  id: string;
  integrationId: string;
  type: 'api_key' | 'oauth_token' | 'webhook_secret';
  key: string;
  value: string;
  encrypted: boolean;
  expiresAt?: Date;
}

interface IntegrationSync {
  id: string;
  integrationId: string;
  syncType: 'full' | 'incremental' | 'webhook';
  status: 'running' | 'completed' | 'failed';
  recordsProcessed: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

class IntegrationManager {
  private integrations: Map<string, Integration> = new Map();
  private webhookHandlers: Map<string, Function> = new Map();
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeIntegrations();
    this.setupWebhookHandlers();
  }

  // Integration management
  async createIntegration(name: string, type: string, provider: string, config: any): Promise<Integration> {
    try {
      const integration: Integration = {
        id: this.generateIntegrationId(),
        name,
        type: type as 'api' | 'webhook' | 'oauth' | 'webhook',
        provider,
        config,
        status: 'active',
        errorCount: 0,
        metadata: {},
      };

      // Store in database
      await prisma.integration.create({
        data: {
          id: integration.id,
          name: integration.name,
          type: integration.type,
          provider: integration.provider,
          config: JSON.stringify(integration.config),
          status: integration.status,
          errorCount: integration.errorCount,
          metadata: JSON.stringify(integration.metadata),
        },
      });

      this.integrations.set(integration.id, integration);
      return integration;
    } catch (error) {
      console.error('Failed to create integration:', error);
      throw new Error('Failed to create integration');
    }
  }

  async getIntegration(integrationId: string): Promise<Integration | null> {
    try {
      const integration = await prisma.integration.findUnique({
        where: { id: integrationId },
      });

      if (!integration) return null;

      return {
        id: integration.id,
        name: integration.name,
        type: integration.type as 'api' | 'webhook' | 'oauth' | 'webhook',
        provider: integration.provider,
        config: JSON.parse(integration.config),
        status: integration.status as 'active' | 'inactive' | 'error',
        lastSync: integration.lastSync,
        errorCount: integration.errorCount,
        metadata: JSON.parse(integration.metadata),
      };
    } catch (error) {
      console.error('Failed to get integration:', error);
      return null;
    }
  }

  async updateIntegration(integrationId: string, updates: Partial<Integration>): Promise<Integration | null> {
    try {
      const integration = await prisma.integration.update({
        where: { id: integrationId },
        data: {
          name: updates.name,
          config: updates.config ? JSON.stringify(updates.config) : undefined,
          status: updates.status,
          errorCount: updates.errorCount,
          metadata: updates.metadata ? JSON.stringify(updates.metadata) : undefined,
          lastSync: updates.lastSync,
        },
      });

      return {
        id: integration.id,
        name: integration.name,
        type: integration.type as 'api' | 'webhook' | 'oauth' | 'webhook',
        provider: integration.provider,
        config: JSON.parse(integration.config),
        status: integration.status as 'active' | 'inactive' | 'error',
        lastSync: integration.lastSync,
        errorCount: integration.errorCount,
        metadata: JSON.parse(integration.metadata),
      };
    } catch (error) {
      console.error('Failed to update integration:', error);
      return null;
    }
  }

  // Webhook management
  async registerWebhook(integrationId: string, eventType: string, handler: Function): Promise<void> {
    const key = `${integrationId}:${eventType}`;
    this.webhookHandlers.set(key, handler);
  }

  async processWebhook(integrationId: string, eventType: string, payload: any): Promise<WebhookEvent> {
    try {
      // Create webhook event record
      const webhookEvent: WebhookEvent = {
        id: this.generateWebhookEventId(),
        integrationId,
        eventType,
        payload,
        status: 'pending',
        retryCount: 0,
        timestamp: new Date(),
      };

      // Store in database
      await prisma.webhookEvent.create({
        data: {
          id: webhookEvent.id,
          integrationId: webhookEvent.integrationId,
          eventType: webhookEvent.eventType,
          payload: JSON.stringify(webhookEvent.payload),
          status: webhookEvent.status,
          retryCount: webhookEvent.retryCount,
          timestamp: webhookEvent.timestamp,
        },
      });

      // Process webhook
      const handler = this.webhookHandlers.get(`${integrationId}:${eventType}`);
      if (handler) {
        try {
          webhookEvent.status = 'processing';
          const response = await handler(payload);
          webhookEvent.status = 'completed';
          webhookEvent.response = response;

          // Update database
          await prisma.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
              status: webhookEvent.status,
              response: JSON.stringify(webhookEvent.response),
            },
          });
        } catch (error) {
          webhookEvent.status = 'failed';
          webhookEvent.response = { error: error.message };

          // Update database
          await prisma.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
              status: webhookEvent.status,
              response: JSON.stringify(webhookEvent.response),
            },
          });

          // Increment error count
          await this.incrementIntegrationErrorCount(integrationId);
        }
      } else {
        webhookEvent.status = 'failed';
        webhookEvent.response = { error: 'No handler found for event type' };

        // Update database
        await prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            status: webhookEvent.status,
            response: JSON.stringify(webhookEvent.response),
          },
        });
      }

      return webhookEvent;
    } catch (error) {
      console.error('Failed to process webhook:', error);
      throw new Error('Failed to process webhook');
    }
  }

  // API credential management
  async storeCredential(integrationId: string, type: string, key: string, value: string, encrypted: boolean = true): Promise<APICredential> {
    try {
      const credential: APICredential = {
        id: this.generateCredentialId(),
        integrationId,
        type: type as 'api_key' | 'oauth_token' | 'webhook_secret',
        key,
        value: encrypted ? await this.encryptValue(value) : value,
        encrypted,
        expiresAt: undefined,
      };

      // Store in database
      await prisma.apiCredential.create({
        data: {
          id: credential.id,
          integrationId: credential.integrationId,
          type: credential.type,
          key: credential.key,
          value: credential.value,
          encrypted: credential.encrypted,
          expiresAt: credential.expiresAt,
        },
      });

      return credential;
    } catch (error) {
      console.error('Failed to store credential:', error);
      throw new Error('Failed to store credential');
    }
  }

  async getCredential(integrationId: string, key: string): Promise<string | null> {
    try {
      const credential = await prisma.apiCredential.findFirst({
        where: {
          integrationId,
          key,
        },
      });

      if (!credential) return null;

      return credential.encrypted ? await this.decryptValue(credential.value) : credential.value;
    } catch (error) {
      console.error('Failed to get credential:', error);
      return null;
    }
  }

  // Sync management
  async startSync(integrationId: string, syncType: string): Promise<IntegrationSync> {
    try {
      const sync: IntegrationSync = {
        id: this.generateSyncId(),
        integrationId,
        syncType: syncType as 'full' | 'incremental' | 'webhook',
        status: 'running',
        recordsProcessed: 0,
        startTime: new Date(),
      };

      // Store in database
      await prisma.integrationSync.create({
        data: {
          id: sync.id,
          integrationId: sync.integrationId,
          syncType: sync.syncType,
          status: sync.status,
          recordsProcessed: sync.recordsProcessed,
          startTime: sync.startTime,
        },
      });

      // Start sync process
      this.performSync(sync);

      return sync;
    } catch (error) {
      console.error('Failed to start sync:', error);
      throw new Error('Failed to start sync');
    }
  }

  async getSyncStatus(syncId: string): Promise<IntegrationSync | null> {
    try {
      const sync = await prisma.integrationSync.findUnique({
        where: { id: syncId },
      });

      if (!sync) return null;

      return {
        id: sync.id,
        integrationId: sync.integrationId,
        syncType: sync.syncType as 'full' | 'incremental' | 'webhook',
        status: sync.status as 'running' | 'completed' | 'failed',
        recordsProcessed: sync.recordsProcessed,
        startTime: sync.startTime,
        endTime: sync.endTime,
        error: sync.error,
      };
    } catch (error) {
      console.error('Failed to get sync status:', error);
      return null;
    }
  }

  // Integration health monitoring
  async checkIntegrationHealth(integrationId: string): Promise<{ healthy: boolean; issues: string[] }> {
    try {
      const integration = await this.getIntegration(integrationId);
      if (!integration) {
        return { healthy: false, issues: ['Integration not found'] };
      }

      const issues: string[] = [];

      // Check error count
      if (integration.errorCount > 10) {
        issues.push('High error count');
      }

      // Check last sync
      if (integration.lastSync) {
        const hoursSinceSync = (Date.now() - integration.lastSync.getTime()) / (1000 * 60 * 60);
        if (hoursSinceSync > 24) {
          issues.push('No recent sync');
        }
      }

      // Check status
      if (integration.status === 'error') {
        issues.push('Integration in error state');
      }

      return {
        healthy: issues.length === 0,
        issues,
      };
    } catch (error) {
      console.error('Failed to check integration health:', error);
      return { healthy: false, issues: ['Health check failed'] };
    }
  }

  // Helper methods
  private generateIntegrationId(): string {
    return `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateWebhookEventId(): string {
    return `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCredentialId(): string {
    return `cred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSyncId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async encryptValue(value: string): Promise<string> {
    const algorithm = 'aes-256-gcm';
    const key = process.env.ENCRYPTION_KEY || 'default-integration-key-32-chars';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return JSON.stringify({
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm,
    });
  }

  private async decryptValue(encryptedValue: string): Promise<string> {
    const data = JSON.parse(encryptedValue);
    const key = process.env.ENCRYPTION_KEY || 'default-integration-key-32-chars';
    const decipher = crypto.createDecipher(data.algorithm, key);
    
    decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));
    
    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  private async incrementIntegrationErrorCount(integrationId: string): Promise<void> {
    try {
      await prisma.integration.update({
        where: { id: integrationId },
        data: {
          errorCount: { increment: 1 },
        },
      });
    } catch (error) {
      console.error('Failed to increment error count:', error);
    }
  }

  private async performSync(sync: IntegrationSync): Promise<void> {
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Update sync status
      await prisma.integrationSync.update({
        where: { id: sync.id },
        data: {
          status: 'completed',
          endTime: new Date(),
          recordsProcessed: Math.floor(Math.random() * 1000) + 100,
        },
      });

      // Update integration last sync
      await prisma.integration.update({
        where: { id: sync.integrationId },
        data: {
          lastSync: new Date(),
        },
      });
    } catch (error) {
      console.error('Sync failed:', error);
      
      await prisma.integrationSync.update({
        where: { id: sync.id },
        data: {
          status: 'failed',
          endTime: new Date(),
          error: error.message,
        },
      });
    }
  }

  private initializeIntegrations(): void {
    // Initialize with default integrations
    const defaultIntegrations = [
      {
        name: 'Stripe Payment',
        type: 'api' as const,
        provider: 'stripe',
        config: { webhookEndpoint: '/api/webhooks/stripe' },
      },
      {
        name: 'Slack Notifications',
        type: 'webhook' as const,
        provider: 'slack',
        config: { webhookUrl: process.env.SLACK_WEBHOOK_URL },
      },
      {
        name: 'Google Analytics',
        type: 'api' as const,
        provider: 'google',
        config: { trackingId: process.env.GA_TRACKING_ID },
      },
    ];

    defaultIntegrations.forEach(async (integration) => {
      try {
        await this.createIntegration(
          integration.name,
          integration.type,
          integration.provider,
          integration.config
        );
      } catch (error) {
        console.error(`Failed to initialize ${integration.name}:`, error);
      }
    });
  }

  private setupWebhookHandlers(): void {
    // Register default webhook handlers
    this.registerWebhook('stripe', 'payment.succeeded', async (payload: any) => {
      console.log('Processing Stripe payment succeeded:', payload);
      return { success: true };
    });

    this.registerWebhook('stripe', 'payment.failed', async (payload: any) => {
      console.log('Processing Stripe payment failed:', payload);
      return { success: true };
    });

    this.registerWebhook('slack', 'notification', async (payload: any) => {
      console.log('Processing Slack notification:', payload);
      return { success: true };
    });
  }
}

// Export integration manager instance
export const integrationManager = new IntegrationManager(); 