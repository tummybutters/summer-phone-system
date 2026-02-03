# What's Next - Deployment Checklist

## 🎯 Current Status: 80% Complete

Your phone system is **functionally complete** but needs deployment configuration.

## ✅ What's Already Done

1. **Twilio SMS Plugin** - Fully built with:
   - Outbound SMS/MMS sending
   - Inbound webhook handling
   - Media attachments
   - Contact allowlists
   - Signature validation

2. **Voice Call Plugin** - Configured with:
   - Outbound call initiation
   - Streaming support
   - OpenAI TTS integration

3. **Webapp Structure** - Created pages for:
   - Dashboard/home
   - Conversations list
   - Contacts management
   - Call history
   - API routes for all data

4. **Supabase Schema** - Database migrations for:
   - Contacts table
   - Conversations table
   - Messages table
   - Calls table
   - Row Level Security policies
   - Automatic triggers

## 📝 Next Steps (In Order)

### Step 1: Set Up Supabase (30 minutes)

```bash
# Navigate to backend directory
cd /Users/tommybutcher/clawd/phone-system-backend

# Create Supabase project
go to https://app.supabase.com
- Click "New Project"
- Name: summer-phone-system
- Database password: Generate a strong one
- Region: US East (or closest to you)
- Click "Create"

# Wait for project creation (1-2 minutes)

# Get connection details
# Project Settings → API
# Copy:
# - Project URL (NEXT_PUBLIC_SUPABASE_URL)
# - Anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
# - Service role key (SUPABASE_SERVICE_ROLE_KEY)
```

### Step 2: Configure Environment (5 minutes)

Edit `/Users/tommybutcher/clawd/phone-system-backend/.env.local`:

```bash
# Supabase (from Step 1)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Twilio (already in your openclaw.json)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# OpenClaw Gateway (from your openclaw.json)
OPENCLAW_GATEWAY_URL=http://localhost:18789  # Change for production
OPENCLAW_GATEWAY_TOKEN=06273a2e0ilhVT4Bz8t

# OpenAI (for voice conversations)
OPENAI_API_KEY=sk-proj-...
```

### Step 3: Deploy Database Schema (5 minutes)

```bash
cd /Users/tommybutcher/clawd/phone-system-backend

# Install Supabase CLI if you haven't
npm install -g supabase

# Deploy schema
npx supabase db push --db-url "$NEXT_PUBLIC_SUPABASE_URL"

# Or use our script:
./deploy.sh db
```

### Step 4: Test Locally (10 minutes)

```bash
# Install dependencies
cd /Users/tommybutcher/clawd/phone-system-backend
npm install

# Run development server
npm run dev

# Open http://localhost:3000
# You should see the dashboard
# Test API endpoints:
curl http://localhost:3000/api/contacts
```

### Step 5: Deploy Webapp to Vercel (15 minutes)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
./deploy.sh vercel
# OR
vercel --prod

# Follow prompts:
# - Set up project: Yes
# - Link to directory: ./
# - Build settings: Default (Next.js)
# - Environment variables: Answer 'Yes' and enter them

# Once deployed, Vercel gives you a URL:
# https://summer-phone-xxxx.vercel.app
```

### Step 6: Configure Twilio Webhooks (10 minutes)

1. Go to **Twilio Console**: https://console.twilio.com/
2. Navigate to: **Phone Numbers → Manage → Active Numbers**
3. Click on: **+18449023577**
4. Scroll to: **Messaging Configuration**
5. Set:
   - **Webhook URL**: `https://your-vercel-url/api/webhooks/twilio/sms`
   - **HTTP method**: `POST`
   - **Webhook signature validation**: ✅ Enabled
6. Click **Save**

7. Also configure voice webhook:
   - **Voice & Fax → Webhook**: `https://your-vercel-url/api/webhooks/twilio/voice`
   - **HTTP method**: `POST`

### Step 7: Update OpenClaw Webhook URL (5 minutes)

Edit your OpenClaw config to point to your deployed webhook:

```bash
# Edit the webhook handler in:
# ~/.openclaw/extensions/twilio-sms/src/webhook.ts

# Or configure via environment:
export TWILIO_WEBHOOK_URL="https://your-vercel-url/api/webhooks/twilio/sms"
```

### Step 8: Test End-to-End (5 minutes)

1. **Send a text** to +18449023577 from your phone
2. **Check dashboard**: https://your-vercel-url/conversations
   - Message should appear
   - AI should respond if enabled
3. **Test contact creation**: Reply from a new number
4. **Test voice**: Call +18449023577

### Step 9: Add Authentication (Optional, 30 minutes)

For production, add authentication to your webapp:

```bash
# Install NextAuth.js
npm install next-auth @supabase/auth-helpers-nextjs

# Configure: app/api/auth/[...nextauth]/route.ts
# Add login page
```

### Step 10: Monitor & Optimize

```bash
# Check logs
vercel logs summer-phone-xxxx.vercel.app --prod

# Check Twilio logs
# Twilio Console → Monitor → Logs

# Check Supabase usage
# Supabase Dashboard → Database → Statistics
```

## 🎯 Quick Start: Automated Deployment

If you want to run everything in one go:

```bash
cd /Users/tommybutcher/clawd/phone-system-backend
./deploy.sh full

# Or step by step:
./deploy.sh menu
```

## 🔧 Manual Steps Summary

1. Create Supabase project
2. Copy `.env.example` to `.env.local`
3. Fill in all environment variables
4. Run `./deploy.sh full`
5. Configure Twilio webhooks manually
6. Test with a real SMS/call

## 📞 Need Help?

**Current System Status**:
```bash
openclaw status
```

**Test SMS Flow**:
```bash
# From your phone, text: +18449023577
# Check if AI responds
# Check if message appears in dashboard
```

**Test Voice Flow**:
```bash
# Call: +18449023577
# AI should answer and converse
# Check dashboard for call recording
```

**Debug Logs**:
```bash
# OpenClaw logs
openclaw logs --follow

# Vercel logs (after deployment)
vercel logs --prod
```

## ⚠️ Security Reminders

- **Rotate credentials** before production use
- **Use API Keys** instead of auth tokens in production
- **Enable 2FA** on Supabase and Twilio accounts
- **Restrict allowlists** to known contacts only
- **Add authentication** to webapp for production

---

**Estimated Total Deployment Time**: 90 minutes
**Complexity**: Medium
**Status**: Ready to deploy when you are! 🚀