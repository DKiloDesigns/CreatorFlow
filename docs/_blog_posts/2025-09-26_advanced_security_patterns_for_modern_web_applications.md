# Advanced Security Patterns for Modern Web Applications

**A comprehensive guide to implementing robust security patterns in modern web applications, covering authentication, authorization, data protection, and threat mitigation strategies.**

*Published: September 26, 2025*
*Author: Darrell Mayberry*
*Tags: Security, Authentication, Authorization, Web Security, OWASP, Next.js, React*

## Introduction

Security is paramount in modern web applications. This guide explores advanced security patterns, from authentication and authorization to data protection and threat mitigation, providing practical implementations for Next.js and React applications.

## Table of Contents

1. [Authentication Patterns](#authentication-patterns)
2. [Authorization Strategies](#authorization-strategies)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [Client-Side Security](#client-side-security)
6. [Infrastructure Security](#infrastructure-security)
7. [Monitoring and Incident Response](#monitoring-and-incident-response)

## Authentication Patterns

### Multi-Factor Authentication (MFA)

```typescript
// lib/auth/mfa.ts
export class MFAService {
  private totp: TOTP;
  private smsService: SMSService;
  private emailService: EmailService;

  constructor() {
    this.totp = new TOTP();
    this.smsService = new SMSService();
    this.emailService = new EmailService();
  }

  async setupMFA(userId: string): Promise<MFASetup> {
    const secret = this.totp.generateSecret();
    const qrCode = await this.totp.generateQRCode(userId, secret);
    
    await this.storeMFASecret(userId, secret);
    
    return {
      secret,
      qrCode,
      backupCodes: this.generateBackupCodes(),
    };
  }

  async verifyMFA(userId: string, token: string): Promise<boolean> {
    const secret = await this.getMFASecret(userId);
    return this.totp.verify(token, secret);
  }

  async sendSMSChallenge(phoneNumber: string): Promise<string> {
    const code = this.generateSMSCode();
    await this.smsService.send(phoneNumber, `Your verification code: ${code}`);
    return code;
  }

  async sendEmailChallenge(email: string): Promise<string> {
    const code = this.generateEmailCode();
    await this.emailService.send(email, 'Verification Code', `Your code: ${code}`);
    return code;
  }
}
```

### OAuth 2.0 and OpenID Connect

```typescript
// lib/auth/oauth.ts
export class OAuthService {
  private providers: Map<string, OAuthProvider> = new Map();

  constructor() {
    this.registerProvider('google', new GoogleProvider());
    this.registerProvider('github', new GitHubProvider());
    this.registerProvider('microsoft', new MicrosoftProvider());
  }

  async initiateAuth(provider: string, redirectUri: string): Promise<string> {
    const oauthProvider = this.providers.get(provider);
    if (!oauthProvider) {
      throw new Error(`Provider ${provider} not supported`);
    }

    const state = this.generateState();
    const authUrl = oauthProvider.getAuthorizationUrl({
      redirectUri,
      state,
      scopes: ['openid', 'profile', 'email'],
    });

    await this.storeState(state, { provider, redirectUri });
    return authUrl;
  }

  async handleCallback(
    provider: string,
    code: string,
    state: string
  ): Promise<AuthResult> {
    const storedState = await this.getStoredState(state);
    if (!storedState || storedState.provider !== provider) {
      throw new Error('Invalid state parameter');
    }

    const oauthProvider = this.providers.get(provider);
    const tokens = await oauthProvider.exchangeCodeForTokens(code);
    const userInfo = await oauthProvider.getUserInfo(tokens.accessToken);

    return {
      user: userInfo,
      tokens,
      provider,
    };
  }
}
```

## Authorization Strategies

### Role-Based Access Control (RBAC)

```typescript
// lib/auth/rbac.ts
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface Role {
  name: string;
  permissions: Permission[];
  inherits?: string[];
}

export class RBACService {
  private roles: Map<string, Role> = new Map();
  private userRoles: Map<string, string[]> = new Map();

  constructor() {
    this.initializeDefaultRoles();
  }

  private initializeDefaultRoles(): void {
    this.roles.set('admin', {
      name: 'admin',
      permissions: [
        { resource: '*', action: '*' },
      ],
    });

    this.roles.set('user', {
      name: 'user',
      permissions: [
        { resource: 'profile', action: 'read' },
        { resource: 'profile', action: 'update' },
        { resource: 'posts', action: 'create' },
        { resource: 'posts', action: 'read' },
        { resource: 'posts', action: 'update', conditions: { owner: true } },
        { resource: 'posts', action: 'delete', conditions: { owner: true } },
      ],
    });

    this.roles.set('moderator', {
      name: 'moderator',
      permissions: [
        { resource: 'posts', action: 'read' },
        { resource: 'posts', action: 'moderate' },
        { resource: 'users', action: 'read' },
      ],
      inherits: ['user'],
    });
  }

  async assignRole(userId: string, roleName: string): Promise<void> {
    const currentRoles = this.userRoles.get(userId) || [];
    if (!currentRoles.includes(roleName)) {
      currentRoles.push(roleName);
      this.userRoles.set(userId, currentRoles);
    }
  }

  async hasPermission(
    userId: string,
    resource: string,
    action: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    const userRoles = this.userRoles.get(userId) || [];
    
    for (const roleName of userRoles) {
      const role = this.roles.get(roleName);
      if (!role) continue;

      if (this.checkRolePermissions(role, resource, action, context)) {
        return true;
      }
    }

    return false;
  }

  private checkRolePermissions(
    role: Role,
    resource: string,
    action: string,
    context?: Record<string, any>
  ): boolean {
    // Check direct permissions
    for (const permission of role.permissions) {
      if (this.matchesPermission(permission, resource, action, context)) {
        return true;
      }
    }

    // Check inherited roles
    if (role.inherits) {
      for (const inheritedRoleName of role.inherits) {
        const inheritedRole = this.roles.get(inheritedRoleName);
        if (inheritedRole && this.checkRolePermissions(inheritedRole, resource, action, context)) {
          return true;
        }
      }
    }

    return false;
  }

  private matchesPermission(
    permission: Permission,
    resource: string,
    action: string,
    context?: Record<string, any>
  ): boolean {
    // Check resource match
    if (permission.resource !== '*' && permission.resource !== resource) {
      return false;
    }

    // Check action match
    if (permission.action !== '*' && permission.action !== action) {
      return false;
    }

    // Check conditions
    if (permission.conditions && context) {
      for (const [key, value] of Object.entries(permission.conditions)) {
        if (context[key] !== value) {
          return false;
        }
      }
    }

    return true;
  }
}
```

### Attribute-Based Access Control (ABAC)

```typescript
// lib/auth/abac.ts
export interface Policy {
  id: string;
  name: string;
  rules: PolicyRule[];
}

export interface PolicyRule {
  effect: 'allow' | 'deny';
  conditions: Condition[];
}

export interface Condition {
  attribute: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: any;
}

export class ABACService {
  private policies: Map<string, Policy> = new Map();

  async evaluateAccess(
    subject: Record<string, any>,
    resource: Record<string, any>,
    action: string,
    environment: Record<string, any>
  ): Promise<boolean> {
    const context = {
      subject,
      resource,
      action,
      environment,
    };

    for (const policy of this.policies.values()) {
      const result = this.evaluatePolicy(policy, context);
      if (result !== null) {
        return result;
      }
    }

    return false; // Default deny
  }

  private evaluatePolicy(policy: Policy, context: any): boolean | null {
    for (const rule of policy.rules) {
      if (this.evaluateRule(rule, context)) {
        return rule.effect === 'allow';
      }
    }
    return null;
  }

  private evaluateRule(rule: PolicyRule, context: any): boolean {
    return rule.conditions.every(condition => 
      this.evaluateCondition(condition, context)
    );
  }

  private evaluateCondition(condition: Condition, context: any): boolean {
    const attributeValue = this.getAttributeValue(condition.attribute, context);
    
    switch (condition.operator) {
      case 'equals':
        return attributeValue === condition.value;
      case 'not_equals':
        return attributeValue !== condition.value;
      case 'contains':
        return String(attributeValue).includes(String(condition.value));
      case 'starts_with':
        return String(attributeValue).startsWith(String(condition.value));
      case 'ends_with':
        return String(attributeValue).endsWith(String(condition.value));
      case 'greater_than':
        return Number(attributeValue) > Number(condition.value);
      case 'less_than':
        return Number(attributeValue) < Number(condition.value);
      default:
        return false;
    }
  }

  private getAttributeValue(attribute: string, context: any): any {
    const parts = attribute.split('.');
    let value = context;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }
}
```

## Data Protection

### Encryption at Rest and in Transit

```typescript
// lib/security/encryption.ts
export class EncryptionService {
  private encryptionKey: string;
  private algorithm = 'aes-256-gcm';

  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
  }

  async encrypt(data: string): Promise<EncryptedData> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
    cipher.setAAD(Buffer.from('additional-data'));

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  async decrypt(encryptedData: EncryptedData): Promise<string> {
    const decipher = crypto.createDecipher(
      this.algorithm,
      this.encryptionKey
    );
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(32);
    const hash = await bcrypt.hash(password, 12);
    return hash;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
```

### Data Masking and Anonymization

```typescript
// lib/security/data-masking.ts
export class DataMaskingService {
  async maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  }

  async maskPhoneNumber(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  async maskCreditCard(cardNumber: string): string {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  async anonymizeUserData(user: User): Promise<AnonymizedUser> {
    return {
      id: user.id,
      email: await this.maskEmail(user.email),
      name: this.generatePseudonym(),
      createdAt: user.createdAt,
      // Remove sensitive fields
    };
  }

  private generatePseudonym(): string {
    const adjectives = ['Happy', 'Bright', 'Swift', 'Calm', 'Bold'];
    const nouns = ['Tiger', 'Eagle', 'Dolphin', 'Lion', 'Wolf'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    return `${adjective}${noun}${number}`;
  }
}
```

## API Security

### Rate Limiting and DDoS Protection

```typescript
// lib/security/rate-limiting.ts
export class RateLimiter {
  private redis: Redis;
  private limits: Map<string, RateLimit> = new Map();

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async checkRateLimit(
    identifier: string,
    endpoint: string,
    limit: RateLimit
  ): Promise<RateLimitResult> {
    const key = `rate_limit:${identifier}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - limit.windowMs;

    // Sliding window counter
    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zcard(key);
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    pipeline.expire(key, Math.ceil(limit.windowMs / 1000));

    const results = await pipeline.exec();
    const currentCount = results[1][1] as number;

    if (currentCount >= limit.max) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: now + limit.windowMs,
        retryAfter: Math.ceil((now + limit.windowMs - Date.now()) / 1000),
      };
    }

    return {
      allowed: true,
      remaining: limit.max - currentCount - 1,
      resetTime: now + limit.windowMs,
    };
  }

  async checkDistributedRateLimit(
    identifier: string,
    endpoint: string,
    limit: RateLimit
  ): Promise<RateLimitResult> {
    const key = `distributed_rate_limit:${identifier}:${endpoint}`;
    const now = Date.now();
    const windowStart = now - limit.windowMs;

    // Distributed sliding window
    const script = `
      local key = KEYS[1]
      local window_start = ARGV[1]
      local now = ARGV[2]
      local limit = ARGV[3]
      local window_ms = ARGV[4]
      
      redis.call('zremrangebyscore', key, 0, window_start)
      local current = redis.call('zcard', key)
      
      if current < tonumber(limit) then
        redis.call('zadd', key, now, now)
        redis.call('expire', key, math.ceil(tonumber(window_ms) / 1000))
        return {1, tonumber(limit) - current - 1, now + tonumber(window_ms)}
      else
        return {0, 0, now + tonumber(window_ms)}
      end
    `;

    const result = await this.redis.eval(script, 1, key, windowStart, now, limit.max, limit.windowMs);
    
    return {
      allowed: result[0] === 1,
      remaining: result[1],
      resetTime: result[2],
    };
  }
}
```

### Input Validation and Sanitization

```typescript
// lib/security/validation.ts
export class ValidationService {
  private schemas: Map<string, z.ZodSchema> = new Map();

