import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/contacts - List all contacts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const tag = searchParams.get('tag')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('last_contact', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone_number.ilike.%${search}%,email.ilike.%${search}%`)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    contacts: data,
    total: count,
    limit,
    offset
  })
}

// POST /api/contacts - Create new contact
export async function POST(request: Request) {
  const body = await request.json()

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      phone_number: body.phone_number,
      name: body.name,
      email: body.email,
      company: body.company,
      notes: body.notes,
      tags: body.tags || [],
      ai_enabled: body.ai_enabled ?? true,
      favorited: body.favorited ?? false
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ contact: data }, { status: 201 })
}
