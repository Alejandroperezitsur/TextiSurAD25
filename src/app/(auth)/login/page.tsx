// src/app/(auth)/login/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import axios from "axios"; // Import axios

// Renamed to LoginPage for clarity
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, login, loading: authLoading } = useAuth(); // Get user, login function and authLoading from AuthContext

  // Redirect if user is already logged in
  useEffect(() => {
    // Only redirect if auth is not loading and user exists
    if (!authLoading && user) {
      router.push("/"); // Redirect to home or dashboard if already logged in
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usar el método login del AuthContext
      await login(email, password);

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo.",
        variant: "default",
      });

      // Redirigir a la raíz; la home se encargará de enviar al dashboard correcto por rol
      router.push("/");
    } catch (err) {
      const errorMessage =
        (err as any)?.response?.data?.message || "No se pudo iniciar sesión.";
      console.error("Error al iniciar sesión:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form if the user is logged in or auth is loading initially
  if (authLoading || user) {
    // You might want a loading indicator here if authLoading is true
    // Or return null if user is already logged in (like before)
    return null; // Keep it simple: render nothing if logged in or loading
  }

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center py-12 px-4 md:px-6">
      <Card className="w-full max-w-md border shadow-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico abajo para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full btn-accent"
              disabled={loading}
            >
              {loading ? "Iniciando Sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline ml-1">
            Regístrate
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
