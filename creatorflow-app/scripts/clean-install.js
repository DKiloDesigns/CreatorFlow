const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths to clean
const paths = [
  path.resolve(__dirname, '..', '.next'),
  path.resolve(__dirname, '..', 'node_modules'),
];

console.log('Cleaning build artifacts and node_modules...');

// Clean each path
paths.forEach(pathToClean => {
  const dirName = path.basename(pathToClean);
  
  if (fs.existsSync(pathToClean)) {
    try {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${pathToClean}"`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf "${pathToClean}"`, { stdio: 'inherit' });
      }
      console.log(`✅ ${dirName} removed successfully.`);
    } catch (error) {
      console.error(`❌ Error removing ${dirName}:`, error.message);
    }
  } else {
    console.log(`ℹ️ ${dirName} does not exist. Skipping.`);
  }
});

// Reinstall dependencies
console.log('\nReinstalling dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  console.log('✅ Dependencies reinstalled successfully.');
} catch (error) {
  console.error('❌ Error reinstalling dependencies:', error.message);
  process.exit(1);
}

console.log('\n✨ Clean install completed successfully!');
console.log('You can now start the development server with: npm run dev');