"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Swiss Trails page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-trail-950 px-5 text-center text-fg">
      <div className="max-w-md">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-300" />
        <h1 className="t-h2 mt-5">This page could not be opened.</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          Try once more. If the problem continues, email hello@swiss-trails.com
          and include what you were trying to open.
        </p>
        <Button variant="alpine" size="lg" className="mt-6" onClick={reset}>
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      </div>
    </main>
  );
}
