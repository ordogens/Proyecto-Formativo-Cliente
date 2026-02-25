import { useState } from "react";
import { ShopContext } from "./shopContext";
import type { CartItem } from "../data/carrito";

interface Props {
  children: React.ReactNode;
}

export const ShopProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const increaseQuantity = (cartId: string) => {
    setCart(prev =>
      prev.map(item =>
        item.cartId === cartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (cartId: string) => {
    setCart(prev =>
      prev
        .map(item =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        total,
        totalItems,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};