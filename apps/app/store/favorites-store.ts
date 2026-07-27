"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  favoriteIds: Set<string>;
  pendingIds: Set<string>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setFavorites: (ids: string[]) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: new Set<string>(),
      pendingIds: new Set<string>(),

      addFavorite: (id) =>
        set((state) => {
          const next = new Set(state.favoriteIds);
          next.add(id);
          return { favoriteIds: next };
        }),

      removeFavorite: (id) =>
        set((state) => {
          const next = new Set(state.favoriteIds);
          next.delete(id);
          return { favoriteIds: next };
        }),

      toggleFavorite: (id) => {
        const { favoriteIds, addFavorite, removeFavorite } = get();
        const wasFavorite = favoriteIds.has(id);
        if (wasFavorite) {
          removeFavorite(id);
        } else {
          addFavorite(id);
        }
        // Local persistence is the source of truth for immediate/offline use.
        // Server sync is best-effort: an unauthenticated or temporarily offline
        // visitor must not lose a favourite they just saved.
        void fetch("/api/favorites", {
          method: wasFavorite ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locationId: id }),
        }).catch(() => undefined);
      },

      isFavorite: (id) => get().favoriteIds.has(id),

      setFavorites: (ids) =>
        set({ favoriteIds: new Set(ids) }),
    }),
    {
      name: "swiss-trails-favorites",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (!item) return null;
          const parsed = JSON.parse(item);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              favoriteIds: new Set(parsed.state.favoriteIds ?? []),
              pendingIds: new Set(parsed.state.pendingIds ?? []),
            },
          };
        },
        setItem: (name, value) => {
          const toStore = {
            ...value,
            state: {
              ...value.state,
              favoriteIds: Array.from(value.state.favoriteIds),
              pendingIds: Array.from(value.state.pendingIds),
            },
          };
          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
