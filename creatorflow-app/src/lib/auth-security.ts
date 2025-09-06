import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from './prisma';

export interface AuthSecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  sessionTimeout: number; // in minutes
  require2FA: boolean;
  passwordHistory: number; // number of previous passwords to remember
  maxConcurrentSessions: number;
}

const defaultConfig: AuthSecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  sessionTimeout: 480, // 8 hours
  require2FA: false,
  passwordHistory: 5,
  maxConcurrentSessions: 3,
};

export class AuthSecurityManager {
  private config: AuthSecurityConfig;

  constructor(config: Partial<AuthSecurityConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Enhanced password hashing with salt rounds
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password with timing attack protection
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      // Always return false on error to prevent timing attacks
      return false;
    }
  }

  // Check if password meets security requirements
  validatePasswordStrength(password: string): {
    valid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters long');

    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password must contain lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password must contain uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Password must contain numbers');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Password must contain special characters');

    // Common password check
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      score = 0;
      feedback.push('Password is too common');
    }

    return {
      valid: score >= 4,
      score,
      feedback,
    };
  }

  // Check if password was recently used
  async checkPasswordHistory(userId: string, newPassword: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHistory: true },
      });

      if (!user?.passwordHistory) return true;

      const history = JSON.parse(user.passwordHistory) as string[];
      
      for (const oldHash of history) {
        if (await this.verifyPassword(newPassword, oldHash)) {
          return false; // Password was recently used
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking password history:', error);
      return true; // Allow on error to prevent lockout
    }
  }

  // Update password with history tracking
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);
    
    // Get current password history
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, passwordHistory: true },
    });

    if (!user) throw new Error('User not found');

    // Update password history
    const history = user.passwordHistory ? JSON.parse(user.passwordHistory) : [];
    history.unshift(user.password); // Add current password to history
    history.splice(this.config.passwordHistory); // Keep only recent passwords

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordHistory: JSON.stringify(history),
        passwordChangedAt: new Date(),
      },
    });
  }

  // Check login attempt limits
  async checkLoginAttempts(identifier: string): Promise<{
    allowed: boolean;
    remainingAttempts: number;
    lockoutExpires?: Date;
  }> {
    try {
      const attempt = await prisma.loginAttempt.findFirst({
        where: { identifier },
        orderBy: { createdAt: 'desc' },
      });

      if (!attempt) {
        return { allowed: true, remainingAttempts: this.config.maxLoginAttempts };
      }

      const now = new Date();
      const lockoutExpires = new Date(attempt.createdAt.getTime() + this.config.lockoutDuration * 60 * 1000);

      if (attempt.failedAttempts >= this.config.maxLoginAttempts && now < lockoutExpires) {
        return { allowed: false, remainingAttempts: 0, lockoutExpires };
      }

      // Reset attempts if lockout period has passed
      if (attempt.failedAttempts >= this.config.maxLoginAttempts && now >= lockoutExpires) {
        await prisma.loginAttempt.update({
          where: { id: attempt.id },
          data: { failedAttempts: 0 },
        });
        return { allowed: true, remainingAttempts: this.config.maxLoginAttempts };
      }

      return {
        allowed: true,
        remainingAttempts: this.config.maxLoginAttempts - attempt.failedAttempts,
      };
    } catch (error) {
      console.error('Error checking login attempts:', error);
      return { allowed: true, remainingAttempts: this.config.maxLoginAttempts };
    }
  }

  // Record login attempt
  async recordLoginAttempt(
    identifier: string,
    success: boolean,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    try {
      const attempt = await prisma.loginAttempt.findFirst({
        where: { identifier },
        orderBy: { createdAt: 'desc' },
      });

      if (success) {
        // Reset failed attempts on successful login
        if (attempt) {
          await prisma.loginAttempt.update({
            where: { id: attempt.id },
            data: { failedAttempts: 0 },
          });
        }
      } else {
        // Increment failed attempts
        if (attempt && new Date().getTime() - attempt.createdAt.getTime() < 24 * 60 * 60 * 1000) {
          // Within 24 hours, increment
          await prisma.loginAttempt.update({
            where: { id: attempt.id },
            data: { 
              failedAttempts: attempt.failedAttempts + 1,
              lastFailedAt: new Date(),
            },
          });
        } else {
          // Create new attempt record
          await prisma.loginAttempt.create({
            data: {
              identifier,
              failedAttempts: 1,
              ipAddress,
              userAgent,
              lastFailedAt: new Date(),
            },
          });
        }
      }
    } catch (error) {
      console.error('Error recording login attempt:', error);
    }
  }

  // Generate secure session token
  generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate 2FA secret
  generate2FASecret(): string {
    return crypto.randomBytes(20).toString('base32');
  }

  // Generate 2FA backup codes
  generate2FABackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  // Verify 2FA code
  verify2FACode(secret: string, code: string): boolean {
    const expectedCode = this.generateTOTPCode(secret);
    return crypto.timingSafeEqual(
      Buffer.from(code),
      Buffer.from(expectedCode)
    );
  }

  // Generate TOTP code
  private generateTOTPCode(secret: string): string {
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const time = Math.floor(epoch / 30);
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeUInt32BE(time, 4);

    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'));
    hmac.update(timeBuffer);
    const hmacResult = hmac.digest();

    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const code = ((hmacResult[offset] & 0x7f) << 24) |
                ((hmacResult[offset + 1] & 0xff) << 16) |
                ((hmacResult[offset + 2] & 0xff) << 8) |
                (hmacResult[offset + 3] & 0xff);

    return (code % 1000000).toString().padStart(6, '0');
  }

  // Check concurrent sessions
  async checkConcurrentSessions(userId: string): Promise<boolean> {
    try {
      const activeSessions = await prisma.session.count({
        where: {
          userId,
          expires: { gt: new Date() },
        },
      });

      return activeSessions < this.config.maxConcurrentSessions;
    } catch (error) {
      console.error('Error checking concurrent sessions:', error);
      return true; // Allow on error
    }
  }

  // Revoke all user sessions
  async revokeAllSessions(userId: string): Promise<void> {
    try {
      await prisma.session.deleteMany({
        where: { userId },
      });
    } catch (error) {
      console.error('Error revoking sessions:', error);
    }
  }

  // Check for suspicious login patterns
  async checkSuspiciousLogin(
    userId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ suspicious: boolean; reasons: string[] }> {
    const reasons: string[] = [];

    try {
      // Check for new IP address
      const recentLogins = await prisma.loginAttempt.findMany({
        where: {
          identifier: userId,
          success: true,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        },
        select: { ipAddress: true },
        distinct: ['ipAddress'],
      });

      const knownIPs = recentLogins.map(login => login.ipAddress);
      if (!knownIPs.includes(ipAddress)) {
        reasons.push('New IP address');
      }

      // Check for unusual user agent
      const userAgentPatterns = await prisma.loginAttempt.findMany({
        where: {
          identifier: userId,
          success: true,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
        },
        select: { userAgent: true },
        distinct: ['userAgent'],
      });

      const knownUserAgents = userAgentPatterns.map(login => login.userAgent);
      if (!knownUserAgents.includes(userAgent)) {
        reasons.push('Unusual user agent');
      }

      // Check for rapid login attempts
      const recentAttempts = await prisma.loginAttempt.count({
        where: {
          identifier: userId,
          createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
        },
      });

      if (recentAttempts > 10) {
        reasons.push('High frequency of login attempts');
      }

      return {
        suspicious: reasons.length > 0,
        reasons,
      };
    } catch (error) {
      console.error('Error checking suspicious login:', error);
      return { suspicious: false, reasons: [] };
    }
  }
}

// Export singleton instance
export const authSecurity = new AuthSecurityManager();
