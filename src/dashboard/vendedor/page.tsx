// src/app/dashboard/vendedor/page.tsx
'use client'; // Required for useRouter

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, PackagePlus, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Added useRouter

// Mock data for seller's products - Using specific seeds consistent with other pages
const sellerProducts = [
  {
    id: 1,
    name: 'Camisa Clásica Teal',
    price: '$29.99',
    imageUrl: 'https://picsum.photos/seed/tealshirt1/400/500',
    stock: 15,
    status: 'Activo',
    hint: 'teal shirt',
  },
  {
    id: 5,
    name: 'Camiseta Básica Gris',
    price: '$19.99',
    imageUrl: 'https://picsum.photos/seed/greytshirt1/400/500',
    stock: 30,
    status: 'Activo',
    hint: 'grey t-shirt',
  },
  {
    id: 9,
    name: 'Camisa de Franela a Cuadros',
    price: '$35.00',
    imageUrl: 'https://picsum.photos/seed/flannelshirt1/400/500',
    stock: 0,
    status: 'Agotado',
    hint: 'flannel shirt',
  },
  // Maybe add one more seller-specific item?
  {
    id: 13,
    name: 'Chaqueta Denim Vintage',
    price: '$75.00',
    imageUrl: 'https://picsum.photos/seed/denimjacket/400/500',
    stock: 5,
    status: 'Activo',
    hint: 'denim jacket',
  },
];

export default function SellerDashboardPage() {
  const router = useRouter(); // Initialize router

  // Add handlers for editing/deleting products (will need actual logic)
  const handleEdit = (id: number) => {
    console.log(`Edit product ${id}`);
    // Example: router.push(`/dashboard/vendedor/editar/${id}`);
    alert(`Editar producto ${id} (funcionalidad pendiente)`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`¿Seguro que quieres eliminar el producto ${id}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      const resp = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (resp.status === 204) {
        // In this legacy page, products are mocked; optionally do nothing or reload.
        // window.location.reload();
      } else if (resp.status === 404) {
        alert("Producto no encontrado");
      } else {
        const data = await resp.json().catch(() => null);
        alert(`Error al eliminar: ${data?.message || resp.statusText}`);
      }
    } catch (error) {
      console.error("DELETE product error", error);
      alert("Error de red al eliminar el producto");
    }
  };

  const handleGoBack = () => {
    router.back(); // Navigate to the previous page, likely the profile or home
  };

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 group text-muted-foreground hover:text-foreground pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{' '}
        Volver
      </Button>

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
          <p className="text-xl text-muted-foreground mb-4">Aún no tienes productos publicados.</p>
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
                <Link href={`/products/${product.id}`} aria-label={`Ver ${product.name}`}>
                  <Image
                    src={product.imageUrl}
                    alt={`Imagen de ${product.name}`} // Descriptive alt text
                    width={400}
                    height={500}
                    className="object-cover w-full h-72" // Consistent height
                    data-ai-hint={product.hint} // Added data-ai-hint
                  />
                </Link>
                <div
                  className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium shadow ${product.status === 'Activo' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}
                >
                  {product.status}
                </div>
                {product.stock === 0 && product.status === 'Activo' && (
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
                <p className="text-lg font-bold mt-2">{product.price}</p>
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
