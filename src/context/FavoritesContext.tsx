// src/context/FavoritesContext.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type FavoriteItem = {
  id: string; // store as string for cross-page consistency
  name: string;
  imageUrl: string;
  price: number;
  category?: string;
  addedAt?: number;
};

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string | number) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: string | number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

function getStorageKey(email?: string | null) {
  return `favorites:${email ?? "guest"}`;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites when auth state resolves
  useEffect(() => {
    if (loading) return;
    try {
      const key = getStorageKey(user?.email ?? null);
      const raw = localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavorites([]);
    }
  }, [user?.email, loading]);

  // Persist favorites when they change
  useEffect(() => {
    if (loading) return;
    try {
      const key = getStorageKey(user?.email ?? null);
      localStorage.setItem(key, JSON.stringify(favorites));
    } catch {
      // ignore storage errors
    }
  }, [favorites, user?.email, loading]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const id = String(item.id);
      if (prev.some((f) => String(f.id) === id)) return prev;
      return [...prev, { ...item, id, addedAt: Date.now() }];
    });
  };

  const removeFavorite = (id: string | number) => {
    const idStr = String(id);
    setFavorites((prev) => prev.filter((f) => String(f.id) !== idStr));
  };

  const toggleFavorite = (item: FavoriteItem) => {
    const idStr = String(item.id);
    setFavorites((prev) => {
      if (prev.some((f) => String(f.id) === idStr)) {
        return prev.filter((f) => String(f.id) !== idStr);
      }
      return [...prev, { ...item, id: idStr, addedAt: Date.now() }];
    });
  };

  const isFavorite = (id: string | number) => {
    const idStr = String(id);
    return favorites.some((f) => String(f.id) === idStr);
  };

  const value = useMemo(
    () => ({ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}