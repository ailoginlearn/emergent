'use client'

import { motion } from 'framer-motion'
import {
  Code2,
  Server,
  Palette,
  Wrench,
  Sparkles,
  Cpu,
  Database,
  Cloud,
  Figma,
  GitBranch,
  Zap,
  Layers,
} from 'lucide-react'

type Skill = { name: string; level: number }
type Category = {
  title: string
  description: string
  Icon: React.ComponentType<{ className?: string }>
  accent: string
  ring: string
  skills: Skill[]
}

const categories: Category[] = [
  {
    title: 'Frontend',
    description: 'Interfaces that feel alive.',
    Icon: Code2,
    accent: 'bg-primary/10 text-primary',
    ring: 'from-primary/60 to-primary/0',
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 92 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 94 },
    ],
  },
  {
    title: 'Backend',
    description: 'APIs that scale gracefully.',
    Icon: Server,
    accent: 'bg-fuchsia-500/10 text-fuchsia-500',
    ring: 'from-fuchsia-500/60 to-fuchsia-500/0',
    skills: [
      { name: 'Node.js', level: 88 },
      { name: 'PostgreSQL', level: 82 },
      { name: 'MongoDB', level: 85 },
      { name: 'GraphQL', level: 78 },
    ],
  },
  {
    title: 'Design',
    description: 'Systems, not screens.',
    Icon: Palette,
    accent: 'bg-amber-500/10 text-amber-500',
    ring: 'from-amber-500/60 to-amber-500/0',
    skills: [
      { name: 'Figma', level: 92 },
      { name: 'Design Systems', level: 88 },
      { name: 'Motion / Framer', level: 84 },
      { name: 'Accessibility', level: 86 },
    ],
  },
  {
    title: 'Tools',
    description: "The craftsman's bench.",
    Icon: Wrench,
    accent: 'bg-emerald-500/10 text-emerald-500',
    ring: 'from-emerald-500/60 to-emerald-500/0',
    skills: [
      { name: 'Git & GitHub', level: 95 },
      { name: 'Docker', level: 78 },
      { name: 'Vercel / AWS', level: 82 },
      { name: 'CI / CD', level: 80 },
    ],
  },
]

const marqueeTech = [
  { label: 'React', Icon: Code2 },
  { label: 'Next.js', Icon: Zap },
  { label: 'TypeScript', Icon: Cpu },
  { label: 'Node.js', Icon: Server },
  { label: 'MongoDB', Icon: Database },
  { label: 'PostgreSQL', Icon: Database },
  { label: 'Tailwind', Icon: Layers },
  { label: 'Figma', Icon: Figma },
  { label: 'Docker', Icon: Cloud },
  { label: 'Git', Icon: GitBranch },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function Skills() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/3 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl sm:h-[400px] sm:w-[400px]" />
        <div className="absolute right-0 top-1/4 h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-3xl sm:h-[400px] sm:w-[400px]" />
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-primary to-fuchsia-500" />
              Skills &amp; Toolkit
            </span>
          </motion.div>

          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="mt-5 text-2xl font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Tools I use to{' '}
            <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-clip-text text-transparent">
              turn ideas
            </span>{' '}
            into products.
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg"
          >
            A curated stack refined over six years of shipping — chosen for
            speed, longevity, and joy of use.
          </motion.p>
        </div>

        {/* Categories grid */}
        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div
                className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b ${cat.ring} opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative flex h-full flex-col rounded-2xl border border-border/60 bg-background/60 p-5 backdrop-blur transition-colors duration-500 group-hover:border-primary/40 sm:p-6">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl ${cat.accent}`}
                >
                  <cat.Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <h3 className="mt-4 text-base font-semibold sm:mt-5 sm:text-lg">
                  {cat.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {cat.description}
                </p>

                <ul className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
                  {cat.skills.map((skill, sIdx) => (
                    <li key={skill.name}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {skill.name}
                        </span>
                        <span className="text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true, margin: '-60px' }}
                          transition={{
                            duration: 1.1,
                            delay: 0.2 + sIdx * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-500"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee tech chips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-14 sm:mt-20"
        >
          <div className="mb-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:mb-6 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Also in my toolbox
          </div>

          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />

            <motion.div
              className="flex w-max gap-2 sm:gap-3"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {[...marqueeTech, ...marqueeTech].map((tech, i) => (
                <div
                  key={`${tech.label}-${i}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
                >
                  <tech.Icon className="h-4 w-4 text-primary" />
                  {tech.label}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
