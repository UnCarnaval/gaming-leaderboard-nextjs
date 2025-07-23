import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🎮 Gaming Leaderboard',
  description: 'Sistema de leaderboard gaming con ranking de órdenes por períodos',
  keywords: ['leaderboard', 'gaming', 'ranking', 'órdenes', 'competencia'],
  authors: [{ name: 'Gaming Leaderboard System' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="particles-bg min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
} 