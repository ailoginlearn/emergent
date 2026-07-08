'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Send,
  Github,
  Linkedin,
  Twitter,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const channels = [
  {
    Icon: Mail,
    label: 'Email',
    value: 'hello@alexmorgan.dev',
    href: 'mailto:hello@alexmorgan.dev',
    accent: 'bg-primary/10 text-primary',
  },
  {
    Icon: MapPin,
    label: 'Location',
    value: 'Lisbon, Portugal',
    href: null,
    accent: 'bg-fuchsia-500/10 text-fuchsia-500',
  },
  {
    Icon: Clock,
    label: 'Response time',
    value: 'Within 24 hours',
    href: null,
    accent: 'bg-emerald-500/10 text-emerald-500',
  },
]

const socials = [
  { href: 'https://github.com', label: 'GitHub', Icon: Github },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://twitter.com', label: 'Twitter', Icon: Twitter },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function ContactPreview() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-1/4 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-primary to-fuchsia-500" />
              Get in Touch
            </span>
          </motion.div>

          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Let&apos;s build something{' '}
            <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-clip-text text-transparent">
              great together.
            </span>
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-muted-foreground sm:text-lg"
          >
            Have a project in mind or just want to say hi? Drop a message —
            I&apos;ll get back within a day.
          </motion.p>
        </div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-6xl"
        >
          {/* Gradient border glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/50 via-fuchsia-500/50 to-primary/50 opacity-70 blur-md"
          />

          <div className="relative rounded-3xl border border-border/60 bg-background/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
              {/* Left column - info */}
              <div className="lg:col-span-2">
                <motion.h3
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-2xl font-semibold tracking-tight"
                >
                  Contact information
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  Prefer a different channel? Pick whichever suits you.
                </motion.p>

                {/* Channels */}
                <ul className="mt-8 space-y-4">
                  {channels.map((c, i) => {
                    const Content = (
                      <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-lg">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.accent}`}
                        >
                          <c.Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">
                            {c.label}
                          </div>
                          <div className="mt-0.5 truncate text-sm font-medium text-foreground">
                            {c.value}
                          </div>
                        </div>
                        {c.href && (
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                        )}
                      </div>
                    )
                    return (
                      <motion.li
                        key={c.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: 0.45 + i * 0.1,
                        }}
                        className="group"
                      >
                        {c.href ? (
                          <a href={c.href} className="block">
                            {Content}
                          </a>
                        ) : (
                          Content
                        )}
                      </motion.li>
                    )
                  })}
                </ul>

                {/* Socials + availability */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.85 }}
                  className="mt-8 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    {socials.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    Available for work
                  </span>
                </motion.div>
              </div>

              {/* Right column - quick form */}
              <motion.form
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                onSubmit={(e) => e.preventDefault()}
                className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-background/80 to-background/40 p-6 backdrop-blur sm:p-8 lg:col-span-3"
              >
                <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Quick message
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs">
                      Your name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      className="h-11 bg-background/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@company.com"
                      className="h-11 bg-background/60"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="subject" className="text-xs">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="A new website for our team"
                    className="h-11 bg-background/60"
                  />
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="message" className="text-xs">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me a bit about your project, timeline, and goals..."
                    rows={5}
                    className="resize-none bg-background/60"
                  />
                </div>

                <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/contact">
                      Full contact page
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button type="submit" size="lg" className="group">
                    Send message
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
