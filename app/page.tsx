import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🌞 Summer's Phone
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Digital phone system dashboard
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          href="/conversations"
          title="Conversations"
          description="View and manage message threads"
          icon="💬"
          stat="0 unread"
        />
        <DashboardCard
          href="/contacts"
          title="Contacts"
          description="Manage your contact list"
          icon="👥"
          stat="View all"
        />
        <DashboardCard
          href="/calls"
          title="Calls"
          description="Call history and recordings"
          icon="📞"
          stat="Recent"
        />
        <DashboardCard
          href="/settings"
          title="Settings"
          description="AI preferences and configuration"
          icon="⚙️"
          stat="Configure"
        />
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Connect Supabase to see recent activity
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Phone Number
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📱</div>
            <div>
              <p className="text-2xl font-mono text-gray-900 dark:text-white">
                +1 (844) 902-3577
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Twilio SMS/Voice
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function DashboardCard({
  href,
  title,
  description,
  icon,
  stat
}: {
  href: string
  title: string
  description: string
  icon: string
  stat: string
}) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
        {description}
      </p>
      <p className="text-blue-600 dark:text-blue-400 text-sm mt-4 font-medium">
        {stat} →
      </p>
    </Link>
  )
}
