/**
 * Color Contrast Utility for WCAG 2.1 AA Compliance
 * 
 * This utility provides comprehensive color contrast analysis and recommendations
 * to ensure CreatorFlow meets accessibility standards.
 */

export interface ColorContrastResult {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  status: 'pass' | 'fail' | 'warning';
  recommendation?: string;
}

export interface ColorPair {
  foreground: string;
  background: string;
  element?: string;
  context?: string;
}

export interface ContrastViolation {
  element: string;
  foreground: string;
  background: string;
  currentRatio: number;
  requiredRatio: number;
  recommendation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Convert RGB to relative luminance
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate color contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  try {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    console.warn('Error calculating contrast ratio:', error);
    return 0;
  }
}

/**
 * Check if a color pair meets WCAG 2.1 AA standards
 */
export function checkWCAGCompliance(
  foreground: string, 
  background: string, 
  fontSize: 'normal' | 'large' = 'normal',
  isBold: boolean = false
): ColorContrastResult {
  const ratio = calculateContrastRatio(foreground, background);
  
  // WCAG 2.1 AA requirements
  const requiredRatio = fontSize === 'large' || isBold ? 3.0 : 4.5;
  const requiredRatioAAA = fontSize === 'large' || isBold ? 4.5 : 7.0;
  
  const wcagAA = ratio >= requiredRatio;
  const wcagAAA = ratio >= requiredRatioAAA;
  
  let status: 'pass' | 'fail' | 'warning' = 'pass';
  let recommendation: string | undefined;
  
  if (!wcagAA) {
    status = 'fail';
    recommendation = `Increase contrast ratio from ${ratio.toFixed(2)}:1 to at least ${requiredRatio}:1 for WCAG 2.1 AA compliance`;
  } else if (!wcagAAA) {
    status = 'warning';
    recommendation = `Consider increasing contrast ratio to ${requiredRatioAAA}:1 for WCAG 2.1 AAA compliance`;
  }
  
  return {
    ratio,
    wcagAA,
    wcagAAA,
    status,
    recommendation
  };
}

/**
 * Generate color contrast recommendations for CreatorFlow
 */
export function generateCreatorFlowContrastRecommendations(): ContrastViolation[] {
  const violations: ContrastViolation[] = [];
  
  // Define current color pairs from the design system
  const colorPairs: ColorPair[] = [
    // Light mode
    { foreground: '#171717', background: '#ffffff', element: 'body-text', context: 'light-mode' },
    { foreground: '#737373', background: '#f5f5f5', element: 'muted-text', context: 'light-mode' },
    { foreground: '#262626', background: '#f5f5f5', element: 'primary-text', context: 'light-mode' },
    { foreground: '#fafafa', background: '#262626', element: 'button-text', context: 'light-mode' },
    
    // Dark mode
    { foreground: '#fafafa', background: '#171717', element: 'body-text', context: 'dark-mode' },
    { foreground: '#a3a3a3', background: '#404040', element: 'muted-text', context: 'dark-mode' },
    { foreground: '#e5e5e5', background: '#404040', element: 'primary-text', context: 'dark-mode' },
    { foreground: '#262626', background: '#e5e5e5', element: 'button-text', context: 'dark-mode' },
    
    // Chart colors
    { foreground: '#ffffff', background: '#3b82f6', element: 'chart-1', context: 'charts' },
    { foreground: '#ffffff', background: '#06b6d4', element: 'chart-2', context: 'charts' },
    { foreground: '#ffffff', background: '#3730a3', element: 'chart-3', context: 'charts' },
    { foreground: '#ffffff', background: '#f59e0b', element: 'chart-4', context: 'charts' },
    { foreground: '#ffffff', background: '#ef4444', element: 'chart-5', context: 'charts' },
    
    // Sidebar
    { foreground: '#171717', background: '#fafafa', element: 'sidebar-text', context: 'sidebar' },
    { foreground: '#fafafa', background: '#262626', element: 'sidebar-text', context: 'sidebar-dark' },
  ];
  
  colorPairs.forEach(pair => {
    const result = checkWCAGCompliance(pair.foreground, pair.background);
    
    if (result.status === 'fail') {
      const priority = result.ratio < 2.0 ? 'critical' : 
                      result.ratio < 3.0 ? 'high' : 
                      result.ratio < 4.0 ? 'medium' : 'low';
      
      violations.push({
        element: pair.element || 'unknown',
        foreground: pair.foreground,
        background: pair.background,
        currentRatio: result.ratio,
        requiredRatio: 4.5, // WCAG 2.1 AA standard
        recommendation: result.recommendation || 'Improve color contrast',
        priority
      });
    }
  });
  
  return violations;
}

