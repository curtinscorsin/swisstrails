"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/shared/reveal";
import { CATEGORIES } from "@/data/categories";
import {
  ArrowRight,
  Droplets, MountainSnow, Waves, Camera
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "hidden-lake": Droplets,
  "viewpoint": MountainSnow,
  "waterfall": Waves,
  "photo-spot": Camera,
};

const CATEGORY_IMAGES: Record<string, { url: string; credit: string; source: string }> = {
  "hidden-lake": {
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/20190725_Oeschinensee-Panorama%2C_Kandersteg_%2806540-42_stitch%29.jpg",
    credit: "G. Seggebäing · CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:20190725_Oeschinensee-Panorama,_Kandersteg_(06540-42_stitch).jpg",
  },
  viewpoint: {
    url: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Alps_of_Switzerland_Landwasserviadukt_%2824402116421%29.jpg",
    credit: "kuhnmi · CC BY 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Alps_of_Switzerland_Landwasserviadukt_(24402116421).jpg",
  },
  waterfall: {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Chutes_du_Rhin_-_Octobre_2021.jpg",
    credit: "Christian David · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Chutes_du_Rhin_-_Octobre_2021.jpg",
  },
  "photo-spot": {
    url: "https://upload.wikimedia.org/wikipedia/commons/4/48/001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg",
    credit: "Giles Laurent · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg",
  },
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
              From a mountain lake to a city landmark, the collection is organised
              around the kind of place you want to understand and visit.
            </p>
          </Reveal>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CATEGORIES.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.id] ?? Droplets;
            const photo = CATEGORY_IMAGES[cat.id];
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
                  style={{ backgroundImage: `url('${photo.url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/90" />
                <a
                  href={photo.source}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-3 top-3 z-10 rounded-full bg-black/35 px-2 py-1 text-[9px] text-white/65 backdrop-blur-md hover:text-white"
                >
                  {photo.credit}
                </a>

                <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/25 backdrop-blur-md">
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <span className="font-mono text-xs text-white/70">
                      {cat.count} {cat.count === 1 ? "place" : "places"}
                    </span>
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
              The review queue grows only when a place has reliable sources and an authentic photograph.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
