'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Contact {
  id: string
  phone_number: string
  name: string | null
  tags: string[]
  ai_enabled: boolean
}

interface Conversation {
  id: string
  phone_number: string
  channel: string
  ai_enabled: boolean
  muted: boolean
  last_message: string | null
  last_message_at: string | null
  unread_count: number
  message_count: number
  contact: Contact
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  async function fetchConversations() {
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setConversations(data.conversations || [])
      }
    } catch (err) {
      setError('Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="toolbar">
        <div>
          <Link href="/" className="muted small">
            ← Back to Dashboard
          </Link>
          <h1 className="title">Conversations</h1>
        </div>
        <button className="button" type="button">
          New Message
        </button>
      </header>

      {loading ? (
        <div className="empty">
          <p className="muted">Loading conversations...</p>
        </div>
      ) : error ? (
        <div className="notice">{error}</div>
      ) : conversations.length === 0 ? (
        <div className="card empty">
          <h2 className="section-title">No conversations yet</h2>
          <p className="muted">When you receive or send messages, they&apos;ll appear here.</p>
        </div>
      ) : (
        <div className="list">
          {conversations.map((convo) => (
            <Link key={convo.id} href={`/conversations/${convo.id}`} className="list-item">
              <div className="avatar">
                {convo.contact?.name ? convo.contact.name[0].toUpperCase() : '📱'}
              </div>
              <div className="list-main">
                <div className="pill-group">
                  <strong>{convo.contact?.name || convo.phone_number}</strong>
                  {convo.unread_count > 0 && (
                    <span className="badge">{convo.unread_count}</span>
                  )}
                  {convo.ai_enabled && <span className="muted small">AI</span>}
                </div>
                <div className="list-meta">
                  {convo.last_message || 'No messages'}
                </div>
              </div>
              <div className="list-meta list-side">
                <div>
                  {convo.last_message_at
                    ? new Date(convo.last_message_at).toLocaleDateString()
                    : ''}
                </div>
                <div>{convo.channel}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
