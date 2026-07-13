'use client'

import { usePathname } from 'next/navigation'

export default function SiteFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
      </div>
    </footer>
  )
}
