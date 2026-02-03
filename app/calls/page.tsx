'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Call {
  id: string
  phone_number: string
  direction: 'inbound' | 'outbound'
  status: string
  duration_seconds: number | null
  recording_url: string | null
  transcript_text: string | null
  summary: string | null
  started_at: string | null
  ended_at: string | null
  contact: {
    id: string
    phone_number: string
    name: string | null
  } | null
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCalls()
  }, [])

  async function fetchCalls() {
    try {
      const res = await fetch('/api/calls')
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setCalls(data.calls || [])
      }
    } catch (err) {
      setError('Failed to load calls')
    } finally {
      setLoading(false)
    }
  }

  function formatDuration(seconds: number | null): string {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return '✅'
      case 'in-progress': return '🔵'
      case 'ringing': return '📞'
      case 'failed': return '❌'
      case 'no-answer': return '📵'
      case 'busy': return '🔴'
      default: return '⚪'
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
            📞 Calls
          </h1>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          📞 New Call
        </button>
      </header>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading calls...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : calls.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-5xl mb-4">📞</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No calls yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Your call history will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
          {calls.map((call) => (
            <div key={call.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl">
                  {call.direction === 'inbound' ? '📥' : '📤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {call.contact?.name || call.phone_number}
                    </p>
                    <span className="text-xs text-gray-500">
                      {getStatusIcon(call.status)} {call.status}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {call.direction === 'inbound' ? 'Incoming' : 'Outgoing'} • {formatDuration(call.duration_seconds)}
                  </p>
                  {call.summary && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      📝 {call.summary}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {call.started_at
                      ? new Date(call.started_at).toLocaleString()
                      : '-'}
                  </p>
                  {call.recording_url && (
                    <a
                      href={call.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 text-sm"
                    >
                      🎙️ Recording
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
