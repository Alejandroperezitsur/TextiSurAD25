"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Datos de ejemplo para productos
const mockProducts = [
  {
    id: "1",
    name: "Camisa Clásica Teal",
    price: 29.99,
    imageUrl: "https://i.etsystatic.com/6777526/r/il/b079af/4824317243/il_570xN.4824317243_nsi7.jpg",
    stock: 15,
    status: "Activo",
  },
  {
    id: "2",
    name: "Camiseta Básica Gris",
    price: 19.99,
    imageUrl: "https://myspringfield.com/dw/image/v2/AAYL_PRD/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwecf64744/images/hi-res/P_680084145FM.jpg?sw=600&sh=900&sm=fit",
    stock: 30,
    status: "Activo",
  },
  {
    id: "3",
    name: "Camisa de Franela a Cuadros",
    price: 35.0,
    imageUrl: "https://i.etsystatic.com/35566366/r/il/9281d3/5173059999/il_fullxfull.5173059999_tslo.jpg",
    stock: 0,
    status: "Agotado",
  },
];

export default function ProductsManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState(mockProducts);

  useEffect(() => {
    // Verificar que el usuario sea vendedor
    if (!user || user.role !== "vendedor") {
      router.push("/");
      return;
    }
  }, [user, router]);

  const handleDelete = (id: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este producto?`)) {
      setProducts(products.filter(product => product.id !== id));
    }
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
              <Image
                src={product.imageUrl}
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
                <span className={product.status === "Agotado" ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                  {product.status}
                </span>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => router.push(`/dashboard/vendedor/products/edit/${product.id}`)}>
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