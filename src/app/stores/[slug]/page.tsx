"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag, Clock, MapPin, Truck, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/types/cart";
import { FavoriteButton } from "@/components/ui/favorite-button";

// Importamos los datos de tiendas y productos desde la página principal
// En una aplicación real, estos datos vendrían de una API
import { registeredStores, allProducts } from "../../page";

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [store, setStore] = useState<any>(null);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Simulamos una carga de datos
    setLoading(true);
    
    // Encontramos la tienda por su slug
    const foundStore = registeredStores.find((s) => s.slug === slug);
    
    if (foundStore) {
      setStore(foundStore);
      
      // Filtramos los productos por tienda
      const products = allProducts.filter(
        (product) => product.storeId === foundStore.id
      );
      
      setStoreProducts(products);

      // Determinar si la tienda pertenece al usuario actual
      const checkOwnership = async () => {
        try {
          const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
          const user = userRaw ? JSON.parse(userRaw) : null;
          const email = user?.email as string | undefined;
          if (email) {
            const resp = await fetch(`/api/stores/by-user?email=${encodeURIComponent(email)}`);
            if (resp.ok) {
              const data = await resp.json();
              const slugOwned = data?.store?.slug as string | undefined;
              if (slugOwned && slugOwned === foundStore.slug) {
                setIsOwner(true);
              } else {
                setIsOwner(false);
              }
            } else if (resp.status === 404) {
              // Fallback a localStorage
              try {
                const ls = localStorage.getItem("seller-store");
                if (ls) {
                  const s = JSON.parse(ls);
                  const slugOwned = s?.slug as string | undefined;
                  setIsOwner(Boolean(slugOwned && slugOwned === foundStore.slug));
                }
              } catch {}
            }
          }
        } catch {
          setIsOwner(false);
        }
      };
      checkOwnership();
    }
    
    setLoading(false);
  }, [slug]);

  const handleAddToCart = (product: any) => {
    const itemToAdd: CartItem = {
      id: typeof product.id === 'number' ? product.id : parseInt(product.id, 10),
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      size: product.sizes[0] || "N/A", // Default to first size or N/A
      storeId: product.storeId,
    };
    addToCart(itemToAdd);
    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al carrito.`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <p className="text-xl">Cargando información de la tienda...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Tienda no encontrada</h1>
        <p>Lo sentimos, la tienda que buscas no existe.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      {/* Cabecera de la tienda */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="relative w-full md:w-1/3 h-64 md:h-auto rounded-lg overflow-hidden">
          <Image
            src={store.imageUrl}
            alt={store.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        
      <div className="w-full md:w-2/3">
        <h1 className="text-4xl font-bold mb-4">{store.name}</h1>
        {isOwner && (
          <div className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-4">
            Tu tienda
          </div>
        )}
        <p className="text-lg text-muted-foreground mb-6">{store.description}</p>
        {isOwner && (
          <div className="flex gap-2 mb-6">
            <Button asChild variant="outline">
              <Link href="/dashboard/vendedor/store/edit">Editar tienda</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/vendedor/nuevo">Agregar producto</Link>
            </Button>
          </div>
        )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Horarios */}
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Horarios</h3>
                <p className="text-sm">Lunes a Viernes: 9:00 - 19:00</p>
                <p className="text-sm">Sábados: 10:00 - 14:00</p>
              </div>
            </div>
            
            {/* Dirección */}
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Dirección</h3>
                <p className="text-sm">Av. Principal 123, Punta Arenas</p>
                <p className="text-sm">Región de Magallanes</p>
              </div>
            </div>
            
            {/* Envíos */}
            <div className="flex items-start gap-3">
              <Truck className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Envíos</h3>
                <p className="text-sm">{store.id === 'store1' || store.id === 'store3' || store.id === 'store6' ? 'Disponible a domicilio' : 'Solo retiro en tienda'}</p>
                <p className="text-sm">{store.id === 'store1' || store.id === 'store3' || store.id === 'store6' ? 'Entrega: 24-48 horas' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Productos de la tienda */}
      <h2 className="text-3xl font-bold mb-8">Productos de {store.name}</h2>
      
      {storeProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {storeProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group border border-border/50 hover:border-accent/50 transition-all hover:shadow-lg cursor-pointer"
              onClick={() => router.push(`/products/${typeof product.id === 'number' ? product.id : parseInt(product.id, 10)}`)}
            >
              <div className="relative aspect-square overflow-hidden">
                {/* Favorites overlay */}
                <div className="absolute top-2 left-2 z-10">
                  {/** @ts-ignore */}
                  <FavoriteButton
                    item={{
                      id: String(product.id),
                      name: product.name,
                      imageUrl: product.imageUrl,
                      price: product.price,
                      category: product.category,
                    }}
                  />
                </div>
                {isOwner && (
                  <div className="absolute top-12 left-2 z-10 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Tu producto
                  </div>
                )}
                {/* Overlay size or multiple sizes indicator */}
                <div className="absolute top-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs font-medium shadow z-10">
                  {Array.isArray(product.sizes)
                    ? product.sizes.length > 1
                      ? "Múltiples tallas"
                      : product.sizes[0] || "N/A"
                    : "N/A"}
                </div>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                />
              </div>
              <CardContent className="p-5">
                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {product.category}
                </CardDescription>
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Tallas:</span> {product.sizes?.join(", ")}
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 mr-1" />
                    {(product.rating ?? 4.5).toFixed(1)}
                  </span>
                  <span className="flex items-center text-muted-foreground">
                    <Truck className="h-4 w-4 mr-1" />
                    {product.hasDelivery ? "Envío a domicilio" : "Sin envío"}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-bold text-lg text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    className="rounded-full bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Añadir
                  </Button>
                  {isOwner && (
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <Link href={`/dashboard/vendedor/products/${typeof product.id === 'number' ? product.id : parseInt(product.id, 10)}/edit`} onClick={(e) => e.stopPropagation()}>Editar</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-xl text-muted-foreground">No hay productos disponibles para esta tienda.</p>
        </div>
      )}
    </div>
  );
}