import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'mobile-screenshots');
const OPTIMIZED_DIR = path.join(__dirname, '..', 'public', 'mobile-screenshots', 'optimized');

// Create optimized directory
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

const SCREENSHOTS = [
  'landing-page.jpg',
  'features.jpg', 
  'pricing.jpg',
  'auth.jpg'
];

async function optimizeScreenshots() {
  console.log('🚀 Starting mobile screenshot optimization...');
  
  for (const screenshot of SCREENSHOTS) {
    const inputPath = path.join(SCREENSHOTS_DIR, screenshot);
    const outputPath = path.join(OPTIMIZED_DIR, screenshot);
    
    try {
      console.log(`📱 Optimizing ${screenshot}...`);
      
      await sharp(inputPath)
        .resize(375, 812, {
          fit: 'cover',
          position: 'top'
        })
        .jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);
      
      // Get file sizes
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${screenshot}: ${(originalSize/1024).toFixed(1)}KB → ${(optimizedSize/1024).toFixed(1)}KB (${savings}% savings)`);
      
    } catch (error) {
      console.error(`❌ Error optimizing ${screenshot}:`, error);
    }
  }
  
  console.log('🎉 Mobile screenshot optimization complete!');
}

// Run optimization
optimizeScreenshots().catch(console.error);
