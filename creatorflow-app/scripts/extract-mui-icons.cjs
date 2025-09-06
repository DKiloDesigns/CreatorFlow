const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files = files.concat(findFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to extract MUI icon imports from a file
function extractMuiIcons(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const icons = new Set();
    
    for (const line of lines) {
      // Match import statements from @mui/icons-material
      const match = line.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@mui\/icons-material['"]/);
      if (match) {
        const iconList = match[1].split(',').map(icon => icon.trim());
        iconList.forEach(icon => {
          // Remove any comments or extra whitespace
          const cleanIcon = icon.replace(/\/\*.*?\*\//g, '').trim();
          if (cleanIcon && !cleanIcon.startsWith('//')) {
            icons.add(cleanIcon);
          }
        });
      }
    }
    
    return Array.from(icons);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Main execution
const srcDir = path.join(__dirname, '..', 'src');
const files = findFiles(srcDir);
const allIcons = new Set();

console.log(`Found ${files.length} files to analyze...`);

files.forEach(file => {
  const icons = extractMuiIcons(file);
  icons.forEach(icon => allIcons.add(icon));
});

const sortedIcons = Array.from(allIcons).sort();

console.log(`\nFound ${sortedIcons.length} unique MUI icons:`);
console.log(sortedIcons.join(', '));

// Generate the import statement
const importStatement = `export {
  ${sortedIcons.join(',\n  ')}
} from '@mui/icons-material';`;

console.log('\n' + '='.repeat(50));
console.log('GENERATED IMPORT STATEMENT:');
console.log('='.repeat(50));
console.log(importStatement);

// Save to file
const outputPath = path.join(__dirname, '..', 'src', 'lib', 'all-mui-icons.ts');
fs.writeFileSync(outputPath, importStatement);
console.log(`\nSaved to: ${outputPath}`);
