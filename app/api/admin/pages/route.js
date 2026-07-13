import { NextResponse } from 'next/server'
import crypto from 'crypto'
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

export async function GET(request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const status = searchParams.get('status') || ''
  const filter = {}
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ title: rx }, { slug: rx }, { seoTitle: rx }]
  }
  if (status) filter.status = status

  const col = await getCol('pages')
  const items = await col.find(filter).sort({ updatedAt: -1 }).toArray()
  return NextResponse.json({ items })
}

export async function POST(request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const title = String(body.title || '').trim()
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const col = await getCol('pages')
  let slug = slugify(body.slug || title)
  // ensure unique
  let base = slug
  let n = 1
  while (await col.findOne({ slug })) {
    n += 1
    slug = `${base}-${n}`
  }

  const now = new Date()
  const doc = {
    _id: crypto.randomUUID(),
    title,
    slug,
    content: body.content || '',
    excerpt: body.excerpt || '',
    seoTitle: body.seoTitle || title,
    metaDescription: body.metaDescription || '',
    template: body.template || 'default',
    status: body.status === 'published' ? 'published' : 'draft',
    createdAt: now,
    updatedAt: now,
    createdBy: user.email,
  }
  await col.insertOne(doc)
  return NextResponse.json({ item: doc }, { status: 201 })
}
