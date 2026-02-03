import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/conversations - List conversations
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channel = searchParams.get('channel')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('conversations')
    .select(`
      *,
      contact:contacts(id, phone_number, name, tags, ai_enabled)
    `, { count: 'exact' })
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (channel) {
    query = query.eq('channel', channel)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    conversations: data,
    total: count,
    limit,
    offset
  })
}
