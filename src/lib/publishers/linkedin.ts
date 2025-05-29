// Prefix unused types with underscore
type _LinkedInRefreshResponse = {
  // ... existing type definition ...
};

type _LinkedInMediaUploadResponse = {
  // ... existing type definition ...
};

// Prefix unused functions with underscore
const _handleError = (error: unknown) => {
  // ... existing code ...
};

const _parseError = (error: unknown) => {
  // ... existing code ...
};

// Add proper type for error
try {
  // ... existing code ...
} catch (_e: unknown) {
  // ... existing code ...
}

// Replace any with proper type
type LinkedInApiResponse = {
  status: number;
  data?: unknown;
  message?: string;
};

// ... existing code ... 