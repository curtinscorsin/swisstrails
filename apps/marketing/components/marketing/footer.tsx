import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const salesEnabled = process.env.NEXT_PUBLIC_SALES_ENABLED === "true";

  return (
    <footer>
      {/* Final CTA */}
      <div
        className="relative overflow-hidden border-y border-white/[0.08] bg-cover bg-center py-24 text-center lg:py-36"
        style={{
          backgroundImage:
            "url('https://upload.wikimedia.org/wikipedia/commons/4/48/001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg')",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-trail-950/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-trail-950 via-transparent to-trail-950/35" />
        <a
          href="https://commons.wikimedia.org/wiki/File:001_Chateau_de_Chillon_and_Dents_du_Midi_Photo_by_Giles_Laurent.jpg"
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-3 right-4 z-10 text-[10px] text-white/55 hover:text-white"
        >
          Giles Laurent · CC BY-SA 4.0
        </a>
        <div className="relative mx-auto max-w-3xl px-6">
          <p className="t-eyebrow mb-7 text-gold-200">The trail starts here</p>
          <h2 className="font-heading text-[clamp(3.3rem,7vw,7rem)] leading-[0.88] tracking-[-0.045em] text-white">
            Spend less time looking.
            <br />
            <span className="text-white/55">More time out there.</span>
          </h2>
          <p className="mx-auto mb-10 mt-7 max-w-lg text-lg leading-relaxed text-white/70">
            A smaller Swiss collection with authentic imagery, transparent sources
            and practical details that have earned their place.
          </p>
          <Button
            asChild
            variant="gold"
            size="xl"
            className="shadow-xl"
          >
            <a href="#pricing">{salesEnabled ? "Get Swiss Trails — CHF 29" : "View launch status"}</a>
          </Button>
        </div>
      </div>

      {/* Footer links */}
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Logo + description */}
          <div className="flex flex-col gap-3">
            <Link href="/">
              <Logo
                iconClassName="text-gold-300"
                wordmarkClassName="text-fg"
              />
            </Link>
            <p className="text-fg-muted text-sm max-w-xs">
              A curated collection of Swiss places with dated sources,
              authentic photography and transparent uncertainty.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {[
              { label: "About", href: "#solution" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
              { label: "Contact", href: "mailto:hello@swiss-trails.com" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center min-h-[44px] px-1 text-fg-muted hover:text-fg text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-fg-muted text-xs">
            © {currentYear} Swiss Trails. All rights reserved.
          </p>
          <p className="text-fg-muted text-xs">
            Made for curious weekends in Switzerland
          </p>
        </div>
      </div>
    </footer>
  );
}
