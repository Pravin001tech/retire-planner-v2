# 🚀 Deployment Guide

This guide covers deploying Retire Planner to Vercel from GitHub.

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account
- ✅ Vercel account (can sign up with GitHub)
- ✅ Project code pushed to GitHub repository
- ✅ No build errors (`npm run build` succeeds)

## 🌐 Deploying to Vercel

### Method 1: Automatic Deployment from GitHub (Recommended)

This method sets up continuous deployment - any push to your main branch automatically deploys.

#### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Retire Planner application"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/your-username/retire-planner.git

# Push to GitHub
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. Import your `retire-planner` repository from GitHub
5. Vercel will auto-detect Vite configuration

#### Step 3: Configure Project

Vercel will show pre-filled settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

These should all be correct. Click **"Deploy"**.

#### Step 4: Wait for Deployment

Vercel will:
1. Install dependencies
2. Build the project
3. Deploy to their CDN

This takes 1-2 minutes. You'll see a live URL when complete!

#### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS according to Vercel instructions

### Method 2: Manual Deployment with Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# Build the project first
npm run build

# Deploy to Vercel
vercel --prod
```

### Method 3: Import from Template

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Vite and configures everything
4. Click Deploy

## 🔧 Vercel Configuration

The project includes `vercel.json` for automatic configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

## 📊 Environment Variables

This project doesn't require environment variables. All calculations are done client-side.

If you add features requiring environment variables (like analytics):

1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy

## 🔄 Continuous Deployment

Once set up, Vercel automatically deploys:

- **On push** to main branch
- **On pull requests** (creates preview URLs)
- **On manual deployment**

### Preview Deployments

Every pull request gets a unique preview URL for testing before merging.

## 🌍 Preview vs Production

| Environment | URL Pattern | Purpose |
|-------------|-------------|---------|
| Production | `your-project.vercel.app` | Live site |
| Preview | `pr-*.your-project.vercel.app` | PR testing |
| Branch | `branch.your-project.vercel.app` | Branch testing |

## ⚡ Performance Optimization

Vercel automatically:
- Minifies JavaScript/CSS
- Optimizes images
- Uses CDN for global distribution
- Implements caching
- Enables gzip compression

## 📈 Analytics

To add analytics:

### Vercel Analytics

1. Go to Project Settings → Analytics
2. Install Vercel Analytics package
3. Wrap your app:

```bash
npm install @vercel/analytics
```

```jsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Google Analytics

Add your GA tracking ID in `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🐛 Troubleshooting

### Build Fails

```bash
# Test locally first
npm run build

# Check for errors
npm run lint
```

### Deployed Site Shows Blank Page

1. Check browser console for errors
2. Ensure `index.html` path is correct
3. Verify all assets are built correctly
4. Check Vercel deployment logs

### Routes Not Working

Check `vercel.json` has correct rewrites:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 404 Errors

Ensure `vite.config.js` has correct base path:

```javascript
export default defineConfig({
  base: '/',
  // ... other config
});
```

## 🔄 Rollback Deployment

If something goes wrong:

1. Go to Vercel dashboard
2. Click on "Deployments"
3. Find previous successful deployment
4. Click "Promote to Production"

## 📱 Testing Deployment

After deployment:

1. ✅ Check homepage loads
2. ✅ Test all sliders work
3. ✅ Verify graph displays correctly
4. ✅ Test on mobile devices
5. ✅ Test in different browsers
6. ✅ Check console for errors

## 🎯 Best Practices

1. **Always test locally first** - Run `npm run build` and `npm run preview`
2. **Use PR previews** - Test changes before merging
3. **Monitor deployments** - Watch for errors in Vercel dashboard
4. **Set up status page** - Show site status to users
5. **Backup regularly** - Keep code backed up on GitHub

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/build.html)
- [React Deployment](https://react.dev/learn/deploying-react)

## 🆘 Support

If you encounter issues:

1. Check [Vercel Status](https://www.vercel-status.com/)
2. Review Vercel deployment logs
3. Search [Vercel GitHub Issues](https://github.com/vercel/vercel/issues)
4. Open an issue in this repository

---

**Congratulations!** Your Retire Planner is now live! 🎉
