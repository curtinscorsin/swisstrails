import { categoryConfig, cn, regionConfig } from "@/lib/utils";
import type { Location } from "@/types";

interface LocationImageFallbackProps {
  location: Location;
  className?: string;
  compact?: boolean;
}

/**
 * Honest fallback for destinations without a verified photograph.
 * It keeps cards visually finished without pretending a generic landscape is
 * the named place.
 */
export function LocationImageFallback({
  location,
  className,
  compact = false,
}: LocationImageFallbackProps) {
  const category = categoryConfig[location.category];

  return (
    <div
      role="img"
      aria-label={`No verified photograph available for ${location.name}`}
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden bg-trail-900",
        className
      )}
      style={{
        backgroundImage: [
          `radial-gradient(circle at 22% 18%, ${category.color}38, transparent 38%)`,
          "linear-gradient(145deg, #20251f 0%, #10130f 52%, #080a08 100%)",
        ].join(", "),
      }}
    >
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(120deg,transparent_35%,white_35%,white_35.5%,transparent_35.5%,transparent_58%,white_58%,white_58.4%,transparent_58.4%)]" />
      <div className="relative flex flex-col items-center text-center">
        <span className={cn("drop-shadow-lg", compact ? "text-xl" : "text-3xl")}>
          {category.emoji}
        </span>
        {!compact && (
          <>
            <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
              {category.label}
            </span>
            <span className="mt-1 text-[10px] text-white/40">
              {regionConfig[location.region].label}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
