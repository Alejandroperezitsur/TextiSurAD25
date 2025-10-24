// src/components/ui/favorite-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites, type FavoriteItem } from "@/context/FavoritesContext";
import * as React from "react";

interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ item, className, size = "sm" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item.id);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  const iconSize = size === "lg" ? 22 : size === "md" ? 18 : 16;

  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="icon"
      aria-label={active ? "Quitar de favoritos" : "Agregar a favoritos"}
      onClick={handleClick}
      className={`rounded-full ${active ? "bg-red-500 hover:bg-red-500/90 text-white" : "bg-background/80 hover:bg-background"} ${className ?? ""}`}
    >
      <Heart className={`${active ? "fill-white" : ""}`} color={active ? "#fff" : undefined} size={iconSize} />
    </Button>
  );
}