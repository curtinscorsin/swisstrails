"use client";

import { Reveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATALOGUE_METRICS } from "@swiss-trails/types";

const FAQ_ITEMS = [
  {
    q: "What exactly do I get?",
    a: `You get access to ${CATALOGUE_METRICS.publishedLocations} Swiss destination pages. Every page includes a sourced map record and uncertainty labels. The catalogue currently contains ${CATALOGUE_METRICS.creditedPhotographs} credited, location-linked photographs; ${CATALOGUE_METRICS.locationsWithThreePhotographs} destinations have galleries of at least three. ${CATALOGUE_METRICS.placeholderLocations} use an honest branded placeholder until a suitable image is approved.`,
  },
  {
    q: "Is this really a one-time payment?",
    a: "Yes. CHF 29 once, access forever. Future locations that complete the manual review are included without an additional charge. We do not promise a monthly quantity because accuracy comes first.",
  },
  {
    q: "Do I need special equipment or experience?",
    a: "Requirements differ by place. Each entry records the verified access effort, relevant accessibility limits, safety notes and what to bring. Recheck its linked official source and current conditions before travelling.",
  },
  {
    q: "Can I use this on my phone?",
    a: "Yes. Swiss Trails is built mobile-first for iOS and Android browsers and can be added to your home screen. An internet connection is currently required for live maps, weather, source links and full location pages; the app shows a clear offline screen instead of stale planning information.",
  },
  {
    q: "What if I don't have a car?",
    a: "Public-transport and parking details appear only where they have been independently checked. Other pages say that the information is unresolved and direct you to current official planning information instead of estimating it.",
  },
  {
    q: "How is this different from a regular hiking app?",
    a: "Swiss Trails is a curated place guide, not a fitness tracker and not a claim of personal on-site verification. It brings together map references, official visitor information and licensed photography in one consistent format.",
  },
  {
    q: "What's your refund policy?",
    a: "Request a full refund within 14 calendar days of purchase by emailing us from the purchasing account. No reason is required. We may ask optional feedback so we can improve, but answering is not a condition of the refund.",
  },
  {
    q: "Are you adding more locations?",
    a: "Yes, but there is no quota. Identity and the published destination map point require a source record. Route, access, rules and photography are added only when separately supported; anything unresolved stays visibly labelled rather than being guessed.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 lg:py-36 scroll-mt-20 lg:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="t-eyebrow mb-4">FAQ</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="t-h1 mb-6">
                Questions?
                <br />
                <span className="text-stone-500">Answered.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="t-body text-fg-muted max-w-sm">
                Everything you need to know before unlocking your best Swiss summer.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 p-6 card-solid rounded-xl">
                <p className="text-fg font-medium mb-2">Still have a question?</p>
                <p className="text-fg-muted text-sm mb-4">
                  Reach us at{" "}
                  <a
                    href="mailto:hello@swiss-trails.com"
                    className="text-alpine-400 hover:underline"
                  >
                    hello@swiss-trails.com
                  </a>
                </p>
                <p className="text-fg-subtle text-xs">Questions and corrections are welcome.</p>
              </div>
            </Reveal>
          </div>

          {/* Right: accordion */}
          <Reveal delay={0.2} direction="none">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
