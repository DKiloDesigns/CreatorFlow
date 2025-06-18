import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const CACHE_TTL = parseInt(process.env.ANALYTICS_CACHE_TTL || '900', 10); // Default 15 minutes
export const RATE_LIMIT = parseInt(process.env.ANALYTICS_RATE_LIMIT || '100', 10); // Default 100 requests per minute 