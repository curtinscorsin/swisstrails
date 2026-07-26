"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/shared/reveal";
import { CATEGORIES } from "@/data/categories";
import {
  ArrowRight,
  Droplets, MountainSnow, Waves, Sunset,
  Layers, Moon, Car, Camera
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "hidden-lake": Droplets,
  "viewpoint": MountainSnow,
  "waterfall": Waves,
  "sunset-spot": Sunset,
  "gorge": Layers,
  "night-sky": Moon,
  "road-trip": Car,
  "photo-spot": Camera,
};

const CATEGORY_IMAGES: Record<string, string> = {
  "hidden-lake": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=82",
  viewpoint: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1000&q=82",
  waterfall: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=82",
  "sunset-spot": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=82",
  gorge: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1000&q=82",
  "night-sky": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=82",
  "road-trip": "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1000&q=82",
  "photo-spot": "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=1000&q=82",
};

export function WhatsIncluded() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="whats-inside" className="scroll-mt-20 py-24 lg:scroll-mt-24 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <Reveal>
              <p className="t-eyebrow mb-5">Choose your landscape</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="t-h1">
                A different Switzerland,
                <br />
                <span className="text-stone-500">every weekend.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="t-body text-fg-muted max-w-md">
              From a dawn swim to a high-alpine sunset, the collection is organised
              around how you want the day to feel.
            </p>
          </Reveal>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CATEGORIES.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.id] ?? Droplets;
            return (
              <motion.div
                key={cat.id}
                className="group relative min-h-[390px] overflow-hidden rounded-[22px] border border-white/10 bg-trail-900 shadow-md"
                initial={reduce ? false : { opacity: 0, y: 32 }}
                animate={reduce || isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: reduce ? 0 : 0.6,
                  delay: reduce ? 0 : 0.05 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ backgroundImage: `url('${CATEGORY_IMAGES[cat.id]}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/90" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/25 backdrop-blur-md">
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <span className="font-mono text-xs text-white/70">{cat.count} places</span>
                  </div>
                  <h3 className="font-heading text-3xl leading-none text-white">{cat.name}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/70">{cat.description}</p>

                  <div className="mt-5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-gold-200 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    <span>Open collection</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-sm text-fg-muted">
              New field notes and locations are added regularly — always included in lifetime access.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
