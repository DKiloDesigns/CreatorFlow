import puppeteer from 'puppeteer';

async function simpleMobileTest() {
  console.log('🚀 Starting simple mobile test...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 812 });
    
    console.log('📱 Navigating to landing page...');
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('⏳ Waiting for client-side rendering...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('🔍 Checking page content...');
    const content = await page.content();
    
    // Check for mobile components
    const hasMobileShowcase = content.includes('How It Works on Mobile');
    const hasMobileProcess = content.includes('Your Mobile Creator Journey');
    const hasMobileScreenshots = content.includes('mobile-screenshots');
    
    console.log(`📊 Results:`);
    console.log(`  Mobile Showcase: ${hasMobileShowcase ? '✅ Found' : '❌ Not found'}`);
    console.log(`  Mobile Process: ${hasMobileProcess ? '✅ Found' : '❌ Not found'}`);
    console.log(`  Mobile Screenshots: ${hasMobileScreenshots ? '✅ Found' : '❌ Not found'}`);
    
    // Take a screenshot
    await page.screenshot({
      path: 'public/mobile-screenshots/simple-test.jpg',
      fullPage: true
    });
    
    console.log('📸 Screenshot saved: simple-test.jpg');
    
    await page.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

simpleMobileTest().catch(console.error);
