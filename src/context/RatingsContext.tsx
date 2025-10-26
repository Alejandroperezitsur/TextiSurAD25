"use client";

import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useNotifications } from "./NotificationsContext";

export type RatingRecord = {
  userEmail: string;
  stars: number; // 0..5
  comment?: string;
  createdAt: number;
};

export type RatingsContextType = {
  addOrUpdateRating: (productId: string, stars: number, comment: string | undefined, opts?: { storeId?: string; productName?: string; productLink?: string; }) => { success: boolean; reason?: string };
  getRatings: (productId: string) => RatingRecord[];
  getAverage: (productId: string) => number | null;
  hasUserRated: (productId: string, email: string) => boolean;
  canCurrentUserRate: (productId: string) => boolean;
};

const RatingsContext = createContext<RatingsContextType | null>(null);

const STORAGE_PREFIX = "ratings:product:"; // + productId
const ORDERS_STORAGE_KEY = "orders_history"; // set from Orders history page

function readRatings(key: string): RatingRecord[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

function writeRatings(key: string, list: RatingRecord[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

function userPurchasedProduct(email: string | undefined, productId: string): boolean {
  if (!email) return false;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return false;
    const orders = JSON.parse(raw);
    if (!Array.isArray(orders)) return false;
    const found = orders.some((o: any) => Array.isArray(o.items) && o.items.some((it: any) => String(it.id) === String(productId)));
    return !!found;
  } catch {
    return false;
  }
}

export function RatingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { notifyBuyer, notifySeller } = useNotifications();

  const addOrUpdateRating = useCallback((productId: string, stars: number, comment: string | undefined, opts?: { storeId?: string; productName?: string; productLink?: string; }) => {
    const email = user?.email;
    if (!email) return { success: false, reason: "no-auth" };
    if (stars < 0 || stars > 5) return { success: false, reason: "invalid-stars" };
    // eligibility: must have purchased
    if (!userPurchasedProduct(email, productId)) {
      return { success: false, reason: "not-eligible" };
    }
    const key = STORAGE_PREFIX + productId;
    const list = readRatings(key);
    const existingIndex = list.findIndex((r) => r.userEmail === email);
    const newRecord: RatingRecord = { userEmail: email, stars, comment, createdAt: Date.now() };
    let updated: RatingRecord[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = newRecord;
    } else {
      updated = [newRecord, ...list];
    }
    writeRatings(key, updated);

    // Notifications
    notifyBuyer(email, {
      title: existingIndex >= 0 ? "Calificación actualizada" : "Calificación registrada",
      message: opts?.productName ? `Tu calificación de '${opts.productName}' fue ${stars} estrellas.` : `Tu calificación fue ${stars} estrellas.`,
      type: "rating",
      link: opts?.productLink ?? `/products/${productId}`,
    });
    if (opts?.storeId) {
      notifySeller(opts.storeId, {
        title: "Nuevo rating recibido",
        message: opts?.productName ? `Tu producto '${opts.productName}' recibió ${stars} estrellas.` : `Un producto recibió ${stars} estrellas.`,
        type: "rating",
        link: opts?.productLink ?? `/products/${productId}`,
      });
    }

    return { success: true };
  }, [user?.email, notifyBuyer, notifySeller]);

  const getRatings = useCallback((productId: string) => {
    return readRatings(STORAGE_PREFIX + productId);
  }, []);

  const getAverage = useCallback((productId: string) => {
    const list = getRatings(productId);
    if (!list.length) return null;
    const avg = list.reduce((acc, r) => acc + r.stars, 0) / list.length;
    return Math.round(avg * 10) / 10;
  }, [getRatings]);

  const hasUserRated = useCallback((productId: string, email: string) => {
    const list = getRatings(productId);
    return list.some((r) => r.userEmail === email);
  }, [getRatings]);

  const canCurrentUserRate = useCallback((productId: string) => {
    const email = user?.email;
    if (!email) return false;
    return userPurchasedProduct(email, productId);
  }, [user?.email]);

  const value = useMemo<RatingsContextType>(() => ({
    addOrUpdateRating,
    getRatings,
    getAverage,
    hasUserRated,
    canCurrentUserRate,
  }), [addOrUpdateRating, getRatings, getAverage, hasUserRated, canCurrentUserRate]);

  return <RatingsContext.Provider value={value}>{children}</RatingsContext.Provider>;
}

export function useRatings() {
  const ctx = useContext(RatingsContext);
  if (!ctx) throw new Error("useRatings must be used within RatingsProvider");
  return ctx;
}