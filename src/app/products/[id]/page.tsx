// src/app/products/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Removed unused imports
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react"; // Added ArrowLeft
import Image from "next/image";
import Link from "next/link"; // Added Link
import { notFound, useRouter } from "next/navigation"; // Added useRouter
import { useState, useEffect } from "react"; // Added useEffect
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/context/CartContext"; // Import useCart
import type { CartItem } from "@/types/cart"; // Import CartItem type

// Updated product data with real product information
const products = [
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
    imageUrl:
      "https://www.innvictus.com/medias/IN-DD8959-100-1.jpg?context=bWFzdGVyfGltYWdlc3w3NDA3MnxpbWFnZS9qcGVnfGFXMWhaMlZ6TDJnNVppOW9PVFV2TVRFeU1UWTRNRGsxT1RBNE1UUXVhbkJufGVkZDg0ZmRkNDhmNWNjMDhiOWVkODkwOGEzNWVhYzgyZjIyM2VlOTViODk1YWMzMjRiZWU1NmNmYWE1NGMwZjk",
    description:
      "Zapatillas blancas versátiles, ideales para cualquier ocasión.",
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
    imageUrl: "https://m.media-amazon.com/images/I/71gHHJV+6DL._AC_SY695_.jpg",
    description: "Botines elegantes de cuero negro con cierre lateral.",
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
    imageUrl: "https://ss421.liverpool.com.mx/xl/1094922711.jpg",
    description: "Pack de 3 bodies de algodón suave para bebé.",
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
    imageUrl: "https://m.media-amazon.com/images/I/A1iLSIggjrL._AC_SX679_.jpg",
    description: "Pijama cómodo con estampado divertido para bebé.",
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
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_2X_673451-MLM83876587551_042025-F-sudadera-con-capucha-para-hombre-casual-holgada-deportiva.webp",
    description: "Sudadera clásica con capucha en gris jaspeado.",
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
    imageUrl: "https://m.media-amazon.com/images/I/51-TjFXSvpL._AC_SX679_.jpg",
    description: "Sudadera básica de cuello redondo en azul marino.",
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
    imageUrl:
      "https://app.cuidadoconelperro.com.mx/media/catalog/product/1/_/1_23114.jpg",
    description: "Camiseta divertida con estampado de dinosaurio para niño.",
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
    imageUrl:
      "https://image.hm.com/assets/hm/52/e0/52e0856536c207a2b3dd2029c2f6c7dfe22c0e23.jpg",
    description: "Pantalón corto cómodo y resistente para niño.",
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
    imageUrl: "https://m.media-amazon.com/images/I/618rnrVOSeL._AC_SX679_.jpg",
    description: "Vestido ligero y fresco con estampado floral para niña.",
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
    imageUrl:
      "https://ae-pic-a1.aliexpress-media.com/kf/S802c36831dc549688813d5324f2230a7L.jpg_960x960q75.jpg_.avif",
    description: "Leggings cómodos y elásticos a rayas para niña.",
    category: "Ropa Infantil",
    sizes: ["5A", "6A", "7A", "8A"],
    rating: 4.7,
    reviews: 100,
    material: "95% Algodón, 5% Elastano",
    care: "Lavar a máquina.",
    hint: "girls leggings",
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const { addToCart } = useCart(); // Get addToCart from context
  const router = useRouter(); // Use router for back navigation
  const product = products.find((p) => p.id === params.id);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);

  // Set default size when product loads
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    // Reset quantity to 1 when product changes
    setQuantity(1);
  }, [product]); // Re-run when product changes

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        variant: "destructive",
        title: "Seleccionar Talla",
        description:
          "Por favor, selecciona una talla antes de añadir al carrito.",
      });
      return;
    }

    const itemToAdd: CartItem = {
      id: parseInt(product.id, 10), // Ensure ID is a number
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity,
      size: selectedSize || "N/A", // Use selected size or 'N/A' if none needed/selected
    };

    addToCart(itemToAdd); // Add to global cart state

    toast({
      title: "Añadido al Carrito",
      description: `${quantity} x ${product.name} ${selectedSize ? `(Talla: ${selectedSize})` : ""} añadido exitosamente.`,
      action: <CheckCircle className="text-green-500 h-5 w-5" />,
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleGoBack = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 group text-muted-foreground hover:text-foreground pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
        Volver
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div>
          <Card className="overflow-hidden border sticky top-20">
            <Image
              src={product.imageUrl}
              alt={`Imagen de ${product.name}`}
              width={600}
              height={800}
              className="object-cover w-full aspect-[3/4]"
              priority // Prioritize loading the main product image
              data-ai-hint={product.hint}
            />
          </Card>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {product.name}
            </h1>
            <div className="flex items-center mb-4 space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews ?? 0} reseñas)
              </span>
            </div>
            <p className="text-3xl font-semibold mb-4 text-primary">
              ${product.price.toFixed(2)} MXN
            </p>
            <Card className="bg-secondary/50 border-none shadow-none">
              <CardContent className="p-4 text-foreground/80">
                <p>{product.description}</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <Label className="text-base font-medium mb-3 block">
                Seleccionar Talla:
              </Label>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-3"
              >
                {product.sizes.map((size) => (
                  <Label
                    key={size}
                    htmlFor={`size-${size}`}
                    className={`border rounded-md px-4 py-2 cursor-pointer transition-colors text-sm ${selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent/50 hover:border-foreground/30"}`}
                  >
                    <RadioGroupItem
                      value={size}
                      id={`size-${size}`}
                      className="sr-only"
                    />
                    {size}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="flex items-center space-x-4 mb-6">
            <Label className="text-base font-medium">Cantidad:</Label>
            <div className="flex items-center space-x-2 border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                -
              </Button>
              <span className="w-10 text-center font-medium text-lg">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => handleQuantityChange(1)}
                aria-label="Aumentar cantidad"
              >
                +
              </Button>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full btn-accent text-lg py-6"
            onClick={handleAddToCart}
            disabled={product.sizes.length > 0 && !selectedSize}
          >
            <ShoppingBag className="mr-2 h-5 w-5" /> Añadir al Carrito
          </Button>

          <div className="space-y-3 text-sm text-muted-foreground border-t pt-6 mt-6">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>
                Envío estándar gratuito en pedidos superiores a $50 MXN.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Compra segura garantizada. Devoluciones fáciles.</span>
            </div>
          </div>

          {/* Accordion for More Details */}
          <Accordion type="single" collapsible className="w-full border-t pt-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base">
                Detalles del Producto
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Material:</strong> {product.material || "N/A"}
                </p>
                <p>
                  <strong>Categoría:</strong> {product.category}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base">Cuidado</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {product.care || "Consultar etiqueta."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Reviews Section Placeholder */}
      <div className="mt-16 lg:mt-20">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">
          Reseñas de Clientes
        </h2>
        <Card className="border shadow-none">
          <CardContent className="p-6">
            {product.reviews > 0 ? (
              <p className="text-muted-foreground">
                Mostrando las {Math.min(5, product.reviews)} reseñas más
                recientes (funcionalidad pendiente).
              </p>
            ) : (
              <p className="text-muted-foreground">
                Todavía no hay reseñas para este producto. ¡Sé el primero!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
