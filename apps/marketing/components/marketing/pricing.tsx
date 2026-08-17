"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Zap, Shield } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PRICING } from "@/data/categories";
import { APP_URL } from "@/lib/config";

export function Pricing() {
  const reduce = useReducedMotion();
  const salesEnabled = process.env.NEXT_PUBLIC_SALES_ENABLED === "true";
  return (
    <section id="pricing" className="relative scroll-mt-20 overflow-hidden py-24 lg:scroll-mt-24 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <p className="t-eyebrow mb-5">Lifetime access</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="t-h1 mb-4">
              One small payment.
              <br />
              <span className="text-stone-500">A very large Switzerland.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="t-body text-fg-muted max-w-md mx-auto">
              No subscription, upgrade tier or recurring charge. Buy the guide once
              and every future source-checked location is included too.
            </p>
          </Reveal>
        </div>

        {/* Pricing card */}
        <div className="max-w-lg mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-stone-50 text-trail-950 shadow-xl"
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top gradient bar */}
            <div className="p-7 sm:p-9 lg:p-10">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/60 px-3 py-1.5">
                <Zap className="h-3 w-3 text-alpine-700" />
                <span className="text-xs font-medium text-stone-700">Instant access · lifetime updates</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl text-stone-500">CHF</span>
                  <span className="font-heading text-7xl leading-none tracking-[-0.04em] text-trail-950 lg:text-8xl">
                    {PRICING.amount}
                  </span>
                </div>
                <p className="mt-3 text-sm text-stone-600">
                  One-time payment · Access for life
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {PRICING.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-alpine-700" />
                    </div>
                    <span className="t-sm text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {salesEnabled ? (
                <Button asChild variant="gold" size="xl" className="w-full bg-trail-950 text-stone-50 shadow-none hover:bg-trail-800">
                  <a href={`${APP_URL}/checkout`}>Get lifetime access — CHF 29</a>
                </Button>
              ) : (
                <Button variant="gold" size="xl" className="w-full bg-trail-950 text-stone-50 shadow-none" disabled>
                  Sales opening soon
                </Button>
              )}

              {/* Reassurance */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <Shield className="h-3.5 w-3.5 text-stone-500" />
                <p className="text-center text-xs text-stone-500">
                  {salesEnabled
                    ? "Secured by Stripe · 14-day voluntary refund policy"
                    : "Checkout stays closed until the production and legal review is complete"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Editorial promise under card */}
          <Reveal delay={0.3}>
            <p className="mt-7 text-center text-sm text-fg-muted">
              <span className="text-stone-200">No invented detail:</span> uncertainty stays visible
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
