'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
  FileText,
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

export default function PagesListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [confirmDel, setConfirmDel] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      const res = await fetch(`/api/admin/pages?${params}`, { cache: 'no-store' })
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

  const del = async () => {
    if (!confirmDel) return
    const res = await fetch(`/api/admin/pages/${confirmDel._id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p._id !== confirmDel._id))
      toast.success('Page deleted')
    } else {
      toast.error('Failed to delete page')
    }
    setConfirmDel(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage dynamic content pages.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            New page
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All pages</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or slug..."
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
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                No pages yet. Create your first one.
              </div>
              <Button asChild size="sm">
                <Link href="/admin/pages/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New page
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.title}</span>
                      <span
                        className={
                          p.status === 'published'
                            ? 'rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400'
                            : 'rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground'
                        }
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      /{p.slug} · updated {new Date(p.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    {p.status === 'published' && (
                      <Button size="sm" variant="ghost" asChild title="View live">
                        <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" asChild title="Edit">
                      <Link href={`/admin/pages/${p._id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDel(p)}
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

      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete page?</DialogTitle>
            <DialogDescription>
              <strong>{confirmDel?.title}</strong> will be permanently removed. This cannot be undone.
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
