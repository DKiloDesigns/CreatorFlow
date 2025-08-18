import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the .next directory
const nextDir = path.resolve(__dirname, '..', '.next');

console.log('Checking Next.js build artifacts...');

// Check if .next directory exists
if (fs.existsSync(nextDir)) {
  try {
    // Check if the build is recent (less than 5 minutes old)
    const stats = fs.statSync(nextDir);
    const ageInMinutes = (Date.now() - stats.mtime.getTime()) / (1000 * 60);
    
    if (ageInMinutes < 5) {
      console.log('.next directory is recent (less than 5 minutes old). Skipping cleanup.');
      process.exit(0);
    }
    
    // Check if there are any obvious build issues
    const hasBuildFiles = fs.existsSync(path.join(nextDir, 'server')) || 
                         fs.existsSync(path.join(nextDir, 'static'));
    
    if (hasBuildFiles) {
      console.log('.next directory appears to have valid build files. Skipping cleanup.');
      process.exit(0);
    }
    
    console.log('.next directory is old or corrupted. Cleaning up...');
    
    // Remove the .next directory
    if (process.platform === 'win32') {
      // On Windows, use rimraf or rd command
      execSync(`rmdir /s /q "${nextDir}"`, { stdio: 'inherit' });
    } else {
      // On Unix-like systems, use rm command
      execSync(`rm -rf "${nextDir}"`, { stdio: 'inherit' });
    }
    console.log('.next directory removed successfully.');
  } catch (error) {
    console.error('Error during cleanup:', error.message);
    // Don't exit with error, just continue
    console.log('Continuing without cleanup...');
  }
} else {
  console.log('.next directory does not exist. No cleanup needed.');
}

console.log('Next.js build artifacts check completed.');