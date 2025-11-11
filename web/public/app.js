const API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000' 
  : window.location.origin;

const codeInput = document.getElementById('codeInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const reportSection = document.getElementById('reportSection');
const loadingSection = document.getElementById('loadingSection');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const resetBtn = document.getElementById('resetBtn');

const gradeCircle = document.getElementById('gradeCircle');
const gradeLetter = document.getElementById('gradeLetter');
const gradeTitle = document.getElementById('gradeTitle');
const gradeScore = document.getElementById('gradeScore');
const gradeSummary = document.getElementById('gradeSummary');

const totalIssuesEl = document.getElementById('totalIssues');
const errorCountEl = document.getElementById('errorCount');
const warningCountEl = document.getElementById('warningCount');

const needsWorkList = document.getElementById('needsWorkList');
const goodPracticesList = document.getElementById('goodPracticesList');
const issuesList = document.getElementById('issuesList');

function showSection(section) {
  reportSection.classList.add('hidden');
  loadingSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  
  if (section === 'report') reportSection.classList.remove('hidden');
  else if (section === 'loading') loadingSection.classList.remove('hidden');
  else if (section === 'error') errorSection.classList.remove('hidden');
}

function getGradeClass(grade) {
  return `grade-${grade.toLowerCase()}`;
}

function displayReport(report) {
  // Grade display
  gradeLetter.textContent = report.grade;
  gradeTitle.textContent = `Grade: ${report.grade}`;
  gradeScore.textContent = `Score: ${report.score}/100`;
  gradeSummary.textContent = report.summary;
  
  gradeCircle.className = `grade-circle ${getGradeClass(report.grade)}`;

  // Stats
  totalIssuesEl.textContent = report.totalIssues;
  errorCountEl.textContent = report.errors;
  warningCountEl.textContent = report.warnings;

  // Needs work
  needsWorkList.innerHTML = '';
  if (report.needsWork.length === 0) {
    needsWorkList.innerHTML = '<li>No issues found! Great job! 🎉</li>';
  } else {
    report.needsWork.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      needsWorkList.appendChild(li);
    });
  }

  // Good practices
  goodPracticesList.innerHTML = '';
  if (report.goodPractices.length === 0) {
    goodPracticesList.innerHTML = '<li>No practices passed. All areas need improvement.</li>';
  } else {
    report.goodPractices.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      goodPracticesList.appendChild(li);
    });
  }

  // Detailed issues
  issuesList.innerHTML = '';
  if (report.issues.length === 0) {
    issuesList.innerHTML = '<p>No issues found!</p>';
  } else {
    report.issues.forEach(issue => {
      const div = document.createElement('div');
      div.className = `issue-item ${issue.severity}`;
      
      div.innerHTML = `
        <div class="issue-item-header">
          <span class="issue-rule-id">${issue.ruleId}</span>
          <span class="issue-severity ${issue.severity}">${issue.severity}</span>
          ${issue.loc ? `<span style="color: var(--text-light); font-size: 0.9rem;">Line ${issue.loc.line}:${issue.loc.column}</span>` : ''}
        </div>
        <div class="issue-message">${issue.message}</div>
      `;
      
      issuesList.appendChild(div);
    });
  }

  showSection('report');
}

async function analyzeCode() {
  const code = codeInput.value.trim();
  const fileType = document.querySelector('input[name="fileType"]:checked').value;

  if (!code) {
    errorMessage.textContent = 'Please enter some code to analyze.';
    showSection('error');
    return;
  }

  showSection('loading');

  try {
    const response = await fetch(`${API_URL}/api/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, fileType }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to analyze code');
    }

    displayReport(data.report);
  } catch (error) {
    console.error('Error:', error);
    errorMessage.textContent = error.message || 'An error occurred while analyzing your code.';
    showSection('error');
  }
}

function reset() {
  codeInput.value = '';
  showSection('report');
  codeInput.focus();
}

analyzeBtn.addEventListener('click', analyzeCode);
resetBtn.addEventListener('click', reset);

// Allow Enter + Ctrl/Cmd to submit
codeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    analyzeCode();
  }
});

