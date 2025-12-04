// src/app/products/page.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, SlidersHorizontal, X, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/types/cart";
import { FavoriteButton } from "@/components/ui/favorite-button";
import type { FavoriteItem } from "@/context/FavoritesContext";
import { ProductQuickView } from "@/components/product-quick-view";

type CatalogProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  sizes?: string[];
  hint?: string;
  rating?: number;
  hasDelivery?: boolean;
};

const categories = [
  "Todos",
  "Camisas",
  "Pantalones",
  "Zapatos",
  "Sudaderas",
  "Ropa de Bebé",
  "Ropa Infantil",
  "Accesorios",
  "Vestidos",
];
const categorySlugs: Record<string, string | null> = {
  Todos: null,
  Camisas: "camisas",
  Pantalones: "pantalones",
  Zapatos: "zapatos",
  Sudaderas: "sudaderas",
  "Ropa de Bebé": "ropa-de-bebe",
  "Ropa Infantil": "ropa-infantil",
  Accesorios: "accesorios",
  Vestidos: "vestidos",
};
const sizes = [
  "Todas",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Talla Única",
  "0-3m",
  "3-6m",
  "6-9m",
  "9-12m",
  "12-18m",
  "2A",
  "3A",
  "4A",
  "5A",
  "6A",
  "7A",
  "8A",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "30W/32L",
  "32W/30L",
  "32W/32L",
  "34W/32L",
  "34W/34L",
];

const getCategoryFromParam = (param: string | null): string => {
  if (!param) return "Todos";
  const foundCategory = Object.keys(categorySlugs).find(
    (cat) => categorySlugs[cat] === param.toLowerCase(),
  );
  return foundCategory || "Todos";
};

const getParamFromCategory = (category: string): string | null => {
  return categorySlugs[category] || null;
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSize, setSelectedSize] = useState("Todas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    if (!searchParams) return;

    const currentSearch = searchParams.get("search") || "";
    const currentCategoryParam = searchParams.get("category");
    const currentSize = searchParams.get("size") || "Todas";
    const currentMinPrice = searchParams.get("minPrice") || "";
    const currentMaxPrice = searchParams.get("maxPrice") || "";

    setSearchTerm(currentSearch);
    setSelectedCategory(getCategoryFromParam(currentCategoryParam));
    setSelectedSize(currentSize);
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }, [searchParams]);

  useEffect(() => {
    setHasActiveFilters(
      selectedCategory !== "Todos" ||
      selectedSize !== "Todas" ||
      minPrice !== "" ||
      maxPrice !== "",
    );
  }, [selectedCategory, selectedSize, minPrice, maxPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resp = await fetch(`/api/products`);
        if (resp.ok) {
          const data = await resp.json();
          const raw = Array.isArray(data.products) ? data.products : [];
          const list: CatalogProduct[] = raw.map((p: any) => ({
            id: Number(p.id),
            name: String(p.name),
            price: Number(p.price),
            imageUrl: (() => {
              const raw = typeof p.imageUrl === "string" ? p.imageUrl.trim().replace(/\)$/, "") : "";
              return raw || `https://picsum.photos/seed/product-${p.id}/600/600`;
            })(),
            category: p.category,
            sizes: (() => {
              try {
                if (Array.isArray(p.sizes)) return p.sizes as string[];
                if (typeof p.sizes === "string") {
                  const txt = p.sizes.trim();
                  if (!txt) return [];
                  try {
                    const parsed = JSON.parse(txt);
                    return Array.isArray(parsed) ? parsed : [];
                  } catch {
                    if (txt.includes(",")) return txt.split(",").map((s: string) => s.trim()).filter(Boolean);
                    return [txt];
                  }
                }
                return [];
              } catch {
                return [];
              }
            })(),
            hint: p.hint,
            rating: typeof p.rating === "number" ? p.rating : 4.5,
            hasDelivery: typeof p.hasDelivery === "boolean" ? p.hasDelivery : true,
          }));
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
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;

    const matchesSize =
      selectedSize === "Todas" ||
      (Array.isArray(product.sizes) && product.sizes.includes(selectedSize));

    const productPriceNum = product.price;
    const matchesMinPrice =
      minPrice === "" ||
      isNaN(parseFloat(minPrice)) ||
      productPriceNum >= parseFloat(minPrice);
    const matchesMaxPrice =
      maxPrice === "" ||
      isNaN(parseFloat(maxPrice)) ||
      productPriceNum <= parseFloat(maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSize &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const handleAddToCart = (product: CatalogProduct) => {
    const sizeToAdd =
      selectedSize !== "Todas" && Array.isArray(product.sizes) && product.sizes.includes(selectedSize)
        ? selectedSize
        : (Array.isArray(product.sizes) && product.sizes[0]) || "N/A";

    const itemToAdd: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || `https://picsum.photos/seed/product-${product.id}/600/600`,
      quantity: 1,
      size: sizeToAdd,
    };
    addToCart(itemToAdd);
    toast({
      title: "Añadido al Carrito",
      description: `${product.name} (Talla: ${sizeToAdd}) ha sido añadido a tu carrito.`,
    });
  };

  const updateUrlFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() || ""); // Preserve existing params
    if (searchTerm) params.set("search", searchTerm);
    else params.delete("search");

    const categoryParam = getParamFromCategory(selectedCategory);
    if (categoryParam) params.set("category", categoryParam);
    else params.delete("category");

    if (selectedSize !== "Todas") params.set("size", selectedSize);
    else params.delete("size");
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [
    searchTerm,
    selectedCategory,
    selectedSize,
    minPrice,
    maxPrice,
    router,
    searchParams,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrlFilters();
    }, 500); // Increased debounce time slightly

    return () => clearTimeout(timer);
  }, [
    selectedCategory,
    selectedSize,
    minPrice,
    maxPrice,
    searchTerm,
    updateUrlFilters,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todos");
    setSelectedSize("Todas");
    setMinPrice("");
    setMaxPrice("");
    // URL update will be handled by the useEffect that calls updateUrlFilters
    toast({
      title: "Filtros Limpiados",
      description: "Se han restablecido todos los filtros.",
    });
  };

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-10 text-center">
        Catálogo de Productos
      </h1>

      <Card className="mb-8 border shadow-none sticky top-[calc(theme(spacing.16)+1px)] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <CardTitle className="text-lg flex items-center">
              <SlidersHorizontal className="mr-2 h-5 w-5" /> Filtros
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-muted-foreground"
              >
                <X className="mr-1 h-3 w-3" /> Limpiar Filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Label htmlFor="search" className="mb-1 block text-sm font-medium">
              Buscar Productos
            </Label>
            <Input
              id="search"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label
              htmlFor="category"
              className="mb-1 block text-sm font-medium"
            >
              Categoría
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="size" className="mb-1 block text-sm font-medium">
              Talla
            </Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger id="size">
                <SelectValue placeholder="Seleccionar talla" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label
                htmlFor="min-price"
                className="mb-1 block text-sm font-medium"
              >
                Precio Mín. (MXN)
              </Label>
              <Input
                id="min-price"
                type="number"
                placeholder="Mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label
                htmlFor="max-price"
                className="mb-1 block text-sm font-medium"
              >
                Precio Máx. (MXN)
              </Label>
              <Input
                id="max-price"
                type="number"
                placeholder="Máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden group border flex flex-col cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <CardHeader className="p-0 relative">
                  <Link
                    href={`/products/${product.id}`}
                    aria-label={`Ver ${product.name}`}
                  >
                    <Image
                      src={product.imageUrl || `https://picsum.photos/seed/product-${product.id}/600/600`}
                      alt={`Imagen de ${product.name}`}
                      width={400}
                      height={500}
                      className="object-cover w-full h-72"
                      data-ai-hint={product.hint}
                    />
                  </Link>
                  {/* Favorites overlay */}
                  <div className="absolute top-2 left-2">
                    <FavoriteButton
                      item={{
                        id: String(product.id),
                        name: product.name,
                        imageUrl: product.imageUrl || `https://picsum.photos/seed/product-${product.id}/600/600`,
                        price: product.price,
                        category: product.category || "",
                      } as FavoriteItem}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                    {/* Display primary size or indication of multiple sizes if not filtering by a specific one */}
                    <div className="bg-background/80 text-foreground px-2 py-1 rounded text-xs font-medium shadow">
                      {selectedSize !== "Todas" && Array.isArray(product.sizes) && product.sizes.includes(selectedSize)
                        ? selectedSize
                        : Array.isArray(product.sizes) && product.sizes.length === 1
                          ? product.sizes[0] || "N/A"
                          : "Varias tallas"}
                    </div>
                    <ProductQuickView product={{ ...product, sizes: product.sizes || [] }} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-lg font-semibold truncate group-hover:text-primary">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {product.category || ""}
                  </CardDescription>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Tallas:</span> {Array.isArray(product.sizes) ? product.sizes.join(", ") : "N/A"}
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
                  <p className="text-lg font-bold mt-2">
                    ${product.price.toFixed(2)} MXN
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full btn-accent"
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Añadir al Carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg bg-secondary/50">
            <p className="text-xl mb-2">No se encontraron productos</p>
            <p>Intenta ajustar tus filtros o revisa la búsqueda.</p>
            <Button variant="link" onClick={clearFilters} className="mt-4">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
