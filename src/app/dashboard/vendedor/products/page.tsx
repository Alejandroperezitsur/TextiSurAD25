"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FavoriteButton } from "@/components/ui/favorite-button";

type Prod = { id: number; name: string; price: number; imageUrl?: string; stock: number; status: string };

export default function ProductsManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Prod[]>([]);

  useEffect(() => {
    if (!user || user.role !== "vendedor") {
      router.push("/");
      return;
    }
    const fetchProducts = async () => {
      try {
        const resp = await fetch(`/api/products?userEmail=${encodeURIComponent(user.email)}`);
        if (resp.ok) {
          const data = await resp.json();
          const list = (data.products || []).map((p: any) => ({ id: Number(p.id), name: p.name, price: Number(p.price), imageUrl: p.imageUrl, stock: Number(p.stock), status: String(p.status) }));
          setProducts(list);
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();
    const es = new EventSource(`/api/products/stream`);
    es.onmessage = () => fetchProducts();
    return () => { es.close(); };
  }, [user, router]);

  const handleDelete = async (id: number) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar este producto?`)) return;
    try {
      const resp = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (resp.status === 204) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {}
  };

  if (!user || user.role !== "vendedor") {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <Link href="/dashboard/vendedor/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
          </Button>
        </Link>
      </div>

      <Link href="/dashboard/vendedor">
        <Button variant="outline" className="mb-6">
          Volver al Dashboard
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <div className="relative h-48 w-full">
              <div className="absolute top-2 left-2 z-10">
                <FavoriteButton
                  item={{
                    id: String(product.id),
                    name: product.name,
                    imageUrl: product.imageUrl || `https://picsum.photos/seed/product-${product.id}/600/600`,
                    price: product.price,
                    category: "Mis Productos",
                  }}
                />
              </div>
              <Image
                src={product.imageUrl || `https://picsum.photos/seed/product-${product.id}/600/600`}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-2">
                <span>Precio:</span>
                <span className="font-bold">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Stock:</span>
                <span className={product.stock === 0 ? "text-red-500 font-bold" : "font-bold"}>
                  {product.stock}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Estado:</span>
                <span className={product.status !== "Activo" ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                  {product.status}
                </span>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/dashboard/vendedor/products/${product.id}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}