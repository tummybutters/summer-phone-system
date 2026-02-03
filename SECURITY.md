# Summer's Phone - Security Configuration

## 🚨 FINANCIAL PROTECTION GUARDRAILS

### Daily Spending Limits (Twilio)
- SMS: Max $5/day (approx 500 messages)
- Voice: Max $10/day (approx 60 minutes)
- Total: $15/day hard cap

### Message Rate Limiting
- Per contact: 10 messages/hour
- Total outbound: 100 messages/day
- Unknown contacts: 5 messages/day (requires approval)
- Emergency contacts: No limit (Tommy only)

### Contact Allowlist
**ONLY these numbers can message or be messaged:**
- +19493951074 (Tommy - emergency contact)

**All other numbers require explicit approval before AI responds.**

### New Contact Approval Process
1. Unknown number texts: Message is LOGGED but NOT responded to
2. You receive alert: "New contact +1234567890 wants to message"
3. You must approve: `openclaw message approve +1234567890`
4. Only then will AI respond

### AI Response Safety
- No financial transactions
- No password sharing
- No external link clicking
- No meeting scheduling without confirmation
- Auto-flag suspicious messages (asking for money, credentials)

### Emergency Stop Commands
```bash
# Disable all outbound
openclaw config set channels.twilio-sms.enabled=false

# Disable specific contact
openclaw config set channels.twilio-sms.knownContacts=["+19493951074"]

# Check spending
openclaw message --channel twilio-sms --status
```

### Monitoring & Alerts
- Daily email summary of all messages
- Alert if spending > $5/day
- Alert if message volume > 50/day
- Alert on new contacts
- Full audit log in Supabase

## 🛡️ DATA PRIVACY

- All messages stored encrypted in Supabase
- Phone numbers hashed in logs
- Webhook validation required
- API keys in environment only
- No message content shared with third parties

## 🚨 INCIDENT RESPONSE

If you suspect abuse:
1. Text "STOPSMS" to +18449023577 (disables all responses)
2. Log into Twilio console and disable number
3. Check Supabase for unauthorized messages
4. Review allowlist in OpenClaw config

Never share your Twilio credentials or OpenClaw token.
