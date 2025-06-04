#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const today = new Date().toISOString().slice(0, 10);
const baseDir = path.resolve(__dirname, '../visual-regression');
const currentDir = path.join(baseDir, 'current', today);
const baselineDir = path.join(baseDir, 'baseline');

if (!fs.existsSync(currentDir)) {
  console.error('No current screenshots found. Run visual:regression first.');
  process.exit(1);
}
if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir, { recursive: true });

const files = fs.readdirSync(currentDir).filter(f => f.endsWith('.png'));
for (const file of files) {
  fs.copyFileSync(path.join(currentDir, file), path.join(baselineDir, file));
  console.log(`Accepted ${file} as new baseline.`);
}
console.log('Visual baseline updated.'); 