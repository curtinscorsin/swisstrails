"use client";

import { useEffect } from "react";

export default function MarketingError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Swiss Trails website error:", error); }, [error]);
  return (
    <main className="flex min-h-dvh items-center justify-center bg-trail-950 px-6 text-center text-fg">
      <div className="max-w-md">
        <h1 className="t-h2">The page could not be loaded.</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">Try again, or contact hello@swiss-trails.com if the problem continues.</p>
        <button onClick={reset} className="mt-6 min-h-11 rounded-full bg-stone-100 px-6 text-sm font-medium text-trail-950">Try again</button>
      </div>
    </main>
  );
}
