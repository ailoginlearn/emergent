import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCol } from '@/lib/mongo'

function slugify(s = '') {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export async function GET(request, { params }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const col = await getCol('pages')
  const item = await col.findOne({ _id: id })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item })
}

export async function PUT(request, { params }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const col = await getCol('pages')

  const existing = await col.findOne({ _id: id })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const update = { updatedAt: new Date() }
  if (body.title !== undefined) update.title = String(body.title).trim()
  if (body.content !== undefined) update.content = body.content
  if (body.excerpt !== undefined) update.excerpt = body.excerpt
  if (body.seoTitle !== undefined) update.seoTitle = body.seoTitle
  if (body.metaDescription !== undefined) update.metaDescription = body.metaDescription
  if (body.template !== undefined) update.template = body.template
  if (body.status !== undefined) {
    update.status = body.status === 'published' ? 'published' : 'draft'
  }
  if (body.slug !== undefined) {
    let newSlug = slugify(body.slug)
    if (newSlug !== existing.slug) {
      let base = newSlug
      let n = 1
      while (await col.findOne({ slug: newSlug, _id: { $ne: id } })) {
        n += 1
        newSlug = `${base}-${n}`
      }
      update.slug = newSlug
    }
  }

  const result = await col.findOneAndUpdate(
    { _id: id },
    { $set: update },
    { returnDocument: 'after' }
  )
  return NextResponse.json({ item: result })
}

export async function DELETE(request, { params }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const col = await getCol('pages')
  const r = await col.deleteOne({ _id: id })
  return NextResponse.json({ success: r.deletedCount === 1 })
}
