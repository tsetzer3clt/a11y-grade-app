import type { Issue } from './analyzers/jsx.js';

export interface Report {
  grade: string;
  score: number;
  totalIssues: number;
  errors: number;
  warnings: number;
  issues: Issue[];
  goodPractices: string[];
  needsWork: string[];
  summary: string;
}

const RULE_DESCRIPTIONS: Record<string, { name: string; fix: string }> = {
  'img-alt': {
    name: 'Image Alt Text',
    fix: 'Add descriptive alt text to all <img> elements. Use alt="" only for decorative images.',
  },
  'anchor-href': {
    name: 'Anchor Links',
    fix: 'All <a> elements must have an href attribute. Use href="#" or a proper URL.',
  },
  'button-type': {
    name: 'Button Type',
    fix: 'Add type="button", type="submit", or type="reset" to all <button> elements.',
  },
  'form-label': {
    name: 'Form Labels',
    fix: 'Wrap form inputs in <label> elements or use aria-label/aria-labelledby attributes.',
  },
  'click-keyboard': {
    name: 'Keyboard Accessibility',
    fix: 'Non-interactive elements with onClick need keyboard handlers (onKeyDown) and appropriate role attributes.',
  },
  'heading-order': {
    name: 'Heading Hierarchy',
    fix: 'Maintain logical heading order (h1 → h2 → h3, etc.). Do not skip levels.',
  },
  'tabindex-positive': {
    name: 'Tab Index',
    fix: 'Avoid positive tabIndex values. Use tabIndex="0" for focusable elements or tabIndex="-1" to remove from tab order.',
  },
};

export function generateReport(issues: Issue[]): Report {
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const totalIssues = issues.length;

  // Calculate score (100 points, -10 per error, -5 per warning)
  let score = 100;
  score -= errors * 10;
  score -= warnings * 5;
  score = Math.max(0, score);

  // Determine grade
  let grade: string;
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';

  // Group issues by rule
  const issuesByRule = new Map<string, Issue[]>();
  for (const issue of issues) {
    if (!issuesByRule.has(issue.ruleId)) {
      issuesByRule.set(issue.ruleId, []);
    }
    issuesByRule.get(issue.ruleId)!.push(issue);
  }

  // Determine what needs work
  const needsWork: string[] = [];
  for (const [ruleId, ruleIssues] of issuesByRule.entries()) {
    const desc = RULE_DESCRIPTIONS[ruleId];
    if (desc) {
      needsWork.push(`${desc.name}: ${desc.fix} (Found ${ruleIssues.length} issue${ruleIssues.length > 1 ? 's' : ''})`);
    }
  }

  // Determine good practices (rules that passed)
  const goodPractices: string[] = [];
  const allRuleIds = Object.keys(RULE_DESCRIPTIONS);
  for (const ruleId of allRuleIds) {
    if (!issuesByRule.has(ruleId)) {
      const desc = RULE_DESCRIPTIONS[ruleId];
      if (desc) {
        goodPractices.push(`${desc.name}: ✓ Correctly implemented`);
      }
    }
  }

  // Generate summary
  let summary = '';
  if (totalIssues === 0) {
    summary = 'Excellent! No accessibility issues found. Your code follows best practices.';
  } else if (errors === 0 && warnings > 0) {
    summary = `Good work! You have ${warnings} warning${warnings > 1 ? 's' : ''} to address, but no critical errors.`;
  } else if (errors > 0) {
    summary = `Found ${errors} critical error${errors > 1 ? 's' : ''} and ${warnings} warning${warnings > 1 ? 's' : ''}. Please address the errors first.`;
  }

  return {
    grade,
    score,
    totalIssues,
    errors,
    warnings,
    issues,
    goodPractices,
    needsWork,
    summary,
  };
}

