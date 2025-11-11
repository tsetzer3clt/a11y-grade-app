# 🔍 Accessibility Code Grader

A web-based application that analyzes HTML and JSX/TSX code for accessibility issues and provides a detailed report with a grade. Users can paste their code and receive instant feedback on what they did right and what needs improvement.

## ✨ Features

- **Code Analysis**: Supports both HTML and JSX/TSX code
- **Grading System**: Get a letter grade (A-F) and score (0-100) based on accessibility issues
- **Detailed Reports**: See exactly what's wrong and what's right
- **Issue Categorization**: Errors and warnings are clearly separated
- **Web Interface**: Beautiful, responsive UI for easy code input
- **REST API**: Backend API for programmatic access

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone or download this repository**
   ```bash
   cd a11y-grade-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Start analyzing code!

## 📋 Usage

### Web Interface

1. Open the app in your browser (http://localhost:3000)
2. Select your code type (HTML or JSX/TSX)
3. Paste your code into the textarea
4. Click "Analyze Code"
5. Review your grade and detailed report

### API Usage

You can also use the API programmatically:

```bash
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "code": "<img src=\"photo.jpg\" />",
    "fileType": "html"
  }'
```

Response:
```json
{
  "success": true,
  "report": {
    "grade": "F",
    "score": 90,
    "totalIssues": 1,
    "errors": 1,
    "warnings": 0,
    "issues": [...],
    "goodPractices": [...],
    "needsWork": [...],
    "summary": "..."
  }
}
```

## 🎯 Accessibility Checks

The analyzer checks for:

- **img-alt**: Images must have descriptive alt text
- **anchor-href**: Links must have href attributes
- **button-type**: Buttons should have explicit type attributes
- **form-label**: Form inputs need associated labels
- **click-keyboard**: Interactive elements need keyboard handlers
- **heading-order**: Logical heading hierarchy (h1 → h2 → h3)
- **tabindex-positive**: Avoid positive tabIndex values

## 📁 Project Structure

```
a11y-grade-app/
├── src/
│   ├── analyzers/        # Code analyzers (JSX, HTML)
│   ├── report.ts         # Report generation and grading
│   └── server.ts         # Express API server
├── web/
│   └── public/           # Frontend files (HTML, CSS, JS)
├── .vscode/              # VS Code configuration
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
└── package.json
```

## 🛠️ Development

### VS Code Setup

The project includes VS Code configuration:

- **Settings**: Format on save, exclude node_modules
- **Extensions**: Recommended extensions for development
- **Launch**: Debug configuration for the API server
- **Tasks**: Build and dev server tasks

Open the project in VS Code and you'll be prompted to install recommended extensions.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server (after build)
- `npm run lint` - Run ESLint (if configured)

## 🌐 Deployment

### GitHub Pages

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Select "GitHub Actions" as the source

2. **Push to main branch**:
   - The workflow will automatically build and deploy
   - Your site will be available at `https://<username>.github.io/<repo-name>`

3. **Note**: GitHub Pages serves static files only. For the API to work, you'll need to:
   - Deploy the backend separately (e.g., Heroku, Railway, Render)
   - Update the API_URL in `web/public/app.js` to point to your backend

### Netlify

1. **Connect your repository** to Netlify
2. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `web/public`

3. **Deploy**: Netlify will automatically deploy on every push

4. **For API**: Deploy backend separately and update API_URL

### Alternative: Full-Stack Deployment

For a complete solution with both frontend and backend:

- **Frontend**: Deploy `web/public` to GitHub Pages, Netlify, or Vercel
- **Backend**: Deploy `src/server.ts` to:
  - [Railway](https://railway.app)
  - [Render](https://render.com)
  - [Heroku](https://heroku.com)
  - [Fly.io](https://fly.io)

Update `API_URL` in `web/public/app.js` to match your backend URL.

## 📝 Grading System

- **Score Calculation**:
  - Starts at 100 points
  - -10 points per error
  - -5 points per warning
  - Minimum score: 0

- **Grade Scale**:
  - A: 90-100
  - B: 80-89
  - C: 70-79
  - D: 60-69
  - F: 0-59

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

Built with:
- [Express](https://expressjs.com) - Web framework
- [@babel/parser](https://babeljs.io) - JavaScript/JSX parsing
- [node-html-parser](https://github.com/taoqf/node-html-parser) - HTML parsing

---

**Happy coding! Make the web more accessible! 🌐♿**

