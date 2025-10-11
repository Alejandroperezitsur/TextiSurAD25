"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag, Clock, MapPin, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/types/cart";

// Importamos los datos de tiendas y productos desde la página principal
// En una aplicación real, estos datos vendrían de una API
import { registeredStores, allProducts } from "../../page";

export default function StorePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [store, setStore] = useState<any>(null);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          <p className="text-lg text-muted-foreground mb-6">{store.description}</p>
          
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
            <Card key={product.id} className="overflow-hidden group border border-border/50 hover:border-accent/50 transition-all hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
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
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-bold text-lg text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="rounded-full bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Añadir
                  </Button>
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