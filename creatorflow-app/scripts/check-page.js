const puppeteer = require('puppeteer');

async function checkPage() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true if you don't want to see the browser
    defaultViewport: null
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to the page
    console.log('Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Get the page title
    const title = await page.title();
    console.log('Page title:', title);

    // Get the page content
    const content = await page.content();
    console.log('Page content length:', content.length);

    // Take a screenshot
    await page.screenshot({ path: 'page-screenshot.png' });
    console.log('Screenshot saved as page-screenshot.png');

    // Check for any console errors
    const errors = await page.evaluate(() => {
      return window.performance.getEntriesByType('resource')
        .filter(entry => entry.initiatorType === 'script' && entry.name.includes('localhost:3001'))
        .map(entry => entry.name);
    });
    
    if (errors.length > 0) {
      console.log('Found potential errors:', errors);
    }

  } catch (error) {
    console.error('Error checking page:', error);
  } finally {
    await browser.close();
  }
}

checkPage(); 