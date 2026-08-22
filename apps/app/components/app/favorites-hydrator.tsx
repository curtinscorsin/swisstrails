"use client";

import { useEffect } from "react";
import { flushPendingFavoriteWrites, useFavoritesStore } from "@/store/favorites-store";

export function FavoritesHydrator() {
  const hydrateFavorites = useFavoritesStore((state) => state.hydrateFavorites);

  useEffect(() => {
    let active = true;
    fetch("/api/favorites")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (active && data?.userId && data?.favoriteIds) {
          hydrateFavorites(data.userId, data.favoriteIds);
          void flushPendingFavoriteWrites();
        }
      })
      .catch(() => {
        // Keep the local cache if the device is temporarily offline.
      });
    return () => { active = false; };
  }, [hydrateFavorites]);

  return null;
}
