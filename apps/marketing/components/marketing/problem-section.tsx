"use client";

import { motion } from "framer-motion";
import { useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/shared/reveal";

const PAIN_POINTS = [
  {
    title: "A pin without context",
    body: "A destination coordinate is not necessarily a trail start, station or car park. Treating them as the same point creates avoidable confusion.",
  },
  {
    title: "Details change",
    body: "Opening periods, transport, permits, fees and closures can change. Useful entries need dated sources and clear reminders to recheck.",
  },
  {
    title: "Generic images mislead",
    body: "A beautiful landscape photograph is not evidence that it shows the named place. Every published image should have an identifiable subject and licence.",
  },
  {
    title: "Volume hides uncertainty",
    body: "A large catalogue can look impressive while repeating estimates and weak matches. Unverified fields are more honest when left blank or unpublished.",
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
              generic photographs. We record what is known—and say what still is not.
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
              One hundred places, clearly sourced.
              <span className="text-stone-600"> Unknown details stay visible.</span>
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
