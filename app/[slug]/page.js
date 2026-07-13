import { notFound } from 'next/navigation'
import { getCol } from '@/lib/mongo'

export const dynamic = 'force-dynamic'

async function getPage(slug) {
  try {
    const col = await getCol('pages')
    return await col.findOne({ slug, status: 'published' })
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return { title: 'Not found' }
  return {
    title: page.seoTitle || page.title,
    description: page.metaDescription || page.excerpt || undefined,
  }
}

export default async function DynamicPage({ params }) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  const template = page.template || 'default'
  const containerCls =
    template === 'wide'
      ? 'container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8'
      : template === 'landing'
        ? 'container mx-auto px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8'
        : 'container mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8'

  return (
    <section className={containerCls}>
      <header className={template === 'landing' ? 'mb-8' : 'mb-8'}>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {page.excerpt}
          </p>
        )}
      </header>
      <article
        className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: page.content || '' }}
      />
    </section>
  )
}
