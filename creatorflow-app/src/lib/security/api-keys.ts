import { NextRequest } from 'next/server';
import { getRedisClient } from '../redis';
import crypto from 'crypto';

export interface APIKey {
  id: string;
  name: string;
  keyHash: string;
  permissions: string[];
  rateLimit: {
    requests: number;
    windowMs: number;
  };
  expiresAt?: Date;
  lastUsedAt?: Date;
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
}

export interface CreateAPIKeyRequest {
  name: string;
  permissions: string[];
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  expiresAt?: Date;
  createdBy: string;
}

export class APIKeyManager {
  private static readonly KEY_PREFIX = 'api_key:';
  private static readonly USER_KEYS_PREFIX = 'user_api_keys:';

  static generateKey(): string {
    return `cf_${crypto.randomBytes(32).toString('hex')}`;
  }

  static hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  static async createKey(request: CreateAPIKeyRequest): Promise<{ key: string; apiKey: APIKey }> {
    const key = this.generateKey();
    const keyHash = this.hashKey(key);
    const id = crypto.randomUUID();

    const apiKey: APIKey = {
      id,
      name: request.name,
      keyHash,
      permissions: request.permissions,
      rateLimit: request.rateLimit || { requests: 1000, windowMs: 3600000 }, // 1000 requests per hour
      expiresAt: request.expiresAt,
      createdAt: new Date(),
      createdBy: request.createdBy,
      isActive: true,
    };

    try {
      const client = await getRedisClient();
      if (client) {
        // Store the API key
        await client.hset(`${this.KEY_PREFIX}${id}`, {
          id: apiKey.id,
          name: apiKey.name,
          keyHash: apiKey.keyHash,
          permissions: JSON.stringify(apiKey.permissions),
          rateLimit: JSON.stringify(apiKey.rateLimit),
          expiresAt: apiKey.expiresAt?.toISOString() || '',
          createdAt: apiKey.createdAt.toISOString(),
          createdBy: apiKey.createdBy,
          isActive: apiKey.isActive.toString(),
        });

        // Add to user's key list
        await client.sadd(`${this.USER_KEYS_PREFIX}${request.createdBy}`, id);

        // Set expiration if specified
        if (apiKey.expiresAt) {
          const ttl = Math.floor((apiKey.expiresAt.getTime() - Date.now()) / 1000);
          if (ttl > 0) {
            await client.expire(`${this.KEY_PREFIX}${id}`, ttl);
          }
        }
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw new Error('Failed to create API key');
    }

    return { key, apiKey };
  }

  static async getKeyById(id: string): Promise<APIKey | null> {
    try {
      const client = await getRedisClient();
      if (!client) return null;

      const keyData = await client.hgetall(`${this.KEY_PREFIX}${id}`);
      if (!keyData || Object.keys(keyData).length === 0) return null;

      return {
        id: keyData.id,
        name: keyData.name,
        keyHash: keyData.keyHash,
        permissions: JSON.parse(keyData.permissions || '[]'),
        rateLimit: JSON.parse(keyData.rateLimit || '{"requests":1000,"windowMs":3600000}'),
        expiresAt: keyData.expiresAt ? new Date(keyData.expiresAt) : undefined,
        lastUsedAt: keyData.lastUsedAt ? new Date(keyData.lastUsedAt) : undefined,
        createdAt: new Date(keyData.createdAt),
        createdBy: keyData.createdBy,
        isActive: keyData.isActive === 'true',
      };
    } catch (error) {
      console.error('Failed to get API key:', error);
      return null;
    }
  }

  static async getKeyByHash(keyHash: string): Promise<APIKey | null> {
    try {
      const client = await getRedisClient();
      if (!client) return null;

      // This is inefficient for large numbers of keys, but Redis doesn't support querying by hash value
      // In production, consider using a separate index or a different storage approach
      const pattern = `${this.KEY_PREFIX}*`;
      const keys = await client.keys(pattern);
      
      for (const key of keys) {
        const keyData = await client.hgetall(key);
        if (keyData.keyHash === keyHash) {
          return {
            id: keyData.id,
            name: keyData.name,
            keyHash: keyData.keyHash,
            permissions: JSON.parse(keyData.permissions || '[]'),
            rateLimit: JSON.parse(keyData.rateLimit || '{"requests":1000,"windowMs":3600000}'),
            expiresAt: keyData.expiresAt ? new Date(keyData.expiresAt) : undefined,
            lastUsedAt: keyData.lastUsedAt ? new Date(keyData.lastUsedAt) : undefined,
            createdAt: new Date(keyData.createdAt),
            createdBy: keyData.createdBy,
            isActive: keyData.isActive === 'true',
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get API key by hash:', error);
      return null;
    }
  }

  static async validateKey(key: string): Promise<{ valid: boolean; apiKey?: APIKey; error?: string }> {
    try {
      const keyHash = this.hashKey(key);
      const apiKey = await this.getKeyByHash(keyHash);

      if (!apiKey) {
        return { valid: false, error: 'Invalid API key' };
      }

      if (!apiKey.isActive) {
        return { valid: false, error: 'API key is inactive' };
      }

      if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return { valid: false, error: 'API key has expired' };
      }

      // Update last used timestamp
      await this.updateLastUsed(apiKey.id);

      return { valid: true, apiKey };
    } catch (error) {
      console.error('Failed to validate API key:', error);
      return { valid: false, error: 'Failed to validate API key' };
    }
  }

  static async updateLastUsed(id: string): Promise<void> {
    try {
      const client = await getRedisClient();
      if (client) {
        await client.hset(`${this.KEY_PREFIX}${id}`, {
          lastUsedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to update last used timestamp:', error);
    }
  }

  static async revokeKey(id: string): Promise<boolean> {
    try {
      const client = await getRedisClient();
      if (!client) return false;

      const apiKey = await this.getKeyById(id);
      if (!apiKey) return false;

      // Mark as inactive instead of deleting
      await client.hset(`${this.KEY_PREFIX}${id}`, {
        isActive: 'false',
      });

      return true;
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      return false;
    }
  }

  static async getUserKeys(userId: string): Promise<APIKey[]> {
    try {
      const client = await getRedisClient();
      if (!client) return [];

      // Use a different approach for getting user keys
      const pattern = `${this.USER_KEYS_PREFIX}${userId}:*`;
      const keyPatterns = await client.keys(pattern);
      const keys: APIKey[] = [];

      for (const keyPattern of keyPatterns) {
        const keyData = await client.get(keyPattern);
        if (keyData) {
          try {
            const key = JSON.parse(keyData) as APIKey;
            keys.push(key);
          } catch (error) {
            console.error('Error parsing API key data:', error);
          }
        }
      }

      return keys.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Failed to get user API keys:', error);
      return [];
    }
  }
}

export function extractAPIKey(req: NextRequest): string | null {
  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check X-API-Key header
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  // Check query parameter (less secure, but sometimes needed)
  const url = new URL(req.url);
  const apiKeyParam = url.searchParams.get('api_key');
  if (apiKeyParam) {
    return apiKeyParam;
  }

  return null;
}

export async function requireAPIKey(req: NextRequest, requiredPermissions: string[] = []): Promise<{ valid: boolean; apiKey?: APIKey; error?: string }> {
  const key = extractAPIKey(req);
  if (!key) {
    return { valid: false, error: 'API key required' };
  }

  const validation = await APIKeyManager.validateKey(key);
  if (!validation.valid) {
    return validation;
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every(permission => 
      validation.apiKey!.permissions.includes(permission) || 
      validation.apiKey!.permissions.includes('*')
    );

    if (!hasPermission) {
      return { valid: false, error: 'Insufficient permissions' };
    }
  }

  return validation;
}
