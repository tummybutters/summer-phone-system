#!/bin/bash
echo "Testing webhook without signature validation..."
curl -X POST https://summer-phone-system.vercel.app/api/webhooks/twilio/sms \
  -d "From=+19493951074" \
  -d "To=+18449023577" \
  -d "Body=Hello Summer" \
  -d "MessageSid=SM12345" \
  -H "Content-Type: application/x-www-form-urlencoded"
echo ""
echo "Test complete. Check if message appears in Supabase."
