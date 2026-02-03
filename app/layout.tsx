import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body className="app">{children}</body>
    </html>
  )
}