  constructor() {
    this.initializeSchemas();
  }

  private initializeSchemas(): void {
    this.schemas.set('user', z.object({
      email: z.string().email().max(255),
      name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
      age: z.number().int().min(13).max(120),
      phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
    }));

    this.schemas.set('post', z.object({
      title: z.string().min(1).max(200).transform(this.sanitizeHtml),
      content: z.string().min(1).max(10000).transform(this.sanitizeHtml),
      tags: z.array(z.string().max(50)).max(10),
      published: z.boolean().optional(),
    }));
  }

  async validateInput<T>(
    schemaName: string,
    data: unknown
  ): Promise<ValidationResult<T>> {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new Error(`Schema ${schemaName} not found`);
    }

    try {
      const validatedData = await schema.parseAsync(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        };
      }
      throw error;
    }
  }

  private sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: [],
    });
  }

  async detectSQLInjection(input: string): Promise<boolean> {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
      /(UNION\s+SELECT)/i,
      /(DROP\s+TABLE)/i,
      /(INSERT\s+INTO)/i,
      /(UPDATE\s+SET)/i,
      /(DELETE\s+FROM)/i,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  async detectXSS(input: string): Promise<boolean> {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<link[^>]*>.*?<\/link>/gi,
      /<meta[^>]*>.*?<\/meta>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }
}
```

## Client-Side Security

### Content Security Policy (CSP)

```typescript
// lib/security/csp.ts
export class CSPService {
  generateCSPHeader(options: CSPOptions): string {
    const directives = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", ...(options.trustedScripts || [])],
      'style-src': ["'self'", "'unsafe-inline'", ...(options.trustedStyles || [])],
      'img-src': ["'self'", 'data:', 'https:', ...(options.trustedImages || [])],
      'font-src': ["'self'", 'https:', ...(options.trustedFonts || [])],
      'connect-src': ["'self'", ...(options.trustedConnections || [])],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': [],
      'block-all-mixed-content': [],
    };

