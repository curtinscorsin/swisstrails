"use client";

import { motion } from "framer-motion";
import { useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/shared/reveal";

const PAIN_POINTS = [
  {
    title: "Same places, every weekend",
    body: "Interlaken again? The Instagram crowd? You know Switzerland is incredible — but somehow you end up in the same ten spots every summer.",
  },
  {
    title: "Summer slipping away",
    body: "June turns to September in a blink. How many weekends did you actually remember? How many times did you say 'I'll go next weekend'?",
  },
  {
    title: "Hours of research, no results",
    body: "Down the rabbit hole of blog posts, Reddit threads, and half-baked Google Maps lists. You spend more time researching than actually going.",
  },
  {
    title: "Missing the places worth finding",
    body: "The spots that become stories — the ones you talk about years later — are never the ones you stumble across. They take insider knowledge.",
  },
];

export function ProblemSection() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="problem" className="relative scroll-mt-20 overflow-hidden py-24 lg:scroll-mt-24 lg:py-40">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 grid gap-6 lg:mb-24 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
          <Reveal>
            <p className="t-eyebrow mb-5">Why Swiss Trails</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="t-h1 mb-6 text-fg">
              Switzerland is vast.
              <br />
              <span className="text-stone-500">Free time is not.</span>
            </h2>
          </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-lg text-lg leading-relaxed text-fg-muted lg:justify-self-end">
              Good weekends should not begin with three hours of tabs, vague pins and
              crowded “secret” spots. We did the scouting so you can simply go.
            </p>
          </Reveal>
        </div>

        {/* Pain point grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 border-t border-white/10 md:grid-cols-2"
        >
          {PAIN_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              className="group border-b border-white/10 px-0 py-8 md:px-8 md:odd:pl-0 md:even:border-l md:even:pr-0 lg:py-10"
              initial={reduce ? false : { opacity: 0, y: 32 }}
              animate={reduce || isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: reduce ? 0 : 0.65,
                delay: reduce ? 0 : 0.1 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="mb-7 block font-mono text-xs tracking-[0.18em] text-gold-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading text-3xl leading-none text-fg">{point.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted">{point.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Stat callout */}
        <Reveal delay={0.5}>
          <div className="mt-16 grid gap-6 rounded-[24px] border border-white/10 bg-stone-50 p-7 text-trail-950 sm:grid-cols-[1fr_auto] sm:items-center lg:p-10">
            <p className="font-heading text-3xl leading-[1.02] sm:text-4xl">
              500+ researched places.
              <span className="text-stone-600"> One calm decision.</span>
            </p>
            <p className="text-sm text-stone-600 sm:text-right">
              CHF 29 once
              <br />
              Lifetime access
            </p>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />
    </section>
  );
}
