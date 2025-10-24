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

// Updated product data with real product information
const allProductsFull = [
  {
    id: "1",
    name: "Camisa Clásica Teal",
    price: 29.99,
    imageUrl:
      "https://i.etsystatic.com/6777526/r/il/b079af/4824317243/il_570xN.4824317243_nsi7.jpg",
    description:
      "Una camisa cómoda y elegante en nuestro color teal característico. Hecha de 100% algodón orgánico.",
    category: "Camisas",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 120,
    material: "100% Algodón Orgánico",
    care: "Lavar a máquina con agua fría, secar en secadora a baja temperatura.",
    hint: "teal shirt",
  },
  {
    id: "2",
    name: "Jeans Cómodos Grises",
    price: 45.5,
    imageUrl:
      "https://pantalonesdemezclilla.mx/cdn/shop/files/Regular-Mom-Jeans-Gris-Para-Hombre_1_9d1541b8-cbda-46af-9395-a597fadd6194.jpg?v=1727668588&width=1445",
    description:
      "Jeans grises duraderos y suaves, perfectos para el uso diario. Diseño clásico de cinco bolsillos.",
    category: "Pantalones",
    sizes: ["30W/32L", "32W/32L", "34W/34L"],
    rating: 4.2,
    reviews: 85,
    material: "98% Algodón, 2% Elastano",
    care: "Lavar a máquina con colores similares, no usar lejía.",
    hint: "grey jeans",
  },
  {
    id: "3",
    name: "Bufanda Amarilla Mostaza",
    price: 15.0,
    imageUrl:
      "https://i.etsystatic.com/8658679/r/il/f2ce25/2845568138/il_570xN.2845568138_r82f.jpg",
    description:
      "Añade un toque de color con esta suave bufanda amarilla mostaza. Ligera y versátil.",
    category: "Accesorios",
    sizes: ["Talla Única"],
    rating: 4.8,
    reviews: 210,
    material: "100% Acrílico Suave",
    care: "Lavar a mano con agua fría, secar al aire.",
    hint: "mustard scarf",
  },
  {
    id: "4",
    name: "Vestido Rayado Teal",
    price: 55.0,
    imageUrl:
      "https://shasa.com/cdn/shop/files/2403378111_1.jpg?v=1718325587&width=3840",
    category: "Vestidos",
    description:
      "Elegante vestido a rayas en teal y blanco. Perfecto para salidas de verano.",
    sizes: ["XS", "S", "M"],
    rating: 4.6,
    reviews: 95,
    material: "Mezcla de Rayón y Lino",
    care: "Lavar a mano o en ciclo delicado, colgar para secar.",
    hint: "striped dress",
  },
  {
    id: "5",
    name: "Camiseta Básica Gris",
    price: 19.99,
    imageUrl:
      "https://myspringfield.com/dw/image/v2/AAYL_PRD/on/demandware.static/-/Sites-gc-spf-master-catalog/default/dwecf64744/images/hi-res/P_680084145FM.jpg?sw=600&sh=900&sm=fit",
    description: "Camiseta esencial de cuello redondo en gris jaspeado.",
    category: "Camisas",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.3,
    reviews: 150,
    material: "60% Algodón, 40% Poliéster",
    care: "Lavar a máquina.",
    hint: "grey t-shirt",
  },
  {
    id: "6",
    name: "Jeans Lavado Oscuro",
    price: 49.99,
    imageUrl: "https://ss849.suburbia.com.mx/xl/5010687111.jpg",
    description: "Jeans de corte recto con un lavado oscuro clásico.",
    category: "Pantalones",
    sizes: ["32W/30L", "32W/32L", "34W/32L"],
    rating: 4.4,
    reviews: 90,
    material: "100% Algodón",
    care: "Lavar del revés.",
    hint: "dark jeans",
  },
  {
    id: "7",
    name: "Vestido Estampado Floral",
    price: 62.0,
    imageUrl:
      "https://erivel.mx/wp-content/uploads/2024/03/VESTIDO-FLORAL-1.webp",
    description: "Vestido ligero con estampado floral, ideal para primavera.",
    category: "Vestidos",
    sizes: ["S", "M", "L"],
    rating: 4.7,
    reviews: 110,
    material: "100% Viscosa",
    care: "Lavar a mano.",
    hint: "floral dress",
  },
  {
    id: "8",
    name: "Gorro de Lana Teal",
    price: 22.0,
    imageUrl:
      "https://i.etsystatic.com/7558906/r/il/0d3368/2131357407/il_570xN.2131357407_a3p9.jpg",
    description: "Gorro de punto cálido en color teal.",
    category: "Accesorios",
    sizes: ["Talla Única"],
    rating: 4.9,
    reviews: 180,
    material: "100% Lana Merino",
    care: "Lavar a mano.",
    hint: "teal beanie",
  },
  {
    id: "9",
    name: "Camisa de Franela a Cuadros",
    price: 35.0,
    imageUrl:
      "https://i.etsystatic.com/35566366/r/il/9281d3/5173059999/il_fullxfull.5173059999_tslo.jpg",
    description: "Camisa de franela suave y cálida con patrón a cuadros.",
    category: "Camisas",
    sizes: ["M", "L", "XL"],
    rating: 4.5,
    reviews: 135,
    material: "100% Algodón Cepillado",
    care: "Lavar a máquina.",
    hint: "flannel shirt",
  },
  {
    id: "10",
    name: "Pantalones Cargo Beige",
    price: 42.0,
    imageUrl:
      "https://calvinkleinmx.vteximg.com.br/arquivos/ids/485180-400-436/J30J326829RAE-PLANO.jpg?v=638570222839270000",
    description: "Pantalones cargo prácticos y resistentes en color beige.",
    category: "Pantalones",
    sizes: ["M", "L", "XL"],
    rating: 4.1,
    reviews: 75,
    material: "100% Algodón Ripstop",
    care: "Lavar a máquina.",
    hint: "beige cargo",
  },
  {
    id: "13",
    name: "Zapatillas Deportivas Blancas",
    price: 75.0,
    imageUrl: "https://picsum.photos/seed/whitesneakers/400/500",
    category: "Zapatos",
    sizes: ["40", "41", "42", "43", "44"],
    rating: 4.7,
    reviews: 150,
    material: "Cuero Sintético y Malla",
    care: "Limpiar con paño húmedo.",
    hint: "white sneakers",
  },
  {
    id: "14",
    name: "Botines de Cuero Negros",
    price: 95.0,
    imageUrl: "https://picsum.photos/seed/blackboots/400/500",
    category: "Zapatos",
    sizes: ["39", "40", "41", "42"],
    rating: 4.6,
    reviews: 110,
    material: "100% Cuero",
    care: "Usar productos específicos para cuero.",
    hint: "black boots",
  },
  {
    id: "15",
    name: "Body de Bebé (Pack 3)",
    price: 25.0,
    imageUrl: "https://picsum.photos/seed/babybodysuit/400/500",
    category: "Ropa de Bebé",
    sizes: ["0-3m", "3-6m", "6-9m"],
    rating: 4.9,
    reviews: 250,
    material: "100% Algodón",
    care: "Lavar a máquina con agua tibia.",
    hint: "baby bodysuit",
  },
  {
    id: "16",
    name: "Pijama de Bebé Estampado",
    price: 18.0,
    imageUrl: "https://picsum.photos/seed/babypajamas/400/500",
    category: "Ropa de Bebé",
    sizes: ["6-9m", "9-12m", "12-18m"],
    rating: 4.8,
    reviews: 190,
    material: "100% Algodón Orgánico",
    care: "Lavar a máquina con agua fría.",
    hint: "baby pajamas",
  },
  {
    id: "17",
    name: "Sudadera con Capucha Gris",
    price: 48.0,
    imageUrl: "https://picsum.photos/seed/greyhoodie/400/500",
    category: "Sudaderas",
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 140,
    material: "80% Algodón, 20% Poliéster",
    care: "Lavar a máquina.",
    hint: "grey hoodie",
  },
  {
    id: "18",
    name: "Sudadera Azul Marino",
    price: 40.0,
    imageUrl: "https://picsum.photos/seed/navysweatshirt/400/500",
    category: "Sudaderas",
    sizes: ["S", "M", "L"],
    rating: 4.4,
    reviews: 125,
    material: "70% Algodón, 30% Poliéster",
    care: "Lavar a máquina.",
    hint: "navy sweatshirt",
  },
  {
    id: "19",
    name: "Camiseta Niño Dinosaurio",
    price: 15.0,
    imageUrl: "https://picsum.photos/seed/boystshirt/400/500",
    category: "Ropa Infantil",
    sizes: ["2A", "3A", "4A", "5A"],
    rating: 4.7,
    reviews: 95,
    material: "100% Algodón",
    care: "Lavar a máquina.",
    hint: "boys t-shirt",
  },
  {
    id: "20",
    name: "Pantalón Corto Niño Azul",
    price: 20.0,
    imageUrl: "https://picsum.photos/seed/boysshorts/400/500",
    category: "Ropa Infantil",
    sizes: ["4A", "5A", "6A"],
    rating: 4.6,
    reviews: 80,
    material: "100% Algodón",
    care: "Lavar a máquina.",
    hint: "boys shorts",
  },
  {
    id: "21",
    name: "Vestido Niña Flores",
    price: 30.0,
    imageUrl: "https://picsum.photos/seed/girlsdress/400/500",
    category: "Ropa Infantil",
    sizes: ["4A", "5A", "6A", "7A"],
    rating: 4.8,
    reviews: 115,
    material: "100% Viscosa",
    care: "Lavar a mano o ciclo delicado.",
    hint: "girls dress",
  },
  {
    id: "22",
    name: "Leggings Niña Rayas",
    price: 18.0,
    imageUrl: "https://picsum.photos/seed/girlsleggings/400/500",
    category: "Ropa Infantil",
    sizes: ["5A", "6A", "7A", "8A"],
    rating: 4.7,
    reviews: 100,
    material: "95% Algodón, 5% Elastano",
    care: "Lavar a máquina.",
    hint: "girls leggings",
  },
];

