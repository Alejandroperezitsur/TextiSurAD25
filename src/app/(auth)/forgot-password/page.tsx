// src/app/(auth)/forgot-password/page.tsx
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
import { useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Correo de Restablecimiento Enviado",
      description:
        "Si existe una cuenta para este correo, recibirás instrucciones para restablecer tu contraseña.",
    });
    setEmail(""); // Clear field after submission
    setLoading(false);
  };

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center py-12 px-4 md:px-6">
      {/* Back Button */}
      <div className="w-full max-w-md mb-4 self-start">
        {" "}
        {/* Ensure back button aligns with card */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Volver a Iniciar Sesión
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            ¿Olvidaste tu Contraseña?
          </CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetRequest} className="space-y-4">
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
            <Button
              type="submit"
              className="w-full btn-accent"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Enlace de Restablecimiento"}
            </Button>
          </form>
        </CardContent>
        {/* Footer can be removed or kept as secondary option */}
        {/* <CardFooter className="text-center text-sm">
           ¿Recordaste tu contraseña?{" "}
           <Link href="/login" className="text-primary hover:underline ml-1">
             Iniciar Sesión
           </Link>
         </CardFooter> */}
      </Card>
    </div>
  );
}
