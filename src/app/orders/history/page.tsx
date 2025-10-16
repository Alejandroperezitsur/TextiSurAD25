"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo para pedidos
const mockOrders = [
  {
    id: "ORD-001",
    date: "2023-10-15",
    total: 75.98,
    status: "Entregado",
    items: [
      { id: "1", name: "Camisa Clásica Teal", quantity: 1, price: 29.99 },
      { id: "2", name: "Jeans Cómodos Grises", quantity: 1, price: 45.99 }
    ]
  },
  {
    id: "ORD-002",
    date: "2023-11-02",
    total: 34.99,
    status: "En proceso",
    items: [
      { id: "3", name: "Bufanda Amarilla Mostaza", quantity: 1, price: 15.00 },
      { id: "5", name: "Camiseta Básica Gris", quantity: 1, price: 19.99 }
    ]
  },
  {
    id: "ORD-003",
    date: "2023-11-20",
    total: 55.00,
    status: "Enviado",
    items: [
      { id: "4", name: "Vestido Rayado Teal", quantity: 1, price: 55.00 }
    ]
  }
];

// Función para obtener el color del estado del pedido
const getStatusColor = (status: string) => {
  switch (status) {
    case "Entregado":
      return "bg-green-500";
    case "En proceso":
      return "bg-yellow-500";
    case "Enviado":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

// Función para obtener el icono del estado del pedido
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Entregado":
      return <CheckCircle className="h-4 w-4" />;
    case "En proceso":
      return <Clock className="h-4 w-4" />;
    case "Enviado":
      return <Package className="h-4 w-4" />;
    default:
      return null;
  }
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(mockOrders);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/(auth)/login");
      return;
    }

    // Obtener los datos del usuario del localStorage
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      if (userData) {
        setUser(userData);
        // Aquí se podría hacer una llamada a la API para obtener los pedidos reales del usuario
        // Por ahora usamos los datos de ejemplo
      } else {
        router.push("/(auth)/login");
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      router.push("/(auth)/login");
    }
  }, [router]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">Historial de Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-lg text-gray-500">No tienes pedidos anteriores.</p>
            <Button className="mt-4" asChild>
              <Link href="/products">Explorar productos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <CardTitle className="text-lg">
                    Pedido #{order.id}
                  </CardTitle>
                  <div className="flex items-center mt-2 md:mt-0">
                    <p className="text-sm text-gray-500 mr-4">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                    <Badge className={`${getStatusColor(order.status)} text-white flex items-center`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <p className="font-semibold">Total</p>
                  <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}