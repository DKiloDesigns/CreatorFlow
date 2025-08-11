/**
 * SACA Accessibility Testing Utilities
 * 
 * This module provides comprehensive accessibility testing tools for SACA compliance.
 * Implements WCAG 2.1 AA standards and automated testing capabilities.
 */

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

export interface AccessibilityTestResult {
  violations: AccessibilityViolation[];
  passes: any[];
  incomplete: any[];
  inapplicable: any[];
  timestamp: string;
  url: string;
  testEngine: {
    name: string;
    version: string;
  };
  testRunner: {
    name: string;
  };
  testEnvironment: {
    userAgent: string;
    windowWidth: number;
    windowHeight: number;
    orientationAngle: number;
    orientationType: string;
  };
  colorContrastReport?: string;
}

/**
 * SACA Accessibility Test Suite
 */
export class SACAAccessibilityTester {
  private violations: AccessibilityViolation[] = [];
  private testResults: AccessibilityTestResult | null = null;

  /**
   * Run comprehensive accessibility tests
   */
  async runAccessibilityTests(url: string): Promise<AccessibilityTestResult> {
    try {
      // Check if axe-core is available
      if (typeof window !== 'undefined' && (window as any).axe) {
        return await this.runAxeCoreTests(url);
      } else {
        return await this.runManualTests(url);
      }
    } catch (error) {
      console.error('Accessibility testing failed:', error);
      return this.createErrorResult(url, error as Error);
    }
  }

