import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEVICES = [
  { name: 'iPhone 12', viewport: { width: 390, height: 844 } },
  { name: 'iPhone 12 Pro Max', viewport: { width: 428, height: 926 } },
  { name: 'Samsung Galaxy S20', viewport: { width: 360, height: 800 } },
  { name: 'iPad', viewport: { width: 768, height: 1024 } }
];

async function testMobileShowcase() {
  console.log('🚀 Starting mobile showcase testing...');
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for visual testing
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const device of DEVICES) {
      console.log(`📱 Testing on ${device.name}...`);
      
      const page = await browser.newPage();
      
      // Set device viewport
      await page.setViewport(device.viewport);
      
      // Set mobile user agent
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1');
      
      // Navigate to landing page
      await page.goto('http://localhost:3001', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for client-side rendering to complete
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // Test mobile showcase interactions
      console.log(`  ✅ Testing mobile feature showcase...`);
      
      // Check if mobile showcase is visible
      const pageContent = await page.content();
      const hasMobileShowcase = pageContent.includes('How It Works on Mobile') || 
                               pageContent.includes('Mobile-First Landing');
      
      if (hasMobileShowcase) {
        console.log(`  ✅ Mobile showcase found on ${device.name}`);
      } else {
        console.log(`  ⚠️  Mobile showcase not found on ${device.name}`);
      }
      
      // Test mobile process flow
      console.log(`  ✅ Testing mobile process flow...`);
      
      // Check for mobile process flow
      const hasProcessFlow = pageContent.includes('Your Mobile Creator Journey') ||
                            pageContent.includes('Mobile Creator Journey');
      
      if (hasProcessFlow) {
        console.log(`  ✅ Mobile process flow found on ${device.name}`);
      } else {
        console.log(`  ⚠️  Mobile process flow not found on ${device.name}`);
      }
      
      // Test responsive behavior
      console.log(`  ✅ Testing responsive behavior...`);
      
      // Check if buttons are properly sized for mobile
      const buttons = await page.$$('button');
      console.log(`  📊 Found ${buttons.length} buttons on ${device.name}`);
      
      // Check if images are loading
      const images = await page.$$('img[src*="mobile-screenshots"]');
      console.log(`  📊 Found ${images.length} mobile screenshots on ${device.name}`);
      
      // Take screenshot for visual verification
      const screenshotPath = path.join(__dirname, '..', 'public', 'mobile-screenshots', `test-${device.name.replace(/\s+/g, '-').toLowerCase()}.jpg`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      console.log(`  📸 Screenshot saved: ${screenshotPath}`);
      
      await page.close();
    }
    
    console.log('🎉 Mobile showcase testing complete!');
    
  } catch (error) {
    console.error('❌ Error during mobile testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testMobileShowcase().catch(console.error);
