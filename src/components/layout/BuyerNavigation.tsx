"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Clock, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function BuyerNavigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    {
      name: "Productos",
      href: "/products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Mis Pedidos",
      href: "/orders/history",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Favoritos",
      href: "/favorites",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      name: "Mi Perfil",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Navegación para móviles */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white z-50 shadow-lg p-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Navegación para escritorio */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}