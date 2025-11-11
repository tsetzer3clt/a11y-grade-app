# 📤 How to Update Changes in GitHub

Quick guide to commit and push your changes to GitHub.

## Step-by-Step Instructions

### 1. Add All Changes

Add all modified and new files to staging:

```bash
git add .
```

Or add specific files:
```bash
git add src/analyzers/
git add src/server.ts
git add src/report.ts
git add web/public/
git add README.md
git add *.md
```

### 2. Commit Your Changes

Create a commit with a descriptive message:

```bash
git commit -m "Add Python, JavaScript, and PHP code analysis support"
```

Or with more detail:
```bash
git commit -m "Add multi-language support

- Add Python analyzer for HTML in strings
- Add JavaScript analyzer for HTML in template literals
- Add PHP analyzer for HTML in strings and templates
- Fix TypeScript build errors
- Update UI with new language options
- Add documentation and examples"
```

### 3. Push to GitHub

Push your changes to the remote repository:

```bash
git push
```

If this is your first push or branch name differs:
```bash
git push -u origin main
```

## Complete Command Sequence

Run these commands in order:

```bash
# 1. Add all changes
git add .

# 2. Commit with message
git commit -m "Add Python, JavaScript, and PHP code analysis support"

# 3. Push to GitHub
git push
```

## Verify Your Push

After pushing, you can verify:

1. **Check GitHub**: Go to your repository on GitHub
2. **Check Actions**: If you have GitHub Pages enabled, check the Actions tab for deployment
3. **Check Commits**: View the latest commit in the repository

## Troubleshooting

### "Nothing to commit"

If you see "nothing to commit", all changes are already committed. Just push:
```bash
git push
```

### "Your branch is ahead of 'origin/main'"

This means you have local commits that haven't been pushed yet. Just push:
```bash
git push
```

### Authentication Error

If you get an authentication error:
- Use a Personal Access Token instead of password
- Or set up SSH keys
- Or use GitHub CLI: `gh auth login`

### Merge Conflicts

If you get merge conflicts:
```bash
# Pull latest changes first
git pull

# Resolve conflicts, then:
git add .
git commit -m "Resolve merge conflicts"
git push
```

## What Gets Pushed

This push will include:
- ✅ New analyzers (Python, JavaScript, PHP)
- ✅ Updated server code
- ✅ Updated UI with new language options
- ✅ Fixed TypeScript errors
- ✅ Updated documentation
- ✅ New example files

## After Pushing

1. **GitHub Pages**: If enabled, will automatically redeploy (check Actions tab)
2. **CI/CD**: Any workflows will run automatically
3. **Collaborators**: Others can pull your changes with `git pull`

---

**Quick Reference:**
```bash
git add .                    # Stage all changes
git commit -m "Your message" # Commit changes
git push                     # Push to GitHub
```

