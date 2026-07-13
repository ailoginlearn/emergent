import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/navbar'
import SiteFooter from '@/components/site-footer'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Portfolio | Personal Website',
  description: 'Modern personal portfolio built with Next.js and Tailwind CSS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  )
}
