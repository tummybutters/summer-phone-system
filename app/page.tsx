import Link from 'next/link'

const links = [
  {
    href: '/conversations',
    title: 'Conversations',
    description: 'View managed threads',
    stat: 'Active',
  },
  {
    href: '/contacts',
    title: 'Contacts',
    description: 'Manage client list',
    stat: 'Database',
  },
  {
    href: '/calls',
    title: 'Calls',
    description: 'History and recordings',
    stat: 'Recent',
  },
  {
    href: '/settings',
    title: 'Settings',
    description: 'AI configuration',
    stat: 'Configure',
  },
]

export default function Home() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1 className="title">Summer&apos;s Phone</h1>
          <p className="subtitle">
            Manage your AI-powered communication hub with real-time insights and controls.
          </p>
        </div>
        <div className="status-pill">
          <span className="status-dot" />
          System Online
        </div>
      </header>

      <section className="grid grid-4" aria-label="Dashboard">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="card link-card">
            <h2 className="card-title">{link.title}</h2>
            <p className="card-meta">{link.description}</p>
            <p className="card-meta">{link.stat}</p>
          </Link>
        ))}
      </section>

      <section className="grid grid-2 section">
        <div className="card">
          <h2 className="section-title">Recent Activity</h2>
          <p className="muted">Waiting for Supabase connection...</p>
        </div>

        <div className="card">
          <h2 className="section-title">Active Number</h2>
          <p className="muted small">Twilio Voice</p>
          <p className="mono big">+1 (844) 902-3577</p>
          <div className="pill-group">
            <span className="pill">SMS Active</span>
            <span className="pill">Voice Active</span>
          </div>
        </div>
      </section>
    </main>
  )
}
