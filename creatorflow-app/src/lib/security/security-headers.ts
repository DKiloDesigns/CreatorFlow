import { NextRequest, NextResponse } from 'next/server';

interface SecurityHeadersConfig {
  contentSecurityPolicy?: string;
  frameOptions?: 'DENY' | 'SAMEORIGIN' | string;
  contentTypeOptions?: boolean;
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  permissionsPolicy?: Record<string, string[]>;
  strictTransportSecurity?: {
    maxAge: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  crossOriginEmbedderPolicy?: 'unsafe-none' | 'require-corp';
  crossOriginOpenerPolicy?: 'unsafe-none' | 'same-origin-allow-popups' | 'same-origin';
  crossOriginResourcePolicy?: 'same-site' | 'same-origin' | 'cross-origin';
}

const defaultConfig: SecurityHeadersConfig = {
  contentSecurityPolicy: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.contexx.ai https://eternalzord.localhost",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
  frameOptions: 'DENY',
  contentTypeOptions: true,
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    interestCohort: [],
    payment: [],
    usb: [],
    magnetometer: [],
    gyroscope: [],
    accelerometer: [],
    ambientLightSensor: [],
    autoplay: [],
    battery: [],
    displayCapture: [],
    documentDomain: [],
    executionWhileNotRendered: [],
    executionWhileOutOfViewport: [],
    fullscreen: ['self'],
    pictureInPicture: [],
    publickeyCredentialsGet: [],
    screenWakeLock: [],
    syncXhr: [],
    webShare: [],
    xrSpatialTracking: [],
  },
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  crossOriginEmbedderPolicy: 'unsafe-none',
  crossOriginOpenerPolicy: 'same-origin-allow-popups',
  crossOriginResourcePolicy: 'same-origin',
};

export function createSecurityHeaders(config: SecurityHeadersConfig = {}) {
  const mergedConfig = { ...defaultConfig, ...config };

  return (req: NextRequest) => {
    const response = NextResponse.next();

    // Content Security Policy
    if (mergedConfig.contentSecurityPolicy) {
      response.headers.set('Content-Security-Policy', mergedConfig.contentSecurityPolicy);
    }

    // X-Frame-Options
    if (mergedConfig.frameOptions) {
      response.headers.set('X-Frame-Options', mergedConfig.frameOptions);
    }

    // X-Content-Type-Options
    if (mergedConfig.contentTypeOptions) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
    }

    // Referrer Policy
    if (mergedConfig.referrerPolicy) {
      response.headers.set('Referrer-Policy', mergedConfig.referrerPolicy);
    }

    // Permissions Policy
    if (mergedConfig.permissionsPolicy) {
      const policyString = Object.entries(mergedConfig.permissionsPolicy)
        .map(([feature, allowlist]) => {
          if (allowlist.length === 0) return `${feature}=()`;
          return `${feature}=(${allowlist.join(' ')})`;
        })
        .join(', ');
      response.headers.set('Permissions-Policy', policyString);
    }

    // Strict-Transport-Security
    if (mergedConfig.strictTransportSecurity) {
      const { maxAge, includeSubDomains, preload } = mergedConfig.strictTransportSecurity;
      let hstsValue = `max-age=${maxAge}`;
      if (includeSubDomains) hstsValue += '; includeSubDomains';
      if (preload) hstsValue += '; preload';
      response.headers.set('Strict-Transport-Security', hstsValue);
    }

    // Cross-Origin Policies
    if (mergedConfig.crossOriginEmbedderPolicy) {
      response.headers.set('Cross-Origin-Embedder-Policy', mergedConfig.crossOriginEmbedderPolicy);
    }

    if (mergedConfig.crossOriginOpenerPolicy) {
      response.headers.set('Cross-Origin-Opener-Policy', mergedConfig.crossOriginOpenerPolicy);
    }

    if (mergedConfig.crossOriginResourcePolicy) {
      response.headers.set('Cross-Origin-Resource-Policy', mergedConfig.crossOriginResourcePolicy);
    }

    // Additional security headers
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

    return response;
  };
}

// Pre-configured security headers for different environments
export const productionSecurityHeaders = createSecurityHeaders({
  contentSecurityPolicy: [
    "default-src 'self'",
    "script-src 'self' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.contexx.ai",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; '),
});

export const developmentSecurityHeaders = createSecurityHeaders({
  contentSecurityPolicy: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.contexx.ai http://localhost:* ws://localhost:*",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
});

export { type SecurityHeadersConfig };
