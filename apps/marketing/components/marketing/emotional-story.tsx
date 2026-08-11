"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/shared/reveal";

const MOMENTS = [
  "The first view across the water",
  "The detail you only notice on foot",
  "The route you can plan with confidence",
];

export function EmotionalStory() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[85svh] overflow-hidden border-y border-white/[0.08]">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/commons/9/91/Old_City_and_the_Aare_river_-_Bern%2C_Switzerland_-_panoramio.jpg')",
        }}
        initial={reduce ? false : { scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduce ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <a
        href="https://commons.wikimedia.org/wiki/File:Old_City_and_the_Aare_river_-_Bern,_Switzerland_-_panoramio.jpg"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 right-4 z-10 text-[10px] text-white/55 hover:text-white"
      >
        Sergey Ashmarin · CC BY-SA 3.0
      </a>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,20,0.9)_0%,rgba(6,17,30,0.62)_48%,rgba(7,20,35,0.22)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-trail-950/70 via-transparent to-trail-950/20" />

      <div className="relative mx-auto flex min-h-[85svh] max-w-[1440px] items-center px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="max-w-3xl">
          <Reveal>
            <p className="t-eyebrow mb-7 text-gold-200">The reason to go</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-heading text-[clamp(3.2rem,7vw,7rem)] leading-[0.88] tracking-[-0.045em] text-white">
              Collect stories,
              <br />
              not bookmarks.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/72">
              A useful guide should do more than collect pins. It should help you understand
              where a place is, how a visit begins and which details still need checking.
            </p>
          </Reveal>

          <div className="mt-12 max-w-xl divide-y divide-white/15 border-y border-white/15">
            {MOMENTS.map((moment, index) => (
              <Reveal key={moment} delay={0.22 + index * 0.08} direction="left">
                <div className="grid grid-cols-[34px_1fr] gap-4 py-4 text-white">
                  <span className="font-mono text-xs text-gold-200">0{index + 1}</span>
                  <p className="text-sm sm:text-base">{moment}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
