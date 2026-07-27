"use client";

import { useEffect } from "react";
import { useFavoritesStore } from "@/store/favorites-store";

export function FavoritesHydrator() {
  const setFavorites = useFavoritesStore((state) => state.setFavorites);

  useEffect(() => {
    let active = true;
    fetch("/api/favorites")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (active && data?.favoriteIds) setFavorites(data.favoriteIds);
      })
      .catch(() => {
        // Keep the local cache if the device is temporarily offline.
      });
    return () => { active = false; };
  }, [setFavorites]);

  return null;
}
