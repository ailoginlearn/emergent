'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageEditor from '@/components/admin/page-editor'
import { toast } from 'sonner'

export default function NewPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const save = async (data) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save')
      toast.success('Page created')
      router.replace(`/admin/pages/${json.item._id}`)
    } catch (err) {
      toast.error(err?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return <PageEditor mode="create" saving={saving} onSave={save} />
}
