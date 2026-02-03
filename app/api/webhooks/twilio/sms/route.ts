import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Twilio from 'twilio'
import type { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Normalize phone number to E.164
function normalizePhone(phone: string): string {
  const stripped = phone.replace(/[^\d+]/g, '')
  if (stripped.startsWith('+')) return stripped
  if (stripped.length === 10) return `+1${stripped}`
  if (stripped.length === 11 && stripped.startsWith('1')) return `+${stripped}`
  return `+${stripped}`
}

// POST /api/webhooks/twilio/sms - Twilio SMS webhook
// This is a secondary persistence layer - OpenClaw handles the main routing
export async function POST(request: Request) {
  const body = await request.formData()
  const params: Record<string, string> = {}
  for (const [key, value] of body.entries()) {
    params[key] = value.toString()
  }

  // Validate Twilio signature
  const signature = request.headers.get('x-twilio-signature') || ''
  const authToken = process.env.TWILIO_AUTH_TOKEN!
  const url = request.url

  const isValid = Twilio.validateRequest(authToken, signature, url, params)
  if (!isValid) {
    console.warn('Invalid Twilio signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  const from = normalizePhone(params.From || '')
  const to = normalizePhone(params.To || '')
  const messageBody = params.Body || ''
  const messageSid = params.MessageSid || ''
  const numMedia = parseInt(params.NumMedia || '0')

  // Extract media URLs
  const mediaUrls: string[] = []
  const mediaTypes: string[] = []
  for (let i = 0; i < numMedia; i++) {
    const url = params[`MediaUrl${i}`]
    const type = params[`MediaContentType${i}`]
    if (url) {
      mediaUrls.push(url)
      if (type) mediaTypes.push(type)
    }
  }

  // Get or create contact
  let { data: contact } = await supabase
    .from('contacts')
    .select('id')
    .eq('phone_number', from)
    .single()

  if (!contact) {
    const { data: newContact } = await supabase
      .from('contacts')
      .insert({ phone_number: from })
      .select('id')
      .single()
    contact = newContact
  }

  // Get or create conversation
  let { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('phone_number', from)
    .eq('channel', 'twilio-sms')
    .single()

  if (!conversation) {
    const { data: newConversation } = await supabase
      .from('conversations')
      .insert({
        contact_id: contact!.id,
        phone_number: from,
        channel: 'twilio-sms'
      })
      .select('id')
      .single()
    conversation = newConversation
  }

  // Insert message
  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversation!.id,
      contact_id: contact!.id,
      external_id: messageSid,
      body: messageBody,
      direction: 'inbound',
      status: 'received',
      media_urls: mediaUrls,
      media_types: mediaTypes
    })

  if (error) {
    console.error('Failed to insert message:', error)
  }

  // Return empty TwiML - OpenClaw handles the AI response
  return new NextResponse(
    '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
    {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    }
  )
}
