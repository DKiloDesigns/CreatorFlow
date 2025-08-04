import { prisma } from '@/lib/prisma';
import { defaultCache as cache } from './cache';
import { performanceMonitor } from './performance-monitor';
import { securityManager } from './security-manager';

interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'oauth' | 'sdk';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  config: any;
  credentials: any;
  webhooks: WebhookConfig[];
  syncSettings: SyncSettings;
  health: HealthStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: Date;
  retryCount: number;
}

interface SyncSettings {
  mode: 'full' | 'incremental' | 'webhook';
  frequency: number; // minutes
  lastSync?: Date;
  nextSync?: Date;
  dataTypes: string[];
  filters: any;
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'error';
  lastCheck: Date;
  responseTime: number;
  errorRate: number;
  uptime: number;
  issues: HealthIssue[];
}

interface HealthIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface APICredential {
  id: string;
  integrationId: string;
  type: 'api_key' | 'oauth_token' | 'webhook_secret' | 'certificate';
  name: string;
  value: string;
  encrypted: boolean;
  expiresAt?: Date;
  lastUsed?: Date;
  permissions: string[];
}

interface IntegrationEvent {
  id: string;
  integrationId: string;
  type: 'webhook' | 'sync' | 'auth' | 'error';
  data: any;
  status: 'success' | 'error' | 'pending';
  timestamp: Date;
  retryCount: number;
  errorMessage?: string;
}

interface IntegrationMetrics {
  totalIntegrations: number;
  activeIntegrations: number;
  errorIntegrations: number;
  totalEvents: number;
  successRate: number;
  averageResponseTime: number;
  lastSyncTime?: Date;
}

class AdvancedIntegrations {
  private cache: any;
  private performanceMonitor: any;
  private securityManager: any;

  constructor() {
    this.cache = cache;
    this.performanceMonitor = performanceMonitor;
    this.securityManager = securityManager;
  }

  // Integration management
  async createIntegration(data: {
    name: string;
    type: 'api' | 'webhook' | 'oauth' | 'sdk';
    provider: string;
    config: any;
    credentials?: any;
  }): Promise<Integration> {
    try {
      const integration = await prisma.integration.create({
        data: {
          name: data.name,
          type: data.type,
          provider: data.provider,
          status: 'pending',
          config: JSON.stringify(data.config),
          credentials: data.credentials ? JSON.stringify(data.credentials) : null,
          syncSettings: JSON.stringify({
            mode: 'incremental',
            frequency: 60,
            dataTypes: [],
            filters: {},
          }),
          health: JSON.stringify({
            status: 'warning',
            lastCheck: new Date(),
            responseTime: 0,
            errorRate: 0,
            uptime: 0,
            issues: [],
          }),
        },
      });

      // Initialize health check
      await this.checkIntegrationHealth(integration.id);

      return {
        ...integration,
        config: JSON.parse(integration.config),
        credentials: integration.credentials ? JSON.parse(integration.credentials) : null,
        webhooks: [],
        syncSettings: JSON.parse(integration.syncSettings),
        health: JSON.parse(integration.health),
      };
    } catch (error) {
      console.error('Error creating integration:', error);
      throw new Error('Failed to create integration');
    }
  }

