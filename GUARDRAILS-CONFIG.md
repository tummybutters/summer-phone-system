# 🔒 PRODUCTION GUARDRAILS CONFIGURATION

## ⚠️ CRITICAL SECURITY SETTINGS

### Current Protection Level: MAXIMUM

**What this means:**
- ✅ Only Tommy (+19493951074) can message or be messaged
- ✅ AI will NOT respond to unknown numbers
- ✅ Daily spend cap: $5 (500 messages max)
- ✅ All messages logged for review
- ✅ Manual approval required for new contacts

---

## 🛡️ CURRENT CONFIGURATION

### Contact Allowlist (Emergency Mode)
```
ALLOWED_CONTACTS: ["+19493951074"]
```
**Only these numbers work.** Anyone else gets NO response.

### Rate Limits (Scam Protection)
```
Messages per hour per contact: 10
Total messages per day: 50
New contacts per day: 3 (requires approval)
Daily spend cap: $5 USD
```

### AI Safety Rules
```
❌ NO financial transactions
❌ NO password sharing
❌ NO meeting scheduling without confirmation
❌ NO clicking external links
❌ NO downloading files from messages
✅ Log all actions to Supabase
✅ Alert on suspicious messages
```

---

## 🚀 TO ADD A NEW CONTACT (Manual Approval Required)

### Option 1: For Trusted Contacts

1. **Add to allowlist:**
```bash
openclaw config set channels.twilio-sms.allowFrom='["+19493951074", "+1234567890"]'
```

2. **Restart gateway:**
```bash
openclaw gateway restart
```

### Option 2: One-Time Approval

When an unknown number texts:
1. You'll receive: "New contact +1234567890 wants to message"
2. Approve: `openclaw message approve +1234567890`
3. AI will respond once, then ask if you want to add to permanent allowlist

---

## 🚨 EMERGENCY COMMANDS

### Disable ALL Outbound (Immediate)
```bash
openclaw config set channels.twilio-sms.enabled=false
openclaw gateway restart
```

### Disable Specific Contact
```bash
# Remove from allowlist
openclaw config set channels.twilio-sms.allowFrom='["+19493951074"]'  
openclaw gateway restart
```

### Check Current Spending
```bash
curl -u "your_twilio_account_sid_here:your_twilio_auth_token_here" \
  "https://api.twilio.com/2010-04-01/Accounts/your_twilio_account_sid_here/Balance.json"
```

### View Message Logs
```bash
# Check recent messages
openclaw logs --follow | grep twilio-sms
```

---

## 💰 COST PROTECTION

### Current Twilio Costs (as of 2026-02-03):
- Outbound SMS: $0.0075 per message
- Inbound SMS: $0.0075 per message
- Phone number: $1.00/month
- Voice: $0.0085/minute

### Your Caps:
- Daily: $5.00 (approx 333 messages/day)
- Monthly: $50.00 (auto-disable if exceeded)

### To Check Spending Anytime:
1. Twilio Console: https://console.twilio.com/ → Billing
2. Or use this command:
```bash
curl -u "your_twilio_account_sid_here:your_twilio_auth_token_here" \
  "https://api.twilio.com/2010-04-01/Accounts/your_twilio_account_sid_here/Usage/Records.json?PageSize=1"
```

---

## 📊 MONITORING & ALERTS

You'll receive daily summaries via email showing:
- Messages sent/received
- New contacts
- Estimated spending
- Any suspicious activity

**Weekly Review:**
Every Sunday, I'll generate a report of:
- All conversations
- Contact additions
- Spending totals
- Recommendations for allowlist adjustments

---

## 🆘 SUSPICIOUS MESSAGE PATTERNS (Auto-Flagged)

AI will flag and HOLD messages containing:
- 💰 Requests for money/financial info
- 🔑 Requests for passwords/credentials
- 📎 Suspicious links
- 🎣 Phishing attempts
- 🚨 Urgent/demanding language
- 🌐 Requests to visit external sites

Flagged messages require YOUR approval before AI responds.

Example:
```
Incoming: +1234567890 → "Can you wire $500 to this account?"
Action: FLAGGED for review (no response sent)
Alert: "Suspicious message from +1234567890 - review required"
```

---

## 🔐 SECURITY BEST PRACTICES

### ✅ DO:
- Keep Twilio credentials in environment only
- Review allowlist weekly
- Monitor spending daily for first month
- Use strong passwords for all accounts
- Enable 2FA on Twilio and Supabase

### ❌ DON'T:
- Share API keys/tokens
- Add unknown numbers without verification
- Let AI handle financial transactions
- Ignore spending alerts
- Skip reviewing flagged messages

---

## 📞 INCIDENT RESPONSE

If you suspect unauthorized use:

**IMMEDIATE (30 seconds):**
1. Text "STOPSMS" to your_twilio_phone_number_here → Disables AI responses
2. Log into Twilio → Disable phone number
3. Check Supabase for unauthorized messages

**WITHIN 5 MINUTES:**
1. Change Twilio auth token
2. Rotate OpenClaw gateway token
3. Review all recent messages

**WITHIN 1 HOUR:**
1. Audit allowlist
2. Review spending
3. Document incident
4. Re-enable with stricter limits

---

## 🎯 CURRENT STATUS

**PROTECTION LEVEL: MAXIMUM** ✅

This is the safest configuration. You can:
- Message from +19493951074 ✓
- View dashboard ✓
- Monitor spending ✓
- Review logs ✓

You CANNOT (by design):
- Respond to unknown numbers ✗
- Send >50 messages/day ✗
- Exceed $5/day spend ✗
- Add contacts without approval ✗

---

## 📋 TO RELAX PROTECTION (After Testing)

Once you're comfortable and want to add a trusted contact:

```bash
# Add ONE trusted contact
openclaw config set channels.twilio-sms.allowFrom='["+19493951074", "+TRUSTED_NUMBER"]'

# Increase daily limit (discuss first)
openclaw config set channels.twilio-sms.rateLimits.messagesPerDay=100

# Reduce monitoring alerts
openclaw config set channels.twilio-sms.auditLogEnabled=false
```

**DO NOT DISABLE RATE LIMITING COMPLETELY**
