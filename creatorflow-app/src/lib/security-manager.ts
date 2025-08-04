import { prisma } from '@/lib/prisma';
import { defaultCache as cache } from './cache';
import crypto from 'crypto';

interface SecurityEvent {
  id: string;
  userId?: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

interface SecurityRule {
  id: string;
  name: string;
  type: 'rate_limit' | 'pattern_match' | 'behavior_analysis' | 'geo_block';
  conditions: any;
  actions: string[];
  enabled: boolean;
  priority: number;
}

interface ThreatDetection {
  threatId: string;
  type: 'brute_force' | 'suspicious_activity' | 'data_breach' | 'malware' | 'phishing';
  confidence: number;
  indicators: string[];
  affectedUsers: string[];
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
}

interface SecurityAudit {
  id: string;
  userId: string;
  action: string;
  resource: string;
  success: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  metadata: any;
}

class SecurityManager {
  private securityRules: SecurityRule[] = [];
  private threatPatterns: Map<string, RegExp> = new Map();
  private blockedIPs: Set<string> = new Set();
  private suspiciousUsers: Map<string, number> = new Map();

  constructor() {
    this.initializeSecurityRules();
    this.initializeThreatPatterns();
  }

  // Authentication security
  async validateLoginAttempt(userId: string, password: string, ipAddress: string, userAgent: string): Promise<{ success: boolean; reason?: string; requires2FA?: boolean }> {
    try {
      // Check for brute force attempts
      const bruteForceCheck = await this.checkBruteForceAttempt(userId, ipAddress);
      if (!bruteForceCheck.allowed) {
        await this.logSecurityEvent('BRUTE_FORCE_ATTEMPT', 'high', {
          userId,
          ipAddress,
          attempts: bruteForceCheck.attempts,
        });
        return { success: false, reason: 'Too many failed attempts' };
      }

      // Check for suspicious IP
      const ipCheck = await this.checkSuspiciousIP(ipAddress);
      if (ipCheck.suspicious) {
        await this.logSecurityEvent('SUSPICIOUS_IP_LOGIN', 'medium', {
          userId,
          ipAddress,
          location: ipCheck.location,
        });
      }

      // Validate password strength
      const passwordCheck = await this.validatePasswordStrength(password);
      if (!passwordCheck.strong) {
        await this.logSecurityEvent('WEAK_PASSWORD_ATTEMPT', 'low', {
          userId,
          strength: passwordCheck.strength,
        });
      }

      // Check if 2FA is required
      const requires2FA = await this.check2FARequirement(userId, ipAddress);

      // Log successful login
      await this.logSecurityEvent('SUCCESSFUL_LOGIN', 'low', {
        userId,
        ipAddress,
        userAgent,
        requires2FA,
      });

      return { success: true, requires2FA };
    } catch (error) {
      console.error('Login validation error:', error);
      return { success: false, reason: 'Security validation failed' };
    }
  }

  // Authorization security
  async validateAccess(userId: string, resource: string, action: string, context?: any): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Check user permissions
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user) {
        return { allowed: false, reason: 'User not found' };
      }

