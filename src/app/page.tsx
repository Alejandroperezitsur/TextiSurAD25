// src/app/page.tsx
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
  Shirt,
  ShoppingBag,
  Tag,
  Percent,
  Store as StoreIcon,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/types/cart";
import {
  Footprints,
  Baby,
  Shirt as HoodieIcon,
  PersonStanding,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect, cloneElement } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Use a subset of the new product list for featured products
const featuredProductsFull = [
  {
    id: "1",
    name: "Camisa Clásica Teal",
    price: 29.99,
    imageUrl:
      "https://i.etsystatic.com/6777526/r/il/b079af/4824317243/il_570xN.4824317243_nsi7.jpg",
    category: "Camisas",
    sizes: ["S", "M", "L", "XL"],
    hint: "teal shirt",
    storeId: "store2", // Moda Urbana Hnos. Pérez
  },
  {
    id: "13",
    name: "Zapatillas Deportivas Blancas",
    price: 75.0,
    imageUrl: "https://picsum.photos/seed/whitesneakers/400/500",
    category: "Zapatos",
    sizes: ["40", "41", "42", "43", "44"],
    hint: "white sneakers",
    storeId: "store7", // Calzados El Caminante
  },
  {
    id: "17",
    name: "Sudadera con Capucha Gris",
    price: 48.0,
    imageUrl: "https://picsum.photos/seed/greyhoodie/400/500",
    category: "Sudaderas",
    sizes: ["S", "M", "L", "XL"],
    hint: "grey hoodie",
    storeId: "store2", // Moda Urbana Hnos. Pérez
  },
];

// Productos adicionales para asegurar que cada tienda tenga al menos un producto
// Exportamos para que sea accesible desde la página de tienda
export const allProducts = [
  ...featuredProductsFull,
  {
    id: "2",
    name: "Vestido Floral Verano",
    price: 45.99,
    imageUrl: "https://picsum.photos/seed/summerdress/400/500",
    category: "Vestidos",
    sizes: ["S", "M", "L"],
    hint: "summer dress",
    storeId: "store6", // El Vestidor de Ana
  },
  {
    id: "3",
    name: "Bufanda Artesanal",
    price: 18.50,
    imageUrl: "https://picsum.photos/seed/handmadescarf/400/500",
    category: "Accesorios",
    sizes: ["Única"],
    hint: "handmade scarf",
    storeId: "store1", // Artesanías Elena
  },
  {
    id: "4",
    name: "Gorro de Lana",
    price: 15.99,
    imageUrl: "https://picsum.photos/seed/woolhat/400/500",
    category: "Accesorios",
    sizes: ["Única"],
    hint: "wool hat",
    storeId: "store4", // Hilos del Sur
  },
  {
    id: "5",
    name: "Pijama Infantil",
    price: 22.99,
    imageUrl: "https://picsum.photos/seed/kidspajama/400/500",
    category: "Ropa Infantil",
    sizes: ["2", "4", "6", "8"],
    hint: "kids pajama",
    storeId: "store5", // Rincón Infantil
  },
  {
    id: "6",
    name: "Bolso de Mano",
    price: 35.50,
    imageUrl: "https://picsum.photos/seed/handbag/400/500",
    category: "Accesorios",
    sizes: ["Única"],
    hint: "handbag",
    storeId: "store8", // Accesorios Luna Mágica
  },
  {
    id: "7",
    name: "Camiseta Deportiva",
    price: 28.99,
    imageUrl: "https://picsum.photos/seed/sporttshirt/400/500",
    category: "Ropa Deportiva",
    sizes: ["S", "M", "L", "XL"],
    hint: "sport shirt",
    storeId: "store9", // Deportes Extremos Sur
  },
  {
    id: "8",
    name: "Vestido de Gala",
    price: 89.99,
    imageUrl: "https://picsum.photos/seed/eveningdress/400/500",
    category: "Vestidos",
    sizes: ["S", "M", "L"],
    hint: "evening dress",
    storeId: "store3", // Boutique Sol Naciente
  }
];

