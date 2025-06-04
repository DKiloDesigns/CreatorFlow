#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const today = new Date().toISOString().slice(0, 10);
const baseDir = path.resolve(__dirname, '../visual-regression');
const baselineDir = path.join(baseDir, 'baseline');
const currentDir = path.join(baseDir, 'current', today);
const diffDir = path.join(baseDir, 'diff', today);
if (!fs.existsSync(currentDir)) {
  console.error('No current screenshots found. Run visual:regression first.');
  process.exit(1);
}
if (!fs.existsSync(baselineDir)) {
  console.log('No baseline found. Creating baseline from current screenshots...');
  fs.mkdirSync(baselineDir, { recursive: true });
  for (const file of fs.readdirSync(currentDir)) {
    fs.copyFileSync(path.join(currentDir, file), path.join(baselineDir, file));
  }
  console.log('Baseline created. Re-run visual:regression and then visual:diff to compare.');
  process.exit(0);
}
if (!fs.existsSync(diffDir)) fs.mkdirSync(diffDir, { recursive: true });

const files = fs.readdirSync(currentDir).filter(f => f.endsWith('.png'));
let diffs = 0;
for (const file of files) {
  const baselineFile = path.join(baselineDir, file);
  const currentFile = path.join(currentDir, file);
  const diffFile = path.join(diffDir, file);
  if (!fs.existsSync(baselineFile)) {
    console.warn(`No baseline for ${file}, skipping.`);
    continue;
  }
  const img1 = PNG.sync.read(fs.readFileSync(baselineFile));
  const img2 = PNG.sync.read(fs.readFileSync(currentFile));
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const numDiff = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  if (numDiff > 0) {
    fs.writeFileSync(diffFile, PNG.sync.write(diff));
    console.log(`Diff found for ${file}: ${numDiff} pixels differ.`);
    diffs++;
  }
}
if (diffs === 0) {
  console.log('No visual differences found.');
} else {
  console.log(`${diffs} visual differences found. See diff images in ${diffDir}`);
} 