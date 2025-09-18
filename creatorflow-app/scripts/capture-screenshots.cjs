const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, '../public/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Screenshot configurations
const screenshots = [
  {
    name: 'dashboard-overview',
    url: 'http://localhost:3001/dashboard',
    width: 1920,
    height: 1080,
    description: 'Main dashboard with stats and overview cards'
  },
  {
    name: 'content-hub',
    url: 'http://localhost:3001/dashboard/content',
    width: 1920,
    height: 1080,
    description: 'Content creation and management interface'
  },
  {
    name: 'analytics-dashboard',
    url: 'http://localhost:3001/dashboard/analytics',
    width: 1920,
    height: 1080,
    description: 'Analytics and performance tracking'
  },
  {
    name: 'billing-dashboard',
    url: 'http://localhost:3001/dashboard/billing',
    width: 1920,
    height: 1080,
    description: 'Billing and subscription management'
  },
  {
    name: 'ai-insights',
    url: 'http://localhost:3001/dashboard',
    width: 1920,
    height: 1080,
    description: 'AI insights and recommendations',
    waitForSelector: '.MuiCard-root', // Wait for cards to load
    scrollToElement: true
  }
];

// Mobile screenshots
const mobileScreenshots = [
  {
    name: 'dashboard-mobile',
    url: 'http://localhost:3001/dashboard',
    width: 375,
    height: 667,
    description: 'Mobile dashboard view'
  },
  {
    name: 'content-mobile',
    url: 'http://localhost:3001/dashboard/content',
    width: 375,
    height: 667,
    description: 'Mobile content creation view'
  }
];

async function captureScreenshot(page, config) {
  console.log(`📸 Capturing ${config.name}...`);
  
  try {
    // Navigate to the page
    await page.goto(config.url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for specific selector if provided
    if (config.waitForSelector) {
      await page.waitForSelector(config.waitForSelector, { timeout: 10000 });
    }

    // Scroll to element if specified
    if (config.scrollToElement) {
      await page.evaluate(() => {
        const element = document.querySelector('.MuiCard-root');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
      await page.waitForTimeout(1000);
    }

    // Set viewport
    await page.setViewport({ 
      width: config.width, 
      height: config.height,
      deviceScaleFactor: 2 // High DPI for crisp images
    });

    // Wait a bit for any animations to settle
    await page.waitForTimeout(2000);

    // Take screenshot
    const screenshotPath = path.join(screenshotsDir, `${config.name}.png`);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: false, // Only capture viewport
      type: 'png'
    });

    console.log(`✅ Saved: ${screenshotPath}`);
    return screenshotPath;
  } catch (error) {
    console.error(`❌ Failed to capture ${config.name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting screenshot capture...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Capture desktop screenshots
  console.log('\n📱 Capturing desktop screenshots...');
  for (const config of screenshots) {
    await captureScreenshot(page, config);
  }

  // Capture mobile screenshots
  console.log('\n📱 Capturing mobile screenshots...');
  for (const config of mobileScreenshots) {
    await captureScreenshot(page, config);
  }

  await browser.close();
  
  console.log('\n🎉 Screenshot capture complete!');
  console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
  
  // List captured files
  const files = fs.readdirSync(screenshotsDir);
  console.log('\n📋 Captured files:');
  files.forEach(file => {
    if (file.endsWith('.png')) {
      const stats = fs.statSync(path.join(screenshotsDir, file));
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`  - ${file} (${sizeKB}KB)`);
    }
  });
}

// Run the script
main().catch(console.error);
