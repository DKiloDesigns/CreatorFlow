/**
 * Database Field Validation
 * Prevents authorId vs userId mismatches and other field name errors
 */

// Valid Post query fields based on Prisma schema
export const VALID_POST_FIELDS = {
  // Core fields
  id: 'string',
  createdAt: 'DateTime',
  updatedAt: 'DateTime',
  userId: 'string', // ✅ Correct field name
  contentText: 'string',
  mediaUrls: 'string[]',
  platforms: 'string[]',
  scheduledAt: 'DateTime',
  publishedAt: 'DateTime',
  status: 'PostStatus',
  
  // Analytics fields
  views: 'number',
  likes: 'number',
  comments: 'number',
  shares: 'number',
  reach: 'number',
  impressions: 'number',
  engagementRate: 'number',
  
  // Content fields
  hashtags: 'string[]',
  isRepost: 'boolean',
  location: 'string',
  mentions: 'string[]',
  parentPostId: 'string',
  repostCount: 'number',
  repostInterval: 'number',
  
  // Collaboration fields
  brandCollabId: 'string',
  errorMessage: 'string',
  
  // Relations
  brandCollab: 'BrandCollab',
  user: 'User'
} as const;

// ❌ DEPRECATED/INVALID FIELDS - These should never be used
export const INVALID_POST_FIELDS = {
  authorId: 'userId', // ❌ Use userId instead
  author: 'user',     // ❌ Use user instead
} as const;

/**
 * Validates Post query fields to prevent schema mismatches
 */
export function validatePostFields(query: Record<string, any>): {
  isValid: boolean;
  errors: string[];
  suggestions: Record<string, string>;
} {
  const errors: string[] = [];
  const suggestions: Record<string, string> = {};
  
  // Valid Prisma operators that should be allowed
  const VALID_PRISMA_OPERATORS = ['OR', 'AND', 'NOT', 'select', 'where', 'orderBy', 'take', 'skip', 'include', 'gte', 'lte', 'gt', 'lt', 'equals', 'in', 'notIn', 'contains', 'startsWith', 'endsWith'];
  
  // Check for invalid fields
  for (const [field, value] of Object.entries(query)) {
    if (field in INVALID_POST_FIELDS) {
      const correctField = INVALID_POST_FIELDS[field as keyof typeof INVALID_POST_FIELDS];
      errors.push(`Invalid field '${field}' - use '${correctField}' instead`);
      suggestions[field] = correctField;
    } else if (!(field in VALID_POST_FIELDS) && !VALID_PRISMA_OPERATORS.includes(field)) {
      errors.push(`Unknown field '${field}' - not found in Post schema`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    suggestions
  };
}

/**
 * Runtime validation for Prisma queries
 * Throws clear error if invalid fields are used
 */
export function validatePostQuery(query: Record<string, any>): void {
  const validation = validatePostFields(query);
  
  if (!validation.isValid) {
    const errorMessage = [
      '❌ Invalid Post query fields detected:',
      ...validation.errors,
      '',
      '💡 Suggestions:',
      ...Object.entries(validation.suggestions).map(([invalid, correct]) => 
        `  - Replace '${invalid}' with '${correct}'`
      )
    ].join('\n');
    
    throw new Error(errorMessage);
  }
}

/**
 * Type-safe Post query builder
 * Ensures only valid fields are used
 */
export function createPostQuery<T extends Record<string, any>>(query: T): T {
  validatePostQuery(query);
  return query;
}

/**
 * Helper to get correct user field name
 */
export const USER_FIELD = 'userId' as const;

/**
 * Helper to get correct user relation name  
 */
export const USER_RELATION = 'user' as const;
