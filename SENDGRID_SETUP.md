# SendGrid Setup Guide

## Why SendGrid?
Render's free tier blocks SMTP ports (25, 465, 587) to prevent spam. SendGrid uses HTTP API instead, which works perfectly on Render.

## Setup Steps:

### 1. Create SendGrid Account
1. Go to https://sendgrid.com/
2. Sign up for FREE account (100 emails/day)
3. Verify your email

### 2. Create API Key
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: `Portfolio Booking`
4. Permissions: `Full Access` or `Mail Send`
5. Copy the API key (you'll only see it once!)

### 3. Verify Sender Identity
1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Fill in:
   - From Name: `Lakshita Gupta`
   - From Email: `lakshitagupta9@gmail.com`
   - Reply To: `lakshitagupta9@gmail.com`
4. Check your email and verify

### 4. Update Environment Variables

**Local (.env):**
```
SENDGRID_API_KEY=SG.your_api_key_here
```

**Render Dashboard:**
1. Go to your service → Environment
2. Add: `SENDGRID_API_KEY` = `SG.your_api_key_here`
3. Save changes (will auto-redeploy)

### 5. Test
```bash
# Restart server
npm run dev

# Test endpoint
curl -X POST http://localhost:5000/api/auth/test-email
```

## Benefits:
✅ Works on Render free tier
✅ No SMTP port blocking
✅ 100 free emails/day
✅ Better deliverability
✅ Email analytics dashboard

## Troubleshooting:
- **"Sender not verified"**: Complete step 3 above
- **"Invalid API key"**: Check the key in .env matches SendGrid
- **Still failing**: Check SendGrid dashboard for error details
