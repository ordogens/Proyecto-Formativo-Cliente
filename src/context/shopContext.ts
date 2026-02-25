import { createContext } from "react";
import type { CartItem } from "../data/carrito";

export interface ShopContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: string) => void;
  increaseQuantity: (cartId: string) => void;
  decreaseQuantity: (cartId: string) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined);