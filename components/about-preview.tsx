'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Code2, Rocket, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'

const workspaceImage =
  'https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?auto=format&fit=crop&w=1200&q=80'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-[400px] w-[400px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section label */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="mb-14 flex flex-col items-center text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
            <span className="h-1 w-6 rounded-full bg-gradient-to-r from-primary to-fuchsia-500" />
            About Me
          </span>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left column - image */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeLeft}
            className="relative"
          >
            <div className="relative">
              {/* Gradient glow behind image */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/30 via-fuchsia-500/20 to-transparent blur-2xl" />

              {/* Image frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-2xl">
                <Image
                  src={workspaceImage}
                  alt="Developer workspace"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Subtle top-to-bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>

              {/* Floating stat card - top left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: -20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -left-4 top-8 flex items-center gap-3 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-xl backdrop-blur md:-left-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Clean Code</div>
                  <div className="text-xs text-muted-foreground">
                    Craft-first mindset
                  </div>
                </div>
              </motion.div>

              {/* Floating stat card - bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: 20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -right-4 bottom-10 flex items-center gap-3 rounded-2xl border border-border/60 bg-background/90 px-4 py-3 shadow-xl backdrop-blur md:-right-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-500">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Ship Fast</div>
                  <div className="text-xs text-muted-foreground">
                    Iterate weekly
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ staggerChildren: 0.12 }}
            className="relative"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              A developer&apos;s journey
              <span className="block bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-clip-text text-transparent">
                built on curiosity.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              What started as a late-night experiment tweaking HTML on a
              second-hand laptop has grown into six years of shipping products
              for startups and scale-ups around the world. I&apos;ve worn many
              hats — frontend engineer, product designer, and occasional
              back-end wrangler — but the throughline has always been the
              same: build things people actually enjoy using.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Today I focus on crafting modern web experiences with React,
              Next.js, and TypeScript — obsessing over performance,
              accessibility, and the tiny details that make an interface feel
              alive. When I&apos;m not at my keyboard, you&apos;ll find me
              sketching UI ideas over coffee or exploring new corners of the
              design world.
            </motion.p>

            {/* Mini info row */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <Coffee className="h-4 w-4 text-primary" />
                Based in Lisbon, PT
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
              <span className="inline-flex items-center gap-2">
                <Rocket className="h-4 w-4 text-fuchsia-500" />
                Open to remote work
              </span>
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} custom={4} className="mt-10">
              <Button asChild size="lg" className="group">
                <Link href="/about">
                  More about me
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
