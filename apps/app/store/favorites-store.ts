"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesStore {
  ownerId: string | null;
  favoriteIds: Set<string>;
  pendingIds: Set<string>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  hydrateFavorites: (ownerId: string, ids: string[]) => void;
  clearFavorites: () => void;
}

// Supabase Auth metadata is updated as one account object, so writes for
// different locations must also be serialized to avoid one fast tap
// overwriting another.
let favoriteWriteQueue: Promise<boolean> = Promise.resolve(true);

async function writeFavorite(id: string, shouldBeFavorite: boolean) {
  const response = await fetch("/api/favorites", {
    method: shouldBeFavorite ? "POST" : "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locationId: id }),
  });
  if (!response.ok) throw new Error(`Favourite sync failed (${response.status})`);
}

function queueFavoriteWrite(id: string): Promise<boolean> {
  const next = favoriteWriteQueue
    .catch(() => false)
    .then(async () => {
      while (true) {
        const desired = useFavoritesStore.getState().favoriteIds.has(id);
        try {
          await writeFavorite(id, desired);
        } catch {
          return false;
        }
        if (useFavoritesStore.getState().favoriteIds.has(id) === desired) break;
      }
      useFavoritesStore.setState((current) => {
        const pendingIds = new Set(current.pendingIds);
        pendingIds.delete(id);
        return { pendingIds };
      });
      return true;
    });
  favoriteWriteQueue = next;
  return next;
}

export async function flushPendingFavoriteWrites() {
  const ids = Array.from(useFavoritesStore.getState().pendingIds);
  if (ids.length === 0) return true;
  const results = await Promise.all(ids.map((id) => queueFavoriteWrite(id)));
  return results.every(Boolean) && useFavoritesStore.getState().pendingIds.size === 0;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ownerId: null,
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
        set((state) => ({ pendingIds: new Set(state.pendingIds).add(id) }));
        void queueFavoriteWrite(id);
      },

      isFavorite: (id) => get().favoriteIds.has(id),

      hydrateFavorites: (ownerId, ids) =>
        set((state) => {
          if (state.ownerId !== ownerId) {
            return { ownerId, favoriteIds: new Set(ids), pendingIds: new Set<string>() };
          }
          const favoriteIds = new Set(ids);
          for (const pendingId of state.pendingIds) {
            if (state.favoriteIds.has(pendingId)) favoriteIds.add(pendingId);
            else favoriteIds.delete(pendingId);
          }
          return { ownerId, favoriteIds };
        }),

      clearFavorites: () =>
        set({ ownerId: null, favoriteIds: new Set<string>(), pendingIds: new Set<string>() }),
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
              ownerId: parsed.state.ownerId ?? null,
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
