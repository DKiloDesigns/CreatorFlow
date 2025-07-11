import { z } from 'zod';

// User input validation
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio too long').optional(),
  website: z.string().url('Invalid URL').optional(),
});

// Post creation validation
export const postSchema = z.object({
  contentText: z.string().min(1, 'Content is required').max(2200, 'Content too long'),
  platforms: z.array(z.string()).min(1, 'At least one platform required'),
  scheduledAt: z.date().optional(),
  hashtags: z.array(z.string()).max(30, 'Too many hashtags').optional(),
  mentions: z.array(z.string()).max(10, 'Too many mentions').optional(),
  mediaUrls: z.array(z.string().url('Invalid media URL')).max(10, 'Too many media files').optional(),
  location: z.string().max(100, 'Location too long').optional(),
});

// Template validation
export const templateSchema = z.object({
  name: z.string().min(1, 'Template name required').max(100, 'Name too long'),
  content: z.string().min(1, 'Content required').max(2200, 'Content too long'),
  category: z.string().min(1, 'Category required').max(50, 'Category too long'),
  tags: z.array(z.string()).max(20, 'Too many tags').optional(),
  platforms: z.array(z.string()).min(1, 'At least one platform required'),
  hashtags: z.array(z.string()).max(30, 'Too many hashtags').optional(),
  mentions: z.array(z.string()).max(10, 'Too many mentions').optional(),
  mediaUrls: z.array(z.string().url('Invalid media URL')).max(10, 'Too many media files').optional(),
  isFavorite: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  usageLimit: z.number().min(1, 'Usage limit must be positive').optional(),
  activeFrom: z.date().optional(),
  activeTo: z.date().optional(),
});

// Analytics query validation
export const analyticsQuerySchema = z.object({
  timeRange: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  platform: z.string().optional(),
  userId: z.string().min(1, 'User ID required'),
});

// API key validation
export const apiKeySchema = z.object({
  name: z.string().min(1, 'API key name required').max(50, 'Name too long'),
  provider: z.enum(['openai', 'anthropic', 'google', 'deepseek', 'perplexity', 'cohere', 'local']),
  key: z.string().min(1, 'API key required'),
});

// Social account validation
export const socialAccountSchema = z.object({
  platform: z.enum(['instagram', 'twitter', 'linkedin', 'facebook', 'tiktok', 'youtube']),
  username: z.string().min(1, 'Username required').max(50, 'Username too long'),
  accessToken: z.string().min(1, 'Access token required').optional(),
  refreshToken: z.string().optional(),
});

// Team validation
export const teamSchema = z.object({
  name: z.string().min(1, 'Team name required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

// Team invitation validation
export const teamInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['MEMBER', 'ADMIN', 'VIEWER']).default('MEMBER'),
  teamId: z.string().min(1, 'Team ID required'),
});

// Feedback validation
export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general']),
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description required').max(2000, 'Description too long'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  category: z.string().max(100, 'Category too long').optional(),
});

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query required').max(200, 'Query too long'),
  filters: z.record(z.string(), z.unknown()).optional(),
  page: z.number().min(1, 'Page must be positive').default(1),
  limit: z.number().min(1, 'Limit must be positive').max(100, 'Limit too high').default(20),
});

// Export validation functions
export function validateUserProfile(data: unknown) {
  return userProfileSchema.parse(data);
}

export function validatePost(data: unknown) {
  return postSchema.parse(data);
}

export function validateTemplate(data: unknown) {
  return templateSchema.parse(data);
}

export function validateAnalyticsQuery(data: unknown) {
  return analyticsQuerySchema.parse(data);
}

export function validateApiKey(data: unknown) {
  return apiKeySchema.parse(data);
}

export function validateSocialAccount(data: unknown) {
  return socialAccountSchema.parse(data);
}

export function validateTeam(data: unknown) {
  return teamSchema.parse(data);
}

export function validateTeamInvitation(data: unknown) {
  return teamInvitationSchema.parse(data);
}

export function validateFeedback(data: unknown) {
  return feedbackSchema.parse(data);
}

export function validateSearch(data: unknown) {
  return searchSchema.parse(data);
} 