"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Camera, ExternalLink, SearchCheck, Shield } from "lucide-react";

const STATS = [
  { value: "8", label: "Published places" },
  { value: "8", label: "Authentic licensed photographs" },
  { value: "92", label: "Hidden while under review" },
  { value: "09.08.26", label: "Latest editorial check" },
];

const TRUST = [
  { icon: SearchCheck, label: "Federal map references" },
  { icon: ExternalLink, label: "Source links included" },
  { icon: Camera, label: "Location-matched photographs" },
  { icon: Shield, label: "Uncertain data stays unpublished" },
];

export function SocialProof() {
  const reduce = useReducedMotion();

  return (
    <section id="stats" className="scroll-mt-20 bg-stone-50 text-trail-950 lg:scroll-mt-24">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="border-stone-200 px-4 first:pl-0 even:border-l lg:border-l lg:first:border-l-0 lg:last:pr-0"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : index * 0.07 }}
            >
              <p className="font-heading text-4xl leading-none tracking-[-0.03em] lg:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-stone-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-stone-200 pt-7 lg:justify-between">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-stone-600">
              <Icon className="h-3.5 w-3.5 text-alpine-700" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
