import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-trail-950 px-5 text-center text-fg">
      <div className="max-w-md">
        <MapPinOff className="mx-auto h-8 w-8 text-fg-muted" />
        <h1 className="t-h2 mt-5">Location not found.</h1>
        <p className="mt-3 text-sm text-fg-muted">
          This link may be outdated, or the destination is not part of the published collection.
        </p>
        <Button asChild variant="alpine" size="lg" className="mt-6">
          <Link href="/explore">Return to Explore</Link>
        </Button>
      </div>
    </main>
  );
}
