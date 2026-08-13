"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-trail-950">
      <div className="marketing-sunset-hero absolute inset-0 scale-[1.02]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,20,0.18)_0%,rgba(5,11,20,0.03)_34%,rgba(5,11,20,0.38)_58%,rgba(5,11,20,0.96)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,transparent_0%,rgba(6,16,29,0.18)_48%,rgba(5,11,20,0.64)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-trail-950" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-5 pb-8 pt-28 sm:px-8 lg:px-12 lg:pb-12 lg:pt-36">
        <motion.div
          className="flex items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-100 backdrop-blur-md">
            <MapPin className="h-3 w-3 text-gold-200" />
            Made for Switzerland
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-white/60 sm:block">
            100 carefully researched places
          </span>
        </motion.div>

        <div className="mt-auto grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <div>
            <motion.p
              className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-gold-200"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.08, ease: EASE }}
            >
              A clearer way to explore Switzerland
            </motion.p>
            <motion.h1
              className="max-w-5xl font-heading text-[clamp(3.75rem,8.6vw,8.75rem)] leading-[0.82] tracking-[-0.055em] text-fg"
              initial={reduce ? false : { opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.12, ease: EASE }}
            >
              Find your next
              <br />
              Swiss escape.
            </motion.h1>
          </div>

          <motion.div
            className="max-w-md lg:pb-2"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.25, ease: EASE }}
          >
            <p className="text-base leading-relaxed text-stone-200 sm:text-lg">
              Discover hikes, quiet lakes and viewpoints with real photographs,
              practical details and source links—all in one calm guide.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild variant="gold" size="xl" className="justify-between gap-5 lg:w-full">
                <a href="#solution">
                  See how the guide works
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="xl" className="lg:w-full">
                <a href="#whats-inside">Browse the collection</a>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-300">
              <span className="flex items-center gap-1.5 text-gold-200">
                <BadgeCheck className="h-4 w-4" />
                Sources shown for every place
              </span>
              <span className="h-1 w-1 rounded-full bg-stone-400" />
              <span>CHF 29 once</span>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#solution"
          aria-label="Scroll to discover more"
          className="mt-8 hidden w-fit items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white md:flex"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.8 }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">
            <ArrowDown className="h-3.5 w-3.5" />
          </span>
          Discover the collection
        </motion.a>
        <a
          href="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-8 right-5 hidden text-[10px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-white/80 sm:block lg:right-12"
        >
          Archived hero · Unsplash
        </a>
      </div>
    </section>
  );
}
