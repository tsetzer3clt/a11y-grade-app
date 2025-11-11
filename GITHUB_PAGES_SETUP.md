# 📄 GitHub Pages Setup Guide

Complete step-by-step instructions to deploy your Accessibility Code Grader to GitHub Pages.

## Prerequisites

- A GitHub account
- Your code pushed to a GitHub repository
- Node.js 18+ installed locally (for testing)

## Step 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Accessibility Code Grader"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/a11y-grade-app.git
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 2: Enable GitHub Pages

1. **Go to your repository on GitHub**
   - Navigate to: `https://github.com/YOUR_USERNAME/a11y-grade-app`

2. **Open Settings**
   - Click the **"Settings"** tab (top menu bar)

3. **Navigate to Pages**
   - In the left sidebar, scroll down and click **"Pages"**

4. **Configure Source**
   - Under **"Source"**, select **"GitHub Actions"** (NOT "Deploy from a branch")
   - This tells GitHub to use the workflow we created (`.github/workflows/pages.yml`)

5. **Save**
   - The settings will save automatically

## Step 3: Trigger the Deployment

The workflow will automatically run when you push to the `main` branch. To trigger it now:

### Option A: Push a Change (Recommended)
```bash
# Make a small change (or just push if you haven't)
git add .
git commit -m "Trigger GitHub Pages deployment"
git push
```

### Option B: Manual Trigger
1. Go to the **"Actions"** tab in your repository
2. Click **"Deploy to GitHub Pages"** in the left sidebar
3. Click **"Run workflow"** button (top right)
4. Select branch: `main`
5. Click **"Run workflow"**

## Step 4: Monitor the Deployment

1. **Check the Actions Tab**
   - Go to **"Actions"** tab in your repository
   - You should see "Deploy to GitHub Pages" workflow running
   - Click on it to see progress

2. **Wait for Completion**
   - The workflow has two jobs: `build` and `deploy`
   - `build`: Installs dependencies, builds the project
   - `deploy`: Deploys to GitHub Pages
   - Usually takes 2-5 minutes

3. **Check for Errors**
   - If there are errors (red X), click on the failed job to see details
   - Common issues:
     - Build errors: Check that `npm run build` works locally
     - Permission errors: Make sure Pages is enabled in Settings

## Step 5: Access Your Site

Once deployment completes:

1. **Find Your URL**
   - Go back to **Settings → Pages**
   - Your site URL will be displayed at the top:
     ```
     https://YOUR_USERNAME.github.io/a11y-grade-app/
     ```

2. **Visit Your Site**
   - Click the URL or copy/paste it into your browser
   - It may take a few minutes for the site to be accessible after first deployment

## Step 6: Verify It Works

1. **Open your site** in a browser
2. **Test the interface**:
   - Paste some code
   - Click "Analyze Code"
   - Verify the report displays correctly

## Important Notes

### ⚠️ API Limitation

**The frontend will work, but the API won't work on GitHub Pages** because:
- GitHub Pages only serves static files (HTML, CSS, JS)
- The Express API server needs a backend hosting service

**Solutions:**

1. **Option 1: Deploy Backend Separately** (Recommended)
   - Deploy the API to: Railway, Render, Heroku, or Fly.io
   - Update `web/public/app.js` to point to your backend URL:
     ```javascript
     const API_URL = 'https://your-backend-url.com';
     ```

2. **Option 2: Use a Different Frontend Host**
   - Deploy frontend to Netlify or Vercel
   - They support serverless functions for the API

3. **Option 3: Static Mode** (Limited)
   - Modify the app to work without a backend (client-side only analysis)
   - This requires bundling the analyzers for the browser

### 🔄 Automatic Updates

- Every push to `main` will automatically trigger a new deployment
- The workflow runs automatically - no manual steps needed
- Your site will update within 2-5 minutes of pushing

### 🔒 Custom Domain (Optional)

If you want to use a custom domain:

1. In **Settings → Pages**, scroll to **"Custom domain"**
2. Enter your domain (e.g., `a11y.yourdomain.com`)
3. Follow DNS configuration instructions
4. GitHub will automatically set up HTTPS

## Troubleshooting

### Workflow Not Running

- **Check**: Is the workflow file in `.github/workflows/pages.yml`?
- **Check**: Did you push to `main` or `master` branch?
- **Fix**: Make sure the file exists and is committed

### Build Fails

- **Error**: "npm ci failed"
  - **Fix**: Make sure `package.json` and `package-lock.json` are committed
  - Run `npm install` locally and commit `package-lock.json`

- **Error**: "npm run build failed"
  - **Fix**: Test locally: `npm run build`
  - Fix any TypeScript errors before pushing

### Site Not Accessible

- **Wait**: First deployment can take 10-15 minutes
- **Check**: Actions tab - is deployment successful?
- **Check**: Settings → Pages - is it enabled?
- **Try**: Clear browser cache or use incognito mode

### 404 Error on Site

- **Check**: The workflow uploads `web/public` folder
- **Verify**: `web/public/index.html` exists
- **Fix**: Make sure the build process doesn't delete this folder

## Quick Reference

```bash
# Push changes (triggers auto-deployment)
git add .
git commit -m "Update code"
git push

# Check deployment status
# → Go to: https://github.com/YOUR_USERNAME/a11y-grade-app/actions

# View your site
# → Go to: https://YOUR_USERNAME.github.io/a11y-grade-app/
```

## Next Steps

After GitHub Pages is set up:

1. ✅ Test your site thoroughly
2. 🔧 Deploy the backend API (Railway, Render, etc.)
3. 🔗 Update API_URL in `web/public/app.js`
4. 📝 Share your site URL with others!

---

**Need help?** Check the [README.md](./README.md) or [SETUP.md](./SETUP.md) for more details.

