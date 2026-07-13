import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCol } from '@/lib/mongo'

export async function GET(request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const status = searchParams.get('status') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10))

  const filter = {}
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: rx }, { email: rx }, { subject: rx }, { message: rx }]
  }
  if (status) filter.status = status

  const col = await getCol('contacts')
  const [total, items] = await Promise.all([
    col.countDocuments(filter),
    col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
  ])

  return NextResponse.json({ total, page, limit, items })
}
