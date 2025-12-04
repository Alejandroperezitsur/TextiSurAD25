"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        zipCode: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shippingThreshold = 500;
    const shippingCost = 50;
    const shipping =
        subtotal > shippingThreshold || subtotal === 0 ? 0.0 : shippingCost;
    const total = subtotal + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            toast({
                title: "Carrito vacío",
                description: "No puedes realizar un pedido sin artículos.",
                variant: "destructive",
            });
            return;
        }

        if (!user) {
            toast({
                title: "Inicia sesión",
                description: "Debes iniciar sesión para realizar un pedido.",
                variant: "destructive",
            });
            router.push("/login");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cartItems,
                    shippingDetails: {
                        fullName: formData.fullName,
                        address: formData.address,
                        city: formData.city,
                        zipCode: formData.zipCode,
                    },
                    total: total,
                }),
            });

            if (response.ok) {
                clearCart();
                toast({
                    title: "¡Pedido Realizado!",
                    description: "Tu pedido ha sido procesado exitosamente.",
                });
                router.push("/dashboard/comprador"); // Redirect to buyer dashboard
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al procesar el pedido");
            }
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Hubo un problema al procesar tu pedido.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Shipping & Payment Form */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de Envío y Pago</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nombre Completo</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        required
                                        placeholder="Juan Pérez"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        required
                                        placeholder="Calle Principal 123"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ciudad</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            required
                                            placeholder="Ciudad de México"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">Código Postal</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            required
                                            placeholder="12345"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <Separator className="my-4" />
                                <h3 className="font-semibold mb-2">Método de Pago (Simulado)</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                                    <Input
                                        id="cardNumber"
                                        name="cardNumber"
                                        required
                                        placeholder="0000 0000 0000 0000"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiryDate">Fecha de Expiración</Label>
                                        <Input
                                            id="expiryDate"
                                            name="expiryDate"
                                            required
                                            placeholder="MM/YY"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            name="cvv"
                                            required
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Resumen del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm">
                                        <span>
                                            {item.quantity}x {item.name} ({item.size})
                                        </span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
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
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)} MXN</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full btn-accent"
                                size="lg"
                                disabled={loading || cartItems.length === 0}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...
                                    </>
                                ) : (
                                    "Confirmar Pedido"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
