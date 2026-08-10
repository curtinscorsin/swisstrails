import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LEGAL_DETAILS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Swiss Trails collects, uses, shares and protects personal data.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "10 August 2026";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Controller and contact",
      body: [
        `${LEGAL_DETAILS.operatorName}, ${LEGAL_DETAILS.operatorAddress}, ${LEGAL_DETAILS.operatorCountry}, is responsible for the personal data described here. Privacy and data-rights requests can be sent to ${LEGAL_DETAILS.supportEmail}.`,
        !LEGAL_DETAILS.complete
          ? "Sales remain disabled until the operator's complete legal identity and postal address are published."
          : "This policy applies to swiss-trails.com and app.swiss-trails.com.",
      ],
    },
    {
      title: "2. Data we process and why",
      body: [
        "Account data includes your email address, optional name and avatar, authentication session, purchase status and account timestamps. We use it to authenticate you, deliver purchased access, provide support and secure the service.",
        "Product data includes saved location identifiers. Trip plans, visited places, map preference and some reactions are stored locally in your browser and are not automatically transferred to Swiss Trails.",
        "Technical requests may include IP address, device/browser information, requested pages, timestamps and security logs. These are used to deliver, protect and troubleshoot the service. Swiss Trails does not currently run advertising trackers or behavioural analytics in this codebase.",
      ],
    },
    {
      title: "3. Service providers",
      body: [
        "Supabase provides account authentication and database hosting. Stripe processes checkout, payment and refunds; Swiss Trails does not receive your full card number. Vercel hosts and delivers the websites.",
        "Mapbox supplies map tiles and driving-route requests. Open-Meteo supplies weather requests. Wikimedia Commons and, on the marketing hero, Unsplash deliver credited imagery. Requests to these services can disclose your IP address and the resource or coordinates requested to that provider.",
        "Providers may process data outside Switzerland. Their contractual and legal safeguards apply alongside Swiss data-protection requirements and, where applicable, European data-protection law.",
      ],
    },
    {
      title: "4. Cookies and device storage",
      body: [
        "Supabase uses essential session storage or cookies to keep you signed in securely. Swiss Trails uses browser storage for favourites, trips, visited-place history, reactions and preferences. These are functional features, not advertising cookies.",
        "You can clear browser-stored data through your browser settings. Blocking essential session storage prevents signed-in features from working.",
      ],
    },
    {
      title: "5. Retention and security",
      body: [
        "Account data is kept while the account is active. On a valid deletion request, personal account data is deleted or anonymised unless a limited record must be retained for payment, accounting, fraud prevention or another legal obligation.",
        "We use HTTPS, server-only secret keys, account-level database rules and restricted administrator access. No online service can promise absolute security; confirmed incidents affecting personal data are handled under applicable law.",
      ],
    },
    {
      title: "6. Your choices and rights",
      body: [
        "You can download a structured copy of server-held account data from Account & Privacy inside the app. You may also request access, correction, deletion, restriction or another right available under applicable law by emailing us from your account address.",
        "If you believe a request was not handled appropriately, you may contact the competent data-protection authority, including the Swiss Federal Data Protection and Information Commissioner where applicable.",
      ],
    },
    {
      title: "7. Changes",
      body: [
        "We update this policy when the product or its providers change. The date above identifies the current version; material changes will be communicated through the service where appropriate.",
      ],
    },
  ];

  return <LegalPage title="Privacy Policy" sections={sections} />;
}

function LegalPage({ title, sections }: { title: string; sections: Array<{ title: string; body: string[] }> }) {
  return (
    <main className="min-h-screen bg-trail-950 text-fg">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
        <Link href="/" className="mb-12 inline-flex"><Logo iconClassName="text-alpine-500" wordmarkClassName="text-fg" /></Link>
        <p className="t-eyebrow mb-4">Legal</p>
        <h1 className="t-h1 mb-4">{title}</h1>
        <p className="mb-12 text-sm text-fg-muted">Last updated: {LAST_UPDATED}</p>
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="t-h4 mb-3 text-fg">{section.title}</h2>
              {section.body.map((paragraph) => <p key={paragraph} className="t-body mb-3 leading-relaxed text-fg-muted last:mb-0">{paragraph}</p>)}
            </section>
          ))}
        </div>
        <div className="mt-16 border-t border-white/[0.06] pt-8"><Link href="/" className="text-sm text-alpine-400 hover:underline">← Back to Swiss Trails</Link></div>
      </div>
    </main>
  );
}
