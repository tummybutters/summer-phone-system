import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/messages - List messages (by conversation)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')
  const contactId = searchParams.get('contact_id')
  const limit = parseInt(searchParams.get('limit') || '100')
  const offset = parseInt(searchParams.get('offset') || '0')

  if (!conversationId && !contactId) {
    return NextResponse.json({ error: 'conversation_id or contact_id required' }, { status: 400 })
  }

  let query = supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (conversationId) {
    query = query.eq('conversation_id', conversationId)
  } else if (contactId) {
    query = query.eq('contact_id', contactId)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    messages: data?.reverse(), // Return chronological order
    total: count,
    limit,
    offset
  })
}

// POST /api/messages - Send a message
export async function POST(request: Request) {
  const body = await request.json()

  // First, send via OpenClaw
  const openclawResponse = await fetch(`${process.env.OPENCLAW_GATEWAY_URL}/api/message/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENCLAW_GATEWAY_TOKEN}`
    },
    body: JSON.stringify({
      channel: body.channel || 'twilio-sms',
      to: body.to,
      message: body.body,
      mediaUrls: body.media_urls
    })
  })

  if (!openclawResponse.ok) {
    const errorText = await openclawResponse.text()
    return NextResponse.json({ error: `OpenClaw send failed: ${errorText}` }, { status: 500 })
  }

  const openclawResult = await openclawResponse.json()

  // Then record in Supabase
  // First get or create contact
  let { data: contact } = await supabase
    .from('contacts')
    .select('id')
    .eq('phone_number', body.to)
    .single()

  if (!contact) {
    const { data: newContact } = await supabase
      .from('contacts')
      .insert({ phone_number: body.to } as Database['public']['Tables']['contacts']['Insert'])
      .select('id')
      .single()
    contact = newContact
  }

  // Get or create conversation
  let { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('phone_number', body.to)
    .eq('channel', body.channel || 'twilio-sms')
    .single()

  if (!conversation) {
    const { data: newConversation } = await supabase
      .from('conversations')
      .insert({
        contact_id: contact!.id,
        phone_number: body.to,
        channel: body.channel || 'twilio-sms'
      } as Database['public']['Tables']['conversations']['Insert'])
      .select('id')
      .single()
    conversation = newConversation
  }

  // Insert message
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversation!.id,
      contact_id: contact!.id,
      body: body.body,
      direction: 'outbound',
      status: 'sent',
      external_id: openclawResult.id,
      media_urls: body.media_urls || [],
      sent_at: new Date().toISOString()
    } as Database['public']['Tables']['messages']['Insert'])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message, openclaw: openclawResult }, { status: 201 })
}
