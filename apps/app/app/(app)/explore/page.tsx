"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, BadgeCheck, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
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
import { regionConfig, cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";
import type { Location } from "@/types";

const ASPECT_RATIOS = ["3/4", "4/5", "2/3", "4/5", "3/4", "1/1", "4/5", "3/5"];

// Infinite-scroll page size for the masonry — keeps the DOM light and avoids
// mounting every card (and fetching its images) up front, which would
// fetch destination photos the user may never scroll to.
const MASONRY_PAGE = 24;

export default function ExplorePage() {
  const { searchQuery, setSearchQuery, activeFilters, clearFilters } = useMapStore();
  const userPosition = useGeoStore((s) => s.position);
  const [showFilters, setShowFilters] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

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
        <div className="mb-4 hidden items-end justify-between lg:flex">
          <div>
            <p className="t-eyebrow mb-2">Curated Switzerland</p>
            <h1 className="font-heading text-4xl leading-none text-fg">Places worth knowing.</h1>
          </div>
          <p className="max-w-sm text-right text-sm leading-relaxed text-fg-muted">
            One hundred Swiss destinations with source links and visible uncertainty instead of invented details.
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
          <section className="px-3 pt-4 sm:px-5 lg:px-7 lg:pt-6" aria-labelledby="editorial-standard">
            <div className="overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-gradient-to-br from-alpine-950 via-trail-900 to-trail-950 p-5 sm:p-6 lg:flex lg:items-end lg:justify-between lg:gap-8 lg:p-8">
              <div className="max-w-2xl">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-alpine-300">
                  <BadgeCheck className="h-4 w-4" />
                  Source-linked collection
                </p>
                <h2 id="editorial-standard" className="font-heading text-3xl leading-[1.05] text-fg sm:text-4xl">
                  One hundred places, honestly scoped.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base">
                  Every page links its destination sources. Route and access details appear only when supported; unresolved information is labelled clearly.
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 lg:mt-0 lg:w-72">
                <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                  <p className="font-heading text-3xl text-fg">100</p>
                  <p className="mt-1 text-xs leading-snug text-fg-muted">published places</p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                  <p className="font-heading text-3xl text-fg">97</p>
                  <p className="mt-1 text-xs leading-snug text-fg-muted">licensed location photographs</p>
                </div>
                <p className="col-span-2 px-1 pt-1 text-[11px] text-stone-500">Last editorial check: 10 August 2026</p>
              </div>
            </div>
            <div className="flex items-end justify-between pb-1 pt-6">
              <div>
                <p className="t-eyebrow">Published collection</p>
                <p className="mt-1 text-sm text-fg-muted">Select a place to see its sources, known details and open questions.</p>
              </div>
              <span className="hidden text-xs text-stone-500 sm:block">{CURATED_LOCATIONS.length} places</span>
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
            <div className="columns-2 px-3 pb-24 pt-3 [column-gap:10px] sm:px-5 sm:[column-gap:14px] lg:columns-3 lg:px-7 lg:pb-10 xl:columns-4">
            {visibleLocations.map((loc, i) => (
              <MasonryCard
                key={loc.id}
                location={loc}
                aspectRatio={ASPECT_RATIOS[i % ASPECT_RATIOS.length]}
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

interface MasonryCardProps {
  location: Location;
  aspectRatio: string;
  priority: boolean;
  onClick: () => void;
}

function MasonryCard({ location, aspectRatio, priority, onClick }: MasonryCardProps) {
  const routeType = location.verification?.routeType.replace(/^Reviewed:\s*/, "") ?? "";
  const isSourcedRoute = location.verification?.routeType.startsWith("Reviewed:") ?? false;
  const isVisitContext = /destination|visit|managed|attraction/i.test(routeType);
  const isClosed = location.verification?.status === "closed";
  const hasAdvisory = location.verification?.status === "open-with-advisory";
  const hasVerifiedStart = Boolean(
    location.verification &&
      (location.verification.start.coordinates.lat !== location.coordinates.lat ||
        location.verification.start.coordinates.lng !== location.coordinates.lng)
  );

  return (
    <motion.button
      className="relative mb-2.5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.07] bg-surface-1 shadow-sm sm:mb-3.5"
      style={{ aspectRatio }}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      aria-label={`Open ${location.name}. ${hasVerifiedStart ? "Access point verified." : isSourcedRoute ? (isVisitContext ? "Visit context sourced." : "Route context sourced.") : "Destination source linked."} Map marker is a destination pin.`}
    >
      <ResolvedLocationPhoto
        location={location}
        className="relative z-[1] object-cover transition-transform duration-700 hover:scale-[1.025]"
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
        priority={priority}
      />

      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/85 via-black/5 to-transparent" />

      {location.verification && (
        <div className="absolute left-2.5 top-2.5 z-[3]">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] backdrop-blur-md",
              isClosed
                ? "border-red-500/40 bg-red-950/80 text-red-100"
                : hasAdvisory
                  ? "border-amber-500/35 bg-amber-950/75 text-amber-200"
                  : "border-white/15 bg-black/45 text-white/85"
            )}
          >
            {isClosed || hasAdvisory ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <BadgeCheck className="h-3 w-3" />
            )}
            <span className="sm:hidden">
              {isClosed
                ? "Closed"
                : hasAdvisory
                  ? "Advisory"
                : hasVerifiedStart
                  ? "Access"
                  : isSourcedRoute
                    ? isVisitContext
                      ? "Visit"
                      : "Route"
                    : "Source"}
            </span>
            <span className="hidden sm:inline">
              {isClosed
                ? "Closed"
                : hasAdvisory
                  ? "Specific advisory"
                : hasVerifiedStart
                  ? "Access verified"
                  : isSourcedRoute
                  ? isVisitContext
                    ? "Visit sourced"
                    : "Route sourced"
                  : "Source linked"}
            </span>
          </span>
        </div>
      )}

      <span className="absolute right-2.5 top-2.5 z-[3] inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/45 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/75 backdrop-blur-md">
        <MapPin className="h-3 w-3" />
        <span className="sm:hidden">Pin</span>
        <span className="hidden sm:inline">Destination pin</span>
      </span>

      <div className="absolute bottom-0 left-0 right-0 z-[3] p-3 text-left sm:p-4">
        <p className="line-clamp-2 text-sm font-medium leading-tight text-white sm:text-base">{location.name}</p>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-gold-200/85">{regionConfig[location.region].label}</p>
      </div>
    </motion.button>
  );
}