/**
 * Suggest alternative colors that meet WCAG 2.1 AA standards
 */
export function suggestAlternativeColors(
  currentColor: string, 
  backgroundColor: string, 
  targetRatio: number = 4.5
): string[] {
  const alternatives: string[] = [];
  
  try {
    const currentRgb = hexToRgb(currentColor);
    const bgRgb = hexToRgb(backgroundColor);
    
    // Generate darker alternatives for light text on dark backgrounds
    if (getRelativeLuminance(currentRgb.r, currentRgb.g, currentRgb.b) > 
        getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b)) {
      
      // Darken the text color
      for (let factor = 0.1; factor <= 0.9; factor += 0.1) {
        const newR = Math.round(currentRgb.r * factor);
        const newG = Math.round(currentRgb.g * factor);
        const newB = Math.round(currentRgb.b * factor);
        
        const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        if (calculateContrastRatio(newColor, backgroundColor) >= targetRatio) {
          alternatives.push(newColor);
          if (alternatives.length >= 3) break;
        }
      }
    } else {
      // Lighten the text color
      for (let factor = 1.1; factor <= 2.0; factor += 0.1) {
        const newR = Math.min(255, Math.round(currentRgb.r * factor));
        const newG = Math.min(255, Math.round(currentRgb.g * factor));
        const newB = Math.min(255, Math.round(currentRgb.b * factor));
        
        const newColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        
        if (calculateContrastRatio(newColor, backgroundColor) >= targetRatio) {
          alternatives.push(newColor);
          if (alternatives.length >= 3) break;
        }
      }
    }
  } catch (error) {
    console.warn('Error generating alternative colors:', error);
  }
  
  return alternatives;
}

/**
 * Generate a comprehensive contrast report for CreatorFlow
 */
export function generateContrastReport(): string {
  const violations = generateCreatorFlowContrastRecommendations();
  
  let report = `# CreatorFlow Color Contrast Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**WCAG 2.1 AA Target:** 4.5:1 (normal text), 3.0:1 (large/bold text)\n\n`;
  
  if (violations.length === 0) {
    report += `✅ **All color combinations meet WCAG 2.1 AA standards!**\n\n`;
  } else {
    report += `🚨 **Found ${violations.length} contrast violations**\n\n`;
    
    // Group by priority
    const critical = violations.filter(v => v.priority === 'critical');
    const high = violations.filter(v => v.priority === 'high');
    const medium = violations.filter(v => v.priority === 'medium');
    const low = violations.filter(v => v.priority === 'low');
    
    if (critical.length > 0) {
      report += `## 🔴 Critical Priority (${critical.length})\n\n`;
      critical.forEach(v => {
        report += `- **${v.element}**: ${v.foreground} on ${v.background} (${v.currentRatio.toFixed(2)}:1)\n`;
        report += `  - Required: ${v.requiredRatio}:1\n`;
        report += `  - Recommendation: ${v.recommendation}\n\n`;
      });
    }
    
    if (high.length > 0) {
      report += `## 🟠 High Priority (${high.length})\n\n`;
      high.forEach(v => {
        report += `- **${v.element}**: ${v.foreground} on ${v.background} (${v.currentRatio.toFixed(2)}:1)\n`;
        report += `  - Required: ${v.requiredRatio}:1\n`;
        report += `  - Recommendation: ${v.recommendation}\n\n`;
      });
    }
    
    if (medium.length > 0) {
      report += `## 🟡 Medium Priority (${medium.length})\n\n`;
      medium.forEach(v => {
        report += `- **${v.element}**: ${v.foreground} on ${v.background} (${v.currentRatio.toFixed(2)}:1)\n`;
        report += `  - Required: ${v.requiredRatio}:1\n`;
        report += `  - Recommendation: ${v.recommendation}\n\n`;
      });
    }
    
    if (low.length > 0) {
      report += `## 🟢 Low Priority (${low.length})\n\n`;
      low.forEach(v => {
        report += `- **${v.element}**: ${v.foreground} on ${v.background} (${v.currentRatio.toFixed(2)}:1)\n`;
        report += `  - Required: ${v.requiredRatio}:1\n`;
        report += `  - Recommendation: ${v.recommendation}\n\n`;
      });
    }
  }
  
  return report;
}

/**
 * Check if a specific color combination is accessible
 */
export function isAccessible(
  foreground: string, 
  background: string, 
  fontSize: 'normal' | 'large' = 'normal',
  isBold: boolean = false
): boolean {
  const result = checkWCAGCompliance(foreground, background, fontSize, isBold);
  return result.wcagAA;
}
