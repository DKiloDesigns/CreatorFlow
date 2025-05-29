const fs = require('fs');
const path = require('path');

const PORTS = ['3000', '3001'];
const EXTS = ['.js', '.ts', '.tsx', '.md', '.env', '.json'];

function scanDir(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory() && !file.startsWith('node_modules')) {
      results = results.concat(scanDir(filePath));
    } else if (EXTS.includes(path.extname(file))) {
      const content = fs.readFileSync(filePath, 'utf8');
      PORTS.forEach(port => {
        if (content.includes(`localhost:${port}`)) {
          results.push({ file: filePath, port });
        }
      });
    }
  });
  return results;
}

const results = scanDir(path.resolve(__dirname, '..'));
if (results.length) {
  console.warn('Found hardcoded localhost port references:');
  results.forEach(r => console.warn(`  ${r.file} (port ${r.port})`));
  process.exit(1);
} else {
  console.log('No hardcoded localhost port references found.');
} 