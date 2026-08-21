import Image from "next/image";
import { ArrowUpRight, Camera, MapPinned, SearchCheck } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

const PRINCIPLES = [
  {
    icon: SearchCheck,
    title: "Show the source",
    body: "Names, map points and practical claims should lead back to something you can check yourself.",
  },
  {
    icon: MapPinned,
    title: "Leave honest gaps",
    body: "A destination pin is not automatically a trailhead. If a detail is unresolved, I say so instead of filling the space.",
  },
  {
    icon: Camera,
    title: "Make it more personal",
    body: "As I revisit places, I’ll add my own photographs and field notes alongside the licensed location imagery already in the guide.",
  },
];

export function FounderNote() {
  return (
    <section id="about-corsin" className="scroll-mt-20 border-b border-white/[0.08] bg-trail-950 py-20 lg:scroll-mt-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="t-eyebrow mb-5">A note from the founder</p>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/[0.04]">
                <Image
                  src="/images/founder/corsin-sunrise-portrait.jpg"
                  alt="Corsin Curtins outdoors in the Swiss mountains at sunrise"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover object-[48%_center]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-trail-950 via-trail-950/70 to-transparent px-5 pb-5 pt-20">
                  <p className="font-medium text-fg">Corsin Curtins</p>
                  <p className="mt-0.5 text-sm text-stone-300">19 · Swiss creator and editor</p>
                </div>
              </div>
              <a
                href="mailto:hello@swiss-trails.com"
                className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm text-gold-200 transition-colors hover:text-gold-100"
              >
                Write to me
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              <h2 className="max-w-4xl font-heading text-[clamp(2.8rem,5.4vw,5.8rem)] leading-[0.94] tracking-[-0.04em] text-fg">
                I’m 19, Swiss, and building the outdoor guide I wanted to have.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                <p>
                  I’m Corsin Curtins, the creator and editor of Swiss Trails. I started this project because I love being outside, but I kept finding beautiful places online with photographs that did not match, vague map pins or practical details I could not trust.
                </p>
                <p>
                  My goal is simple: build a smaller Swiss guide that is genuinely useful. I would rather publish 100 carefully presented places than fill a database with 500 vague ones. I keep original sources visible, record when information was checked and leave uncertain details clearly marked.
                </p>
                <p>
                  I’m still learning and improving the guide place by place. These photographs show me outdoors, but they are not a claim that I have personally walked every route in the catalogue. If you notice something that has changed, you can write directly to me.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <Reveal delay={0.16}>
                <figure className="overflow-hidden rounded-xl bg-white/[0.04]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/images/founder/corsin-schaefler-trail.jpg"
                      alt="Corsin Curtins on the trail below Schäfler in the Alpstein"
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-4 py-3 text-xs leading-relaxed text-fg-muted">
                    On the trail below Schäfler in the Alpstein.
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.22}>
                <figure className="mt-10 overflow-hidden rounded-xl bg-white/[0.04]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/images/founder/corsin-alpstein-dawn.jpg"
                      alt="Corsin Curtins walking at an Alpstein viewpoint before sunrise"
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover object-[54%_center]"
                    />
                  </div>
                  <figcaption className="px-4 py-3 text-xs leading-relaxed text-fg-muted">
                    An early start above the Alpstein.
                  </figcaption>
                </figure>
              </Reveal>
            </div>

            <div className="mt-12 grid border-t border-white/10 md:grid-cols-3">
              {PRINCIPLES.map(({ icon: Icon, title, body }, index) => (
                <Reveal key={title} delay={0.18 + index * 0.06}>
                  <div className="border-b border-white/10 py-7 md:min-h-64 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                    <Icon className="h-5 w-5 text-gold-200" />
                    <h3 className="mt-8 text-base font-medium text-fg">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