// Map to the structure expected by the catalog page
const allProducts = allProductsFull.map((p) => ({
  id: parseInt(p.id, 10), // Convert id to number for consistency with cart
  name: p.name,
  price: p.price,
  imageUrl: p.imageUrl,
  category: p.category,
  size: p.sizes[0] || "Talla Única", // Display primary size
  hint: p.hint,
  rating: p.rating ?? 4.5,
  hasDelivery: true,
}));

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
  }, [searchParams?.toString()]); // Depend on searchParams.toString()

  useEffect(() => {
    setHasActiveFilters(
      selectedCategory !== "Todos" ||
        selectedSize !== "Todas" ||
        minPrice !== "" ||
        maxPrice !== "",
    );
  }, [selectedCategory, selectedSize, minPrice, maxPrice]);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;

    // For size matching, check if the product is in allProductsFull and if any of its sizes match selectedSize
    // This requires finding the full product details to access its `sizes` array.
    const fullProductDetails = allProductsFull.find(
      (p) => p.id === product.id.toString(),
    );
    const matchesSize =
      selectedSize === "Todas" ||
      (fullProductDetails && fullProductDetails.sizes.includes(selectedSize));

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

  const handleAddToCart = (product: (typeof allProducts)[0]) => {
    // Determine the actual size to add. If 'Talla Única' is selected or product has only one, use that.
    // For products with multiple sizes where a specific one isn't selected via filter, default to first.
    // This logic might need refinement based on UX for adding from product list vs detail page.
    const sizeToAdd =
      selectedSize !== "Todas" && product.size === selectedSize
        ? selectedSize
        : allProductsFull.find((p) => p.id === product.id.toString())
            ?.sizes[0] || "N/A";

    const itemToAdd: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
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
                      src={product.imageUrl}
                      alt={`Imagen de ${product.name}`}
                      width={400}
                      height={500}
                      className="object-cover w-full h-72"
                      data-ai-hint={product.hint}
                    />
                  </Link>
                  {/* Favorites overlay */}
                  <div className="absolute top-2 left-2">
                    {/* Pass minimal product snapshot for favorites */}
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
                  {/* Display primary size or indication of multiple sizes if not filtering by a specific one */}
                  <div className="absolute top-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs font-medium shadow">
                    {selectedSize !== "Todas" && product.size === selectedSize
                      ? product.size
                      : allProductsFull.find(
                            (p) => p.id === product.id.toString(),
                          )?.sizes.length === 1
                        ? product.size
                        : "Varias tallas"}
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-lg font-semibold truncate group-hover:text-primary">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {product.category}
                  </CardDescription>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Tallas:</span> {allProductsFull.find(p => p.id === product.id.toString())?.sizes.join(", ") || "N/A"}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <span className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 mr-1" />
                      {product.rating.toFixed(1)}
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
