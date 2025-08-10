#!/usr/bin/env node

/**
 * Color Contrast Testing Script for CreatorFlow
 * Tests all components for WCAG 2.1 AA compliance
 */

import fs from 'fs';
import path from 'path';

// Color contrast calculation functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

function getRelativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(color1, color2) {
  try {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  } catch (error) {
    return 0;
  }
}

function checkWCAGCompliance(foreground, background, fontSize = 'normal', isBold = false) {
  const ratio = calculateContrastRatio(foreground, background);
  const requiredRatio = fontSize === 'large' || isBold ? 3.0 : 4.5;
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA: ratio >= requiredRatio,
    wcagAAA: ratio >= (fontSize === 'large' || isBold ? 4.5 : 7.0),
    status: ratio >= requiredRatio ? 'pass' : 'fail'
  };
}

// Test color combinations from our theme
const testColors = [
  // Primary colors
  { foreground: '#ffffff', background: '#2563eb', name: 'Primary Button Text', context: 'Button text on primary background' },
  { foreground: '#2563eb', background: '#ffffff', name: 'Primary Text', context: 'Primary color text on white' },
  
  // Secondary colors
  { foreground: '#ffffff', background: '#7c3aed', name: 'Secondary Button Text', context: 'Button text on secondary background' },
  { foreground: '#7c3aed', background: '#ffffff', name: 'Secondary Text', context: 'Secondary color text on white' },
  
  // Success colors - Updated with new darker shades
  { foreground: '#ffffff', background: '#047857', name: 'Success Button Text', context: 'Button text on success background' },
  { foreground: '#047857', background: '#ffffff', name: 'Success Text', context: 'Success color text on white' },
  
  // Warning colors - Updated with new darker shades
  { foreground: '#ffffff', background: '#b45309', name: 'Warning Button Text', context: 'Button text on warning background' },
  { foreground: '#b45309', background: '#ffffff', name: 'Warning Text', context: 'Warning color text on white' },
  
  // Error colors
  { foreground: '#ffffff', background: '#dc2626', name: 'Error Button Text', context: 'Button text on error background' },
  { foreground: '#dc2626', background: '#ffffff', name: 'Error Text', context: 'Error color text on white' },
  
  // Neutral colors
  { foreground: '#0f172a', background: '#f8fafc', name: 'Dark Text on Light Background', context: 'Main text on light background' },
  { foreground: '#64748b', background: '#ffffff', name: 'Secondary Text on White', context: 'Secondary text on white background' },
  { foreground: '#525252', background: '#f5f5f5', name: 'Muted Text on Light Background', context: 'Muted text on light background' },
  
  // Dark theme colors
  { foreground: '#f8fafc', background: '#0f172a', name: 'Light Text on Dark Background', context: 'Main text on dark background' },
  { foreground: '#cbd5e1', background: '#1e293b', name: 'Light Text on Card Background', context: 'Text on dark card background' },
  { foreground: '#cbd5e1', background: '#334155', name: 'Muted Text on Dark Background', context: 'Muted text on dark background' } // Updated: Better contrast than #94a3b8
];

console.log('🎨 CreatorFlow Color Contrast Analysis');
console.log('=====================================\n');

let totalTests = 0;
let passingTests = 0;
let failingTests = 0;
let criticalFailures = [];

console.log('Testing WCAG 2.1 AA Compliance (4.5:1 ratio required for normal text)\n');

testColors.forEach(colorPair => {
  totalTests++;
  const result = checkWCAGCompliance(colorPair.foreground, colorPair.background);
  
  const status = result.status === 'pass' ? '✅' : '❌';
  const ratioDisplay = result.ratio.toFixed(2);
  
  console.log(`${status} ${colorPair.name}`);
  console.log(`   Context: ${colorPair.context}`);
  console.log(`   Contrast Ratio: ${ratioDisplay}:1`);
  console.log(`   WCAG AA: ${result.wcagAA ? 'PASS' : 'FAIL'}`);
  console.log(`   WCAG AAA: ${result.wcagAAA ? 'PASS' : 'FAIL'}`);
  
  if (result.status === 'pass') {
    passingTests++;
  } else {
    failingTests++;
    if (result.ratio < 3.0) {
      criticalFailures.push({
        ...colorPair,
        ratio: result.ratio,
        severity: 'CRITICAL'
      });
    }
  }
  
  console.log('');
});

// Summary
console.log('📊 SUMMARY');
console.log('==========');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passing: ${passingTests} ✅`);
console.log(`Failing: ${failingTests} ❌`);
console.log(`Success Rate: ${Math.round((passingTests / totalTests) * 100)}%`);

if (criticalFailures.length > 0) {
  console.log('\n🚨 CRITICAL FAILURES (Ratio < 3.0:1)');
  console.log('=====================================');
  criticalFailures.forEach(failure => {
    console.log(`❌ ${failure.name}: ${failure.ratio}:1 ratio`);
    console.log(`   Context: ${failure.context}`);
  });
}

if (failingTests > 0) {
  console.log('\n🔧 RECOMMENDATIONS');
  console.log('==================');
  console.log('1. Review failing color combinations above');
  console.log('2. Use the accessible color palette utilities');
  console.log('3. Test with high contrast mode enabled');
  console.log('4. Consider implementing automatic contrast adjustment');
}

console.log('\n✨ Color contrast analysis complete!');
