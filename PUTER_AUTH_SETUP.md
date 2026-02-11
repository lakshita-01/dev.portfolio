# Puter.js Authentication Setup

## Add to your .env file:

```env
PUTER_USERNAME=your-puter-email@example.com
PUTER_PASSWORD=your-puter-password
```

## Steps:

1. **Add credentials to `.env`**:
   - Open `.env` file in the root directory
   - Add the two lines above with your actual Puter.com credentials

2. **For Render deployment**:
   - Go to Render Dashboard → Your Service → Environment
   - Add environment variables:
     - `PUTER_USERNAME` = your email
     - `PUTER_PASSWORD` = your password

3. **How it works**:
   - Puter authenticates silently in the background
   - No login popup or webpage shown to users
   - All console logs suppressed during authentication
   - Users can use AI assistant immediately

## Security Note:
- Never commit `.env` file to Git
- Credentials are only stored in environment variables
- Authentication happens server-side only
