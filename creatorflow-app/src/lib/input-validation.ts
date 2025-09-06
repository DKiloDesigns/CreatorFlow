import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Input sanitization utilities
export class InputSanitizer {
  // Sanitize HTML content
  static sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'title'],
      ALLOW_DATA_ATTR: false,
    });
  }

  // Sanitize text content
  static sanitizeText(text: string): string {
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  // Sanitize file name
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
      .substring(0, 255); // Limit length
  }

  // Sanitize URL
  static sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid protocol');
      }
      return parsed.toString();
    } catch {
      return '';
    }
  }

  // Sanitize JSON input
  static sanitizeJSON<T>(json: any): T | null {
    try {
      const sanitized = JSON.parse(JSON.stringify(json));
      return sanitized;
    } catch {
      return null;
    }
  }
}

// Zod schemas for validation
export const validationSchemas = {
  // User input validation
  user: {
    email: z.string().email().max(255).toLowerCase(),
    name: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/),
    password: z.string()
      .min(8)
      .max(128)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    bio: z.string().max(500).optional(),
  },

  // Post content validation
  post: {
    content: z.string().min(1).max(2000),
    title: z.string().min(1).max(200).optional(),
    hashtags: z.array(z.string().max(50)).max(10).optional(),
    platforms: z.array(z.enum(['twitter', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'])).min(1),
    scheduledAt: z.string().datetime().optional(),
  },

  // API request validation
  api: {
    pagination: z.object({
      page: z.number().int().min(1).max(1000).default(1),
      limit: z.number().int().min(1).max(100).default(20),
      sort: z.string().max(50).optional(),
      order: z.enum(['asc', 'desc']).default('desc'),
    }),
    
    dateRange: z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    }).refine(data => new Date(data.start) <= new Date(data.end), {
      message: "Start date must be before end date",
    }),

    search: z.object({
      query: z.string().min(1).max(100),
      filters: z.record(z.string()).optional(),
    }),
  },

  // File upload validation
  file: {
    image: z.object({
      name: z.string().min(1).max(255),
      size: z.number().int().max(10 * 1024 * 1024), // 10MB max
      type: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/),
    }),

    video: z.object({
      name: z.string().min(1).max(255),
      size: z.number().int().max(100 * 1024 * 1024), // 100MB max
      type: z.string().regex(/^video\/(mp4|webm|ogg)$/),
    }),

    document: z.object({
      name: z.string().min(1).max(255),
      size: z.number().int().max(5 * 1024 * 1024), // 5MB max
      type: z.string().regex(/^application\/(pdf|doc|docx|txt)$/),
    }),
  },
};

// Validation helper functions
export class InputValidator {
  // Validate and sanitize user input
  static async validateUserInput<T>(
    data: unknown,
    schema: z.ZodSchema<T>
  ): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 255;
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    strong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters long');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password must contain lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password must contain uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Password must contain numbers');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Password must contain special characters');

    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    return {
      strong: score >= 4,
      score,
      feedback,
    };
  }

  // Validate file upload
  static validateFileUpload(
    file: { name: string; size: number; type: string },
    allowedTypes: string[],
    maxSize: number
  ): { valid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File too large' };
    }

    if (file.name.length > 255) {
      return { valid: false, error: 'File name too long' };
    }

    // Check for malicious file extensions
    const maliciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (maliciousExtensions.includes(extension)) {
      return { valid: false, error: 'File type not allowed for security reasons' };
    }

    return { valid: true };
  }

  // Validate URL
  static validateURL(url: string): { valid: boolean; error?: string } {
    try {
      const parsed = new URL(url);
      
      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
      }

      // Check for suspicious patterns
      const suspiciousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i,
        /ftp:/i,
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url)) {
          return { valid: false, error: 'URL contains suspicious content' };
        }
      }

      return { valid: true };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  }

  // Validate SQL injection patterns
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
      /(UNION\s+SELECT)/i,
      /(DROP\s+TABLE)/i,
      /(INSERT\s+INTO)/i,
      /(DELETE\s+FROM)/i,
      /(UPDATE\s+SET)/i,
      /(ALTER\s+TABLE)/i,
      /(CREATE\s+TABLE)/i,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // Validate XSS patterns
  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<link[^>]*>.*?<\/link>/gi,
      /<meta[^>]*>.*?<\/meta>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload\s*=/gi,
      /onerror\s*=/gi,
      /onclick\s*=/gi,
      /onmouseover\s*=/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }
}

// Rate limiting validation
export class RateLimiter {
  private static limits = new Map<string, { count: number; resetTime: number }>();

  static checkLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    const limit = this.limits.get(key);

    if (!limit || now > limit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
    }

    if (limit.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTime: limit.resetTime };
    }

    limit.count++;
    return { allowed: true, remaining: maxRequests - limit.count, resetTime: limit.resetTime };
  }

  static clearLimit(identifier: string): void {
    this.limits.delete(identifier);
  }
}
