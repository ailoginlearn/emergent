'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Inbox,
  FileText,
  MailOpen,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statCards = [
  { key: 'totalContacts', label: 'Total Messages', icon: Inbox, tint: 'bg-primary/10 text-primary' },
  { key: 'unreadContacts', label: 'Unread', icon: MailOpen, tint: 'bg-amber-500/10 text-amber-500' },
  { key: 'totalPages', label: 'Total Pages', icon: FileText, tint: 'bg-fuchsia-500/10 text-fuchsia-500' },
  { key: 'publishedPages', label: 'Published', icon: CheckCircle2, tint: 'bg-emerald-500/10 text-emerald-500' },
]

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/admin/dashboard', { cache: 'no-store' })
        if (res.ok) setData(await res.json())
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  const stats = data?.stats || {}
  const recent = data?.recentContacts || []

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An overview of your portfolio activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/contacts">
              <Inbox className="mr-2 h-4 w-4" />
              View messages
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/pages/new">
              <Plus className="mr-2 h-4 w-4" />
              New page
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <Card key={c.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.tint}`}>
                <c.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats[c.key] ?? 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent messages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent messages</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/contacts">
              View all
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. When someone submits your contact form, it will appear here.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((m) => (
                <li key={m._id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{m.name}</span>
                      {m.status === 'unread' && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                          New
                        </span>
                      )}
                    </div>
                    <div className="truncate text-sm text-muted-foreground">{m.subject}</div>
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-right">
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
