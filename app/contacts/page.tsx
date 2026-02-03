'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Contact {
  id: string
  phone_number: string
  name: string | null
  email: string | null
  company: string | null
  tags: string[]
  ai_enabled: boolean
  message_count: number
  call_count: number
  last_contact: string | null
  favorited: boolean
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchContacts()
  }, [search])

  async function fetchContacts() {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const res = await fetch(`/api/contacts?${params}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setContacts(data.contacts || [])
      }
    } catch (err) {
      setError('Failed to load contacts')
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
          <h1 className="title">Contacts</h1>
        </div>
        <button className="button" type="button">
          Add Contact
        </button>
      </header>

      <div className="section">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
      </div>

      {loading ? (
        <div className="empty">
          <p className="muted">Loading contacts...</p>
        </div>
      ) : error ? (
        <div className="notice">{error}</div>
      ) : contacts.length === 0 ? (
        <div className="card empty">
          <h2 className="section-title">No contacts yet</h2>
          <p className="muted">
            Add contacts or they&apos;ll be created automatically when you receive messages.
          </p>
        </div>
      ) : (
        <div className="card section">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Tags</th>
                <th>Activity</th>
                <th>AI</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <div className="pill-group">
                      <div className="avatar">
                        {contact.name ? contact.name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <div>{contact.name || 'Unknown'}</div>
                        {contact.company && (
                          <div className="muted small">{contact.company}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="mono">{contact.phone_number}</td>
                  <td>
                    <div className="pill-group">
                      {contact.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="muted">
                    {contact.message_count} msgs, {contact.call_count} calls
                  </td>
                  <td>
                    <span className={`status ${contact.ai_enabled ? 'on' : 'off'}`}>
                      {contact.ai_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
