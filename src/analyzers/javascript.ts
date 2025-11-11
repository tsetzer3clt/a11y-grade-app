import { analyzeJSX } from './jsx.js';
import { analyzeHtml } from './html.js';
import type { Issue } from './jsx.js';

/**
 * Extracts HTML/JSX content from JavaScript code
 * Looks for:
 * - Template literals with HTML/JSX
 * - String literals with HTML
 * - JSX in .js files
 */
function extractHtmlFromJavaScript(code: string): { content: string; isJSX: boolean }[] {
  const htmlStrings: { content: string; isJSX: boolean }[] = [];
  
  // Check if code contains JSX syntax (even in .js files)
  const hasJSX = /<\w[\w-]*[\s>]/.test(code);
  
  if (hasJSX) {
    // If JSX is found, analyze the whole file as JSX
    return [{ content: code, isJSX: true }];
  }
  
  // Extract template literals (backticks)
  const templateLiteralRegex = /`([^`]*)`/gs;
  let match;
  while ((match = templateLiteralRegex.exec(code)) !== null) {
    const content = match[1];
    // Check if it looks like HTML
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      // Remove JS expressions like ${...} for analysis
      const cleaned = content.replace(/\$\{[^}]*\}/g, '');
      htmlStrings.push({ content: cleaned, isJSX: false });
    }
  }
  
  // Extract regular strings with HTML
  const stringRegex = /(['"])((?:(?!\1)[^\\]|\\.|\\n)*)\1/gs;
  while ((match = stringRegex.exec(code)) !== null) {
    const content = match[2];
    // Check if it looks like HTML
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      htmlStrings.push({ content, isJSX: false });
    }
  }
  
  return htmlStrings;
}

export function analyzeJavaScript(code: string, filename?: string): Issue[] {
  const issues: Issue[] = [];
  
  // Extract HTML/JSX from JavaScript
  const htmlStrings = extractHtmlFromJavaScript(code);
  
  if (htmlStrings.length === 0) {
    // No HTML/JSX found - might be pure JavaScript
    issues.push({
      ruleId: 'no-html-found',
      message: 'No HTML/JSX content found in JavaScript code. This analyzer looks for HTML in template literals or string literals.',
      severity: 'warning',
    });
    return issues;
  }
  
  // Analyze each HTML/JSX string found
  for (const { content, isJSX } of htmlStrings) {
    if (isJSX) {
      // Analyze as JSX
      const jsxIssues = analyzeJSX(content, filename);
      issues.push(...jsxIssues);
    } else {
      // Analyze as HTML
      const htmlIssues = analyzeHtml(content, filename);
      issues.push(...htmlIssues);
    }
  }
  
  return issues;
}

