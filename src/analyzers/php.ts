import { analyzeHtml } from './html.js';
import type { Issue } from './jsx.js';

/**
 * Extracts HTML content from PHP code
 * Looks for HTML in:
 * - Direct HTML outside PHP tags (<?php ... ?>)
 * - Single-quoted strings ('...')
 * - Double-quoted strings ("...")
 * - Heredoc syntax (<<<EOF ... EOF)
 * - Nowdoc syntax (<<<'EOF' ... EOF)
 * - Echo/print statements
 */
function extractHtmlFromPHP(code: string): string[] {
  const htmlStrings: string[] = [];
  
  // First, extract HTML that's outside PHP tags (common in template files)
  // Remove PHP tags and extract the HTML parts
  const phpTagRegex = /<\?php.*?\?>/gs;
  const htmlParts = code.split(phpTagRegex);
  
  for (const part of htmlParts) {
    const trimmed = part.trim();
    // Check if it looks like HTML (has tags)
    if (trimmed.includes('<') && trimmed.includes('>') && /<[a-zA-Z][\s>]/.test(trimmed)) {
      htmlStrings.push(trimmed);
    }
  }
  
  // Extract HTML from PHP strings
  // Single-quoted strings
  const singleQuoteRegex = /'((?:[^'\\]|\\.|\\n)*)'/gs;
  let match;
  while ((match = singleQuoteRegex.exec(code)) !== null) {
    const content = match[1];
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      htmlStrings.push(content);
    }
  }
  
  // Double-quoted strings
  const doubleQuoteRegex = /"((?:[^"\\]|\\.|\\n)*)"/gs;
  while ((match = doubleQuoteRegex.exec(code)) !== null) {
    const content = match[1];
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      // Remove PHP variables like $var or {$var}
      const cleaned = content.replace(/\$\w+|{\$\w+}/g, '');
      htmlStrings.push(cleaned);
    }
  }
  
  // Heredoc syntax (<<<EOF ... EOF)
  const heredocRegex = /<<<(\w+)\s*\n(.*?)\n\1\s*;/gs;
  while ((match = heredocRegex.exec(code)) !== null) {
    const content = match[2];
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      // Remove PHP variables
      const cleaned = content.replace(/\$\w+|{\$\w+}/g, '');
      htmlStrings.push(cleaned);
    }
  }
  
  // Nowdoc syntax (<<<'EOF' ... EOF)
  const nowdocRegex = /<<<'(\w+)'\s*\n(.*?)\n\1\s*;/gs;
  while ((match = nowdocRegex.exec(code)) !== null) {
    const content = match[2];
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      htmlStrings.push(content);
    }
  }
  
  // Extract from echo/print statements
  const echoRegex = /(?:echo|print)\s+['"](.*?)['"]/gs;
  while ((match = echoRegex.exec(code)) !== null) {
    const content = match[1];
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      htmlStrings.push(content);
    }
  }
  
  // Extract from echo/print with concatenation
  const echoConcatRegex = /(?:echo|print)\s+['"](.*?)['"]\s*\./gs;
  while ((match = echoConcatRegex.exec(code)) !== null) {
    const content = match[1];
    if (content.includes('<') && content.includes('>') && /<[a-zA-Z][\s>]/.test(content)) {
      htmlStrings.push(content);
    }
  }
  
  return htmlStrings;
}

export function analyzePHP(code: string, filename?: string): Issue[] {
  const issues: Issue[] = [];
  
  // Extract HTML from PHP code
  const htmlStrings = extractHtmlFromPHP(code);
  
  if (htmlStrings.length === 0) {
    // No HTML found - this might be pure PHP code
    issues.push({
      ruleId: 'no-html-found',
      message: 'No HTML content found in PHP code. This analyzer looks for HTML in strings, heredoc, or outside PHP tags.',
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

