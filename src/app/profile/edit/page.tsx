"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Cargar datos del usuario
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      confirmPassword: "",
    });
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulación de actualización de perfil
      // En una implementación real, aquí se haría una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente",
      });
      
      // Redirigir según el rol del usuario
      if (user?.role === "vendedor") {
        router.push("/dashboard/vendedor");
      } else {
        router.push("/products");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => router.back()}
        className="mb-6"
      >
        Volver
      </Button>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña (opcional)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar en blanco para mantener la actual"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Dejar en blanco para mantener la actual"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}