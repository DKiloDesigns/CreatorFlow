import crypto from 'crypto';

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  tagLength: number;
}

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
  algorithm: string;
}

const defaultConfig: EncryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32, // 256 bits
  ivLength: 16,  // 128 bits
  tagLength: 16, // 128 bits
};

export class DataEncryption {
  private config: EncryptionConfig;
  private masterKey: Buffer;

  constructor(masterKey: string, config: EncryptionConfig = defaultConfig) {
    this.config = config;
    this.masterKey = crypto.scryptSync(masterKey, 'salt', config.keyLength);
  }

  encrypt(data: string, context?: string): EncryptedData {
    try {
      const iv = crypto.randomBytes(this.config.ivLength);
      const cipher = crypto.createCipher(this.config.algorithm, this.masterKey);
      cipher.setAAD(Buffer.from(context || 'default'));

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();

      return {
        data: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.config.algorithm,
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData: EncryptedData, context?: string): string {
    try {
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const tag = Buffer.from(encryptedData.tag, 'hex');
      const decipher = crypto.createDecipher(encryptedData.algorithm, this.masterKey);
      
      decipher.setAAD(Buffer.from(context || 'default'));
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  hash(data: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(data, actualSalt, 100000, 64, 'sha512');
    return `${actualSalt}:${hash.toString('hex')}`;
  }

  verifyHash(data: string, hashedData: string): boolean {
    try {
      const [salt, hash] = hashedData.split(':');
      const newHash = crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha512');
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), newHash);
    } catch (error) {
      console.error('Hash verification failed:', error);
      return false;
    }
  }

  generateKey(): string {
    return crypto.randomBytes(this.config.keyLength).toString('hex');
  }

  generateIV(): string {
    return crypto.randomBytes(this.config.ivLength).toString('hex');
  }

  // Field-level encryption for sensitive data
  encryptField(value: string, fieldName: string): EncryptedData {
    return this.encrypt(value, `field:${fieldName}`);
  }

  decryptField(encryptedData: EncryptedData, fieldName: string): string {
    return this.decrypt(encryptedData, `field:${fieldName}`);
  }

  // PII anonymization
  anonymizeEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const anonymizedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${anonymizedLocal}@${domain}`;
  }

  anonymizePhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return cleaned.slice(0, 3) + '***' + cleaned.slice(-4);
    }
    return '*'.repeat(cleaned.length);
  }

  anonymizeName(name: string): string {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0) + '*'.repeat(part.length - 1)).join(' ');
  }

  // Data masking for logging
  maskSensitiveData(data: any, sensitiveFields: string[] = ['password', 'token', 'key', 'secret']): any {
    if (typeof data === 'string') {
      return sensitiveFields.some(field => field.toLowerCase().includes(data.toLowerCase())) ? '[MASKED]' : data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.maskSensitiveData(item, sensitiveFields));
    }

    if (data && typeof data === 'object') {
      const masked: any = {};
      for (const [key, value] of Object.entries(data)) {
        const isSensitive = sensitiveFields.some(field => 
          key.toLowerCase().includes(field.toLowerCase())
        );
        masked[key] = isSensitive ? '[MASKED]' : this.maskSensitiveData(value, sensitiveFields);
      }
      return masked;
    }

    return data;
  }
}

// Singleton instance with master key from environment
const masterKey = process.env.ENCRYPTION_MASTER_KEY || 'default-master-key-change-in-production';
export const dataEncryption = new DataEncryption(masterKey);

// Utility functions for common encryption tasks
export function encryptSensitiveData(data: string, context?: string): EncryptedData {
  return dataEncryption.encrypt(data, context);
}

export function decryptSensitiveData(encryptedData: EncryptedData, context?: string): string {
  return dataEncryption.decrypt(encryptedData, context);
}

export function hashPassword(password: string): string {
  return dataEncryption.hash(password);
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return dataEncryption.verifyHash(password, hashedPassword);
}

export function anonymizePII(data: any): any {
  if (typeof data === 'string') {
    // Check if it looks like an email
    if (data.includes('@') && data.includes('.')) {
      return dataEncryption.anonymizeEmail(data);
    }
    // Check if it looks like a phone number
    if (/\d{10,}/.test(data.replace(/\D/g, ''))) {
      return dataEncryption.anonymizePhone(data);
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => anonymizePII(item));
  }

  if (data && typeof data === 'object') {
    const anonymized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('email')) {
        anonymized[key] = dataEncryption.anonymizeEmail(value as string);
      } else if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
        anonymized[key] = dataEncryption.anonymizePhone(value as string);
      } else if (lowerKey.includes('name') && lowerKey !== 'username') {
        anonymized[key] = dataEncryption.anonymizeName(value as string);
      } else {
        anonymized[key] = anonymizePII(value);
      }
    }
    return anonymized;
  }

  return data;
}

export function maskForLogging(data: any): any {
  return dataEncryption.maskSensitiveData(data);
}
