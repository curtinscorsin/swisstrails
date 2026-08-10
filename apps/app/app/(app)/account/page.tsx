import Link from "next/link";
import { Download, ExternalLink, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const deletionSubject = encodeURIComponent("Swiss Trails account deletion request");
  const deletionBody = encodeURIComponent(
    "Please delete my Swiss Trails account and personal data. I am sending this request from the email address used for my account. Please tell me if any purchase record must be retained by law."
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))] lg:px-6 lg:pt-8">
        <p className="t-eyebrow">Account &amp; privacy</p>
        <h1 className="t-h2 mt-2 text-fg">Your information, under your control.</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
          Download the account data stored on our servers, review the legal documents,
          or request deletion. Browser-only trip and visit history can be cleared by
          removing this site&apos;s data in your browser settings.
        </p>

        <div className="mt-8 space-y-4">
          <section className="card-solid rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Download className="mt-0.5 h-5 w-5 text-alpine-400" />
              <div className="flex-1">
                <h2 className="text-base font-semibold text-fg">Download your data</h2>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                  Receive a JSON file—a simple structured text file—with your profile,
                  saved locations and purchase history.
                </p>
                <Button asChild variant="outline" size="md" className="mt-4">
                  <a href="/api/account/export" download>
                    <Download className="h-4 w-4" /> Download account data
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <section className="card-solid rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-amber-300" />
              <div className="flex-1">
                <h2 className="text-base font-semibold text-fg">Request account deletion</h2>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                  Deletion is reviewed so payment records that must legally be retained
                  are not accidentally destroyed. Send the request from your account email.
                </p>
                <Button asChild variant="outline" size="md" className="mt-4">
                  <a href={`mailto:hello@swiss-trails.com?subject=${deletionSubject}&body=${deletionBody}`}>
                    <Mail className="h-4 w-4" /> Request deletion
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.07] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-fg-muted" />
              <div>
                <h2 className="text-base font-semibold text-fg">Legal documents</h2>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link href="https://swiss-trails.com/privacy" className="inline-flex items-center gap-1 text-alpine-300 hover:text-alpine-200">
                    Privacy Policy <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="https://swiss-trails.com/terms" className="inline-flex items-center gap-1 text-alpine-300 hover:text-alpine-200">
                    Terms <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
