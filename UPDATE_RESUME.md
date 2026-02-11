# Update Resume for AI Assistant

## Steps to Update:

### 1. Replace the Resume File
- Navigate to: `server/src/data/`
- Delete: `LAKSHITA_GUPTA_RESUME.pdf`
- Add your new resume with the SAME name: `LAKSHITA_GUPTA_RESUME.pdf`

### 2. Commit and Push
```bash
git add server/src/data/LAKSHITA_GUPTA_RESUME.pdf
git commit -m "Update resume"
git push origin main
```

### 3. Restart Server
The AI assistant will automatically load the new resume on next startup.

**For Render:**
- Render will auto-deploy when you push
- Or manually trigger a deploy from Render dashboard

**For Local:**
- Restart the server: `npm run dev`

## Alternative: Use Text File
If you prefer a text file instead of PDF:

1. Create: `server/src/data/resume.txt`
2. Paste your resume content as plain text
3. The system will automatically use it if PDF is not found

The AI assistant will use the new resume content immediately after restart!
