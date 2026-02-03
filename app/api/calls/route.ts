import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/calls - List calls
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const contactId = searchParams.get('contact_id')
  const phoneNumber = searchParams.get('phone_number')
  const statusParam = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  type CallStatus = Database['public']['Tables']['calls']['Row']['status']
  const allowedStatuses: CallStatus[] = [
    'ringing',
    'in-progress',
    'completed',
    'failed',
    'no-answer',
    'busy'
  ]
  const status = statusParam && allowedStatuses.includes(statusParam as CallStatus)
    ? (statusParam as CallStatus)
    : null

  if (statusParam && !status) {
    return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 })
  }

  let query = supabase
    .from('calls')
    .select(`
      *,
      contact:contacts(id, phone_number, name)
    `, { count: 'exact' })
    .order('started_at', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (contactId) {
    query = query.eq('contact_id', contactId)
  }
  if (phoneNumber) {
    query = query.eq('phone_number', phoneNumber)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    calls: data,
    total: count,
    limit,
    offset
  })
}

// POST /api/calls - Initiate a call
export async function POST(request: Request) {
  const body = await request.json()

  // Initiate call via OpenClaw voice-call plugin
  const openclawResponse = await fetch(`${process.env.OPENCLAW_GATEWAY_URL}/api/voice-call/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENCLAW_GATEWAY_TOKEN}`
    },
    body: JSON.stringify({
      to: body.to,
      message: body.intro_message,
      mode: body.mode || 'conversation'
    })
  })

  if (!openclawResponse.ok) {
    const errorText = await openclawResponse.text()
    return NextResponse.json({ error: `OpenClaw call failed: ${errorText}` }, { status: 500 })
  }

  const openclawResult = await openclawResponse.json()

  // Get or create contact
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

  // Record call in Supabase
  const { data: call, error } = await supabase
    .from('calls')
    .insert({
      contact_id: contact?.id,
      phone_number: body.to,
      external_id: openclawResult.callId || openclawResult.sid,
      direction: 'outbound',
      status: 'ringing',
      started_at: new Date().toISOString()
    } as Database['public']['Tables']['calls']['Insert'])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ call, openclaw: openclawResult }, { status: 201 })
}
