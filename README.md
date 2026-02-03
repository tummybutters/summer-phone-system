# Phone System Backend

API backend for Summer's digital phone with contacts, conversations, and call management.

## Setup

1. Create Supabase project
2. Copy `.env.example` to `.env.local` and fill in values
3. Run migrations: `npm run supabase:push`
4. Run dev server: `npm run dev`

## API Routes

### Contacts
- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Create new contact
- `GET /api/contacts/[id]` - Get contact details
- `PUT /api/contacts/[id]` - Update contact
- `DELETE /api/contacts/[id]` - Delete contact

### Conversations
- `GET /api/conversations` - List conversations
- `GET /api/conversations/[id]` - Get conversation
- `PUT /api/conversations/[id]` - Update conversation (mute, AI toggle)

### Messages
- `GET /api/messages` - List messages
- `POST /api/messages` - Send message
- `GET /api/messages/[id]` - Get message

### Calls
- `GET /api/calls` - List calls
- `POST /api/calls` - Initiate call
- `GET /api/calls/[id]` - Get call details

### Webhooks
- `POST /api/webhooks/twilio/sms` - Twilio SMS webhook
- `POST /api/webhooks/twilio/voice` - Twilio Voice webhook
- `POST /api/webhooks/openclaw` - OpenClaw event webhook

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# OpenClaw
OPENCLAW_GATEWAY_URL=
OPENCLAW_GATEWAY_TOKEN=
```# summer-phone-system
