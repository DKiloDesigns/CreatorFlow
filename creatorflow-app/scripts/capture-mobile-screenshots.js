import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOBILE_VIEWPORTS = {
  iPhone: { width: 375, height: 812 },
  iPhonePlus: { width: 414, height: 896 },
  iPad: { width: 768, height: 1024 }
};

const SCREENSHOTS_TO_CAPTURE = [
  {
    name: 'landing-page',
    url: 'http://localhost:3001/',
    description: 'Landing Page - Mobile homepage with features'
  },
  {
    name: 'pricing',
    url: 'http://localhost:3001/pricing',
    description: 'Pricing - Mobile pricing plans'
  },
  {
    name: 'features',
    url: 'http://localhost:3001/features-demo',
    description: 'Features - Mobile feature showcase'
  },
  {
    name: 'auth',
    url: 'http://localhost:3001/auth',
    description: 'Authentication - Mobile login/signup'
  }
];

async function captureMobileScreenshots() {
  console.log('🚀 Starting mobile screenshot capture...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const screenshot of SCREENSHOTS_TO_CAPTURE) {
      console.log(`📱 Capturing ${screenshot.name}...`);
      
      const page = await browser.newPage();
      
      // Set mobile viewport
      await page.setViewport(MOBILE_VIEWPORTS.iPhone);
      
      // Set user agent for mobile
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
      
      // Navigate to page
      await page.goto(screenshot.url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot
      const screenshotPath = path.join(__dirname, '..', 'public', 'mobile-screenshots', `${screenshot.name}.jpg`);
      await page.screenshot({
        path: screenshotPath,
        type: 'jpeg',
        quality: 90,
        fullPage: true
      });
      
      console.log(`✅ Captured ${screenshot.name} -> ${screenshotPath}`);
      
      await page.close();
    }
    
    console.log('🎉 All mobile screenshots captured successfully!');
    
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the capture
captureMobileScreenshots().catch(console.error);
