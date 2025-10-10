// src/app/cart/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react"; // Added ArrowLeft
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added useRouter
import { useCart } from "@/context/CartContext"; // Import the useCart hook
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart(); // Use cart context
  const { toast } = useToast();
  const router = useRouter(); // Use router for back navigation

  const handleRemoveItem = (id: number) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    removeFromCart(id);
    toast({
      title: "Artículo Eliminado",
      description: `"${itemToRemove?.name}" ha sido eliminado de tu carrito.`,
      variant: "destructive",
    });
  };

  const handleQuantityChange = (id: number, delta: number) => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (currentItem && currentItem.quantity + delta >= 1) {
      updateQuantity(id, currentItem.quantity + delta);
    } else if (currentItem && currentItem.quantity + delta < 1) {
      // Prevent quantity from going below 1
    }
  };

  const handleGoBack = () => {
    router.back(); // Navigate to the previous page
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingThreshold = 500; // Example: 500 MXN for free shipping
  const shippingCost = 50; // Example: 50 MXN for shipping
  const shipping =
    subtotal > shippingThreshold || subtotal === 0 ? 0.0 : shippingCost;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      {/* Back Button */}
      {cartItems.length > 0 && ( // Only show if cart is not empty, or always show
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 group text-muted-foreground hover:text-foreground pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Volver
        </Button>
      )}

      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-10">
        Tu Carrito de Compras
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-secondary/50">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-4">
            Tu carrito está vacío.
          </p>
          <Link href="/products">
            <Button className="btn-accent">Continuar Comprando</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card
                key={`${item.id}-${item.size}`}
                className="flex flex-col sm:flex-row items-center p-4 border overflow-hidden"
              >
                {" "}
                {/* Ensure unique key */}
                <Image
                  src={item.imageUrl}
                  alt={`Imagen de ${item.name}`}
                  width={100}
                  height={133}
                  className="object-cover rounded-md mr-0 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0"
                  data-ai-hint={item.name
                    .split(" ")
                    .slice(0, 2)
                    .join(" ")
                    .toLowerCase()}
                />
                <div className="flex-grow w-full sm:w-auto">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-semibold hover:text-primary text-lg">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Talla: {item.size || "N/A"}
                  </p>
                  <p className="text-sm font-medium">
                    ${item.price.toFixed(2)} MXN
                  </p>
                </div>
                <div className="flex items-center space-x-2 my-3 sm:my-0 sm:mx-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={item.quantity <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, 1)}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </Button>
                </div>
                <p className="font-semibold w-24 text-right text-lg sm:text-base">
                  ${(item.price * item.quantity).toFixed(2)} MXN
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-0 mt-3 sm:mt-0 sm:ml-4 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Eliminar artículo</span>
                </Button>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border">
              <CardHeader>
                <CardTitle className="text-xl">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span>
                    {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)} MXN`}
                  </span>
                </div>
                {subtotal > 0 && subtotal <= shippingThreshold && (
                  <p className="text-xs text-primary text-center">
                    ¡Añade ${(shippingThreshold + 0.01 - subtotal).toFixed(2)}{" "}
                    MXN más para envío gratuito!
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)} MXN</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full btn-accent"
                  size="lg"
                  onClick={() =>
                    alert("Proceder al pago (funcionalidad pendiente)")
                  }
                >
                  Proceder al Pago
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
