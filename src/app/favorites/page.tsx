// src/app/favorites/page.tsx
"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/types/cart";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (fav: typeof favorites[number]) => {
    const item: CartItem = {
      id: parseInt(String(fav.id), 10),
      name: fav.name,
      price: fav.price,
      imageUrl: fav.imageUrl,
      quantity: 1,
      size: "N/A",
    };
    addToCart(item);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Mis Favoritos</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg bg-secondary/50">
          <p className="text-xl mb-2">Aún no tienes favoritos</p>
          <p>Explora productos y marca tus favoritos con el corazón.</p>
          <Link href="/products">
            <Button className="mt-4">Explorar productos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((fav) => (
            <Card key={`${fav.id}-${fav.addedAt}`} className="overflow-hidden group border flex flex-col">
              <CardHeader className="p-0">
                <Link href={`/products/${fav.id}`} aria-label={`Ver ${fav.name}`}>
                  <Image
                    src={fav.imageUrl}
                    alt={`Imagen de ${fav.name}`}
                    width={400}
                    height={500}
                    className="object-cover w-full h-72"
                  />
                </Link>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold truncate group-hover:text-primary">
                  {fav.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{fav.category ?? "Producto"}</p>
                <p className="text-lg font-bold mt-2">${fav.price.toFixed(2)} MXN</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button className="flex-1" onClick={() => handleAddToCart(fav)}>
                  <ShoppingBag className="mr-2 h-4 w-4" /> Añadir al Carrito
                </Button>
                <Button variant="destructive" size="icon" onClick={() => removeFavorite(String(fav.id))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}