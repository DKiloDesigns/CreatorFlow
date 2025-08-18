#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SPACER_CONFIG = {
  mui: {
    before: `      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />`,
    after: `    </Box>
  );
}`
  },
  tailwind: {
    before: `      {/* Bottom Spacer to Clear Bottom Navigation */}
      <div className="h-32 sm:h-10 w-full"></div>`,
    after: `    </div>
  );
}`
  }
};

// Files that already have spacers (from Phase 1)
const FILES_WITH_SPACERS = [
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/analytics/page.tsx',
  'src/app/dashboard/accounts/page.tsx',
  'src/app/settings/page.tsx',
  'src/app/security/page.tsx',
  'src/app/support/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/dashboard/phase2-hub/page.tsx',
  'src/app/dashboard/phase3-hub/page.tsx',
  'src/app/enterprise/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/dashboard/ai-tools/page.tsx',
  'src/app/dashboard/enhanced/page.tsx',
  'src/app/scheduling/page.tsx',
  'src/app/privacy/page.tsx'
];

// Files to skip (non-page files or special cases)
const FILES_TO_SKIP = [
  'src/app/layout.tsx',
  'src/app/globals.css',
  'src/app/favicon.ico',
  'src/app/icon.png',
  'src/app/manifest.json',
  'src/app/robots.txt',
  'src/app/sitemap.xml'
];

// Function to detect if a file is MUI-based or Tailwind-based
function detectFileType(content) {
  const hasMUI = content.includes('@mui/material') || content.includes('MuiBox-root') || content.includes('sx={{');
  const hasTailwind = content.includes('className=') && (content.includes('bg-') || content.includes('text-') || content.includes('p-') || content.includes('m-'));
  
  if (hasMUI && !hasTailwind) return 'mui';
  if (hasTailwind && !hasMUI) return 'tailwind';
  if (hasMUI && hasTailwind) return 'mui'; // Prefer MUI if both present
  return 'tailwind'; // Default to Tailwind
}

// Function to check if file already has a spacer
function hasSpacer(content) {
  return content.includes('Bottom Spacer to Clear Bottom Navigation') || 
         content.includes('height: { xs: \'120px\'') ||
         content.includes('h-32 sm:h-10');
}

// Function to find the right insertion point
function findInsertionPoint(content, fileType) {
  const lines = content.split('\n');
  
  // Look for the closing of the main component return statement
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('//') || line.startsWith('/*')) continue;
    
    // Look for the closing of the main return statement
    // This should be the last closing tag or brace before the final closing
    if (line === '</div>' || line === '</main>' || line === '</section>' || line === '</>') {
      // Check if this is the main closing tag by looking at the structure
      const beforeLines = lines.slice(0, i);
      const openTags = (beforeLines.join('\n').match(/<[^/][^>]*>/g) || []).length;
      const closeTags = (beforeLines.join('\n').match(/<\/[^>]*>/g) || []).length;
      
      // If we have more open tags than close tags, this is likely the main closing
      if (openTags > closeTags) {
        return i;
      }
    }
    
    // For MUI components, look for the closing of the main Box or Container
    if (fileType === 'mui' && (line === '}' || line === '};')) {
      // Check if this is the main component closing
      const beforeLines = lines.slice(0, i);
      const openBraces = (beforeLines.join('\n').match(/\{/g) || []).length;
      const closeBraces = (beforeLines.join('\n').match(/\}/g) || []).length;
      
      if (openBraces === closeBraces) {
        return i;
      }
    }
  }
  
  // Fallback: look for the last closing tag
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line === '</div>' || line === '</main>' || line === '</section>' || line === '</>') {
      return i;
    }
  }
  
  // Final fallback: insert before the last line
  return lines.length - 1;
}

// Function to add spacer to a file
function addSpacerToFile(filePath, fileType) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has spacer
    if (hasSpacer(content)) {
      console.log(`⏭️  ${filePath} - Already has spacer`);
      return { success: true, skipped: true };
    }
    
    const lines = content.split('\n');
    const insertIndex = findInsertionPoint(content, fileType);
    
    if (insertIndex === -1) {
      console.log(`❌ ${filePath} - Could not find insertion point`);
      return { success: false, error: 'No insertion point found' };
    }
    
    // Insert spacer
    const spacerLines = SPACER_CONFIG[fileType].before.split('\n');
    lines.splice(insertIndex, 0, ...spacerLines);
    
    // Write back to file
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    
    console.log(`✅ ${filePath} - Spacer added (${fileType})`);
    return { success: true, skipped: false };
    
  } catch (error) {
    console.log(`❌ ${filePath} - Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main function to process all page files
async function processAllPages() {
  console.log('🚀 Starting bulk bottom spacer addition...\n');
  
  // Find all page.tsx files
  const allPages = [];
  
  function findPages(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findPages(fullPath);
      } else if (item === 'page.tsx') {
        allPages.push(fullPath);
      }
    }
  }
  
  findPages('src/app');
  
  console.log(`📁 Found ${allPages.length} page files total`);
  console.log(`✅ ${FILES_WITH_SPACERS.length} already have spacers (Phase 1)`);
  console.log(`🎯 ${allPages.length - FILES_WITH_SPACERS.length} need spacers added\n`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  let processedCount = 0;
  
  // Process each page
  for (const pagePath of allPages) {
    const relativePath = path.relative(process.cwd(), pagePath);
    
    // Skip if already processed in Phase 1
    if (FILES_WITH_SPACERS.includes(relativePath)) {
      skipCount++;
      continue;
    }
    
    // Skip if in skip list
    if (FILES_TO_SKIP.some(skip => relativePath.includes(skip))) {
      skipCount++;
      continue;
    }
    
    try {
      const content = fs.readFileSync(pagePath, 'utf8');
      const fileType = detectFileType(content);
      
      const result = addSpacerToFile(pagePath, fileType);
      
      if (result.success) {
        if (result.skipped) {
          skipCount++;
        } else {
          successCount++;
        }
      } else {
        errorCount++;
      }
      
      processedCount++;
      
      // Progress indicator
      if (processedCount % 10 === 0) {
        console.log(`📊 Progress: ${processedCount}/${allPages.length - FILES_WITH_SPACERS.length} processed`);
      }
      
    } catch (error) {
      console.log(`❌ ${relativePath} - Error: ${error.message}`);
      errorCount++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BULK SPACER ADDITION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successfully added spacers: ${successCount}`);
  console.log(`⏭️  Skipped (already had spacers): ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📁 Total pages processed: ${processedCount}`);
  console.log('='.repeat(60));
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some files had errors. Please review them manually.');
  } else {
    console.log('\n🎉 All pages successfully processed!');
  }
  
  console.log('\n🔍 Next steps:');
  console.log('1. Review a few random pages to ensure spacers are properly positioned');
  console.log('2. Test mobile view on key pages');
  console.log('3. Commit changes when satisfied');
}

// Run the script
processAllPages().catch(console.error);