// Map to the structure expected by the homepage
const featuredProducts = featuredProductsFull.map((p) => ({
  id: parseInt(p.id, 10),
  name: p.name,
  price: p.price,
  imageUrl: p.imageUrl,
  category: p.category,
  sizes: p.sizes, // Keep sizes array
  hint: p.hint,
  storeId: p.storeId,
}));

const categories = [
  {
    name: "Camisas",
    icon: <Shirt className="h-8 w-8 mb-2 text-primary" />,
    slug: "camisas",
  },
  {
    name: "Pantalones",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 mb-2 text-primary"
      >
        <path d="M9 21H6a2 2 0 0 1-2-2V7.303a2 2 0 0 1 .67-1.49L8 3l4 4 3.33-2.83a2 2 0 0 1 2.817-.133L20 5.697A2 2 0 0 1 21 7.303V19a2 2 0 0 1-2 2h-3" />
        <path d="M15 21v-5.5a2.5 2.5 0 0 0-5 0V21" />
      </svg>
    ),
    slug: "pantalones",
  },
  {
    name: "Zapatos",
    icon: <Footprints className="h-8 w-8 mb-2 text-primary" />,
    slug: "zapatos",
  },
  {
    name: "Sudaderas",
    icon: <HoodieIcon className="h-8 w-8 mb-2 text-primary" />,
    slug: "sudaderas",
  },
  {
    name: "Ropa de Bebé",
    icon: <Baby className="h-8 w-8 mb-2 text-primary" />,
    slug: "ropa-de-bebe",
  },
  {
    name: "Ropa Infantil",
    icon: <PersonStanding className="h-8 w-8 mb-2 text-primary" />,
    slug: "ropa-infantil",
  },
  {
    name: "Accesorios",
    icon: <Tag className="h-8 w-8 mb-2 text-primary" />,
    slug: "accesorios",
  },
  {
    name: "Vestidos",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 mb-2 text-primary"
      >
        <path d="M17.94 3.94a1.5 1.5 0 0 1 .06 2.12l-5.3 6.84a.5.5 0 0 0 .39.8h4.82a1.5 1.5 0 0 1 1.4.9l.85 1.71a1 1 0 0 1-.9 1.53H6a1 1 0 0 1-.9-1.53l.85-1.71a1.5 1.5 0 0 1 1.4-.9h4.82a.5.5 0 0 0 .39-.8l-5.3-6.84a1.5 1.5 0 0 1 .06-2.12L12 2l5.94 1.94Z" />
      </svg>
    ),
    slug: "vestidos",
  },
];

const featuredOffers = [
  {
    id: "offer1",
    imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    altText: "Oferta de verano con modelos sonriendo",
    title: "¡Oferta de Verano!",
    description: "Hasta 50% de descuento en vestidos y sandalias.",
    buttonText: "Ver Ofertas",
    link: "/products?category=vestidos",
    dataAiHint: "summer fashion",
  },
  {
    id: "offer2",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    altText: "Nuevas llegadas de ropa de temporada",
    title: "Nuevas Llegadas",
    description: "Descubre lo último en moda para esta temporada.",
    buttonText: "Explorar Novedades",
    link: "/products",
    dataAiHint: "new clothes",
  },
  {
    id: "offer3",
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    altText: "Artículos exclusivos con stock limitado",
    title: "Stock Limitado",
    description:
      "¡No te pierdas nuestras piezas exclusivas antes de que se agoten!",
    buttonText: "Comprar Ahora",
    link: "/products?category=accesorios",
    dataAiHint: "exclusive offer",
  },
];

