"use client";

import { motion } from "framer-motion";
import { AlertTriangle, BadgeCheck, Heart, Clock, TrendingUp, MapPin, Check } from "lucide-react";
import { cn, difficultyConfig, categoryConfig, formatDuration } from "@/lib/utils";
import { SPRING } from "@/lib/motion";
import { haptics } from "@/lib/haptics";
import { useFavoritesStore } from "@/store/favorites-store";
import { useVisitedStore } from "@/store/visited-store";
import { useGeoStore } from "@/store/geo-store";
import { distanceKm, formatDistance } from "@/lib/distance";
import { ResolvedLocationPhoto } from "@/components/app/location-photo";
import type { Location } from "@/types";

interface LocationCardProps {
  location: Location;
  onClick?: () => void;
  isSelected?: boolean;
  compact?: boolean;
}

export function LocationCard({
  location,
  onClick,
  isSelected = false,
  compact = false,
}: LocationCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const visited = useVisitedStore((s) => s.visitedIds.has(location.id));
  const userPosition = useGeoStore((s) => s.position);
  const fav = isFavorite(location.id);
  const diff = difficultyConfig[location.difficulty];
  const cat = categoryConfig[location.category];

  // Real, honest distance when we know where the user is; otherwise fall back
  // to the static travel-time estimate (relabelled "~X by car", no "away").
  const awayKm = userPosition
    ? formatDistance(distanceKm(userPosition, location.coordinates))
    : null;

  // Favourite on → success double-tick, off → light tap. Mirrors reaction-bar.
  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fav) haptics.tap();
    else haptics.success();
    toggleFavorite(location.id);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer group",
        "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpine-500",
        isSelected
          ? "ring-1 ring-alpine-600"
          : "hover:bg-trail-800",
        compact ? "h-20 flex" : ""
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Open ${location.name}` : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (
          onClick &&
          event.currentTarget === event.target &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {compact ? (
        <>
          {/* Image thumb */}
          <div className="relative w-20 h-full flex-shrink-0 overflow-hidden">
            <ResolvedLocationPhoto
              location={location}
              className="object-cover"
              sizes="80px"
              compactFallback
            />
            <div className="absolute inset-0 bg-trail-950/20" />
            {/* Visited badge */}
            {visited && (
              <div
                aria-label="Visited"
                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm"
              >
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            )}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0 px-3 py-2.5 bg-trail-900">
            <p className="text-fg text-sm font-medium truncate">{location.name}</p>
            <p className="text-fg-muted text-xs mt-0.5 truncate">
              {cat.label} ·{" "}
              {awayKm
                ? `${awayKm} away`
                : location.verification
                  ? `${formatDuration(location.verification.durationMinutes)} hike`
                  : `~${formatDuration(location.travelTimeMinutes)} by car`}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn("text-xs font-medium", diff.color)}>
                {diff.label}
              </span>
            </div>
          </div>
          {/* Fav button */}
          <button
            aria-label={fav ? "Remove favourite" : "Add favourite"}
            aria-pressed={fav}
            className="pressable min-w-[48px] flex items-center justify-center bg-trail-900"
            onClick={handleToggleFav}
          >
            <motion.span
              key={fav ? "on" : "off"}
              initial={{ scale: fav ? 0.6 : 1 }}
              animate={{ scale: 1 }}
              transition={SPRING.snappy}
              className="inline-flex"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  fav ? "fill-red-400 text-red-400" : "text-stone-400 hover:text-fg"
                )}
              />
            </motion.span>
          </button>
        </>
      ) : (
        <>
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <ResolvedLocationPhoto
              location={location}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-trail-950/80 via-transparent to-transparent" />

            {location.verification && (
              <div className="absolute bottom-3 left-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm",
                    location.verification.status === "open"
                      ? "bg-black/50 text-white/80"
                      : "bg-amber-950/80 text-amber-200"
                  )}
                >
                  {location.verification.status === "open" ? (
                    <BadgeCheck className="h-2.5 w-2.5" />
                  ) : (
                    <AlertTriangle className="h-2.5 w-2.5" />
                  )}
                  {location.verification.status === "open" ? "Checked" : "Advisory"}
                </span>
              </div>
            )}

            {/* Category label */}
            <div className="absolute top-3 left-3">
              <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-white/70 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                {cat.label}
              </span>
            </div>

            {/* Fav button */}
            <button
              aria-label={fav ? "Remove favourite" : "Add favourite"}
              aria-pressed={fav}
              className="pressable absolute top-2 right-2 w-11 h-11 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/60"
              onClick={handleToggleFav}
            >
              <motion.span
                key={fav ? "on" : "off"}
                initial={{ scale: fav ? 0.6 : 1 }}
                animate={{ scale: 1 }}
                transition={SPRING.snappy}
                className="inline-flex"
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-colors",
                    fav ? "fill-red-400 text-red-400" : "text-white/80"
                  )}
                />
              </motion.span>
            </button>

            {/* Visited chip */}
            {visited && !location.verification && (
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase text-emerald-300 bg-emerald-900/70 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  Visited
                </span>
              </div>
            )}

            {/* New label */}
            {location.isNew && (
              <div className="absolute bottom-3 right-3">
                <span className="text-[10px] font-semibold tracking-wide uppercase text-alpine-300 bg-alpine-900/70 backdrop-blur-sm rounded px-1.5 py-0.5">
                  New
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 bg-trail-900">
            <h3 className="text-fg font-medium text-sm leading-snug mb-0.5">
              {location.name}
            </h3>
            <p className="text-fg-muted text-xs mb-2.5 line-clamp-2 leading-relaxed">
              {location.tagline}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-fg-muted">
                {awayKm ? (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {awayKm} away
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {location.verification
                      ? `${formatDuration(location.verification.durationMinutes)} hike`
                      : `~${formatDuration(location.travelTimeMinutes)} by car`}
                  </span>
                )}
                <span className={cn("font-medium", diff.color)}>{diff.label}</span>
              </div>
              {location.saveCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-fg-muted">
                  <TrendingUp className="w-3 h-3" />
                  {location.saveCount}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
