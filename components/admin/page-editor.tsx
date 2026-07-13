'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Loader2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function slugify(s = '') {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export default function PageEditor({ mode, initial, saving, onSave }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [status, setStatus] = useState(initial?.status || 'draft')
  const [content, setContent] = useState(initial?.content || '')
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '')
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle || '')
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription || '')
  const [template, setTemplate] = useState(initial?.template || 'default')

  // Auto-slug from title (unless manually edited)
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title))
  }, [title, slugTouched])

  const submit = (nextStatus) => {
    if (!title.trim()) return
    onSave({
      title,
      slug: slug || slugify(title),
      content,
      excerpt,
      seoTitle,
      metaDescription,
      template,
      status: nextStatus || status,
    })
    if (nextStatus) setStatus(nextStatus)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/pages" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {mode === 'create' ? 'New page' : 'Edit page'}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {mode === 'edit' && initial?.status === 'published' ? (
                <>
                  Public URL:{' '}
                  <a
                    href={`/${initial.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    /{initial.slug}
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                </>
              ) : (
                'This page will not be visible to the public until you publish it.'
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => submit('draft')} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save draft
          </Button>
          <Button onClick={() => submit('published')} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
            {status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="About Us"
                  className="h-11 text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true)
                      setSlug(slugify(e.target.value))
                    }}
                    placeholder="about-us"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-generated from title. Only lowercase letters, numbers and dashes.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary (optional)</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short summary shown in listings and previews."
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your page content here. Supports plain text and basic HTML. (A rich editor will come in the next phase.)"
                  rows={16}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags for formatting. Line breaks are preserved.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO title</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to page title if left blank"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="150-160 characters recommended."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      status === 'published'
                        ? 'rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400'
                        : 'rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground'
                    }
                  >
                    {status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="landing">Landing (centered, hero-style)</SelectItem>
                    <SelectItem value="wide">Wide (full-width)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border bg-background p-4">
                <div className="text-xs text-muted-foreground">Preview</div>
                <div className="mt-1 text-lg font-semibold">{title || 'Untitled page'}</div>
                {excerpt && (
                  <div className="mt-1 text-sm text-muted-foreground">{excerpt}</div>
                )}
                <div
                  className="prose prose-sm mt-3 max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: content || '<p class="text-muted-foreground">Nothing to preview yet.</p>' }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