      // Check role-based access
      const roleCheck = await this.checkRoleAccess(user.role?.name || 'user', resource, action);
      if (!roleCheck.allowed) {
        await this.logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', 'medium', {
          userId,
          resource,
          action,
          role: user.role?.name,
        });
        return { allowed: false, reason: 'Insufficient permissions' };
      }

      // Check resource-specific permissions
      const resourceCheck = await this.checkResourcePermissions(userId, resource, action);
      if (!resourceCheck.allowed) {
        await this.logSecurityEvent('RESOURCE_ACCESS_DENIED', 'medium', {
          userId,
          resource,
          action,
          reason: resourceCheck.reason,
        });
        return { allowed: false, reason: resourceCheck.reason };
      }

      // Log successful access
      await this.logSecurityEvent('SUCCESSFUL_ACCESS', 'low', {
        userId,
        resource,
        action,
        context,
      });

      return { allowed: true };
    } catch (error) {
      console.error('Access validation error:', error);
      return { allowed: false, reason: 'Security validation failed' };
    }
  }

  // Data protection
  async encryptSensitiveData(data: string, keyType: 'user' | 'system' = 'user'): Promise<string> {
    try {
      const algorithm = 'aes-256-gcm';
      const key = this.getEncryptionKey(keyType);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(algorithm, key);
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return JSON.stringify({
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm,
      });
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  async decryptSensitiveData(encryptedData: string, keyType: 'user' | 'system' = 'user'): Promise<string> {
    try {
      const data = JSON.parse(encryptedData);
      const key = this.getEncryptionKey(keyType);
      const decipher = crypto.createDecipher(data.algorithm, key);
      
      decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));
      
      let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Threat detection
  async detectThreats(userId: string, action: string, context: any): Promise<ThreatDetection[]> {
    const threats: ThreatDetection[] = [];

    try {
      // Check for suspicious behavior patterns
      const behaviorThreat = await this.analyzeUserBehavior(userId, action, context);
      if (behaviorThreat) {
        threats.push(behaviorThreat);
      }

      // Check for data access anomalies
      const dataThreat = await this.detectDataAccessAnomalies(userId, action, context);
      if (dataThreat) {
        threats.push(dataThreat);
      }

      // Check for API abuse
      const apiThreat = await this.detectAPIAbuse(userId, action, context);
      if (apiThreat) {
        threats.push(apiThreat);
      }

      // Log threats
      for (const threat of threats) {
        await this.logSecurityEvent('THREAT_DETECTED', 'high', {
          threatId: threat.threatId,
          type: threat.type,
          confidence: threat.confidence,
          indicators: threat.indicators,
        });
      }

      return threats;
    } catch (error) {
      console.error('Threat detection error:', error);
      return threats;
    }
  }

  // Security monitoring
  async monitorSecurityEvents(timeRange: { start: Date; end: Date }): Promise<SecurityEvent[]> {
    try {
      const events = await prisma.securityEvent.findMany({
        where: {
          timestamp: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 1000,
      });

      return events.map(event => ({
        id: event.id,
        userId: event.userId,
        eventType: event.eventType,
        severity: event.severity as 'low' | 'medium' | 'high' | 'critical',
        description: event.description,
        metadata: JSON.parse(event.metadata),
        timestamp: event.timestamp,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
      }));
    } catch (error) {
      console.error('Security monitoring error:', error);
      return [];
    }
  }

  // Security audit
  async auditUserActivity(userId: string, timeRange: { start: Date; end: Date }): Promise<SecurityAudit[]> {
    try {
      const audits = await prisma.securityAudit.findMany({
        where: {
          userId,
          timestamp: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
        },
        orderBy: { timestamp: 'desc' },
      });

      return audits.map(audit => ({
        id: audit.id,
        userId: audit.userId,
        action: audit.action,
        resource: audit.resource,
        success: audit.success,
        timestamp: audit.timestamp,
        ipAddress: audit.ipAddress,
        userAgent: audit.userAgent,
        metadata: JSON.parse(audit.metadata),
      }));
    } catch (error) {
      console.error('Security audit error:', error);
      return [];
    }
  }

  // Helper methods
  private async checkBruteForceAttempt(userId: string, ipAddress: string): Promise<{ allowed: boolean; attempts: number }> {
    const cacheKey = `brute_force:${userId}:${ipAddress}`;
    const attempts = await cache.get<number>(cacheKey) || 0;
    
    if (attempts >= 5) {
      return { allowed: false, attempts };
    }
    
    return { allowed: true, attempts };
  }

  private async checkSuspiciousIP(ipAddress: string): Promise<{ suspicious: boolean; location?: string }> {
    // Check against known malicious IPs
    if (this.blockedIPs.has(ipAddress)) {
      return { suspicious: true };
    }

    // Mock geolocation check
    const location = await this.getIPLocation(ipAddress);
    const suspiciousCountries = ['XX', 'YY', 'ZZ']; // Example blocked countries
    
    return {
      suspicious: suspiciousCountries.includes(location?.country || ''),
      location: location?.country,
    };
  }

  private async validatePasswordStrength(password: string): Promise<{ strong: boolean; strength: number }> {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return {
      strong: strength >= 4,
      strength: strength,
    };
  }

  private async check2FARequirement(userId: string, ipAddress: string): Promise<boolean> {
    // Check if user has 2FA enabled
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });
    
    if (!user?.twoFactorEnabled) {
      return false;
    }

    // Check if login is from new location
    const lastLogin = await this.getLastLoginLocation(userId);
    const currentLocation = await this.getIPLocation(ipAddress);
    
    return lastLogin?.country !== currentLocation?.country;
  }

  private async checkRoleAccess(role: string, resource: string, action: string): Promise<{ allowed: boolean }> {
    const permissions = {
      admin: ['*'],
      marketing_director: ['analytics', 'campaign', 'feedback', 'performance'],
      user: ['dashboard', 'content', 'accounts'],
    };

    const userPermissions = permissions[role as keyof typeof permissions] || [];
    
    if (userPermissions.includes('*')) {
      return { allowed: true };
    }

    return { allowed: userPermissions.includes(resource) };
  }

  private async checkResourcePermissions(userId: string, resource: string, action: string): Promise<{ allowed: boolean; reason?: string }> {
    // Check if user owns the resource
    if (resource.startsWith('user:')) {
      const resourceUserId = resource.split(':')[1];
      if (resourceUserId !== userId) {
        return { allowed: false, reason: 'Resource ownership required' };
      }
    }

    return { allowed: true };
  }

  private getEncryptionKey(keyType: 'user' | 'system'): string {
    const systemKey = process.env.ENCRYPTION_KEY || 'default-system-key-32-chars-long';
    const userKey = process.env.USER_ENCRYPTION_KEY || 'default-user-key-32-chars-long';
    
    return keyType === 'user' ? userKey : systemKey;
  }

  private async analyzeUserBehavior(userId: string, action: string, context: any): Promise<ThreatDetection | null> {
    // Get user's recent activity
    const recentActivity = await this.getUserRecentActivity(userId, 24); // Last 24 hours
    
    // Check for unusual patterns
    const unusualPatterns = this.detectUnusualPatterns(recentActivity, action, context);
    
    if (unusualPatterns.length > 0) {
      return {
        threatId: `behavior_${Date.now()}`,
        type: 'suspicious_activity',
        confidence: 0.7,
        indicators: unusualPatterns,
        affectedUsers: [userId],
        timestamp: new Date(),
        status: 'active',
      };
    }
    
    return null;
  }

  private async detectDataAccessAnomalies(userId: string, action: string, context: any): Promise<ThreatDetection | null> {
    // Check for bulk data access
    if (action === 'data_export' && context?.recordCount > 1000) {
      return {
        threatId: `data_anomaly_${Date.now()}`,
        type: 'data_breach',
        confidence: 0.8,
        indicators: ['Bulk data export', 'Unusual access pattern'],
        affectedUsers: [userId],
        timestamp: new Date(),
        status: 'active',
      };
    }
    
    return null;
  }

  private async detectAPIAbuse(userId: string, action: string, context: any): Promise<ThreatDetection | null> {
    // Check API rate limits
    const apiKey = `api_usage:${userId}`;
    const usage = await cache.get<number>(apiKey) || 0;
    
    if (usage > 1000) { // More than 1000 API calls per hour
      return {
        threatId: `api_abuse_${Date.now()}`,
        type: 'suspicious_activity',
        confidence: 0.9,
        indicators: ['Excessive API usage', 'Rate limit exceeded'],
        affectedUsers: [userId],
        timestamp: new Date(),
        status: 'active',
      };
    }
    
    return null;
  }

  private async getUserRecentActivity(userId: string, hours: number): Promise<any[]> {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return await prisma.securityAudit.findMany({
      where: {
        userId,
        timestamp: { gte: startTime },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  private detectUnusualPatterns(activity: any[], action: string, context: any): string[] {
    const patterns: string[] = [];
    
    // Check for rapid-fire actions
    const recentActions = activity.filter(a => 
      a.timestamp > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    );
    
    if (recentActions.length > 50) {
      patterns.push('Rapid-fire actions detected');
    }
    
    // Check for unusual time patterns
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      patterns.push('Unusual activity time');
    }
    
    return patterns;
  }

  private async getIPLocation(ipAddress: string): Promise<{ country?: string; city?: string } | null> {
    // Mock geolocation - in real implementation, use a service like MaxMind
    return {
      country: 'US',
      city: 'San Francisco',
    };
  }

  private async getLastLoginLocation(userId: string): Promise<{ country?: string } | null> {
    const lastLogin = await prisma.securityAudit.findFirst({
      where: {
        userId,
        action: 'LOGIN',
        success: true,
      },
      orderBy: { timestamp: 'desc' },
    });
    
    if (lastLogin?.ipAddress) {
      return await this.getIPLocation(lastLogin.ipAddress);
    }
    
    return null;
  }

  async logSecurityEvent(eventType: string, severity: 'low' | 'medium' | 'high' | 'critical', metadata: any): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          eventType,
          severity,
          description: this.getEventDescription(eventType),
          metadata: JSON.stringify(metadata),
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private getEventDescription(eventType: string): string {
    const descriptions: Record<string, string> = {
      'BRUTE_FORCE_ATTEMPT': 'Multiple failed login attempts detected',
      'SUSPICIOUS_IP_LOGIN': 'Login attempt from suspicious IP address',
      'WEAK_PASSWORD_ATTEMPT': 'Login attempt with weak password',
      'SUCCESSFUL_LOGIN': 'User successfully logged in',
      'UNAUTHORIZED_ACCESS_ATTEMPT': 'Unauthorized access attempt detected',
      'RESOURCE_ACCESS_DENIED': 'Resource access denied due to insufficient permissions',
      'SUCCESSFUL_ACCESS': 'User successfully accessed resource',
      'THREAT_DETECTED': 'Security threat detected and logged',
    };
    
    return descriptions[eventType] || 'Security event occurred';
  }

  private initializeSecurityRules(): void {
    this.securityRules = [
      {
        id: 'rate_limit_auth',
        name: 'Authentication Rate Limiting',
        type: 'rate_limit',
        conditions: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
        actions: ['block_ip', 'require_captcha'],
        enabled: true,
        priority: 1,
      },
      {
        id: 'suspicious_patterns',
        name: 'Suspicious Activity Patterns',
        type: 'pattern_match',
        conditions: { patterns: ['rapid_fire', 'bulk_access', 'unusual_time'] },
        actions: ['flag_user', 'require_verification'],
        enabled: true,
        priority: 2,
      },
    ];
  }

  private initializeThreatPatterns(): void {
    this.threatPatterns.set('sql_injection', /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i);
    this.threatPatterns.set('xss', /(<script|javascript:|on\w+\s*=)/i);
    this.threatPatterns.set('path_traversal', /(\.\.\/|\.\.\\)/);
  }
}

// Export security manager instance
export const securityManager = new SecurityManager(); 