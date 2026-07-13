import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCol } from '@/lib/mongo'

export async function PATCH(request, { params }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const update = {}
  if (body.status) update.status = body.status
  if (typeof body.starred === 'boolean') update.starred = body.starred
  update.updatedAt = new Date()
  const col = await getCol('contacts')
  const result = await col.findOneAndUpdate(
    { _id: id },
    { $set: update },
    { returnDocument: 'after' }
  )
  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item: result })
}

export async function DELETE(request, { params }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const col = await getCol('contacts')
  const result = await col.deleteOne({ _id: id })
  return NextResponse.json({ success: result.deletedCount === 1 })
}
