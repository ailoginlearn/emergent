'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import AboutPreview from '@/components/about-preview'
import Skills from '@/components/skills'

const profileImage =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3ODM0MjkyODN8MA&ixlib=rb-4.1.0&q=85'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const socials = [
  { href: 'https://github.com', label: 'GitHub', Icon: Github },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://twitter.com', label: 'Twitter', Icon: Twitter },
  { href: 'mailto:hello@example.com', label: 'Email', Icon: Mail },
]

export default function HomePage() {
  return (
    <>
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse at center, black 40%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 40%, transparent 75%)',
          }}
        />
        {/* Colored blurs */}
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/25 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 lg:py-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          {/* Left column - text */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            {/* Availability badge */}
            <motion.div variants={item} className="inline-flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Available for new projects
              </span>
            </motion.div>

            {/* Greeting */}
            <motion.p
              variants={item}
              className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground lg:justify-start"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Hello, I&apos;m
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="block">Alex Morgan.</span>
              <span className="mt-2 block bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-clip-text text-transparent">
                Full-Stack Developer
              </span>
              <span className="block text-foreground/80">
                &amp; Product Designer
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={item}
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
            >
              I craft fast, delightful web experiences — blending clean code
              with thoughtful design to help ambitious teams ship products
              users love.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link href="/projects">
                  View my work
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="/contact">
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Link>
              </Button>
            </motion.div>

            {/* Socials */}
            <motion.div
              variants={item}
              className="mt-8 flex items-center justify-center gap-2 lg:justify-start"
            >
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-md"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="mt-10 grid grid-cols-3 gap-6 border-t border-border/40 pt-6 lg:max-w-md"
            >
              {[
                { value: '6+', label: 'Years exp.' },
                { value: '40+', label: 'Projects' },
                { value: '25+', label: 'Happy clients' },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column - profile image */}
          <motion.div
            variants={item}
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <div className="relative">
              {/* Animated glow ring */}
              <motion.div
                aria-hidden
                className="absolute -inset-6 rounded-full bg-gradient-to-tr from-primary via-fuchsia-500 to-primary opacity-30 blur-2xl"
                animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Rotating gradient border */}
              <motion.div
                aria-hidden
                className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,theme(colors.primary.DEFAULT),theme(colors.fuchsia.500),theme(colors.primary.DEFAULT))]"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              />

              {/* Profile image */}
              <motion.div
                className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-background shadow-2xl sm:h-80 sm:w-80 md:h-96 md:w-96"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src={profileImage}
                  alt="Alex Morgan portrait"
                  fill
                  priority
                  sizes="(max-width: 768px) 288px, 384px"
                  className="object-cover"
                />
              </motion.div>

              {/* Floating badge - tech */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -left-4 top-8 flex items-center gap-2 rounded-2xl border border-border/60 bg-background/90 px-3 py-2 shadow-lg backdrop-blur"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold">Design Systems</div>
                  <div className="text-[10px] text-muted-foreground">
                    Expert
                  </div>
                </div>
              </motion.div>

              {/* Floating badge - years */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute -right-2 bottom-10 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-lg backdrop-blur"
              >
                <div className="text-2xl font-bold leading-none">6+</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Years shipping
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
    <AboutPreview />
    <Skills />
    </>
  )
}
