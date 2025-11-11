import express from 'express';
import cors from 'cors';
import { analyzeJSX } from './analyzers/jsx.js';
import { analyzeHtml } from './analyzers/html.js';
import { generateReport } from './report.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('web/public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main audit endpoint
app.post('/api/audit', (req, res) => {
  try {
    const { code, fileType } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required and must be a string' });
    }

    let issues;
    if (fileType === 'html' || fileType === 'htm') {
      issues = analyzeHtml(code);
    } else {
      // Default to JSX/TSX
      issues = analyzeJSX(code);
    }

    const report = generateReport(issues);

    res.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Error analyzing code:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while analyzing the code',
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Open http://localhost:${PORT} in your browser to use the app`);
});

