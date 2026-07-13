import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCol } from '@/lib/mongo'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contacts = await getCol('contacts')
  const pages = await getCol('pages')

  const [totalContacts, unreadContacts, totalPages, publishedPages, recentContacts] =
    await Promise.all([
      contacts.countDocuments({}),
      contacts.countDocuments({ status: { $ne: 'read' } }),
      pages.countDocuments({}),
      pages.countDocuments({ status: 'published' }),
      contacts.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    ])

  return NextResponse.json({
    stats: {
      totalContacts,
      unreadContacts,
      totalPages,
      publishedPages,
      totalOrders: 0,
      totalClients: 0,
      totalBlogs: 0,
      totalProjects: 0,
    },
    recentContacts,
  })
}