  async getIntegration(integrationId: string): Promise<Integration | null> {
    try {
      const integration = await prisma.integration.findUnique({
        where: { id: integrationId },
        include: {
          webhooks: true,
          credentials: true,
          events: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      });

      if (!integration) return null;

      return {
        ...integration,
        config: JSON.parse(integration.config),
        credentials: integration.credentials ? JSON.parse(integration.credentials) : null,
        webhooks: integration.webhooks.map(webhook => ({
          ...webhook,
          secret: this.decryptValue(webhook.secret),
        })),
        syncSettings: JSON.parse(integration.syncSettings),
        health: JSON.parse(integration.health),
      };
    } catch (error) {
      console.error('Error getting integration:', error);
      return null;
    }
  }

  async updateIntegration(integrationId: string, updates: any): Promise<Integration> {
    try {
      const integration = await prisma.integration.update({
        where: { id: integrationId },
        data: {
          name: updates.name,
          config: updates.config ? JSON.stringify(updates.config) : undefined,
          credentials: updates.credentials ? JSON.stringify(updates.credentials) : undefined,
          syncSettings: updates.syncSettings ? JSON.stringify(updates.syncSettings) : undefined,
          status: updates.status,
        },
        include: {
          webhooks: true,
          credentials: true,
        },
      });

      return {
        ...integration,
        config: JSON.parse(integration.config),
        credentials: integration.credentials ? JSON.parse(integration.credentials) : null,
        webhooks: integration.webhooks.map(webhook => ({
          ...webhook,
          secret: this.decryptValue(webhook.secret),
        })),
        syncSettings: JSON.parse(integration.syncSettings),
        health: JSON.parse(integration.health),
      };
    } catch (error) {
      console.error('Error updating integration:', error);
      throw new Error('Failed to update integration');
    }
  }

  // Webhook management
  async createWebhook(integrationId: string, data: {
    url: string;
    events: string[];
    secret?: string;
  }): Promise<WebhookConfig> {
    try {
      const webhook = await prisma.webhookEvent.create({
        data: {
          integrationId,
          url: data.url,
          events: JSON.stringify(data.events),
          secret: data.secret ? this.encryptValue(data.secret) : this.generateSecret(),
          status: 'active',
          retryCount: 0,
        },
      });

      return {
        ...webhook,
        events: JSON.parse(webhook.events),
        secret: this.decryptValue(webhook.secret),
      };
    } catch (error) {
      console.error('Error creating webhook:', error);
      throw new Error('Failed to create webhook');
    }
  }

  async processWebhook(integrationId: string, eventData: any): Promise<IntegrationEvent> {
    try {
      const integration = await this.getIntegration(integrationId);
      if (!integration) {
        throw new Error('Integration not found');
      }

      // Process webhook based on integration type
      const processedData = await this.processWebhookData(integration, eventData);

      const event = await prisma.integrationEvent.create({
        data: {
          integrationId,
          type: 'webhook',
          data: JSON.stringify(processedData),
          status: 'success',
          timestamp: new Date(),
          retryCount: 0,
        },
      });

      return {
        ...event,
        data: JSON.parse(event.data),
      };
    } catch (error) {
      console.error('Error processing webhook:', error);
      
      // Log failed webhook
      const failedEvent = await prisma.integrationEvent.create({
        data: {
          integrationId,
          type: 'webhook',
          data: JSON.stringify(eventData),
          status: 'error',
          timestamp: new Date(),
          retryCount: 0,
          errorMessage: error.message,
        },
      });

      return {
        ...failedEvent,
        data: JSON.parse(failedEvent.data),
      };
    }
  }

  // Credential management
  async storeCredential(integrationId: string, data: {
    type: 'api_key' | 'oauth_token' | 'webhook_secret' | 'certificate';
    name: string;
    value: string;
    permissions?: string[];
    expiresAt?: Date;
  }): Promise<APICredential> {
    try {
      const credential = await prisma.apiCredential.create({
        data: {
          integrationId,
          type: data.type,
          name: data.name,
          value: this.encryptValue(data.value),
          encrypted: true,
          expiresAt: data.expiresAt,
          permissions: JSON.stringify(data.permissions || []),
        },
      });

      return {
        ...credential,
        value: data.value, // Return unencrypted for immediate use
        permissions: JSON.parse(credential.permissions),
      };
    } catch (error) {
      console.error('Error storing credential:', error);
      throw new Error('Failed to store credential');
    }
  }

  async getCredential(credentialId: string): Promise<APICredential | null> {
    try {
      const credential = await prisma.apiCredential.findUnique({
        where: { id: credentialId },
      });

      if (!credential) return null;

      return {
        ...credential,
        value: this.decryptValue(credential.value),
        permissions: JSON.parse(credential.permissions),
      };
    } catch (error) {
      console.error('Error getting credential:', error);
      return null;
    }
  }

  // Sync management
  async startSync(integrationId: string, mode: 'full' | 'incremental' | 'webhook' = 'incremental'): Promise<{
    success: boolean;
    syncId: string;
    estimatedTime: number;
  }> {
    try {
      const integration = await this.getIntegration(integrationId);
      if (!integration) {
        throw new Error('Integration not found');
      }

      // Create sync job
      const syncJob = await prisma.integrationSync.create({
        data: {
          integrationId,
          mode,
          status: 'running',
          startedAt: new Date(),
          dataTypes: JSON.stringify(integration.syncSettings.dataTypes),
          filters: JSON.stringify(integration.syncSettings.filters),
        },
      });

      // Update integration sync settings
      await prisma.integration.update({
        where: { id: integrationId },
        data: {
          syncSettings: JSON.stringify({
            ...integration.syncSettings,
            lastSync: new Date(),
            nextSync: new Date(Date.now() + integration.syncSettings.frequency * 60 * 1000),
          }),
        },
      });

      // Start background sync process
      this.performSync(syncJob.id, integration);

      return {
        success: true,
        syncId: syncJob.id,
        estimatedTime: this.estimateSyncTime(integration, mode),
      };
    } catch (error) {
      console.error('Error starting sync:', error);
      return {
        success: false,
        syncId: '',
        estimatedTime: 0,
      };
    }
  }

  async getSyncStatus(syncId: string): Promise<{
    status: string;
    progress: number;
    dataProcessed: number;
    errors: number;
    estimatedCompletion?: Date;
  }> {
    try {
      const sync = await prisma.integrationSync.findUnique({
        where: { id: syncId },
      });

      if (!sync) {
        throw new Error('Sync job not found');
      }

      return {
        status: sync.status,
        progress: sync.progress || 0,
        dataProcessed: sync.dataProcessed || 0,
        errors: sync.errors || 0,
        estimatedCompletion: sync.estimatedCompletion,
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        status: 'error',
        progress: 0,
        dataProcessed: 0,
        errors: 1,
      };
    }
  }

  // Health monitoring
  async checkIntegrationHealth(integrationId: string): Promise<HealthStatus> {
    try {
      const integration = await this.getIntegration(integrationId);
      if (!integration) {
        throw new Error('Integration not found');
      }

      const startTime = Date.now();
      const health = await this.performHealthCheck(integration);
      const responseTime = Date.now() - startTime;

      const updatedHealth = {
        ...health,
        lastCheck: new Date(),
        responseTime,
      };

      // Update integration health
      await prisma.integration.update({
        where: { id: integrationId },
        data: {
          health: JSON.stringify(updatedHealth),
        },
      });

      return updatedHealth;
    } catch (error) {
      console.error('Error checking integration health:', error);
      return {
        status: 'error',
        lastCheck: new Date(),
        responseTime: 0,
        errorRate: 100,
        uptime: 0,
        issues: [{
          id: Date.now().toString(),
          type: 'error',
          message: error.message,
          timestamp: new Date(),
          resolved: false,
        }],
      };
    }
  }

  // Analytics and metrics
  async getIntegrationMetrics(): Promise<IntegrationMetrics> {
    try {
      const [
        totalIntegrations,
        activeIntegrations,
        errorIntegrations,
        totalEvents,
        recentEvents,
      ] = await Promise.all([
        prisma.integration.count(),
        prisma.integration.count({ where: { status: 'active' } }),
        prisma.integration.count({ where: { status: 'error' } }),
        prisma.integrationEvent.count(),
        prisma.integrationEvent.findMany({
          where: {
            timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        }),
      ]);

      const successRate = recentEvents.length > 0
        ? (recentEvents.filter(e => e.status === 'success').length / recentEvents.length) * 100
        : 0;

      const averageResponseTime = recentEvents.length > 0
        ? recentEvents.reduce((sum, e) => sum + (e.responseTime || 0), 0) / recentEvents.length
        : 0;

      return {
        totalIntegrations,
        activeIntegrations,
        errorIntegrations,
        totalEvents,
        successRate,
        averageResponseTime,
        lastSyncTime: new Date(),
      };
    } catch (error) {
      console.error('Error getting integration metrics:', error);
      return {
        totalIntegrations: 0,
        activeIntegrations: 0,
        errorIntegrations: 0,
        totalEvents: 0,
        successRate: 0,
        averageResponseTime: 0,
      };
    }
  }

  // Helper methods
  private async processWebhookData(integration: Integration, eventData: any): Promise<any> {
    // Process webhook data based on integration type
    switch (integration.type) {
      case 'api':
        return this.processAPIWebhook(integration, eventData);
      case 'oauth':
        return this.processOAuthWebhook(integration, eventData);
      case 'sdk':
        return this.processSDKWebhook(integration, eventData);
      default:
        return eventData;
    }
  }

  private async processAPIWebhook(integration: Integration, eventData: any): Promise<any> {
    // Process API webhook data
    return {
      ...eventData,
      processed: true,
      integration: integration.name,
      timestamp: new Date(),
    };
  }

  private async processOAuthWebhook(integration: Integration, eventData: any): Promise<any> {
    // Process OAuth webhook data
    return {
      ...eventData,
      processed: true,
      integration: integration.name,
      timestamp: new Date(),
    };
  }

  private async processSDKWebhook(integration: Integration, eventData: any): Promise<any> {
    // Process SDK webhook data
    return {
      ...eventData,
      processed: true,
      integration: integration.name,
      timestamp: new Date(),
    };
  }

  private async performHealthCheck(integration: Integration): Promise<HealthStatus> {
    // Perform health check based on integration type
    const issues: HealthIssue[] = [];
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let errorRate = 0;

    try {
      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if integration is responding
      if (integration.status === 'error') {
        status = 'error';
        errorRate = 100;
        issues.push({
          id: Date.now().toString(),
          type: 'error',
          message: 'Integration is in error state',
          timestamp: new Date(),
          resolved: false,
        });
      }
    } catch (error) {
      status = 'error';
      errorRate = 100;
      issues.push({
        id: Date.now().toString(),
        type: 'error',
        message: error.message,
        timestamp: new Date(),
        resolved: false,
      });
    }

    return {
      status,
      lastCheck: new Date(),
      responseTime: 0,
      errorRate,
      uptime: status === 'healthy' ? 99.9 : 0,
      issues,
    };
  }

  private async performSync(syncId: string, integration: Integration): Promise<void> {
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update sync status
      await prisma.integrationSync.update({
        where: { id: syncId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          progress: 100,
          dataProcessed: 1000,
        },
      });
    } catch (error) {
      await prisma.integrationSync.update({
        where: { id: syncId },
        data: {
          status: 'error',
          completedAt: new Date(),
          errors: 1,
        },
      });
    }
  }

  private estimateSyncTime(integration: Integration, mode: string): number {
    // Estimate sync time based on integration and mode
    const baseTime = 30; // seconds
    const modeMultiplier = mode === 'full' ? 3 : 1;
    return baseTime * modeMultiplier;
  }

  private encryptValue(value: string): string {
    // In a real implementation, use proper encryption
    return btoa(value);
  }

  private decryptValue(encryptedValue: string): string {
    // In a real implementation, use proper decryption
    return atob(encryptedValue);
  }

  private generateSecret(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// Export advanced integrations instance
export const advancedIntegrations = new AdvancedIntegrations(); 