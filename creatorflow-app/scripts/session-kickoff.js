// Lightweight session kickoff - non-blocking
console.log('🚀 Starting CreatorFlow development session...');

// Simple timestamp logging
const sessionStart = new Date().toISOString();
console.log(`📅 Session started at: ${sessionStart}`);

// Check if we're in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode detected');
}

// Log available ports
console.log('🌐 Dev server will be available on next available port');

// Exit immediately to not block startup
process.exit(0); 