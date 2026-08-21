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
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="t-eyebrow mb-5">A note from the founder</p>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-200/30 bg-gold-200/10 font-heading text-xl text-gold-100">
                  CC
                </span>
                <div>
                  <p className="font-medium text-fg">Corsin Curtins</p>
                  <p className="mt-0.5 text-sm text-fg-muted">Founder and editor, Swiss Trails</p>
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
                I would rather share 100 useful places than 500 vague ones.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                <p>
                  I’m building Swiss Trails because a beautiful photograph and a pin are not enough to plan a day outside. The image, place name, route and access information need to belong together.
                </p>
                <p>
                  This is an independent guide, edited place by place. I keep original sources visible, record when information was checked and leave uncertain details clearly marked. It is not a claim that I have personally walked every route.
                </p>
              </div>
            </Reveal>

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
