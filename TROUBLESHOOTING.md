# 🔧 Troubleshooting GitHub Pages Deployment

## Common Issues and Solutions

### ❌ Build Failed - TypeScript Errors

**Symptom**: GitHub Actions shows red X, build job fails with TypeScript errors

**Solution**: 
1. Test build locally first:
   ```bash
   npm run build
   ```
2. Fix any TypeScript errors that appear
3. Commit and push the fixes:
   ```bash
   git add .
   git commit -m "Fix TypeScript build errors"
   git push
   ```

**Common TypeScript Issues**:
- Missing type definitions: Add `@ts-ignore` comment or install types
- Type mismatches: Check return types match interface definitions
- Import errors: Verify all dependencies are in `package.json`

### ❌ Build Failed - Missing package-lock.json

**Symptom**: `npm ci` fails with "package-lock.json not found"

**Solution**:
```bash
npm install  # This creates package-lock.json
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### ❌ Deployment Failed - Permissions Error

**Symptom**: "Permission denied" or "pages: write" error

**Solution**:
1. Go to **Settings → Pages** in your repository
2. Make sure **"GitHub Actions"** is selected as source
3. Check that the workflow file exists: `.github/workflows/pages.yml`
4. Verify the workflow has correct permissions (should be in the file)

### ❌ Site Shows 404 or Not Found

**Symptom**: Site URL returns 404 error

**Possible Causes**:
1. **First deployment still processing**: Wait 10-15 minutes
2. **Wrong path**: Check that `web/public/index.html` exists
3. **Build didn't complete**: Check Actions tab for errors

**Solution**:
```bash
# Verify files exist locally
ls -la web/public/

# Should show: index.html, app.js, styles.css
```

### ❌ Workflow Not Running

**Symptom**: No workflow appears in Actions tab after push

**Solution**:
1. Check that `.github/workflows/pages.yml` exists and is committed
2. Verify you pushed to `main` or `master` branch
3. Check file is in correct location: `.github/workflows/` (not `.github/workflow/`)

### ❌ "npm ci" Fails

**Symptom**: Build step fails at `npm ci`

**Solution**:
- Make sure `package-lock.json` is committed
- If using npm, ensure you're using npm (not yarn)
- Try running locally: `npm ci` to verify it works

### ❌ TypeScript Compilation Errors

**Symptom**: `npm run build` fails with TS errors

**Solution**:
1. **Fix locally first**:
   ```bash
   npm run build
   ```
2. **Common fixes**:
   - Add `@ts-ignore` for missing types
   - Change `null` to `undefined` if interface expects undefined
   - Install missing type packages: `npm install --save-dev @types/package-name`
3. **Test again**:
   ```bash
   npm run build
   ```
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Fix TypeScript errors"
   git push
   ```

## How to Check What Went Wrong

### Step 1: Check Actions Tab
1. Go to your repository on GitHub
2. Click **"Actions"** tab
3. Click on the failed workflow run (red X)
4. Click on the failed job (usually "build" or "deploy")
5. Expand the failed step to see error message

### Step 2: Read the Error Message
- Look for keywords like:
  - "error TS..." = TypeScript error
  - "npm ci failed" = Dependency issue
  - "Permission denied" = GitHub Pages not enabled
  - "File not found" = Missing file

### Step 3: Test Locally
Reproduce the error locally:
```bash
# Test the build
npm ci
npm run build

# If build succeeds, check the workflow file
cat .github/workflows/pages.yml
```

### Step 4: Fix and Push
After fixing:
```bash
git add .
git commit -m "Fix: [describe the issue]"
git push
```

## Quick Diagnostic Commands

Run these locally to verify everything is ready:

```bash
# Check if build works
npm run build

# Check if files exist
ls -la web/public/

# Check if package-lock.json exists
test -f package-lock.json && echo "✓ package-lock.json exists" || echo "✗ MISSING"

# Check if workflow file exists
test -f .github/workflows/pages.yml && echo "✓ Workflow exists" || echo "✗ MISSING"

# Check TypeScript config
test -f tsconfig.json && echo "✓ tsconfig.json exists" || echo "✗ MISSING"
```

## Still Having Issues?

1. **Check the full error log** in GitHub Actions
2. **Compare with local build** - does `npm run build` work locally?
3. **Verify all files are committed** - especially `package-lock.json`
4. **Check GitHub Pages is enabled** in Settings → Pages
5. **Wait a few minutes** - first deployment can take 10-15 minutes

## Getting Help

If you're still stuck:
1. Copy the exact error message from Actions tab
2. Check if `npm run build` works locally
3. Verify all files from this project are committed
4. Share the error message for more specific help

