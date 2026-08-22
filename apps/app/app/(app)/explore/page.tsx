"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, BadgeCheck, Clock, Gauge, Ruler, Search, SlidersHorizontal, X } from "lucide-react";
import { useMapStore } from "@/store/map-store";
import { useGeoStore } from "@/store/geo-store";
import { CURATED_LOCATIONS } from "@/data/curated-locations";
import { filterLocations, countActiveFilters } from "@/lib/filters";
import { sortLocations, type SortMode } from "@/lib/sort";
import { FilterDrawer } from "@/components/app/filter-drawer";
import { SortControl } from "@/components/app/sort-control";
import { LocationDetailSheet } from "@/components/app/location-detail-sheet";
import { ResolvedLocationPhoto } from "@/components/app/location-photo";
import { TripPill } from "@/components/app/trip-pill";
import { regionConfig, difficultyConfig, formatDuration, cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";
import type { Location } from "@/types";
import { CATALOGUE_METRICS } from "@swiss-trails/types";

// Infinite-scroll page size for the gallery — keeps the DOM light and avoids
// mounting every card (and fetching its images) up front, which would
// fetch destination photos the user may never scroll to.
const MASONRY_PAGE = 24;

export default function ExplorePage() {
  const { searchQuery, setSearchQuery, activeFilters, clearFilters } = useMapStore();
  const userPosition = useGeoStore((s) => s.position);
  const [showFilters, setShowFilters] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const catalogueReviewDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${CATALOGUE_METRICS.lastEditorialCheck}T12:00:00Z`));

  const filteredLocations = useMemo(
    () =>
      sortLocations(
        filterLocations(CURATED_LOCATIONS, searchQuery, activeFilters),
        sortMode,
        userPosition
      ),
    [searchQuery, activeFilters, sortMode, userPosition]
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(activeFilters),
    [activeFilters]
  );

  // Continuous loading: render a window of cards and grow it as the user nears
  // the end, so larger future curated releases remain lightweight.
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(MASONRY_PAGE);

  // Reset the window (and scroll to top) whenever the result set changes.
  // behavior:"auto" overrides the global smooth-scroll so filtering doesn't
  // animate a long rewind on every keystroke.
  useEffect(() => {
    setVisibleCount(MASONRY_PAGE);
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [filteredLocations]);

  // Grow the window when the sentinel nears view. Rooted on the inner scroll
  // container since the document itself is locked on tab routes.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + MASONRY_PAGE, filteredLocations.length));
        }
      },
      { root: scrollRef.current, rootMargin: "800px 0px" }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [filteredLocations.length]);

  const visibleLocations = filteredLocations.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLocations.length;

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="z-20 flex-shrink-0 border-b border-white/[0.07] bg-trail-950/92 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-2xl sm:px-5 lg:px-7 lg:pb-4 lg:pt-5">
        <div className="mb-5 hidden items-end justify-between lg:flex">
          <div>
            <p className="t-eyebrow mb-2 text-alpine-200">Explore Switzerland</p>
            <h1 className="font-heading text-[2.65rem] leading-none text-white">Places worth the walk.</h1>
          </div>
          <p className="max-w-md text-right text-sm leading-relaxed text-white/60">
            A personal collection of lakes, ridges and quiet viewpoints, with the practical details beside every photograph.
          </p>
        </div>
        <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
          <input
            type="search"
            placeholder="Search lakes, regions, viewpoints…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-full border border-white/[0.08] bg-white/[0.055] text-base text-fg outline-none transition-colors placeholder:text-stone-500 focus:border-white/[0.16] focus:bg-white/[0.085]"
            style={{ paddingLeft: "2.5rem", paddingRight: searchQuery ? "2.5rem" : "0.875rem" }}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 icon-button text-stone-400 hover:text-fg"
                onClick={() => setSearchQuery("")}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => {
            haptics.tap();
            setShowFilters((v) => !v);
          }}
          aria-label="Filters"
          className={cn(
            "pressable flex h-12 flex-shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] px-4 text-sm font-medium transition-colors",
            activeFilterCount > 0
              ? "bg-alpine-900/50 text-alpine-300"
              : "bg-white/[0.035] text-fg-muted hover:bg-white/[0.07] hover:text-fg"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-bold text-alpine-400 ml-0.5">
              {activeFilterCount}
            </span>
          )}
        </button>
        </div>
        <div className="mt-2.5">
          <SortControl value={sortMode} onChange={setSortMode} />
        </div>
      </div>

      {/* Active filter strip */}
      <AnimatePresence>
        {(activeFilterCount > 0 || searchQuery) && (
          <motion.div
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-trail-950/70"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-fg-muted text-xs">
              {filteredLocations.length} result{filteredLocations.length !== 1 ? "s" : ""}
            </span>
            <span className="text-stone-700 text-xs">·</span>
            <button
              onClick={() => { clearFilters(); setSearchQuery(""); }}
              className="text-xs text-fg-muted hover:text-fg transition-colors py-1"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curated collection */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
        {!searchQuery && activeFilterCount === 0 && (
          <section className="px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10" aria-labelledby="editorial-standard">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-alpine-200">
                <BadgeCheck className="h-3.5 w-3.5" />
                Selected by Corsin
              </p>
              <h2 id="editorial-standard" className="font-heading text-[2rem] leading-[1.05] text-white sm:text-[2.6rem]">
                {CATALOGUE_METRICS.publishedLocations} places. Chosen one by one.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 sm:text-[15px]">
                No endless database. Just places I find worth knowing, with honest access notes, original photography and sources you can open yourself.
              </p>
            </div>
            <div className="mt-8 flex items-end justify-between border-t border-white/[0.08] pb-1 pt-5">
              <div>
                <p className="text-sm font-medium text-white">The collection</p>
                <p className="mt-1 text-xs leading-relaxed text-white/45 sm:text-sm">Open a place for access, route notes, photographs and sources.</p>
              </div>
              <span className="hidden text-right text-xs tabular-nums text-white/40 sm:block">
                {CURATED_LOCATIONS.length} places<br />Reviewed {catalogueReviewDate}
              </span>
            </div>
          </section>
        )}

        {filteredLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
            <div className="w-12 h-12 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-stone-600" />
            </div>
            <p className="text-fg text-base font-medium mb-1">No results</p>
            <p className="text-fg-muted text-sm">
              Try a different search or{" "}
              <button
                onClick={() => setShowFilters(true)}
                className="text-alpine-400 underline underline-offset-2"
              >
                adjust filters
              </button>
            </p>
          </div>
        ) : (
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 px-3 pb-24 pt-4 sm:gap-x-4 sm:gap-y-7 sm:px-6 lg:grid-cols-3 lg:px-8 lg:pb-12 xl:grid-cols-4">
            {visibleLocations.map((loc, i) => (
              <EditorialCard
                key={loc.id}
                location={loc}
                priority={i < 4}
                onClick={() => setSelectedLocation(loc)}
              />
            ))}
          </div>
        )}
        {/* Infinite-scroll sentinel — loading the next window before it's reached */}
        {hasMore && <div ref={sentinelRef} aria-hidden className="h-4" />}
      </div>

      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        resultCount={filteredLocations.length}
      />

      <LocationDetailSheet
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onSelectSimilar={(loc) => setSelectedLocation(loc)}
      />

      {/* Floating "Trip · N" pill — bottom-left, above the nav */}
      <TripPill />
    </div>
  );
}

interface EditorialCardProps {
  location: Location;
  priority: boolean;
  onClick: () => void;
}

function EditorialCard({ location, priority, onClick }: EditorialCardProps) {
  const routeType = location.verification?.routeType.replace(/^Reviewed:\s*/, "") ?? "";
  const isSourcedRoute = location.verification?.routeType.startsWith("Reviewed:") ?? false;
  const isDestinationOnly = location.verification?.routeType === "Destination reference only";
  const isVisitContext = /destination|visit|managed|attraction/i.test(routeType);
  const isClosed = location.verification?.status === "closed";
  const hasAdvisory = location.verification?.status === "open-with-advisory";
  const hasVerifiedStart = Boolean(
    location.verification &&
      (location.verification.start.coordinates.lat !== location.coordinates.lat ||
        location.verification.start.coordinates.lng !== location.coordinates.lng)
  );
  const routeDistance = location.verification?.distanceKm ?? location.distanceKm;
  const routeDuration = location.verification?.durationMinutes;
  const difficulty = difficultyConfig[location.difficulty];

  return (
    <motion.button
      className="group block min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpine-300 focus-visible:ring-offset-4 focus-visible:ring-offset-trail-950"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      aria-label={`Open ${location.name}. ${hasVerifiedStart ? "Access point verified." : isSourcedRoute ? (isVisitContext ? "Visit context sourced." : "Route context sourced.") : "Destination identity sourced; route logistics unverified."} Map marker is a destination pin.`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[0.7rem] bg-trail-900 sm:aspect-[3/4] sm:rounded-xl">
        <ResolvedLocationPhoto
          location={location}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06101f]/45 via-transparent to-black/5 transition-opacity group-hover:opacity-80" />

        {(isClosed || hasAdvisory || isDestinationOnly) && (
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] backdrop-blur-md",
              isClosed
                ? "border-red-500/40 bg-red-950/80 text-red-100"
                : "border-amber-300/25 bg-[#172338]/85 text-amber-100"
            )}
          >
            <AlertTriangle className="h-3 w-3" />
            {isClosed ? "Closed" : hasAdvisory ? "Advisory" : "Access unverified"}
          </span>
          </div>
        )}
      </div>

      <div className="px-0.5 pt-3 sm:pt-3.5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight text-white sm:text-[15px]">{location.name}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-alpine-200/80 sm:text-[11px]">
              {regionConfig[location.region].label}
            </p>
          </div>
          {!isClosed && !hasAdvisory && !isDestinationOnly && (
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 flex-none text-white/35" aria-label="Source reviewed" />
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-white/50 sm:text-[11px]">
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3 w-3 text-white/35" />
            {difficulty.label}
          </span>
          {routeDistance != null && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-3 w-3 text-white/35" />
              {routeDistance} km
            </span>
          )}
          {routeDuration != null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-white/35" />
              {formatDuration(routeDuration)}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
