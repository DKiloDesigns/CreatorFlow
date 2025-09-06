import { NextRequest, NextResponse } from 'next/server';

export interface SecurityHeadersConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXSSProtection: boolean;
  enableFrameOptions: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
  cspDirectives?: Record<string, string[]>;
  hstsMaxAge?: number;
  frameOptions?: 'DENY' | 'SAMEORIGIN';
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
}

const defaultConfig: SecurityHeadersConfig = {
  enableCSP: true,
  enableHSTS: true,
  enableXSSProtection: true,
  enableFrameOptions: true,
  enableReferrerPolicy: true,
  enablePermissionsPolicy: true,
  hstsMaxAge: 31536000, // 1 year
  frameOptions: 'SAMEORIGIN',
  referrerPolicy: 'strict-origin-when-cross-origin',
  cspDirectives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://js.stripe.com', 'https://checkout.stripe.com'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': ["'self'", 'https://api.stripe.com', 'https://checkout.stripe.com'],
    'frame-src': ["'self'", 'https://js.stripe.com', 'https://checkout.stripe.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  },
};

export function applySecurityHeaders(
  response: NextResponse,
  config: Partial<SecurityHeadersConfig> = {}
): NextResponse {
  const finalConfig = { ...defaultConfig, ...config };

  // Content Security Policy
  if (finalConfig.enableCSP && finalConfig.cspDirectives) {
    const cspString = Object.entries(finalConfig.cspDirectives)
      .map(([directive, values]) => {
        if (values.length === 0) return directive;
        return `${directive} ${values.join(' ')}`;
      })
      .join('; ');
    
    response.headers.set('Content-Security-Policy', cspString);
  }

  // HTTP Strict Transport Security
  if (finalConfig.enableHSTS) {
    const hstsValue = `max-age=${finalConfig.hstsMaxAge}; includeSubDomains; preload`;
    response.headers.set('Strict-Transport-Security', hstsValue);
  }

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  if (finalConfig.enableFrameOptions) {
    response.headers.set('X-Frame-Options', finalConfig.frameOptions || 'SAMEORIGIN');
  }

  // X-XSS-Protection
  if (finalConfig.enableXSSProtection) {
    response.headers.set('X-XSS-Protection', '1; mode=block');
  }

  // Referrer Policy
  if (finalConfig.enableReferrerPolicy) {
    response.headers.set('Referrer-Policy', finalConfig.referrerPolicy || 'strict-origin-when-cross-origin');
  }

  // Permissions Policy
  if (finalConfig.enablePermissionsPolicy) {
    const permissionsPolicy = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', ');
    
    response.headers.set('Permissions-Policy', permissionsPolicy);
  }

  // Additional security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

  // Remove server information
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  return response;
}

// Middleware helper for applying security headers
export function withSecurityHeaders(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config?: Partial<SecurityHeadersConfig>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const response = await handler(req);
    return applySecurityHeaders(response, config);
  };
}

// Environment-specific security configurations
export const securityConfigs = {
  development: {
    enableCSP: false, // Disable CSP in dev for easier debugging
    enableHSTS: false,
    cspDirectives: {
      'default-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'connect-src': ["'self'", 'ws:', 'wss:'],
    },
  },
  production: defaultConfig,
  staging: {
    ...defaultConfig,
    enableHSTS: false, // Disable HSTS in staging
    cspDirectives: {
      ...defaultConfig.cspDirectives,
      'script-src': [...(defaultConfig.cspDirectives?.['script-src'] || []), "'unsafe-inline'"],
    },
  },
};

// Get security config based on environment
export function getSecurityConfig(): SecurityHeadersConfig {
  const env = process.env.NODE_ENV as keyof typeof securityConfigs;
  return securityConfigs[env] || securityConfigs.production;
}
