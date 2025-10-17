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
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

interface SellerProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  status: "Activo" | "Inactivo";
  category?: string;
  sizes?: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number((params as any)?.id);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<SellerProduct | null>(null);

  useEffect(() => {
    // Autenticación básica de vendedor
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
    } catch {
      router.replace("/login");
      return;
    }

    // Cargar producto desde localStorage o crear uno por defecto
    const stored = localStorage.getItem("seller-products");
    if (stored) {
      try {
        const arr: SellerProduct[] = JSON.parse(stored);
        const found = arr.find((p) => p.id === productId) || null;
        if (found) {
          setProduct(found);
        } else {
          setProduct({
            id: productId,
            name: `Producto ${productId}`,
            price: 0,
            imageUrl: "https://picsum.photos/seed/product/400/500",
            stock: 0,
            status: "Activo",
            sizes: [],
          });
        }
      } catch {
        setProduct({
          id: productId,
          name: `Producto ${productId}`,
          price: 0,
          imageUrl: "https://picsum.photos/seed/product/400/500",
          stock: 0,
          status: "Activo",
          sizes: [],
        });
      }
    } else {
      setProduct({
        id: productId,
        name: `Producto ${productId}`,
        price: 0,
        imageUrl: "https://picsum.photos/seed/product/400/500",
        stock: 0,
        status: "Activo",
        sizes: [],
      });
    }

    setLoading(false);
  }, [productId, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const stored = localStorage.getItem("seller-products");
      let arr: SellerProduct[] = [];
      if (stored) {
        arr = JSON.parse(stored);
      }

      const index = arr.findIndex((p) => p.id === product.id);
      if (index >= 0) {
        arr[index] = product;
      } else {
        arr.push(product);
      }
      localStorage.setItem("seller-products", JSON.stringify(arr));
      router.replace("/dashboard/vendedor");
    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("No se pudo guardar el producto.");
    }
  };

  if (loading || !product) {
    return (
      <div className="container mx-auto flex-1 py-12 px-4 md:px-6">Cargando...</div>
    );
  }

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
          <CardDescription>Modifica la información de tu producto.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (MXN)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value || "0") })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={product.stock}
                  onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value || "0", 10) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  className="border rounded h-10 px-3"
                  value={product.status}
                  onChange={(e) => setProduct({ ...product, status: e.target.value as SellerProduct["status"] })}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={product.category || ""}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de Imagen</Label>
              <Input
                id="imageUrl"
                value={product.imageUrl}
                onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
              />
              <div className="text-xs text-muted-foreground">Usa una URL pública por ahora.</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sizes">Tallas (separadas por coma)</Label>
              <Input
                id="sizes"
                value={(product.sizes || []).join(", ")}
                onChange={(e) => setProduct({ ...product, sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              />
            </div>

            <CardFooter className="flex justify-end gap-3 px-0">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" className="btn-accent">Guardar Cambios</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}