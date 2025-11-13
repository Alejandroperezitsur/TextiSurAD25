"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { AlertCircle, Upload } from "lucide-react";

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pid = Number(params?.id);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    status: "Activo",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || user.role !== "vendedor") {
      router.push("/");
      return;
    }
    const fetchProduct = async () => {
      try {
        const resp = await fetch(`/api/products/${pid}`);
        if (resp.ok) {
          const data = await resp.json();
          const p = data.product;
          setFormData({
            name: String(p.name || ""),
            price: String(p.price ?? ""),
            description: String(p.description || ""),
            stock: String(p.stock ?? ""),
            status: String(p.status || "Activo"),
          });
          const img = typeof p.imageUrl === "string" ? p.imageUrl.trim().replace(/\)$/, "") : "";
          setImagePreview(img || null);
        }
      } catch {}
    };
    if (pid) fetchProduct();
  }, [user, router, pid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Por favor, selecciona un archivo de imagen." }));
        setImagePreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "La imagen es demasiado grande (máx 5MB)." }));
        setImagePreview(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let uploadedUrl: string | undefined;
      if (imagePreview && imagePreview.startsWith("data:image/")) {
        const up = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: imagePreview }),
        });
        if (up.ok) {
          const j = await up.json();
          uploadedUrl = String(j.url);
        } else {
          const err = await up.json().catch(() => null);
          setErrors((prev) => ({ ...prev, image: err?.message || "No se pudo subir la imagen" }));
          return;
        }
      }

      const payload: Record<string, any> = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: parseInt(formData.stock || "0", 10),
        status: formData.status === "Inactivo" ? "Inactivo" : "Activo",
      };
      if (uploadedUrl) payload.imageUrl = uploadedUrl;

      const resp = await fetch(`/api/products/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        router.push("/dashboard/vendedor/products");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== "vendedor") {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="outline" onClick={() => router.push("/dashboard/vendedor/products")} className="mb-6">
        Volver a Productos
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del producto</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock disponible</Label>
              <Input id="stock" name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Input id="status" name="status" value={formData.status} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Imagen del Producto</Label>
              <div className="flex flex-col sm:flex-row items-center gap-4 border rounded-md p-4">
                <div className="flex-shrink-0 w-24 h-32 bg-secondary rounded-md flex items-center justify-center overflow-hidden border">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Vista previa" width={96} height={128} className="object-cover w-full h-full" />
                  ) : (
                    <div className="text-xs text-muted-foreground">Sin imagen</div>
                  )}
                </div>
                <div className="flex-grow text-center sm:text-left space-y-2">
                  <Input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> {imagePreview ? "Cambiar Imagen" : "Cargar Imagen"}
                  </Button>
                  {errors.image && (
                    <p className="text-xs text-destructive flex items-center justify-center sm:justify-start">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar Cambios"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

