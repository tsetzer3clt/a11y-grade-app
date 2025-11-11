import { analyzeHtml } from './html.js';
import type { Issue } from './jsx.js';

/**
 * Extracts HTML content from Python code strings
 * Looks for HTML in:
 * - Triple-quoted strings ("""...""")
 * - Single-quoted strings ('...')
 * - Double-quoted strings ("...")
 * - f-strings with HTML
 * - Template variables in HTML strings
 */
function extractHtmlFromPython(code: string): string[] {
  const htmlStrings: string[] = [];
  
  // Match triple-quoted strings (most common for HTML in Python)
  const tripleQuotedRegex = /"""(.*?)"""/gs;
  let match;
  while ((match = tripleQuotedRegex.exec(code)) !== null) {
    const content = match[1].trim();
    if (content.includes('<') && content.includes('>')) {
      htmlStrings.push(content);
    }
  }
  
  // Match single triple quotes
  const singleTripleQuotedRegex = /'''(.*?)'''/gs;
  while ((match = singleTripleQuotedRegex.exec(code)) !== null) {
    const content = match[1].trim();
    if (content.includes('<') && content.includes('>')) {
      htmlStrings.push(content);
    }
  }
  
  // Match regular strings that contain HTML-like content
  // Look for strings with HTML tags
  const stringRegex = /(['"])((?:(?!\1)[^\\]|\\.|\\n)*)\1/gs;
  while ((match = stringRegex.exec(code)) !== null) {
    const content = match[2];
    // Check if it looks like HTML (has tags)
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      htmlStrings.push(content);
    }
  }
  
  // Match f-strings (f"...")
  const fStringRegex = /f(['"])((?:(?!\1)[^\\]|\\.|\\n)*)\1/gs;
  while ((match = fStringRegex.exec(code)) !== null) {
    const content = match[2];
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      // Remove Python expressions like {variable} for analysis
      const cleaned = content.replace(/\{[^}]*\}/g, '');
      htmlStrings.push(cleaned);
    }
  }
  
  return htmlStrings;
}

export function analyzePython(code: string, filename?: string): Issue[] {
  const issues: Issue[] = [];
  
  // Extract HTML from Python strings
  const htmlStrings = extractHtmlFromPython(code);
  
  if (htmlStrings.length === 0) {
    // No HTML found - this might be pure Python code
    issues.push({
      ruleId: 'no-html-found',
      message: 'No HTML content found in Python code. This analyzer looks for HTML in string literals.',
      severity: 'warning',
    });
    return issues;
  }
  
  // Analyze each HTML string found
  for (const html of htmlStrings) {
    const htmlIssues = analyzeHtml(html, filename);
    issues.push(...htmlIssues);
  }
  
  return issues;
}

