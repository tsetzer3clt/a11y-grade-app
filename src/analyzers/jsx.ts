import parser from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;

export interface Issue {
  ruleId: string;
  message: string;
  severity: 'error' | 'warning';
  node?: any;
  loc?: { line: number; column: number };
}

export function parseJSX(code: string, opts: { filename?: string } = {}) {
  return parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'classProperties',
      'objectRestSpread',
      ['decorators', { decoratorsBeforeExport: true }],
    ],
    ...opts,
  }) as any;
}

function getName(node: any): string | null {
  if (!node) return null;
  if (node.type === 'JSXIdentifier') return node.name;
  if (node.type === 'JSXMemberExpression') return getName(node.property);
  return null;
}

function getAttr(attrs: any[], name: string) {
  for (const a of attrs) {
    if (a.type !== 'JSXAttribute') continue;
    if (getName(a.name) === name) return a;
  }
  return null;
}

function getAttrValueLiteral(attr: any): string | null {
  if (!attr) return null;
  if (!attr.value) return '';
  if (attr.value.type === 'StringLiteral') return attr.value.value;
  if (attr.value.type === 'JSXExpressionContainer') {
    const expr = attr.value.expression;
    if (expr.type === 'StringLiteral' || expr.type === 'TemplateLiteral') {
      if (expr.type === 'StringLiteral') return expr.value;
      if (expr.quasis && expr.quasis.length === 1)
        return expr.quasis[0].value.cooked || '';
    }
  }
  return null;
}

function isInteractive(tagName: string): boolean {
  return ['a', 'button', 'input', 'select', 'textarea', 'summary', 'option'].includes(tagName);
}

function hasKeyboardHandler(attrs: any[]): boolean {
  return ['onKeyDown', 'onKeyUp', 'onKeyPress', 'onKeyDownCapture', 'onKeyUpCapture'].some(
    (k) => !!getAttr(attrs, k)
  );
}

function locationFromNode(node: any): { line: number; column: number } | null {
  if (!node || !node.loc) return null;
  return { line: node.loc.start.line, column: node.loc.start.column + 1 };
}

export function analyzeJSX(code: string, filename?: string): Issue[] {
  const issues: Issue[] = [];
  const headingLevels: number[] = [];

  try {
    const ast = parseJSX(code, { filename });

    traverse(ast, {
      JSXElement(path: any) {
        const { openingElement } = path.node;
        const name = getName(openingElement.name);
        if (!name) return;
        const lower = name.toLowerCase();
        const attrs = openingElement.attributes || [];

        // img-alt check
        if (lower === 'img') {
          const alt = getAttr(attrs, 'alt');
          const role = getAttrValueLiteral(getAttr(attrs, 'role')) || '';
          const ariaHidden = getAttrValueLiteral(getAttr(attrs, 'aria-hidden')) || '';
          const altVal = getAttrValueLiteral(alt);
          if (!(role === 'presentation' || ariaHidden === 'true')) {
            if (altVal == null || altVal.trim() === '') {
              issues.push({
                ruleId: 'img-alt',
                message: '<img> elements must have non-empty alt text.',
                severity: 'error',
                node: openingElement,
                loc: locationFromNode(openingElement),
              });
            }
          }
        }

        // anchor-href check
        if (lower === 'a') {
          const href = getAttr(attrs, 'href');
          if (!href) {
            issues.push({
              ruleId: 'anchor-href',
              message: '<a> elements must have an href attribute.',
              severity: 'error',
              node: openingElement,
              loc: locationFromNode(openingElement),
            });
          }
        }

        // button-type check
        if (lower === 'button') {
          const typeAttr = getAttr(attrs, 'type');
          const typeVal = getAttrValueLiteral(typeAttr);
          if (!typeAttr || !typeVal) {
            issues.push({
              ruleId: 'button-type',
              message: '<button> should have an explicit type attribute (button, submit, or reset).',
              severity: 'warning',
              node: openingElement,
              loc: locationFromNode(openingElement),
            });
          }
        }

        // form-label check
        if (['input', 'select', 'textarea'].includes(lower)) {
          const hasAriaLabel = getAttr(attrs, 'aria-label') || getAttr(attrs, 'aria-labelledby');
          let wrappedInLabel = false;
          let p = path.parentPath;
          while (p && p.node) {
            if (p.node.type === 'JSXElement') {
              const pn = getName(p.node.openingElement.name);
              if (pn && pn.toLowerCase() === 'label') {
                wrappedInLabel = true;
                break;
              }
            }
            p = p.parentPath;
          }
          if (!hasAriaLabel && !wrappedInLabel) {
            issues.push({
              ruleId: 'form-label',
              message: `${name} should have an associated label (wrap in <label>, or use aria-label/aria-labelledby).`,
              severity: 'error',
              node: openingElement,
              loc: locationFromNode(openingElement),
            });
          }
        }

        // click-keyboard check
        if (getAttr(attrs, 'onClick') && !isInteractive(lower)) {
          const role = getAttrValueLiteral(getAttr(attrs, 'role')) || '';
          if (!hasKeyboardHandler(attrs) || !role) {
            issues.push({
              ruleId: 'click-keyboard',
              message: `Non-interactive <${name}> with onClick should have keyboard handlers and an appropriate role.`,
              severity: 'error',
              node: openingElement,
              loc: locationFromNode(openingElement),
            });
          }
        }

        // heading-order check
        if (/^h[1-6]$/.test(lower)) {
          const level = Number(lower[1]);
          headingLevels.push(level);
          const last = headingLevels.length > 1 ? headingLevels[headingLevels.length - 2] : level;
          if (level > last + 1) {
            issues.push({
              ruleId: 'heading-order',
              message: `Heading level skips from h${last} to h${level}. Maintain logical heading hierarchy.`,
              severity: 'warning',
              node: openingElement,
              loc: locationFromNode(openingElement),
            });
          }
        }

        // tabindex-positive check
        const tabIndexAttr = getAttr(attrs, 'tabIndex') || getAttr(attrs, 'tabindex');
        const tabIndexVal = getAttrValueLiteral(tabIndexAttr);
        if (tabIndexVal && /^\d+$/.test(tabIndexVal) && Number(tabIndexVal) > 0) {
          issues.push({
            ruleId: 'tabindex-positive',
            message: 'Avoid positive tabIndex; it creates confusing tab order. Use tabIndex={0} or -1 if needed.',
            severity: 'warning',
            node: openingElement,
            loc: locationFromNode(openingElement),
          });
        }
      },
    });
  } catch (err: any) {
    issues.push({
      ruleId: 'parse-error',
      message: `Failed to parse as JSX/TSX: ${err.message?.split('\n')[0] || 'Unknown error'}`,
      severity: 'error',
      loc: null,
    });
  }

  return issues;
}

