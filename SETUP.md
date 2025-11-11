# Setup Instructions

## Step-by-Step Guide

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express (web server)
- Babel parser (for JSX/TSX)
- HTML parser
- TypeScript compiler
- Development tools

### 2. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 3. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Open in Browser

Navigate to `http://localhost:3000` and start using the app!

## VS Code Setup

1. **Open the project in VS Code**:
   ```bash
   code .
   ```

2. **Install recommended extensions**:
   - VS Code will prompt you to install recommended extensions
   - Or manually install: Prettier, ESLint, TypeScript

3. **Use the debugger**:
   - Press `F5` or go to Run → Start Debugging
   - Select "Debug API Server" configuration
   - The server will start with debugging enabled

## GitHub Setup

### Initial Repository Setup

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Don't initialize with README (we already have one)

3. **Connect and Push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/a11y-grade-app.git
   git branch -M main
   git push -u origin main
   ```

### Enable GitHub Pages

1. **Go to Repository Settings**:
   - Navigate to Settings → Pages

2. **Configure Source**:
   - Source: "GitHub Actions"
   - The workflow will automatically deploy on push to main

3. **Wait for Deployment**:
   - After pushing, check Actions tab
   - Once workflow completes, your site will be live at:
     `https://YOUR_USERNAME.github.io/a11y-grade-app`

## Netlify Setup

### Option 1: GitHub Integration (Recommended)

1. **Sign up/Login to Netlify**
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to GitHub** and select your repository
4. **Build settings** (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `web/public`
5. **Deploy site**

### Option 2: Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**:
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Testing the App

### Test with Sample Code

Try pasting this code in the web interface:

**HTML Example**:
```html
<div>
  <img src="photo.jpg" />
  <button>Click me</button>
  <a>Link without href</a>
</div>
```

**JSX Example**:
```jsx
function Component() {
  return (
    <div>
      <img src="photo.jpg" />
      <button onClick={handleClick}>Click me</button>
      <a>Link without href</a>
    </div>
  );
}
```

You should see issues reported for:
- Missing alt text on image
- Missing button type
- Missing href on anchor

## Troubleshooting

### Port Already in Use

If port 3000 is taken, set a different port:
```bash
PORT=3001 npm run dev
```

### Build Errors

If TypeScript compilation fails:
1. Check Node.js version: `node --version` (should be 18+)
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Delete `dist` folder and rebuild: `rm -rf dist && npm run build`

### VS Code Not Recognizing TypeScript

1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type "TypeScript: Select TypeScript Version"
3. Choose "Use Workspace Version"

## Next Steps

- Customize the accessibility rules in `src/analyzers/`
- Adjust the grading system in `src/report.ts`
- Style the UI in `web/public/styles.css`
- Add more features to the web interface

Happy coding! 🚀

