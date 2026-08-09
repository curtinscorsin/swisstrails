"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, MapPin, Navigation, Search, Smartphone } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const FEATURES = [
  {
    icon: MapPin,
    title: "Source-recorded places",
    body: "Destination coordinates, access points, season and practical details with their sources.",
  },
  {
    icon: Search,
    title: "Find the right day out",
    body: "Filter by region, difficulty, season and the kind of landscape you want to experience.",
  },
  {
    icon: Heart,
    title: "Build your own Switzerland",
    body: "Save favourites, collect visited places and shape them into a weekend itinerary.",
  },
  {
    icon: Smartphone,
    title: "Ready on the trail",
    body: "A focused mobile experience you can add to your home screen for one-tap access.",
  },
];

export function SolutionSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="solution"
      className="scroll-mt-20 border-y border-white/[0.07] bg-trail-900 py-24 lg:scroll-mt-24 lg:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-24">
          <div>
            <Reveal>
              <p className="t-eyebrow mb-5">The guide</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="t-h1 max-w-xl text-fg">
                Less planning.
                <br />
                <span className="text-stone-500">More outside.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-fg-muted">
                Swiss Trails brings official visitor information, federal map references
                and licensed photography into one calm, clearly organised guide.
              </p>
            </Reveal>

            <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delay={0.08 * index} direction="left">
                  <div className="grid grid-cols-[42px_1fr] gap-4 py-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">
                      <feature.icon className="h-4 w-4 text-alpine-300" />
                    </span>
                    <div>
                      <h3 className="text-base font-medium text-fg">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">{feature.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <motion.div
            className="relative min-h-[560px] overflow-hidden rounded-[28px] border border-white/10 bg-trail-800 shadow-xl sm:min-h-[680px]"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reduce ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.025]"
              style={{
                backgroundImage:
                  "url('https://upload.wikimedia.org/wikipedia/commons/0/0f/20190725_Oeschinensee-Panorama%2C_Kandersteg_%2806540-42_stitch%29.jpg')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80" />

            <div className="absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
              <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-lg">
                Check current status
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-lg">
                <Heart className="h-4 w-4" />
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-5 rounded-[22px] border border-white/15 bg-trail-950/82 p-5 backdrop-blur-2xl sm:inset-x-8 sm:bottom-8 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-alpine-300">
                    Bern · Moderate access
                  </p>
                  <h3 className="mt-2 font-heading text-3xl leading-none text-fg sm:text-4xl">
                    Oeschinensee
                  </h3>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-200 text-trail-950">
                  <Navigation className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-sm">
                <div>
                  <p className="text-stone-500">Upper path</p>
                  <p className="mt-1 text-fg">30 min</p>
                </div>
                <div>
                  <p className="text-stone-500">Elevation</p>
                  <p className="mt-1 text-fg">1,578 m</p>
                </div>
                <div>
                  <p className="text-stone-500">Map point</p>
                  <p className="mt-1 text-fg">Lake centre</p>
                </div>
              </div>
            </div>
            <a
              href="https://commons.wikimedia.org/wiki/File:20190725_Oeschinensee-Panorama,_Kandersteg_(06540-42_stitch).jpg"
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2 right-3 text-[10px] text-white/55 hover:text-white"
            >
              Günter Seggebäing · CC BY-SA 3.0
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
