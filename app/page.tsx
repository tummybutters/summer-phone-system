import { GlassCard } from '@/app/components/ui/glass-card'
import {
  MessageSquare,
  Users,
  Phone,
  Settings,
  Activity,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            Summer's Phone
          </h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-lg">
            Manage your AI-powered communication hub with real-time insights and controls.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-white/80">System Online</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardLink
          href="/conversations"
          title="Conversations"
          description="View managed threads"
          icon={<MessageSquare className="w-8 h-8 text-primary" />}
          stat="Active"
        />
        <DashboardLink
          href="/contacts"
          title="Contacts"
          description="Manage client list"
          icon={<Users className="w-8 h-8 text-secondary" />}
          stat="Database"
        />
        <DashboardLink
          href="/calls"
          title="Calls"
          description="History & Recordings"
          icon={<Phone className="w-8 h-8 text-blue-400" />}
          stat="Recent"
        />
        <DashboardLink
          href="/settings"
          title="Settings"
          description="AI Configuration"
          icon={<Settings className="w-8 h-8 text-emerald-400" />}
          stat="Configure"
        />
      </div>

      {/* Activity & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-heading font-semibold text-white">Recent Activity</h2>
          </div>
          <GlassCard className="min-h-[200px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Waiting for Supabase connection...</p>
            </div>
          </GlassCard>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-heading font-semibold text-white">Active Number</h2>
          </div>
          <GlassCard className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Twilio Voice</p>
                <p className="text-3xl font-mono text-white mt-1 tracking-tight">+1 (844) 902-3577</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-md text-xs font-medium border border-white/5">SMS Active</span>
              <span className="px-3 py-1 bg-white/5 rounded-md text-xs font-medium border border-white/5">Voice Active</span>
            </div>
          </GlassCard>
        </section>
      </div>
    </main>
  )
}

function DashboardLink({
  href,
  title,
  description,
  icon,
  stat
}: {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  stat: string
}) {
  return (
    <Link href={href} className="group">
      <GlassCard className="h-full relative overflow-hidden group-hover:border-primary/50 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
          {/* Glow effect */}
          <div className="w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/30 transition-all" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/5 group-hover:bg-primary/10 transition-colors shadow-inner">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          <div className="pt-2 flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
            {stat} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
