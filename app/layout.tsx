import './globals.css'
import type { Metadata } from 'next'
import ThemeToggle from './components/ThemeToggle'
import './utils/darkMode'

export const metadata: Metadata = {
  title: 'Topic Comparison Tool',
  description: 'Compare different topics using LLM analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  )
}
