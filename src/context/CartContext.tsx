// src/context/CartContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import type { CartItem } from "@/types/cart";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void; // Function to clear the cart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false); // Flag to track initialization

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("textisur-cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      setIsInitialized(true); // Mark as initialized after loading
    }
  }, []);

  // Save cart to localStorage whenever it changes, after initialization
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem("textisur-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.size === item.size,
      );
      if (existingItem) {
        // Increase quantity if item (with same size) already exists
        return prevItems.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map(
        (item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item, // Ensure quantity >= 1
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
