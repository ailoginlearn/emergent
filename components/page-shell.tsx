import { ReactNode } from 'react'

interface PageShellProps {
  title: string
  subtitle?: string
  children?: ReactNode
}

export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children && <div className="mt-12">{children}</div>}
    </section>
  )
}
