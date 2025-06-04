#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
const PAGES = [
  { path: '/dashboard', name: 'dashboard' },
  { path: '/dashboard/accounts', name: 'accounts' },
  { path: '/dashboard/content', name: 'content' },
  { path: '/dashboard/analytics', name: 'analytics' },
];
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 812, isMobile: true },
];
const today = new Date().toISOString().slice(0, 10);
const outDir = path.resolve(__dirname, `../visual-regression/current/${today}`);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await puppeteer.launch();
  const results = [];
  for (const pageDef of PAGES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
      const url = BASE_URL + pageDef.path;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      const file = path.join(outDir, `${pageDef.name}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      results.push(file);
      await page.close();
    }
  }
  await browser.close();
  console.log('Visual regression screenshots saved:');
  results.forEach(f => console.log(' -', f));
})(); 