"use client";

import React, { createContext, useContext, useMemo, useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type?: "rating" | "general";
  link?: string;
  read?: boolean;
  createdAt: number; // timestamp
};

// Notificaciones por usuario (email) y por tienda (storeId) para vendedores
export type NotificationsContextType = {
  notifyBuyer: (email: string, n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  notifySeller: (storeId: string, n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  getUserNotifications: (email: string) => NotificationItem[];
  getStoreNotifications: (storeId: string) => NotificationItem[];
  markUserNotificationRead: (email: string, id: string) => void;
  markStoreNotificationRead: (storeId: string, id: string) => void;
  unreadCountForCurrentUser: number;
};

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const STORAGE_USER_PREFIX = "notifications:user:"; // + email
const STORAGE_STORE_PREFIX = "notifications:store:"; // + storeId

function readList(key: string): NotificationItem[] {
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

function writeList(key: string, list: NotificationItem[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const notifyBuyer = useCallback((email: string, n: Omit<NotificationItem, "id" | "createdAt" | "read">) => {
    if (!email) return;
    const key = STORAGE_USER_PREFIX + email;
    const existing = readList(key);
    const newItem: NotificationItem = {
      id: crypto.randomUUID(),
      title: n.title,
      message: n.message,
      type: n.type ?? "general",
      link: n.link,
      read: false,
      createdAt: Date.now(),
    };
    const updated = [newItem, ...existing];
    writeList(key, updated);
    // Update count reactively if the notification is for current user
    if (user?.email === email) {
      setUnreadCount((c) => c + 1);
    }
  }, [user?.email]);

  const notifySeller = useCallback((storeId: string, n: Omit<NotificationItem, "id" | "createdAt" | "read">) => {
    if (!storeId) return;
    const key = STORAGE_STORE_PREFIX + storeId;
    const existing = readList(key);
    const newItem: NotificationItem = {
      id: crypto.randomUUID(),
      title: n.title,
      message: n.message,
      type: n.type ?? "general",
      link: n.link,
      read: false,
      createdAt: Date.now(),
    };
    const updated = [newItem, ...existing];
    writeList(key, updated);
    // Sellers' unread count will be computed on open; we keep store-specific
  }, []);

  const getUserNotifications = useCallback((email: string) => {
    if (!email) return [];
    return readList(STORAGE_USER_PREFIX + email);
  }, []);

  const getStoreNotifications = useCallback((storeId: string) => {
    if (!storeId) return [];
    return readList(STORAGE_STORE_PREFIX + storeId);
  }, []);

  const markUserNotificationRead = useCallback((email: string, id: string) => {
    if (!email || !id) return;
    const key = STORAGE_USER_PREFIX + email;
    const list = readList(key);
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    writeList(key, updated);
    // recompute unread for current user
    if (user?.email === email) {
      const unread = updated.filter((n) => !n.read).length;
      setUnreadCount(unread);
    }
  }, [user?.email]);

  const markStoreNotificationRead = useCallback((storeId: string, id: string) => {
    if (!storeId || !id) return;
    const key = STORAGE_STORE_PREFIX + storeId;
    const list = readList(key);
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    writeList(key, updated);
  }, []);

  // compute unread on mount for current user
  useEffect(() => {
    if (!user?.email) {
      setUnreadCount(0);
      return;
    }
    const arr = getUserNotifications(user.email);
    setUnreadCount(arr.filter((n) => !n.read).length);
  }, [user?.email, getUserNotifications]);

  const value = useMemo<NotificationsContextType>(() => ({
    notifyBuyer,
    notifySeller,
    getUserNotifications,
    getStoreNotifications,
    markUserNotificationRead,
    markStoreNotificationRead,
    unreadCountForCurrentUser: unreadCount,
  }), [notifyBuyer, notifySeller, getUserNotifications, getStoreNotifications, markUserNotificationRead, markStoreNotificationRead, unreadCount]);

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}