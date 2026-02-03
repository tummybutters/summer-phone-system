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
    <div className="min-h-screen p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="text-blue-600 dark:text-blue-400 text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            👥 Contacts
          </h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Add Contact
        </button>
      </header>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading contacts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-5xl mb-4">📇</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No contacts yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Add contacts or they'll be created automatically when you receive messages.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">Name</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">Phone</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">Tags</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">Activity</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-300 font-medium">AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {contact.name ? contact.name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {contact.name || 'Unknown'}
                        </p>
                        {contact.company && (
                          <p className="text-sm text-gray-500">{contact.company}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-gray-600 dark:text-gray-400">
                    {contact.phone_number}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                    {contact.message_count} msgs, {contact.call_count} calls
                  </td>
                  <td className="p-4">
                    <span className={contact.ai_enabled ? 'text-green-600' : 'text-gray-400'}>
                      {contact.ai_enabled ? '✓ Enabled' : '○ Disabled'}
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