  /**
   * Run axe-core tests if available
   */
  private async runAxeCoreTests(url: string): Promise<AccessibilityTestResult> {
    const axe = (window as any).axe;
    
    const results = await axe.run({
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'best-practice']
      },
      reporter: 'v2'
    });

    // Generate color contrast report
    let colorContrastReport = '';
    try {
      const { generateContrastReport } = await import('./color-contrast');
      colorContrastReport = generateContrastReport();
    } catch (error) {
      console.warn('Failed to generate color contrast report:', error);
      colorContrastReport = 'Color contrast report unavailable';
    }

    this.testResults = {
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      inapplicable: results.inapplicable,
      timestamp: new Date().toISOString(),
      url,
      testEngine: {
        name: 'axe-core',
        version: axe.version || 'unknown'
      },
      testRunner: {
        name: 'saca-accessibility-tester'
      },
      testEnvironment: {
        userAgent: navigator.userAgent,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        orientationAngle: (screen as any).orientation?.angle || 0,
        orientationType: (screen as any).orientation?.type || 'landscape-primary'
      },
      colorContrastReport
    };

    return this.testResults;
  }

  /**
   * Run manual accessibility tests
   */
  private async runManualTests(url: string): Promise<AccessibilityTestResult> {
    const violations: AccessibilityViolation[] = [];

    // Test 1: Check for proper heading structure
    const headingViolations = this.checkHeadingStructure();
    violations.push(...headingViolations);

    // Test 2: Check for proper ARIA attributes
    const ariaViolations = this.checkARIAAttributes();
    violations.push(...ariaViolations);

    // Test 3: Check for keyboard navigation
    const keyboardViolations = this.checkKeyboardNavigation();
    violations.push(...keyboardViolations);

    // Test 4: Check for color contrast
    const contrastViolations = await this.checkColorContrast();
    violations.push(...contrastViolations);

    // Test 5: Check for focus indicators
    const focusViolations = this.checkFocusIndicators();
    violations.push(...focusViolations);

    // Generate color contrast report
    let colorContrastReport = '';
    try {
      const { generateContrastReport } = await import('./color-contrast');
      colorContrastReport = generateContrastReport();
    } catch (error) {
      console.warn('Failed to generate color contrast report:', error);
      colorContrastReport = 'Color contrast report unavailable';
    }

    this.testResults = {
      violations,
      passes: [],
      incomplete: [],
      inapplicable: [],
      timestamp: new Date().toISOString(),
      url,
      testEngine: {
        name: 'saca-manual-tester',
        version: '1.0.0'
      },
      testRunner: {
        name: 'saca-accessibility-tester'
      },
      testEnvironment: {
        userAgent: navigator.userAgent,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        orientationAngle: (screen as any).orientation?.angle || 0,
        orientationType: (screen as any).orientation?.type || 'landscape-primary'
      },
      colorContrastReport
    };

    return this.testResults;
  }

  /**
   * Check heading structure for proper hierarchy
   */
  private checkHeadingStructure(): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels: number[] = [];

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);
    });

    // Check for skipped heading levels
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i - 1] > 1) {
        violations.push({
          id: 'heading-order',
          impact: 'moderate',
          description: 'Heading levels should not be skipped',
          help: 'Ensure heading levels are not skipped (e.g., h1 to h3)',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/heading-order',
          tags: ['wcag2a', 'wcag131'],
          nodes: [{
            html: headings[i].outerHTML,
            target: [headings[i].tagName.toLowerCase()],
            failureSummary: `Heading level ${headingLevels[i]} follows heading level ${headingLevels[i - 1]}`
          }]
        });
      }
    }

    return violations;
  }

  /**
   * Check for proper ARIA attributes
   */
  private checkARIAAttributes(): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [role]');

    interactiveElements.forEach((element) => {
      // Check for missing aria-label on interactive elements
      if (element.hasAttribute('aria-label') === false && 
          element.hasAttribute('aria-labelledby') === false &&
          element.textContent?.trim() === '') {
        violations.push({
          id: 'aria-label-missing',
          impact: 'serious',
          description: 'Interactive elements should have accessible names',
          help: 'Provide an aria-label or aria-labelledby attribute for interactive elements',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/aria-label',
          tags: ['wcag2a', 'wcag412'],
          nodes: [{
            html: element.outerHTML,
            target: [element.tagName.toLowerCase()],
            failureSummary: 'Interactive element missing accessible name'
          }]
        });
      }
    });

    return violations;
  }

  /**
   * Check for keyboard navigation support
   */
  private checkKeyboardNavigation(): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]');

    interactiveElements.forEach((element) => {
      // Check for proper tabindex
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        violations.push({
          id: 'tabindex-positive',
          impact: 'moderate',
          description: 'Positive tabindex values can cause navigation issues',
          help: 'Avoid positive tabindex values as they can disrupt natural tab order',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/tabindex',
          tags: ['wcag2a', 'wcag211'],
          nodes: [{
            html: element.outerHTML,
            target: [element.tagName.toLowerCase()],
            failureSummary: `Element has positive tabindex value: ${tabIndex}`
          }]
        });
      }
    });

    return violations;
  }

  /**
   * Check for color contrast compliance using enhanced color contrast utility
   */
  private async checkColorContrast(): Promise<AccessibilityViolation[]> {
    const violations: AccessibilityViolation[] = [];
    
    try {
      // Import color contrast utilities dynamically
      const { calculateContrastRatio, checkWCAGCompliance } = await import('./color-contrast');
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, a, input, textarea, select, label');
      
      textElements.forEach((element) => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Skip if colors are transparent or invalid
        if (!color || !backgroundColor || color === 'transparent' || backgroundColor === 'transparent') {
          return;
        }
        
        try {
          // Convert CSS color values to hex for contrast calculation
          const hexColor = this.cssColorToHex(color);
          const hexBackground = this.cssColorToHex(backgroundColor);
          
          if (hexColor && hexBackground) {
            const result = checkWCAGCompliance(hexColor, hexBackground);
            
            if (result.status === 'fail') {
              const impact = result.ratio < 2.0 ? 'critical' : 
                           result.ratio < 3.0 ? 'serious' : 
                           result.ratio < 4.0 ? 'moderate' : 'minor';
              
              violations.push({
                id: 'color-contrast',
                impact,
                description: `Insufficient color contrast: ${result.ratio.toFixed(2)}:1 (required: ${result.ratio < 3.0 ? '3.0:1' : '4.5:1'})`,
                help: result.recommendation || 'Ensure text has sufficient contrast with its background',
                helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/color-contrast',
                tags: ['wcag2aa', 'wcag143'],
                nodes: [{
                  html: element.outerHTML,
                  target: [element.tagName.toLowerCase()],
                  failureSummary: `Color contrast ratio ${result.ratio.toFixed(2)}:1 does not meet WCAG 2.1 AA standards`
                }]
              });
            }
          }
        } catch (error) {
          console.warn('Error checking color contrast for element:', element, error);
        }
      });
    } catch (error) {
      console.warn('Failed to load color contrast utilities:', error);
    }

    return violations;
  }

  /**
   * Convert CSS color values to hex format
   */
  private cssColorToHex(cssColor: string): string | null {
    try {
      // Handle named colors
      const namedColors: { [key: string]: string } = {
        'black': '#000000',
        'white': '#ffffff',
        'red': '#ff0000',
        'green': '#00ff00',
        'blue': '#0000ff',
        'yellow': '#ffff00',
        'cyan': '#00ffff',
        'magenta': '#ff00ff',
        'gray': '#808080',
        'grey': '#808080',
        'silver': '#c0c0c0',
        'maroon': '#800000',
        'olive': '#808000',
        'navy': '#000080',
        'purple': '#800080',
        'teal': '#008080',
        'orange': '#ffa500',
        'pink': '#ffc0cb',
        'brown': '#a52a2a',
        'lime': '#00ff00',
        'aqua': '#00ffff',
        'fuchsia': '#ff00ff'
      };
      
      if (namedColors[cssColor.toLowerCase()]) {
        return namedColors[cssColor.toLowerCase()];
      }
      
      // Handle hex colors
      if (cssColor.startsWith('#')) {
        return cssColor;
      }
      
      // Handle rgb/rgba colors
      if (cssColor.startsWith('rgb')) {
        const match = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (match) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
      }
      
      // Handle hsl/hsla colors
      if (cssColor.startsWith('hsl')) {
        // This is a simplified conversion - in production you'd want a more robust HSL to RGB converter
        console.warn('HSL color conversion not implemented:', cssColor);
        return null;
      }
      
      return null;
    } catch (error) {
      console.warn('Error converting CSS color to hex:', cssColor, error);
      return null;
    }
  }

  /**
   * Check for focus indicators
   */
  private checkFocusIndicators(): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');

    interactiveElements.forEach((element) => {
      // Check if element has focus styles
      const style = window.getComputedStyle(element);
      const outline = style.outline;
      const boxShadow = style.boxShadow;
      
      if (outline === 'none' && boxShadow === 'none') {
        violations.push({
          id: 'focus-visible',
          impact: 'serious',
          description: 'Focus indicators are not visible',
          help: 'Ensure focus indicators are visible for keyboard navigation',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/focus-visible',
          tags: ['wcag2aa', 'wcag211'],
          nodes: [{
            html: element.outerHTML,
            target: [element.tagName.toLowerCase()],
            failureSummary: 'Interactive element missing visible focus indicator'
          }]
        });
      }
    });

    return violations;
  }

  /**
   * Create error result when testing fails
   */
  private createErrorResult(url: string, error: Error): AccessibilityTestResult {
    return {
      violations: [{
        id: 'testing-error',
        impact: 'critical',
        description: 'Accessibility testing failed',
        help: error.message,
        helpUrl: '',
        tags: ['testing'],
        nodes: [{
          html: '',
          target: [],
          failureSummary: error.message
        }]
      }],
      passes: [],
      incomplete: [],
      inapplicable: [],
      timestamp: new Date().toISOString(),
      url,
      testEngine: {
        name: 'saca-accessibility-tester',
        version: '1.0.0'
      },
      testRunner: {
        name: 'saca-accessibility-tester'
      },
      testEnvironment: {
        userAgent: navigator.userAgent,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        orientationAngle: (screen as any).orientation?.angle || 0,
        orientationType: (screen as any).orientation?.type || 'landscape-primary'
      }
    };
  }

  /**
   * Get test results summary
   */
  getTestSummary(): {
    totalViolations: number;
    criticalViolations: number;
    seriousViolations: number;
    moderateViolations: number;
    minorViolations: number;
    compliance: 'pass' | 'fail' | 'partial';
  } {
    if (!this.testResults) {
      return {
        totalViolations: 0,
        criticalViolations: 0,
        seriousViolations: 0,
        moderateViolations: 0,
        minorViolations: 0,
        compliance: 'pass'
      };
    }

    const criticalViolations = this.testResults.violations.filter(v => v.impact === 'critical').length;
    const seriousViolations = this.testResults.violations.filter(v => v.impact === 'serious').length;
    const moderateViolations = this.testResults.violations.filter(v => v.impact === 'moderate').length;
    const minorViolations = this.testResults.violations.filter(v => v.impact === 'minor').length;
    const totalViolations = this.testResults.violations.length;

    let compliance: 'pass' | 'fail' | 'partial' = 'pass';
    if (criticalViolations > 0 || seriousViolations > 0) {
      compliance = 'fail';
    } else if (moderateViolations > 0 || minorViolations > 0) {
      compliance = 'partial';
    }

    return {
      totalViolations,
      criticalViolations,
      seriousViolations,
      moderateViolations,
      minorViolations,
      compliance
    };
  }

  /**
   * Generate accessibility report
   */
  generateReport(): string {
    const summary = this.getTestSummary();
    const results = this.testResults;

    if (!results) {
      return 'No accessibility test results available.';
    }

    let report = `# SACA Accessibility Test Report\n\n`;
    report += `**Test Date:** ${new Date(results.timestamp).toLocaleString()}\n`;
    report += `**URL:** ${results.url}\n`;
    report += `**Test Engine:** ${results.testEngine.name} v${results.testEngine.version}\n\n`;

    report += `## Summary\n\n`;
    report += `- **Total Violations:** ${summary.totalViolations}\n`;
    report += `- **Critical Violations:** ${summary.criticalViolations}\n`;
    report += `- **Serious Violations:** ${summary.seriousViolations}\n`;
    report += `- **Moderate Violations:** ${summary.moderateViolations}\n`;
    report += `- **Minor Violations:** ${summary.minorViolations}\n`;
    report += `- **Compliance Status:** ${summary.compliance.toUpperCase()}\n\n`;

    if (results.violations.length > 0) {
      report += `## Violations\n\n`;
      results.violations.forEach((violation, index) => {
        report += `### ${index + 1}. ${violation.description}\n\n`;
        report += `- **Impact:** ${violation.impact}\n`;
        report += `- **Help:** ${violation.help}\n`;
        report += `- **Tags:** ${violation.tags.join(', ')}\n\n`;
        
        if (violation.nodes.length > 0) {
          report += `**Affected Elements:**\n\n`;
          violation.nodes.forEach((node) => {
            report += `\`\`\`html\n${node.html}\n\`\`\`\n\n`;
          });
        }
      });
    } else {
      report += `## ✅ No Violations Found\n\n`;
      report += `Congratulations! This page passes all accessibility tests.\n\n`;
    }

    return report;
  }
}

/**
 * Global accessibility tester instance
 */
export const sacaTester = new SACAAccessibilityTester();

/**
 * Utility function to run accessibility tests
 */
export async function runSACAAccessibilityTests(url?: string): Promise<AccessibilityTestResult> {
  const testUrl = url || window.location.href;
  return await sacaTester.runAccessibilityTests(testUrl);
}

/**
 * Utility function to generate accessibility report
 */
export function generateSACAReport(): string {
  return sacaTester.generateReport();
}
