// src/app/dashboard/vendedor/page.tsx
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
import { PlusCircle, Edit, Trash2, PackagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Mock data for seller's products - Using a subset of the new real product data
const sellerProducts = [
  {
    id: 1,
    name: "Camisa Clásica Teal",
    price: 29.99,
    imageUrl:
      "https://i.etsystatic.com/6777526/r/il/b079af/4824317243/il_570xN.4824317243_nsi7.jpg",
    stock: 15,
    status: "Activo",
    hint: "teal shirt",
  },
  {
    id: 5,
    name: "Camiseta Básica Gris",
    price: 19.99,
    imageUrl:
      "https://myspringfield.com/dw/image/v2/AAYL_PRD/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwecf64744/images/hi-res/P_680084145FM.jpg?sw=600&sh=900&sm=fit",
    stock: 30,
    status: "Activo",
    hint: "grey t-shirt",
  },
  {
    id: 9,
    name: "Camisa de Franela a Cuadros",
    price: 35.0,
    imageUrl:
      "https://i.etsystatic.com/35566366/r/il/9281d3/5173059999/il_fullxfull.5173059999_tslo.jpg",
    stock: 0,
    status: "Agotado",
    hint: "flannel shirt",
  },
  {
    id: 13,
    name: "Zapatillas Deportivas Blancas",
    price: 75.0,
    imageUrl: "https://picsum.photos/seed/whitesneakers/400/500",
    stock: 5,
    status: "Activo",
    hint: "white sneakers",
  },
];

interface User {
  id: number;
  name: string;
  email: string;
  role: "comprador" | "vendedor";
}

export default function SellerDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/(auth)/login");
      return;
    }

    // Obtener los datos del usuario directamente del localStorage
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      if (userData) {
        setUser(userData);
      } else {
        router.push("/(auth)/login");
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      router.push("/(auth)/login");
    }
  }, [router]);

  const handleEdit = (id: number) => {
    console.log(`Edit product ${id}`);
    alert(`Editar producto ${id} (funcionalidad pendiente)`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete product ${id}`);
    if (
      confirm(
        `¿Seguro que quieres eliminar el producto ${id}? Esta acción no se puede deshacer.`,
      )
    ) {
      alert(`Producto ${id} eliminado (simulación).`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 group text-muted-foreground hover:text-foreground pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
        Volver
      </Button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-lg text-muted-foreground">Rol: {user?.role}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Mis Publicaciones
        </h1>
        <Link href="/dashboard/vendedor/nuevo">
          <Button className="btn-accent w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Producto
          </Button>
        </Link>
      </div>

      {sellerProducts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-secondary/50">
          <PackagePlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-4">
            Aún no tienes productos publicados.
          </p>
          <Link href="/dashboard/vendedor/nuevo">
            <Button className="btn-accent">Publicar mi primer producto</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sellerProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group border transition-colors duration-300 hover:border-primary flex flex-col"
            >
              <CardHeader className="p-0 relative">
                <Link
                  href={`/products/${product.id}`}
                  aria-label={`Ver ${product.name}`}
                >
                  <Image
                    src={product.imageUrl}
                    alt={`Imagen de ${product.name}`}
                    width={400}
                    height={500}
                    className="object-cover w-full h-72"
                    data-ai-hint={product.hint}
                  />
                </Link>
                <div
                  className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium shadow ${product.status === "Activo" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"}`}
                >
                  {product.status}
                </div>
                {product.stock === 0 && product.status === "Activo" && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium shadow bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Sin Stock
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold truncate group-hover:text-primary">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Stock: {product.stock}
                </CardDescription>
                <p className="text-lg font-bold mt-2">
                  ${product.price.toFixed(2)} MXN
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between space-x-2 border-t mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" /> Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="flex-1"
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
