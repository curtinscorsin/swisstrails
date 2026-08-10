import Link from "next/link";
import { CloudOff, RefreshCw } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-trail-950 px-5 text-fg">
      <div className="w-full max-w-md text-center">
        <Logo className="mb-10 justify-center" iconClassName="text-alpine-500" wordmarkClassName="text-fg" />
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
          <CloudOff className="h-7 w-7 text-fg-muted" />
        </div>
        <h1 className="t-h2">You&apos;re offline.</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          Swiss Trails does not show cached route status, weather or transport as if
          it were current. Reconnect to open location pages and check official sources.
        </p>
        <Button asChild variant="alpine" size="lg" className="mt-7">
          <Link href="/explore">
            <RefreshCw className="h-4 w-4" /> Try again
          </Link>
        </Button>
      </div>
    </main>
  );
}