    return Object.entries(directives)
      .map(([directive, sources]) => {
        if (sources.length === 0) {
          return directive;
        }
        return `${directive} ${sources.join(' ')}`;
      })
      .join('; ');
  }

  generateNonce(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  generateHash(content: string, algorithm: string = 'sha256'): string {
    const hash = crypto.createHash(algorithm).update(content).digest('base64');
    return `${algorithm}-${hash}`;
  }
}
```

### Secure Storage

```typescript
// lib/security/secure-storage.ts
export class SecureStorageService {
  private encryptionKey: string;

  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
  }

  async setSecureItem(key: string, value: any): Promise<void> {
    const encrypted = await this.encrypt(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
  }

  async getSecureItem<T>(key: string): Promise<T | null> {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = await this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt secure item:', error);
      return null;
    }
  }

  async removeSecureItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  private async encrypt(data: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.encryptionKey),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(data)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  private async decrypt(encryptedData: string): Promise<string> {
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.encryptionKey),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  }
}
```

## Infrastructure Security

### Security Headers

```typescript
// lib/security/headers.ts
export class SecurityHeadersService {
  generateSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
    };
  }

  generateCORSHeaders(origin: string): Record<string, string> {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (allowedOrigins.includes(origin)) {
      return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      };
    }

    return {};
  }
}
```

## Monitoring and Incident Response

### Security Monitoring

```typescript
// lib/security/monitoring.ts
export class SecurityMonitoringService {
  private logger: Logger;
  private alertService: AlertService;

