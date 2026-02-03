# 🔒 CRITICAL SECURITY CONFIGURATION

## ⚠️ BEFORE YOU DEPLOY - READ THIS

Your phone system has **MAXIMUM SECURITY** enabled by default. This protects you from:
- Financial fraud/scams  
- Unauthorized usage
- Data breaches
- Reputational damage

---

## 🛡️ CURRENT PROTECTION LEVEL: MAXIMUM

### ✅ What's Allowed (Current Config)
- You (+19493951074) can message the AI
- AI will respond to your messages
- All messages logged to Supabase
- Webhook signature validation enabled
- Rate limiting active

### ❌ What's Blocked (Current Config)  
- Unknown numbers: **NO RESPONSE** (message logged only)
- More than 50 messages/day: **BLOCKED**
- More than $5/day spending: **BLOCKED**
- New contacts without approval: **BLOCKED**

---

## 🚨 FINANCIAL SAFEGUARDS

### Cost Per Message (Twilio)
- Outbound SMS: $0.0075 per message
- Inbound SMS: $0.0075 per message  
- Monthly phone: $1.00

### Your Caps (CANNOT BE EXCEEDED)
- **Daily: $5.00** (max ~333 messages)
- **Monthly: $50.00** (auto-shutdown if hit)
- **Per contact/hour: 10 messages**
- **Total outbound/day: 50 messages**

### Rate Limiting
```
Known contacts: 10 messages/hour max
Unknown contacts: 0 messages (blocked)
Total daily: 50 messages max
New contacts/day: 3 (requires manual approval)
```

---

## 📋 APPROVAL PROCESS FOR NEW CONTACTS

### If Someone New Texts Your Number:

**Current Behavior (MAX SECURITY):**
1. Message arrives from +1234567890
2. AI **does not respond** (blocked by allowlist)
3. Message logged to Supabase with "pending_review" status
4. You get alert: "New contact +1234567890 wants to message"
5. **You must manually approve** before AI responds

**To Approve a Contact:**
```bash
# Option 1: Add to permanent allowlist
openclaw config set channels.twilio-sms.allowFrom='["+19493951074", "+1234567890"]'

# Option 2: One-time approval (AI responds once)
openclaw message approve +1234567890
```

---

## 🚨 EMERGENCY SHUTDOWN COMMANDS

### Disable ALL Outbound (Immediately)
```bash
openclaw config set channels.twilio-sms.enabled=false
openclaw gateway restart
```

### View Current Spending
```bash
curl -u "your_twilio_account_sid_here:your_twilio_auth_token_here" \
  "https://api.twilio.com/2010-04-01/Accounts/your_twilio_account_sid_here/Balance.json"
```

### Check Message Logs
```bash
openclaw logs --follow | grep twilio-sms
```

---

## 💰 DAILY MONITORING

You'll receive a daily summary showing:
- Messages sent/received
- Total spending
- New contact requests
- Any flagged suspicious messages
- Recommendations for allowlist

**Twilio Console:** https://console.twilio.com/ → Usage → SMS

---

## 🚫 AI RESPONSE RESTRICTIONS

AI **CANNOT** and **WILL NOT**:
- ❌ Send money or financial info
- ❌ Share passwords or credentials  
- ❌ Click suspicious links
- ❌ Download files from messages
- ❌ Schedule meetings without approval
- ❌ Share personal data
- ❌ Make purchases

**If someone asks the AI for money:**
- Message is **FLAGGED** immediately
- You receive alert
- NO response sent without your approval
- Contact blacklisted until reviewed

---

## ✅ TO ADD A TRUSTED CONTACT

After testing and feeling comfortable:

1. **Add the number:**
```bash
# Replace +1234567890 with actual number
openclaw config set channels.twilio-sms.allowFrom='["+19493951074", "+1234567890"]'
openclaw gateway restart
```

2. **Verify it worked:**
```bash
openclaw status
```

3. **Test:** Have them text the number

---

## 🆘 IF YOU SEE SUSPICIOUS ACTIVITY

**Immediate response (within 1 minute):**
1. Run: `openclaw config set channels.twilio-sms.enabled=false`
2. Twilio console: Disable your_twilio_phone_number_here
3. Check Supabase for unauthorized messages

**Within 5 minutes:**
1. Rotate Twilio auth token
2. Review message logs
3. Change allowlist back to just your number

**Within 1 hour:**
1. Full audit of all communications
2. Document what happened
3. Contact Twilio support if needed

---

## 🔐 SECURITY CHECKLIST

- [ ] Supabase keys in environment only (not in code)
- [ ] Twilio credentials secured
- [ ] OpenClaw token protected
- [ ] Allowlist restricted to known numbers
- [ ] Rate limits configured
- [ ] Daily spending cap active
- [ ] Webhook signature validation enabled  
- [ ] Audit logging to Supabase working
- [ ] Emergency shutdown commands tested
- [ ] Monitoring alerts configured

---

## 📊 CURRENT ALLOWLIST

**Only these numbers work:**
- +19493951074 (Tommy - You)

**All others require approval.**

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

**Week 1:** Monitor all messages, verify spending stays at $0-1/day  
**Week 2:** Add 1-2 trusted contacts, increase limits gradually  
**Week 3+:** Based on usage patterns, adjust as needed

**DO NOT increase limits beyond:**
- 100 messages/day
- $10/day spend
- Without reviewing weekly

---

**Questions? Concerns?** Check logs, review spend, tighten allowlist. 
Better safe than scammed.
