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
    <div className="min-h-screen p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="text-blue-600 dark:text-blue-400 text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            💬 Conversations
          </h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + New Message
        </button>
      </header>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-5xl mb-4">📭</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No conversations yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            When you receive or send messages, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
          {conversations.map((convo) => (
            <Link
              key={convo.id}
              href={`/conversations/${convo.id}`}
              className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
                  {convo.contact?.name ? convo.contact.name[0].toUpperCase() : '📱'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {convo.contact?.name || convo.phone_number}
                    </p>
                    {convo.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {convo.unread_count}
                      </span>
                    )}
                    {convo.ai_enabled && (
                      <span className="text-xs text-green-600 dark:text-green-400">🤖 AI</span>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                    {convo.last_message || 'No messages'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {convo.last_message_at
                      ? new Date(convo.last_message_at).toLocaleDateString()
                      : ''}
                  </p>
                  <p className="text-xs text-gray-400">{convo.channel}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