  constructor(logger: Logger, alertService: AlertService) {
    this.logger = logger;
    this.alertService = alertService;
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    await this.logger.log('security', {
      ...event,
      timestamp: new Date().toISOString(),
      severity: this.calculateSeverity(event),
    });

    if (this.shouldAlert(event)) {
      await this.alertService.sendAlert({
        type: 'security',
        severity: event.severity,
        message: event.message,
        details: event.details,
        userId: event.userId,
        ipAddress: event.ipAddress,
      });
    }
  }

  async detectAnomalies(userId: string, activity: UserActivity): Promise<void> {
    const patterns = await this.analyzeUserPatterns(userId);
    const anomalies = this.identifyAnomalies(activity, patterns);

    if (anomalies.length > 0) {
      await this.logSecurityEvent({
        type: 'anomaly_detected',
        severity: 'medium',
        message: 'Unusual user activity detected',
        details: { anomalies, userId },
        userId,
        ipAddress: activity.ipAddress,
      });
    }
  }

  private calculateSeverity(event: SecurityEvent): string {
    const severityMap = {
      'login_failed': 'low',
      'rate_limit_exceeded': 'medium',
      'suspicious_activity': 'high',
      'data_breach': 'critical',
      'unauthorized_access': 'high',
    };

    return severityMap[event.type] || 'medium';
  }

  private shouldAlert(event: SecurityEvent): boolean {
    const criticalTypes = ['data_breach', 'unauthorized_access'];
    return criticalTypes.includes(event.type) || event.severity === 'critical';
  }
}
```

## Best Practices

### 1. Defense in Depth
- Implement multiple layers of security
- Use principle of least privilege
- Regular security audits and penetration testing

### 2. Secure Development Lifecycle
- Integrate security into development process
- Use secure coding practices
- Regular dependency updates and vulnerability scanning

### 3. Incident Response
- Develop comprehensive incident response plan
- Regular security training for team
- Continuous monitoring and threat detection

### 4. Compliance and Standards
- Follow OWASP guidelines
- Implement industry standards (ISO 27001, SOC 2)
- Regular compliance audits

## Conclusion

Implementing advanced security patterns requires a comprehensive approach covering authentication, authorization, data protection, and monitoring. By following these patterns and best practices, you can build secure, resilient web applications that protect both your users and your business.

Remember that security is an ongoing process that requires constant vigilance, regular updates, and continuous improvement based on emerging threats and best practices.

---

**Next Steps:**
- Implement comprehensive security monitoring
- Conduct regular security audits
- Establish incident response procedures
- Train team on security best practices
- Stay updated with latest security threats and mitigations
