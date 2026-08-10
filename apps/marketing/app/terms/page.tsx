import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LEGAL_DETAILS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing purchase and use of Swiss Trails.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "10 August 2026";

const sections = [
  {
    title: "1. Operator and scope",
    body: [
      `Swiss Trails is operated by ${LEGAL_DETAILS.operatorName}, ${LEGAL_DETAILS.operatorAddress}, ${LEGAL_DETAILS.operatorCountry}. Contact: ${LEGAL_DETAILS.supportEmail}.`,
      "These terms apply to the Swiss Trails website, progressive web app and one-time digital-access purchase. Mandatory rights under applicable law are not excluded.",
    ],
  },
  {
    title: "2. Product and licence",
    body: [
      "A completed one-time purchase grants the purchasing account personal, non-transferable access to the published Swiss Trails collection and later additions made available under the same product. It is not a subscription.",
      "You may use the guide for personal planning. You may not resell, scrape, systematically copy, redistribute or commercially republish its database, writing or presentation. Third-party photographs and sources remain subject to their own credited licences and rights.",
    ],
  },
  {
    title: "3. How a purchase is made",
    body: [
      "Create or sign in to an account, review the product description, price, these terms and the privacy policy, then select Continue to secure payment. Stripe shows the final CHF total and payment details before you submit the order. You can correct payment information before confirmation.",
      "The contract is formed when Stripe confirms successful payment. Access is then activated for the account identified in checkout. A payment confirmation or receipt must be sent to the account email through the configured payment service.",
    ],
  },
  {
    title: "4. Price, access and availability",
    body: [
      "The advertised price is CHF 29 as a one-time payment. The checkout must display the total payable amount, including any non-optional charge, before purchase. No recurring fee is created by this product.",
      "Lifetime access means access for the commercially reasonable lifetime of this Swiss Trails digital product, not the lifetime of a person or a promise that every feature, provider or location will remain unchanged forever. Planned maintenance, security incidents or third-party outages can temporarily affect availability.",
    ],
  },
  {
    title: "5. Voluntary refund promise",
    body: [
      `If you visit three locations and genuinely do not find the guide useful, email ${LEGAL_DETAILS.supportEmail} from the purchasing account and identify the three locations. We will process the advertised full refund through Stripe. This voluntary promise does not reduce any mandatory statutory remedy.`,
      "A refunded purchase normally ends paid access. If only part of a charge is refunded, access remains active unless otherwise agreed.",
    ],
  },
  {
    title: "6. Outdoor information and safety",
    body: [
      "Swiss Trails is a desk-researched planning guide, not proof of personal on-site inspection, a live trail-status service, emergency assistance, professional guiding or a substitute for official maps and instructions.",
      "Weather, snow, water, transport, opening periods, fees, restrictions and closures can change after the stated review date. Check the linked official source and current local conditions immediately before travel. Choose activities within your ability and follow closures, signs and instructions from authorities and operators.",
      "A destination map pin is not automatically a trailhead, parking place, station or safe access point. The product labels separately verified starting points and unresolved access information.",
    ],
  },
  {
    title: "7. Accuracy, corrections and responsibility",
    body: [
      "We aim to publish only supportable information, show uncertainty and correct credible reports. We do not guarantee that changing third-party information is continuously complete or current. Each location provides a correction link.",
      "To the extent permitted by law, Swiss Trails is not responsible for decisions that ignore current official information, closures, weather, personal capability or normal outdoor risks. Nothing here excludes liability that cannot legally be excluded.",
    ],
  },
  {
    title: "8. Accounts, termination and changes",
    body: [
      "Keep access to your sign-in email secure and do not share the account. We may restrict an account for fraud, unlawful use, security threats or material breach after proportionate review.",
      "We may update these terms when the service or law changes. Material changes apply prospectively and will be communicated where appropriate. Questions and notices can be sent to the contact above.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-trail-950 text-fg">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
        <Link href="/" className="mb-12 inline-flex"><Logo iconClassName="text-alpine-500" wordmarkClassName="text-fg" /></Link>
        <p className="t-eyebrow mb-4">Legal</p>
        <h1 className="t-h1 mb-4">Terms of Service</h1>
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
