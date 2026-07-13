'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Inbox,
  FileText,
  LogOut,
  Menu,
  X,
  Loader2,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/contacts', label: 'Contact Messages', icon: Inbox },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
]

export default function AdminShell({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === '/admin/login'
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!isLogin)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (isLogin) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/admin/me', { cache: 'no-store' })
        if (!res.ok) {
          router.replace('/admin/login')
          return
        }
        const data = await res.json()
        if (mounted) {
          setUser(data.user)
          setLoading(false)
        }
      } catch {
        router.replace('/admin/login')
      }
    })()
    return () => {
      mounted = false
    }
  }, [pathname, isLogin, router])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    toast.success('Logged out')
    router.replace('/admin/login')
  }

  if (isLogin) return <>{children}</>

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar - mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>Admin</span>
          </Link>
          <button
            className="rounded-md p-1 hover:bg-muted md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </a>
          <div className="rounded-md bg-muted/50 p-3">
            <div className="truncate text-xs font-medium">{user?.name || 'Admin'}</div>
            <div className="truncate text-[11px] text-muted-foreground">{user?.email}</div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="mt-2 w-full"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <button
            className="rounded-md p-2 hover:bg-muted md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 text-sm text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
