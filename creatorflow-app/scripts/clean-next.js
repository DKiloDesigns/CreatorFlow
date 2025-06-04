import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the .next directory
const nextDir = path.resolve(__dirname, '..', '.next');

console.log('Cleaning Next.js build artifacts...');

// Check if .next directory exists
if (fs.existsSync(nextDir)) {
  try {
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
    console.error('Error removing .next directory:', error.message);
    process.exit(1);
  }
} else {
  console.log('.next directory does not exist. No cleanup needed.');
}

console.log('Next.js build artifacts cleaned successfully.');