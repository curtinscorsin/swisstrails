import Link from "next/link";
import { Compass, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Temporarily unavailable",
  robots: { index: false, follow: false },
};

export default function ServiceUnavailablePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-trail-950 px-5 text-fg">
      <section className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 text-center shadow-2xl sm:p-10">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-alpine-500/10 text-alpine-300">
          <Compass className="h-6 w-6" aria-hidden />
        </span>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-alpine-300">
          Swiss Trails
        </p>
        <h1 className="mt-2 font-heading text-3xl text-white sm:text-4xl">
          The trail guide is temporarily unavailable.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone-400">
          Production configuration is being completed. No payment has been taken.
          Please try again shortly.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-alpine-500 px-5 text-sm font-semibold text-trail-950 transition-colors hover:bg-alpine-400"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </Link>
          <a
            href="https://www.swiss-trails.com"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/[0.1] px-5 text-sm font-medium text-stone-300 transition-colors hover:bg-white/[0.06]"
          >
            Visit the website
          </a>
        </div>
      </section>
    </main>
  );
}
