'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import PageEditor from '@/components/admin/page-editor'

export default function EditPage() {
  const { id } = useParams()
  const router = useRouter()
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/pages/${id}`, { cache: 'no-store' })
        if (!res.ok) {
          toast.error('Page not found')
          router.replace('/admin/pages')
          return
        }
        const data = await res.json()
        setInitial(data.item)
      } finally {
        setLoading(false)
      }
    })()
  }, [id, router])

  const save = async (data) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      toast.success('Changes saved')
      setInitial(json.item)
    } catch (err) {
      toast.error(err?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }
  if (!initial) return null

  return <PageEditor mode="edit" initial={initial} saving={saving} onSave={save} />
}
