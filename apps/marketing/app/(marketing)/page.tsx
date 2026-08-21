import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { FounderNote } from "@/components/marketing/founder-note";
import { SocialProof } from "@/components/marketing/social-proof";
import { SolutionSection } from "@/components/marketing/solution-section";
import { WhatsIncluded } from "@/components/marketing/whats-included";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <FounderNote />
      <SolutionSection />
      <WhatsIncluded />
      <SocialProof />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
