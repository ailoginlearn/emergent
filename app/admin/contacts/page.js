'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Search,
  Trash2,
  Mail,
  MailOpen,
  Loader2,
  Reply,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function ContactsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      const res = await fetch(`/api/admin/contacts?${params}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
      }
    } finally {
      setLoading(false)
    }
  }, [q])

  useEffect(() => {
    load()
  }, [load])

  const openMsg = async (msg) => {
    setActive(msg)
    if (msg.status !== 'read') {
      const res = await fetch(`/api/admin/contacts/${msg._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: 'read' } : m))
        )
      }
    }
  }

  const toggleRead = async (msg) => {
    const next = msg.status === 'read' ? 'unread' : 'read'
    const res = await fetch(`/api/admin/contacts/${msg._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    if (res.ok) {
      setItems((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: next } : m))
      )
      toast.success(next === 'read' ? 'Marked as read' : 'Marked as unread')
    }
  }

  const del = async () => {
    if (!confirmDel) return
    const res = await fetch(`/api/admin/contacts/${confirmDel._id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setItems((prev) => prev.filter((m) => m._id !== confirmDel._id))
      toast.success('Message deleted')
      if (active?._id === confirmDel._id) setActive(null)
    } else {
      toast.error('Failed to delete')
    }
    setConfirmDel(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Contact Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All inquiries submitted via the website contact form.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Inbox</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, subject..."
              className="h-9 pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No messages found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((m) => (
                <div
                  key={m._id}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <button
                    onClick={() => openMsg(m)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className={m.status === 'read' ? 'font-medium' : 'font-semibold'}>
                        {m.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{m.email}</span>
                      {m.status !== 'read' && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                          New
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/80">{m.subject}</span>
                      {' · '}
                      <span>{m.message}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                  </button>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleRead(m)}
                      title={m.status === 'read' ? 'Mark unread' : 'Mark read'}
                    >
                      {m.status === 'read' ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <MailOpen className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDel(m)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View message dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.subject}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2 text-sm">
                  From <strong>{active.name}</strong>
                  <span className="text-muted-foreground">&lt;{active.email}&gt;</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(active.createdAt).toLocaleString()}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                {active.message}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" asChild>
                  <a href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject)}`}>
                    <Reply className="mr-2 h-4 w-4" />
                    Reply via Email
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDel(active)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete message?</DialogTitle>
            <DialogDescription>
              This cannot be undone. The message from{' '}
              <strong>{confirmDel?.name}</strong> will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDel(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={del}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
