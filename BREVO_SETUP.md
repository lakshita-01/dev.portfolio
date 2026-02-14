# Brevo (Sendinblue) Setup Guide

## Why Brevo?
✅ **300 free emails/day** (vs SendGrid's 100)
✅ Works on Render (HTTP API, no SMTP ports)
✅ Easy setup
✅ Better free tier

## Setup Steps:

### 1. Create Brevo Account
1. Go to https://www.brevo.com/
2. Sign up for FREE account
3. Verify your email

### 2. Get API Key
1. Go to Settings → SMTP & API
2. Click "Generate a new API key"
3. Name: `Portfolio Booking`
4. Copy the API key

### 3. Verify Sender Email
1. Go to Senders & IP
2. Add sender: `lakshitagupta9@gmail.com`
3. Verify via email confirmation link

### 4. Update Environment Variables

**Local (.env):**
```env
BREVO_API_KEY=xkeysib-your_api_key_here
```

**Render Dashboard:**
1. Go to your service → Environment
2. Add: `BREVO_API_KEY` = `xkeysib-your_api_key_here`
3. Save (auto-redeploys)

### 5. Test
```bash
# Restart server
npm run dev

# Test endpoint
curl -X POST http://localhost:5000/api/auth/test-email
```

## Benefits:
✅ 300 emails/day (FREE)
✅ No SMTP blocking
✅ Works on Render
✅ Email analytics
✅ SMS capability (bonus)

## Troubleshooting:
- **"Sender not verified"**: Complete step 3
- **"Invalid API key"**: Check .env file
- **Still failing**: Check Brevo dashboard logs
