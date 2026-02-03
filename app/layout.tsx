import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: "Summer's Phone",
  description: 'Digital phone system dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.variable,
        outfit.variable,
        "min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary"
      )}>
        {children}
      </body>
    </html>
  )
}
