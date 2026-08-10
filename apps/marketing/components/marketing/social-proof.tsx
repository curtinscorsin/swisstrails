"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Camera, ExternalLink, SearchCheck, Shield } from "lucide-react";
import { CATALOGUE_METRICS } from "@swiss-trails/types";

const STATS = [
  { value: String(CATALOGUE_METRICS.publishedLocations), label: "Published destinations" },
  { value: String(CATALOGUE_METRICS.creditedPhotographs), label: "Credited location photographs" },
  { value: String(CATALOGUE_METRICS.verifiedAccessPoints), label: "Separately verified access points" },
  {
    value: new Intl.DateTimeFormat("en-CH", { day: "2-digit", month: "2-digit", year: "2-digit" })
      .format(new Date(`${CATALOGUE_METRICS.lastEditorialCheck}T12:00:00Z`)),
    label: "Latest editorial check",
  },
];

const TRUST = [
  { icon: SearchCheck, label: "Federal map references" },
  { icon: ExternalLink, label: "Source links included" },
  { icon: Camera, label: "Location-matched photographs" },
  { icon: Shield, label: "Uncertainty remains visible" },
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
