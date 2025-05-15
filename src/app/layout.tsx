import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from 'src/context/AuthContext'
import { cn } from 'src/lib/utils'
import { Header } from 'src/components/layout/Header'
import { Footer } from 'src/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CaptureIt LS',
  description: 'AI-powered sales lead capture tool for iOS/iPadOS',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CaptureIt LS'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={cn(
          inter.className,
          'h-full bg-gradient-to-b from-background/90 to-background/50 text-foreground',
          'min-h-screen bg-black transition-colors duration-300',
          'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black'
        )}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            {/* Background effects */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="pointer-events-none fixed inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            <Header />

            {/* Content */}
            <div className="relative z-10 flex-1">
              <div className="container relative">{children}</div>
            </div>

            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
