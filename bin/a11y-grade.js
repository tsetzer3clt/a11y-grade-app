#!/usr/bin/env node

import { readFileSync } from 'fs';
import { analyzeJSX } from '../dist/analyzers/jsx.js';
import { analyzeHtml } from '../dist/analyzers/html.js';
import { generateReport } from '../dist/report.js';

const args = process.argv.slice(2);
const filePath = args[0];

if (!filePath) {
  console.error('Usage: a11y-grade <file-path>');
  process.exit(1);
}

try {
  const code = readFileSync(filePath, 'utf8');
  const ext = filePath.split('.').pop()?.toLowerCase();
  
  let issues;
  if (ext === 'html' || ext === 'htm') {
    issues = analyzeHtml(code, filePath);
  } else {
    issues = analyzeJSX(code, filePath);
  }
  
  const report = generateReport(issues);
  
  console.log('\n📊 Accessibility Report\n');
  console.log(`Grade: ${report.grade} (${report.score}/100)`);
  console.log(`Total Issues: ${report.totalIssues} (${report.errors} errors, ${report.warnings} warnings)\n`);
  console.log(report.summary);
  
  if (report.needsWork.length > 0) {
    console.log('\n❌ Needs Work:');
    report.needsWork.forEach(item => console.log(`  • ${item}`));
  }
  
  if (report.goodPractices.length > 0) {
    console.log('\n✅ Good Practices:');
    report.goodPractices.forEach(item => console.log(`  • ${item}`));
  }
  
  process.exit(report.errors > 0 ? 1 : 0);
} catch (error: any) {
  console.error('Error:', error.message);
  process.exit(1);
}

