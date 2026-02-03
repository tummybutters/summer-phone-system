// TypeScript types for Supabase
export type Json = string | number | boolean | Json[] | { [key: string]: Json } | null

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          phone_number: string
          name: string | null
          email: string | null
          company: string | null
          notes: string | null
          tags: string[]
          ai_enabled: boolean
          created_at: string
          updated_at: string
          last_contact: string | null
          message_count: number
          call_count: number
          favorited: boolean
        }
        Insert: {
          id?: string
          phone_number: string
          name?: string | null
          email?: string | null
          company?: string | null
          notes?: string | null
          tags?: string[]
          ai_enabled?: boolean
          created_at?: string
          updated_at?: string
          last_contact?: string | null
          message_count?: number
          call_count?: number
          favorited?: boolean
        }
        Update: {
          id?: string
          phone_number?: string
          name?: string | null
          email?: string | null
          company?: string | null
          notes?: string | null
          tags?: string[]
          ai_enabled?: boolean
          created_at?: string
          updated_at?: string
          last_contact?: string | null
          message_count?: number
          call_count?: number
          favorited?: boolean
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          contact_id: string
          phone_number: string
          channel: string
          ai_enabled: boolean
          muted: boolean
          last_message: string | null
          last_message_at: string | null
          unread_count: number
          message_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          phone_number: string
          channel: string
          ai_enabled?: boolean
          muted?: boolean
          last_message?: string | null
          last_message_at?: string | null
          unread_count?: number
          message_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          phone_number?: string
          channel?: string
          ai_enabled?: boolean
          muted?: boolean
          last_message?: string | null
          last_message_at?: string | null
          unread_count?: number
          message_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          contact_id: string
          external_id: string | null
          body: string | null
          direction: 'inbound' | 'outbound'
          status: 'sent' | 'delivered' | 'failed' | 'received'
          media_urls: string[]
          media_types: string[]
          error_message: string | null
          sent_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          contact_id: string
          external_id?: string | null
          body?: string | null
          direction: 'inbound' | 'outbound'
          status?: 'sent' | 'delivered' | 'failed' | 'received'
          media_urls?: string[]
          media_types?: string[]
          error_message?: string | null
          sent_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          contact_id?: string
          external_id?: string | null
          body?: string | null
          direction?: 'inbound' | 'outbound'
          status?: 'sent' | 'delivered' | 'failed' | 'received'
          media_urls?: string[]
          media_types?: string[]
          error_message?: string | null
          sent_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      calls: {
        Row: {
          id: string
          contact_id: string | null
          phone_number: string
          external_id: string | null
          direction: 'inbound' | 'outbound'
          status: 'ringing' | 'in-progress' | 'completed' | 'failed' | 'no-answer' | 'busy'
          duration_seconds: number | null
          recording_url: string | null
          recording_duration_seconds: number | null
          transcript_text: string | null
          transcript_json: Json | null
          summary: string | null
          started_at: string | null
          answered_at: string | null
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contact_id?: string | null
          phone_number: string
          external_id?: string | null
          direction: 'inbound' | 'outbound'
          status?: 'ringing' | 'in-progress' | 'completed' | 'failed' | 'no-answer' | 'busy'
          duration_seconds?: number | null
          recording_url?: string | null
          recording_duration_seconds?: number | null
          transcript_text?: string | null
          transcript_json?: Json | null
          summary?: string | null
          started_at?: string | null
          answered_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string | null
          phone_number?: string
          external_id?: string | null
          direction?: 'inbound' | 'outbound'
          status?: 'ringing' | 'in-progress' | 'completed' | 'failed' | 'no-answer' | 'busy'
          duration_seconds?: number | null
          recording_url?: string | null
          recording_duration_seconds?: number | null
          transcript_text?: string | null
          transcript_json?: Json | null
          summary?: string | null
          started_at?: string | null
          answered_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