// Exportamos para que sea accesible desde la página de tienda
export const registeredStores = [
  {
    id: "store1",
    name: "Artesanías Elena",
    description:
      "Textiles hechos a mano con amor y tradición. Piezas únicas que cuentan historias.",
    imageUrl: "https://picsum.photos/seed/artisanstore/600/400",
    slug: "artesanias-elena",
    dataAiHint: "artisan crafts",
  },
  {
    id: "store2",
    name: "Moda Urbana Hnos. Pérez",
    description:
      "Las últimas tendencias en ropa urbana para un estilo moderno y fresco.",
    imageUrl: "https://picsum.photos/seed/urbanfashionstore/600/400",
    slug: "moda-urbana-perez",
    dataAiHint: "city fashion",
  },
  {
    id: "store3",
    name: "Boutique Sol Naciente",
    description:
      "Prendas elegantes y sofisticadas para ocasiones especiales. Calidad y diseño exclusivo.",
    imageUrl: "https://picsum.photos/seed/boutiquestore/600/400",
    slug: "boutique-sol-naciente",
    dataAiHint: "fashion boutique",
  },
  {
    id: "store4",
    name: "Hilos del Sur",
    description:
      "Lanas naturales y accesorios para tejido. Inspiración para tus creaciones.",
    imageUrl: "https://picsum.photos/seed/yarnstore/600/400",
    slug: "hilos-del-sur",
    dataAiHint: "yarn shop",
  },
  {
    id: "store5",
    name: "Rincón Infantil",
    description:
      "Ropa divertida y cómoda para los más pequeños. Calidad y diseños originales.",
    imageUrl: "https://picsum.photos/seed/kidsstore/600/400",
    slug: "rincon-infantil",
    dataAiHint: "kids clothing",
  },
  {
    id: "store6",
    name: "El Vestidor de Ana",
    description:
      "Moda femenina actual y versátil. Encuentra tu estilo para cada ocasión.",
    imageUrl: "https://picsum.photos/seed/womenstore/600/400",
    slug: "el-vestidor-de-ana",
    dataAiHint: "womens fashion",
  },
  {
    id: "store7",
    name: "Calzados El Caminante",
    description:
      "Zapatos para toda la familia. Comodidad y estilo en cada paso.",
    imageUrl: "https://picsum.photos/seed/shoestore/600/400",
    slug: "calzados-el-caminante",
    dataAiHint: "shoe store",
  },
  {
    id: "store8",
    name: "Accesorios Luna Mágica",
    description:
      "Complementos únicos para realzar tu look. Bolsos, pañuelos y bisutería.",
    imageUrl: "https://picsum.photos/seed/accessoriesstore/600/400",
    slug: "accesorios-luna-magica",
    dataAiHint: "fashion accessories",
  },
  {
    id: "store9",
    name: "Deportes Extremos Sur",
    description:
      "Equipamiento y ropa técnica para tus aventuras al aire libre.",
    imageUrl: "https://picsum.photos/seed/sportstore/600/400",
    slug: "deportes-extremos-sur",
    dataAiHint: "sports gear",
  },
];

// Función para obtener productos por tienda
const getProductsByStore = (storeId: string) => {
  return allProducts.filter(product => product.storeId === storeId);
};

// Función para obtener todos los productos
const getAllProducts = () => {
  return allProducts.map((p) => ({
    id: parseInt(p.id, 10),
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    category: p.category,
    sizes: p.sizes,
    hint: p.hint,
    storeId: p.storeId,
  }));
};

