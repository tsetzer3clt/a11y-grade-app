import { parse } from 'node-html-parser';
import type { Issue } from './jsx.js';

function getAttr(node: any, name: string): string | null {
  if (!node || !node.getAttribute) return null;
  return node.getAttribute(name);
}

export function analyzeHtml(code: string, filename?: string): Issue[] {
  const root = parse(code, { comment: true, blockTextElements: { script: true, style: true } });
  const issues: Issue[] = [];

  function walk(node: any, state: { lastHeadingLevel?: number }) {
    if (!node || !node.tagName) return;
    const tag = node.tagName.toLowerCase();

    // img-alt check
    if (tag === 'img') {
      const role = getAttr(node, 'role') || '';
      const ariaHidden = getAttr(node, 'aria-hidden') || '';
      const alt = getAttr(node, 'alt');
      if (!(role === 'presentation' || ariaHidden === 'true')) {
        if (alt == null || String(alt).trim() === '') {
          issues.push({
            ruleId: 'img-alt',
            message: '<img> elements must have non-empty alt text.',
            severity: 'error',
          });
        }
      }
    }

    // anchor-href check
    if (tag === 'a') {
      const href = getAttr(node, 'href');
      if (!href) {
        issues.push({
          ruleId: 'anchor-href',
          message: '<a> elements must have an href attribute.',
          severity: 'error',
        });
      }
    }

    // button-type check
    if (tag === 'button') {
      const type = getAttr(node, 'type');
      if (!type) {
        issues.push({
          ruleId: 'button-type',
          message: '<button> should have an explicit type attribute (button, submit, or reset).',
          severity: 'warning',
        });
      }
    }

    // form-label check
    if (['input', 'select', 'textarea'].includes(tag)) {
      const hasAria = getAttr(node, 'aria-label') || getAttr(node, 'aria-labelledby');
      let hasLabel = false;
      let p = node.parentNode;
      while (p) {
        if (p.tagName && p.tagName.toLowerCase() === 'label') {
          hasLabel = true;
          break;
        }
        p = p.parentNode;
      }
      if (!hasAria && !hasLabel) {
        issues.push({
          ruleId: 'form-label',
          message: `<${tag}> should have an associated label (wrap in <label>, or use aria-label/aria-labelledby).`,
          severity: 'error',
        });
      }
    }

    // heading-order check
    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag[1]);
      const last = state.lastHeadingLevel ?? level;
      if (level > last + 1) {
        issues.push({
          ruleId: 'heading-order',
          message: `Heading level skips from h${last} to h${level}. Maintain logical heading hierarchy.`,
          severity: 'warning',
        });
      }
      state.lastHeadingLevel = level;
    }

    // tabindex-positive check
    const tabIndex = getAttr(node, 'tabindex');
    if (tabIndex && /^\d+$/.test(String(tabIndex)) && Number(tabIndex) > 0) {
      issues.push({
        ruleId: 'tabindex-positive',
        message: 'Avoid positive tabIndex; it creates confusing tab order. Use tabIndex="0" or "-1" if needed.',
        severity: 'warning',
      });
    }

    // Recursively check children
    for (const child of node.childNodes || []) {
      walk(child, state);
    }
  }

  for (const child of root.childNodes || []) {
    walk(child, {});
  }

  return issues;
}

