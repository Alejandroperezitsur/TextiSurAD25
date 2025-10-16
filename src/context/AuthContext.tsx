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
import axios from "axios";

// Set default initial user to null (logged out)
const defaultInitialUser: User | null = null;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(defaultInitialUser);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // Aquí podrías hacer una petición a una API para validar el token
          // Por ahora, simplemente extraemos la información del usuario del token
          const userData = JSON.parse(localStorage.getItem("user") || "null");
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem("token");
          }
        } catch (e) {
          console.error("Error al verificar la autenticación:", e);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Solución temporal: usar datos de prueba para evitar el error 500
      // Esto simula un inicio de sesión exitoso mientras se resuelve el problema de la API
      if (email === "vendedor@example.com" && password === "password123") {
        const userData: User = {
          id: "1",
          name: "Juan Vendedor",
          email: "vendedor@example.com",
          role: "vendedor" as "vendedor"
        };
        
        // Guardar los datos del usuario en localStorage
        localStorage.setItem("token", "token_simulado_vendedor");
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Actualizar el estado del usuario
        setUser(userData);
        router.push("/");
        return;
      }
      
      if (email === "comprador@example.com" && password === "password123") {
        const userData: User = {
          id: "2",
          name: "Ana Compradora",
          email: "comprador@example.com",
          role: "comprador" as "comprador"
        };
        
        // Guardar los datos del usuario en localStorage
        localStorage.setItem("token", "token_simulado_comprador");
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Actualizar el estado del usuario
        setUser(userData);
        router.push("/");
        return;
      }
      
      // Si no coincide con los usuarios de prueba, intentar con la API
      const response = await axios.post("/api/login", { email, password });
      
      if (response.status === 200) {
        const { token, user: userData } = response.data;
        
        // Guardar el token y la información del usuario
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        
        setUser(userData);
        router.push("/");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw new Error("Error al iniciar sesión: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("textisur-user");
    router.push("/");
  }, [router]);

  const updateUser = useCallback((updated: User) => {
    try {
      // Actualizar estado y almacenamiento
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (e) {
      console.error("Error actualizando usuario en contexto:", e);
    }
  }, []);

  // Provide the context value
  const value = { user, login, logout, loading, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
