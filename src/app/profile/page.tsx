// src/app/profile/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user";
import {
  Edit,
  Save,
  Lock,
  Loader2,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react"; // Added ArrowLeft
import { useState, type FormEvent, type ChangeEvent, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import Link from "next/link"; // Added Link

export default function ProfilePage() {
  const { user, updateUser, loading: authLoading } = useAuth(); // Get user, updateUser, and loading state from context
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Usually email is not editable, but included for example
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false); // Separate loading state for updates
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Redirect if not logged in after loading check
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login"); // Use replace to avoid adding login to history
      toast({
        variant: "destructive",
        title: "Acceso Denegado",
        description: "Debes iniciar sesión para ver tu perfil.",
      });
    }
  }, [authLoading, user, router, toast]);

  // Initialize form fields when user data is loaded
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]); // Depend on user object

  const handleEditToggle = () => {
    if (isEditing && user) {
      // Reset fields if cancelling edit
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatarUrl || null);
      setAvatarFile(null);
    }
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return; // Should not happen if useEffect redirect works

    setUpdateLoading(true);

    // Simulate API call to update profile (including avatar upload)
    console.log("Simulating profile update for:", {
      userId: user.id,
      name,
      email,
      avatarFile: avatarFile?.name,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Construct updated user data based on changes
    // In real app, API response would provide the updated user data
    let newAvatarUrl = user.avatarUrl; // Keep existing URL by default
    if (avatarFile) {
      // In a real app, upload avatarFile and get the new URL
      // For simulation, use the preview URL if available
      newAvatarUrl = avatarPreview || user.avatarUrl;
      console.log("Simulating avatar upload, using preview:", newAvatarUrl);
    }

    const updatedUserData: User = {
      ...user,
      name,
      // email: email, // Only update email if your backend allows and handles verification
      avatarUrl: newAvatarUrl,
    };

    // Update global auth state using updateUser
    updateUser(updatedUserData);

    toast({
      title: "Perfil Actualizado",
      description: "Tu información ha sido guardada exitosamente.",
    });
    setIsEditing(false);
    setUpdateLoading(false);
    setAvatarFile(null); // Clear the file state after successful update
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast({
          variant: "destructive",
          title: "Archivo demasiado grande",
          description: "El tamaño máximo del avatar es 2MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
      toast({ title: "Vista previa de avatar actualizada." });
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Archivo inválido",
        description:
          "Por favor, selecciona un archivo de imagen (JPG, PNG, WEBP).",
      });
      setAvatarPreview(user?.avatarUrl || null); // Reset preview if invalid file
      setAvatarFile(null);
    }
  };

  // Placeholder for password change functionality
  const handleChangePassword = () => {
    toast({
      title: "Funcionalidad Pendiente",
      description: "El cambio de contraseña aún no está implementado.",
    });
  };

  const handleGoBack = () => {
    router.back(); // Navigate to the previous page
  };

  // Loading state while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
        <Skeleton className="h-10 w-48 mb-10" />
        <Card className="max-w-2xl mx-auto border shadow-none">
          <CardHeader className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Separator />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto flex-1 py-12 px-4 md:px-6 text-center">
        <Card className="max-w-md mx-auto p-6 border-destructive">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">
            Debes iniciar sesión para acceder a esta página.
          </p>
          <Link href="/login">
            <Button variant="destructive">Ir a Iniciar Sesión</Button>
          </Link>
        </Card>
      </div>
    );
  }

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

      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-10">
        Mi Perfil
      </h1>
      <Card className="max-w-2xl mx-auto border shadow-none">
        <form onSubmit={handleProfileUpdate}>
          <CardHeader className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="h-28 w-28 border-2 border-primary">
                <AvatarImage
                  src={
                    avatarPreview ||
                    user.avatarUrl ||
                    `https://avatar.vercel.sh/${user.email}.png?size=112`
                  }
                  alt={user.name}
                  key={avatarPreview}
                />{" "}
                {/* Add key to force re-render on change */}
                <AvatarFallback className="text-4xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={updateLoading}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-full bg-background hover:bg-muted border-2"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                    aria-label="Cambiar avatar"
                    disabled={updateLoading}
                    title="Cambiar avatar (max 2MB)"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {isEditing ? name : user.name}
              </CardTitle>
              <CardDescription>
                Rol: {user.role === "vendedor" ? "Vendedor" : "Comprador"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Acceso rápido al historial de pedidos para compradores */}
            {user.role === "comprador" && (
              <div className="flex justify-start">
                <Button asChild variant="outline">
                  <Link href="/orders/history">Mis pedidos</Link>
                </Button>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing || updateLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true} // Email should generally not be editable
                required
                readOnly
                className="disabled:cursor-not-allowed disabled:opacity-70"
              />
              <p className="text-xs text-muted-foreground">
                El correo electrónico no se puede cambiar.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Seguridad</Label>
              <Button
                type="button"
                variant="outline"
                onClick={handleChangePassword}
                disabled={updateLoading || isEditing} // Disable if main form is loading or editing
                className="w-full justify-start"
              >
                <Lock className="mr-2 h-4 w-4" /> Cambiar Contraseña
              </Button>
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  Guarda tus cambios antes de cambiar la contraseña.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 border-t pt-6">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEditToggle}
                  disabled={updateLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="btn-accent"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {updateLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={handleEditToggle}>
                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
