const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/dashboard', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'dashboard-puppeteer-screenshot.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved as dashboard-puppeteer-screenshot.png');
})(); 