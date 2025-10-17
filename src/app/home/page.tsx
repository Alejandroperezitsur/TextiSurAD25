"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir según su rol
    if (user && !loading) {
      if (user.role === "vendedor") {
        router.push("/dashboard/vendedor");
      } else if (user.role === "comprador") {
        router.push("/products");
      }
    }
  }, [user, router, loading]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Bienvenido a TextiSur</h1>
      <p className="text-xl mb-8 text-center">
        La plataforma de comercio textil del sur de Chile
      </p>
      
      {!user && (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild size="lg">
        <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
        <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      )}
      
      <div className="mt-12 max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Conectamos productores textiles con compradores</h2>
        <p className="text-gray-600 mb-6">
          TextiSur es la plataforma que facilita la comercialización de productos textiles
          artesanales del sur de Chile, apoyando a los productores locales y ofreciendo
          productos de calidad a los compradores.
        </p>
      </div>
    </main>
  );
}