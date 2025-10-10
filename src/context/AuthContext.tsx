// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";

// Example initial users (can be null) - In a real app, fetch this or determine from session/token
const initialSeller: User | null = {
  id: "1",
  name: "Juan Vendedor",
  email: "vendedor@example.com",
  role: "vendedor",
  avatarUrl: "https://picsum.photos/seed/juanvendedor/100/100",
};
const initialBuyer: User | null = {
  id: "2",
  name: "Ana Compradora",
  email: "comprador@example.com",
  role: "comprador",
  avatarUrl: "https://picsum.photos/seed/anacompradora/100/100",
};
// Set default initial user to null (logged out)
const defaultInitialUser: User | null = null;

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(defaultInitialUser);
  const [loading, setLoading] = useState(true); // Start loading until check is done
  const router = useRouter();

  // Simulate checking auth status on initial load (e.g., from localStorage or a token)
  useEffect(() => {
    // In a real app, you'd verify a token/session here
    // For simulation, let's check localStorage
    const storedUser = localStorage.getItem("textisur-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("textisur-user"); // Clear invalid data
      }
    }
    setLoading(false); // Finished checking
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    // Persist user in localStorage for simulation
    localStorage.setItem("textisur-user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Clear user from localStorage
    localStorage.removeItem("textisur-user");
    router.push("/"); // Redirect to home after logout
  }, [router]);

  // Provide the context value
  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
