// src/app/(auth)/register/page.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"comprador" | "vendedor">("comprador");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user: loggedInUser, loading: authLoading } = useAuth(); // Get user and loading state

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && loggedInUser) {
      router.push("/"); // Redirect to home if already logged in
    }
  }, [loggedInUser, authLoading, router]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registro Fallido",
        description: "Las contraseñas no coinciden.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Registro Fallido",
        description: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    // Validación frontend para clases de equivalencia y valores al límite
    if (name.trim().length < 2 || name.trim().length > 50) {
      toast({
        variant: "destructive",
        title: "Registro Fallido",
        description: "El nombre debe tener entre 2 y 50 caracteres.",
      });
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)) {
      toast({
        variant: "destructive",
        title: "Registro Fallido",
        description: "Correo electrónico inválido.",
      });
      return;
    }
    if (password.length > 32) {
      toast({
        variant: "destructive",
        title: "Registro Fallido",
        description: "La contraseña no debe exceder 32 caracteres.",
      });
      return;
    }
    if (role !== "comprador" && role !== "vendedor") {
      toast({
        variant: "destructive",
        title: "Registro Fallido",
        description: "Selecciona un rol válido.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
        avatarUrl: null, // Puedes agregar un campo para el avatar si es necesario
      });

      if (response.status === 201) {
        toast({
          title: "Registro exitoso",
          description: "Usuario registrado correctamente.",
          variant: "default", // Cambiado a un valor compatible
        });
        router.push("/login");
      }
    } catch (err) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "No se pudo registrar el usuario.";
      console.error("Error al registrar el usuario:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form if the user is logged in or auth is loading
  if (authLoading || loggedInUser) {
    return null; // Or a loading indicator
  }

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center py-12 px-4 md:px-6">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Crear una Cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos abajo para crear una nueva cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repite tu contraseña"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-select">Quiero ser</Label>
              <Select
                value={role}
                onValueChange={(value: "comprador" | "vendedor") =>
                  setRole(value)
                }
                disabled={loading}
                required
                name="role"
              >
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprador">Comprador</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground pt-1">
                {role === "vendedor"
                  ? "Podrás publicar y vender tus productos textiles."
                  : "Podrás explorar y comprar productos de vendedores locales."}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full btn-accent"
              disabled={loading}
            >
              {loading ? "Creando Cuenta..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline ml-1">
            Iniciar Sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
