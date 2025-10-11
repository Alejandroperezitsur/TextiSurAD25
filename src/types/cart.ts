// src/types/cart.ts

export type CartItem = {
  id: number;
  name: string;
  price: number; // Use number for calculations
  imageUrl: string;
  quantity: number;
  size: string; // Size selection
  storeId?: string; // ID de la tienda asociada
};
