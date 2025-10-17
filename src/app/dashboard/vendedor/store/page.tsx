"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SellerStore {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  schedule?: {
    openDays?: string[]; // e.g., ["Lunes","Martes"]
    openTime?: string;   // HH:MM
    closeTime?: string;  // HH:MM
  };
  shipping?: {
    enabled: boolean;
    pickup?: boolean;
    localDelivery?: boolean;
    national?: boolean;
  };
  contact?: {
    phone?: string;
    email?: string;
  };
  logoUrl?: string;
  bannerUrl?: string;
}

export default function SellerStorePage() {
  const router = useRouter();
  const [store, setStore] = useState<SellerStore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      if (!token || !userRaw) {
        router.replace("/login");
        return;
      }
      try {
        const user = JSON.parse(userRaw);
        if (user?.role !== "vendedor") {
          router.replace("/");
          return;
        }
        // Recuperar tienda desde API; si no existe, asignar una tienda destacada por defecto.
        try {
          const resp = await fetch(`/api/stores/by-user?email=${encodeURIComponent(user.email)}`);
          if (resp.ok) {
            const data = await resp.json();
            const s = data.store as SellerStore;
            setStore(s);
            try { localStorage.setItem("seller-store", JSON.stringify(s)); } catch {}
          } else if (resp.status === 404) {
            // Auto-asignar "Hilos del Sur" al vendedor si no tiene tienda aún
            const assign = await fetch("/api/stores/assign", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                storeData: {
                  name: "Hilos del Sur",
                  description: "Lanas naturales y accesorios para tejido. Inspiración para tus creaciones.",
                  address: "Av. Principal 123, Ciudad Textil",
                  phone: "",
                  email: user.email,
                  logo: "",
                  slug: "hilos-del-sur",
                },
              }),
            });
            if (assign.ok) {
              const data = await assign.json();
              const s = data.store as SellerStore;
              setStore(s);
              try { localStorage.setItem("seller-store", JSON.stringify(s)); } catch {}
            } else {
              setStore(null);
            }
          } else {
            setStore(null);
          }
        } catch (err) {
          console.error("Error obteniendo/creando tienda del vendedor", err);
          setStore(null);
        }
      } catch {}
      setLoading(false);
    };
    run();
  }, [router]);

  const ensureStore = async () => {
    try {
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!user) {
        router.replace("/login");
        return;
      }
      const resp = await fetch("/api/stores/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          // Datos por defecto para asegurar tienda
          storeData: {
            name: "Tienda de Juan Vendedor",
            description: "Tienda asignada automáticamente",
            address: "Dirección por definir",
            phone: "",
            email: user.email,
            logo: "",
          },
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setStore(data.store);
        try { localStorage.setItem("seller-store", JSON.stringify(data.store)); } catch {}
      }
    } catch (err) {
      console.error("Error asegurando tienda", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex-1 py-12 px-4 md:px-6">Cargando...</div>
    );
  }

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      {!store ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>No tienes una tienda configurada</CardTitle>
            <CardDescription>
              Crea tu tienda para comenzar a publicar y administrar tus productos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button asChild className="btn-accent">
              <Link href="/dashboard/vendedor/store/edit">Crear mi tienda</Link>
            </Button>
            <Button variant="outline" onClick={ensureStore}>Asegurar tienda</Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-4xl mx-auto overflow-hidden">
          {store.bannerUrl && (
            <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${store.bannerUrl})` }} />
          )}
          <CardHeader>
            <CardTitle>{store.name}</CardTitle>
            <CardDescription>{store.description || "Sin descripción"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Dirección</h3>
              <p className="text-sm text-muted-foreground">
                {[store.address?.street, store.address?.city, store.address?.state, store.address?.postalCode]
                  .filter(Boolean)
                  .join(", ") || "Sin dirección"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Horarios</h3>
              <p className="text-sm text-muted-foreground">
                {store.schedule?.openDays?.join(", ") || "Sin días configurados"}
                {store.schedule?.openTime && store.schedule?.closeTime && (
                  <> — {store.schedule.openTime} a {store.schedule.closeTime}</>
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Envíos</h3>
              <p className="text-sm text-muted-foreground">
                {store.shipping?.enabled
                  ? [
                      store.shipping?.pickup ? "Recogida en tienda" : null,
                      store.shipping?.localDelivery ? "Entrega local" : null,
                      store.shipping?.national ? "Envío nacional" : null,
                    ].filter(Boolean).join(" · ") || "Envíos habilitados"
                  : "Sin envíos"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Contacto</h3>
              <p className="text-sm text-muted-foreground">
                {store.contact?.phone || "Sin teléfono"} · {store.contact?.email || "Sin email"}
              </p>
            </div>
            <div className="pt-2">
              <Button asChild variant="outline">
                <Link href="/dashboard/vendedor/store/edit">Editar tienda</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}