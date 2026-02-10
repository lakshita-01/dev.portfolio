# Deploy Frontend to Vercel

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel

**Option A: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com` (your Render backend URL)

6. Click "Deploy"

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: ai-portfolio-frontend
# - Directory: ./
# - Override settings? No

# Add environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend-url.onrender.com

# Deploy to production
vercel --prod
```

### 3. Update Backend CORS

After deployment, update your backend's CORS settings to allow your Vercel domain.

In `server/index.js`, update the `corsOptions`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-vercel-app.vercel.app'  // Add your Vercel URL
];
```

### 4. Test Your Deployment

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ API calls work (check browser console)
- ✅ Chat feature works
- ✅ Theme toggle works

## Important Notes

- **Backend First**: Deploy backend to Render first, then use that URL in Vercel
- **Environment Variables**: Must start with `VITE_` to be accessible in frontend
- **CORS**: Backend must allow your Vercel domain
- **API Calls**: Update any hardcoded API URLs to use `import.meta.env.VITE_API_URL`

## Troubleshooting

**API calls failing?**
- Check VITE_API_URL is set correctly in Vercel
- Verify backend CORS allows your Vercel domain
- Check browser console for errors

**Build failing?**
- Ensure all dependencies are in package.json
- Check build logs in Vercel dashboard
- Try building locally: `npm run build`

**404 on routes?**
- Vercel automatically handles SPA routing for Vite projects
- If issues persist, add `vercel.json` with rewrites
