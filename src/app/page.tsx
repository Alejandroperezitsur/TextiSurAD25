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
} from "lucide-react"; // Added Percent and StoreIcon
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
import React from "react";

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
  },
  {
    id: "13",
    name: "Zapatillas Deportivas Blancas",
    price: 75.0,
    imageUrl: "https://picsum.photos/seed/whitesneakers/400/500",
    category: "Zapatos",
    sizes: ["40", "41", "42", "43", "44"],
    hint: "white sneakers",
  },
  {
    id: "17",
    name: "Sudadera con Capucha Gris",
    price: 48.0,
    imageUrl: "https://picsum.photos/seed/greyhoodie/400/500",
    category: "Sudaderas",
    sizes: ["S", "M", "L", "XL"],
    hint: "grey hoodie",
  },
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
    imageUrl: "https://picsum.photos/seed/summersale/1200/400",
    altText: "Oferta de verano con modelos sonriendo",
    title: "¡Oferta de Verano!",
    description: "Hasta 50% de descuento en vestidos y sandalias.",
    buttonText: "Ver Ofertas",
    link: "/products?category=vestidos",
    dataAiHint: "summer fashion",
  },
  {
    id: "offer2",
    imageUrl: "https://picsum.photos/seed/newarrivals/1200/400",
    altText: "Nuevas llegadas de ropa de temporada",
    title: "Nuevas Llegadas",
    description: "Descubre lo último en moda para esta temporada.",
    buttonText: "Explorar Novedades",
    link: "/products",
    dataAiHint: "new clothes",
  },
  {
    id: "offer3",
    imageUrl: "https://picsum.photos/seed/limitedstock/1200/400",
    altText: "Artículos exclusivos con stock limitado",
    title: "Stock Limitado",
    description:
      "¡No te pierdas nuestras piezas exclusivas antes de que se agoten!",
    buttonText: "Comprar Ahora",
    link: "/products?category=accesorios",
    dataAiHint: "exclusive offer",
  },
];

const registeredStores = [
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

export default function HomePage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true }),
  );

  React.useEffect(() => {
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
    };
    addToCart(itemToAdd);
    toast({
      title: "Añadido al Carrito",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <>
      {/* Simplified Hero Section */}
      <section className="relative w-full py-24 md:py-36 lg:py-48 text-center overflow-hidden">
        <div className="absolute inset-0 z-[-1]">
          <Image
            src="https://picsum.photos/seed/textilesblur/1920/1080"
            alt="Fondo textil borroso"
            layout="fill"
            objectFit="cover"
            className="filter blur-sm scale-105"
            data-ai-hint="blurred background"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <div className="space-y-4 max-w-2xl">
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Explorar Productos
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 hover:text-white"
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
                  <Card className="overflow-hidden border-none shadow-none">
                    <div className="relative aspect-[3/1] w-full">
                      {" "}
                      {/* Aspect ratio for banners */}
                      <Image
                        src={offer.imageUrl}
                        alt={offer.altText}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
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
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-10">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden group border flex flex-col"
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
                      className="object-cover w-full h-72 transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={product.hint}
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-lg font-semibold truncate group-hover:text-primary">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {product.category}
                  </CardDescription>
                  <p className="text-lg font-bold mt-2">
                    ${product.price.toFixed(2)} MXN
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full btn-accent"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Añadir al Carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Ver Todos los Productos
              </Button>
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
              <Card
                key={store.id}
                className="overflow-hidden group border flex flex-col transition-all hover:shadow-lg"
              >
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
                  {/* Optional: Link to products filtered by store if functionality exists */}
                  {/* For now, a generic button or no button */}
                  <Link
                    href={`/products?search=${encodeURIComponent(store.name)}`}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      Ver Productos de {store.name.split(" ")[0]}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-10">
            Comprar por Categoría
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                href={`/products?category=${category.slug}`}
                key={category.name}
                passHref
              >
                <Card className="text-center border hover:border-primary transition-colors duration-300 p-6 flex flex-col items-center justify-center h-full cursor-pointer group aspect-square">
                  {category.icon}
                  <p className="font-semibold mt-2 group-hover:text-primary">
                    {category.name}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
