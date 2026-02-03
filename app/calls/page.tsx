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
      case 'completed':
        return '✓'
      case 'in-progress':
        return '●'
      case 'ringing':
        return '☎'
      case 'failed':
        return '×'
      case 'no-answer':
        return '–'
      case 'busy':
        return '●'
      default:
        return '○'
    }
  }

  return (
    <div className="page">
      <header className="toolbar">
        <div>
          <Link href="/" className="muted small">
            ← Back to Dashboard
          </Link>
          <h1 className="title">Calls</h1>
        </div>
        <button className="button" type="button">
          New Call
        </button>
      </header>

      {loading ? (
        <div className="empty">
          <p className="muted">Loading calls...</p>
        </div>
      ) : error ? (
        <div className="notice">{error}</div>
      ) : calls.length === 0 ? (
        <div className="card empty">
          <h2 className="section-title">No calls yet</h2>
          <p className="muted">Your call history will appear here.</p>
        </div>
      ) : (
        <div className="list">
          {calls.map((call) => (
            <div key={call.id} className="list-item">
              <div className="avatar">
                {call.direction === 'inbound' ? 'IN' : 'OUT'}
              </div>
              <div className="list-main">
                <div className="pill-group">
                  <strong>{call.contact?.name || call.phone_number}</strong>
                  <span className="list-meta">
                    {getStatusIcon(call.status)} {call.status}
                  </span>
                </div>
                <div className="list-meta">
                  {call.direction === 'inbound' ? 'Incoming' : 'Outgoing'} •{' '}
                  {formatDuration(call.duration_seconds)}
                </div>
                {call.summary && <div className="call-summary">{call.summary}</div>}
              </div>
              <div className="list-meta list-side">
                <div>
                  {call.started_at ? new Date(call.started_at).toLocaleString() : '-'}
                </div>
                {call.recording_url && (
                  <a href={call.recording_url} target="_blank" rel="noopener noreferrer">
                    Recording
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
