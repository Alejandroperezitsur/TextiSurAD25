// src/components/layout/user-nav.tsx
"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import {
  LogOut,
  User as UserIcon,
  ListOrdered,
  LayoutDashboard,
} from "lucide-react"; // Added icons

interface UserNavProps {
  user: User;
  onLogout: () => void; // Prop to handle logout logic
}

export function UserNav({ user, onLogout }: UserNavProps) {
  const { toast } = useToast();

  const handleLogoutClick = () => {
    onLogout(); // Call the passed logout handler from AuthContext via Layout
    toast({
      title: "Sesión Cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 border">
            {" "}
            {/* Added border */}
            <AvatarImage
              src={
                user.avatarUrl ||
                `https://avatar.vercel.sh/${user.email}.png?size=32`
              }
              alt={user.name}
            />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || "Usuario"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize pt-1">
              Rol: {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        {/* Conditionally render based on role */}
        {user.role === "vendedor" ? (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/vendedor">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Mis Publicaciones</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          // Link to a buyer-specific order history page (if available)
          <DropdownMenuItem asChild>
            <Link href="/orders">
              {" "}
              {/* TODO: Create /orders page */}
              <ListOrdered className="mr-2 h-4 w-4" />
              <span>Mis Pedidos</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogoutClick}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
