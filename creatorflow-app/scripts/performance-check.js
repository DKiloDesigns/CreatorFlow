import { performance } from 'perf_hooks';
import { execSync } from 'child_process';

console.log('🔍 Performance Check Starting...');

const startTime = performance.now();

// Check Node.js version
try {
  const nodeVersion = process.version;
  console.log(`📦 Node.js version: ${nodeVersion}`);
  
  if (nodeVersion.startsWith('v18') || nodeVersion.startsWith('v20')) {
    console.log('✅ Node.js version is good for performance');
  } else {
    console.log('⚠️  Consider upgrading to Node.js 18+ for better performance');
  }
} catch (e) {
  console.log('❌ Could not check Node.js version');
}

// Check available memory
try {
  const memUsage = process.memoryUsage();
  const memGB = Math.round(memUsage.heapUsed / 1024 / 1024 / 1024 * 100) / 100;
  console.log(`💾 Memory usage: ${memGB}GB`);
} catch (e) {
  console.log('❌ Could not check memory usage');
}

// Check if we're in a fast environment
const isFastEnv = process.env.NODE_ENV === 'development' && 
                  !process.env.CI && 
                  !process.env.DISABLE_OPTIMIZATIONS;

if (isFastEnv) {
  console.log('🚀 Fast development environment detected');
} else {
  console.log('🐌 Performance optimizations may be limited');
}

const endTime = performance.now();
const duration = Math.round(endTime - startTime);

console.log(`⚡ Performance check completed in ${duration}ms`);
console.log('💡 Use "npm run dev:fast" for fastest startup');
console.log('💡 Use "npm run dev:clean" if you need a fresh build');
console.log('💡 Use "npm run dev" for full startup with all checks');
