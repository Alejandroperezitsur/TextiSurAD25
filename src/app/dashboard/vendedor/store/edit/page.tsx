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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type Days =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

interface SellerStoreForm {
  name: string;
  description?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressPostalCode?: string;
  openDays: Days[];
  openTime?: string;
  closeTime?: string;
  shippingEnabled: boolean;
  shippingPickup: boolean;
  shippingLocal: boolean;
  shippingNational: boolean;
  contactPhone?: string;
  contactEmail?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

const ALL_DAYS: Days[] = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function EditSellerStorePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<SellerStoreForm>({
    name: "",
    description: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressPostalCode: "",
    openDays: [],
    openTime: "09:00",
    closeTime: "18:00",
    shippingEnabled: true,
    shippingPickup: true,
    shippingLocal: true,
    shippingNational: false,
    contactPhone: "",
    contactEmail: "",
    logoUrl: "",
    bannerUrl: "",
  });

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
        // Recuperar tienda desde API por email
        try {
          const resp = await fetch(`/api/stores/by-user?email=${encodeURIComponent(user.email)}`);
          if (resp.ok) {
            const data = await resp.json();
            const s = data.store || {};
            setForm({
              name: s.name || "",
              description: s.description || "",
              // Dirección en una sola cadena en el modelo: mapeamos a street
              addressStreet: s.address || "",
              addressCity: "",
              addressState: "",
              addressPostalCode: "",
              openDays: [],
              openTime: "09:00",
              closeTime: "18:00",
              shippingEnabled: true,
              shippingPickup: true,
              shippingLocal: true,
              shippingNational: false,
              contactPhone: s.phone || "",
              contactEmail: s.email || user.email || "",
              logoUrl: s.logo || "",
              bannerUrl: "",
            });
            try { localStorage.setItem("seller-store", JSON.stringify(s)); } catch {}
          }
        } catch (err) {
          console.error("Error obteniendo tienda del vendedor", err);
        }
      } catch {}
      setLoading(false);
    };
    run();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const resp = await fetch("/api/stores/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ? Number(user.id) : undefined,
          data: {
            name: form.name,
            description: form.description,
            address: [form.addressStreet, form.addressCity, form.addressState, form.addressPostalCode].filter(Boolean).join(", "),
            phone: form.contactPhone,
            email: form.contactEmail || user?.email,
            logo: form.logoUrl,
          },
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const s = data.store;
        try { localStorage.setItem("seller-store", JSON.stringify(s)); } catch {}
        toast({ title: "Tienda guardada", description: "Los cambios se han aplicado." });
        router.push("/dashboard/vendedor/store");
      } else {
        toast({ title: "Error", description: "No se pudo guardar la tienda" });
      }
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar la tienda" });
    }
  };

  const toggleDay = (day: Days, checked: boolean) => {
    setForm((prev) => {
      const set = new Set(prev.openDays);
      checked ? set.add(day) : set.delete(day);
      return { ...prev, openDays: Array.from(set) as Days[] };
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto flex-1 py-12 px-4 md:px-6">Cargando...</div>
    );
  }

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Editar tienda</CardTitle>
          <CardDescription>Configura tu información de tienda, horarios y envíos.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Nombre de la tienda</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={form.contactPhone} onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" value={form.logoUrl} onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="banner">Banner URL</Label>
                <Input id="banner" value={form.bannerUrl} onChange={(e) => setForm((p) => ({ ...p, bannerUrl: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dirección</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="street">Calle y número</Label>
                  <Input id="street" value={form.addressStreet} onChange={(e) => setForm((p) => ({ ...p, addressStreet: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" value={form.addressCity} onChange={(e) => setForm((p) => ({ ...p, addressCity: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="state">Estado/Provincia</Label>
                  <Input id="state" value={form.addressState} onChange={(e) => setForm((p) => ({ ...p, addressState: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="postal">Código Postal</Label>
                  <Input id="postal" value={form.addressPostalCode} onChange={(e) => setForm((p) => ({ ...p, addressPostalCode: e.target.value }))} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Horarios</h3>
              <div className="flex flex-wrap gap-3 mb-3">
                {ALL_DAYS.map((day) => (
                  <label key={day} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.openDays.includes(day)}
                      onCheckedChange={(checked) => toggleDay(day, Boolean(checked))}
                    />
                    {day}
                  </label>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="open">Hora apertura</Label>
                  <Input type="time" id="open" value={form.openTime} onChange={(e) => setForm((p) => ({ ...p, openTime: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="close">Hora cierre</Label>
                  <Input type="time" id="close" value={form.closeTime} onChange={(e) => setForm((p) => ({ ...p, closeTime: e.target.value }))} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Envíos</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.shippingEnabled}
                    onCheckedChange={(checked) => setForm((p) => ({ ...p, shippingEnabled: Boolean(checked) }))}
                  />
                  Habilitar envíos
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.shippingPickup}
                    onCheckedChange={(checked) => setForm((p) => ({ ...p, shippingPickup: Boolean(checked) }))}
                    disabled={!form.shippingEnabled}
                  />
                  Recogida en tienda
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.shippingLocal}
                    onCheckedChange={(checked) => setForm((p) => ({ ...p, shippingLocal: Boolean(checked) }))}
                    disabled={!form.shippingEnabled}
                  />
                  Entrega local
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.shippingNational}
                    onCheckedChange={(checked) => setForm((p) => ({ ...p, shippingNational: Boolean(checked) }))}
                    disabled={!form.shippingEnabled}
                  />
                  Envío nacional
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" className="btn-accent">Guardar tienda</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}