export default function HomePage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(getAllProducts());

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );

  // Redirección post-login al dashboard adecuado según el rol
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (user.role === "vendedor") {
      router.replace("/dashboard/vendedor");
    } else if (user.role === "comprador") {
      router.replace("/products");
    }
  }, [user, loading, router]);
  
  // Filtrar productos cuando cambia la tienda seleccionada
  useEffect(() => {
    if (selectedStore) {
      const storeProducts = getProductsByStore(selectedStore);
      setFilteredProducts(storeProducts.map(p => ({
        id: parseInt(p.id, 10),
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category,
        sizes: p.sizes,
        hint: p.hint,
        storeId: p.storeId,
      })));
    } else {
      setFilteredProducts(getAllProducts());
    }
  }, [selectedStore]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    const itemToAdd: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      size: product.sizes[0] || "N/A", // Default to first size or N/A
      storeId: product.storeId,
    };
    addToCart(itemToAdd);
    toast({
      title: "Añadido al Carrito",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <>
      {/* Hero Section con Carrusel */}
      <section className="relative w-full py-24 md:py-36 lg:py-48 text-center overflow-hidden animate-fade-in">
        <div className="absolute inset-0 z-[-1]">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/8/80/Uriangato_Zona_Comercial_Textil_en_la_Av_%C3%81lvaro_Obreg%C3%B3n_112.jpg"
            alt="Fondo textil colorido"
            layout="fill"
            objectFit="cover"
            className="filter blur-sm scale-105 transition-transform duration-700"
            data-ai-hint="blurred background"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <div className="space-y-4 max-w-2xl animate-slide-up">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Tu Mercado Textil Local
            </h1>
            <p className="text-lg text-gray-200 md:text-xl">
              Descubre prendas únicas de vendedores locales. Compra, vende y
              conecta.
            </p>
            <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center pt-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
                >
                  Explorar Productos
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/20 hover:text-white transition-all duration-300 hover:shadow-lg"
                >
                  Vende Tus Artículos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Offers Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl flex items-center">
              <Percent className="mr-3 h-8 w-8 text-primary" />
              Ofertas Destacadas
            </h2>
            <Link href="/products?sort=ofertas">
              <Button variant="outline">Ver Todas las Ofertas</Button>
            </Link>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {featuredOffers.map((offer) => (
                <CarouselItem key={offer.id}>
                  <Card className="overflow-hidden border-none shadow-none transition-transform duration-300 hover:scale-[1.02]">
                    <div className="relative aspect-[3/1] w-full">
                      <Image
                        src={offer.imageUrl}
                        alt={offer.altText}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg transition-transform duration-500 hover:scale-105"
                        data-ai-hint={offer.dataAiHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg" />
                      <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full md:w-2/3">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                          {offer.title}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg mb-4 text-gray-200">
                          {offer.description}
                        </p>
                        <Link href={offer.link}>
                          <Button
                            size="lg"
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                          >
                            {offer.buttonText}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-none h-10 w-10 sm:h-12 sm:w-12" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/30 hover:bg-black/50 border-none h-10 w-10 sm:h-12 sm:w-12" />
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            {current} de {count} ofertas
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-accent/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block bg-accent/20 px-3 py-1 rounded-full mb-2">
                <span className="text-accent-foreground text-sm font-medium">Lo más vendido</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Productos Destacados
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre nuestros productos más populares y las últimas
                tendencias.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-10">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group border border-border/50 hover:border-accent/50 transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                    Destacado
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
          <div className="flex justify-center mt-12">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-medium text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ver Todos los Productos
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Registered Stores Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl flex items-center">
              <StoreIcon className="mr-3 h-8 w-8 text-primary" /> Tiendas
              Destacadas
            </h2>
            {/* This link might go to a future dedicated stores page */}
            <Link href="/products">
              <Button variant="outline">Ver Todas las Tiendas</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {registeredStores.map((store) => (
              <Link key={store.id} href={`/stores/${store.slug}`} className="block h-full">
                <Card className="overflow-hidden group border flex flex-col transition-all hover:shadow-lg">
                  <CardHeader className="p-0 relative">
                    <Image
                      src={store.imageUrl}
                      alt={`Logo de ${store.name}`}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={store.dataAiHint}
                    />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-xl font-semibold group-hover:text-primary mb-1">
                      {store.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                      {store.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      Visitar Tienda
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Products by Store Section */}
      {selectedStore && (
        <section className="py-12 bg-accent/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">
                Productos de {registeredStores.find(store => store.id === selectedStore)?.name}
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedStore(null)}
              >
                Ver todos los productos
              </Button>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
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
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No hay productos disponibles para esta tienda.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block bg-primary/10 px-3 py-1 rounded-full mb-2">
                <span className="text-primary text-sm font-medium">Explora por categorías</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Categorías
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explora nuestras categorías y encuentra lo que estás buscando.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 mt-10">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative flex flex-col items-center rounded-xl p-6 bg-card shadow-md transition-all hover:shadow-lg hover:scale-105 border border-border/50"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 mb-3">
                  {cloneElement(category.icon as React.ReactElement, {
                    className: "h-8 w-8 text-primary group-hover:text-primary"
                  })}
                </div>
                <h3 className="text-base font-medium group-hover:text-primary">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
