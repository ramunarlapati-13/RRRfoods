'use client';
import React, { createContext, useContext } from 'react';
import { useStore } from '@/lib/store';
import { CartItem } from '@/lib/types';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  addMultipleItems: (items: CartItem[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useStore((state) => state.cart);
  const addCartItem = useStore((state) => state.addCartItem);
  const storeAddMultipleItems = useStore((state) => state.addMultipleItems);
  const storeRemoveItem = useStore((state) => state.removeItem);
  const storeUpdateQuantity = useStore((state) => state.updateQuantity);
  const storeClearCart = useStore((state) => state.clearCart);
  const storeTotal = useStore((state) => state.cartTotal());
  const storeCount = useStore((state) => state.cartCount());

  const addItem = (item: CartItem) => {
    addCartItem(item);
  };

  const addMultipleItems = (items: CartItem[]) => {
    storeAddMultipleItems(items);
  };

  const removeItem = (productId: string) => {
    storeRemoveItem(productId);
  };

  const updateQuantity = (productId: string, qty: number) => {
    storeUpdateQuantity(productId, qty);
  };

  const clearCart = () => {
    storeClearCart();
  };

  return (
    <CartContext.Provider
      value={{
        items: cart,
        addItem,
        addMultipleItems,
        removeItem,
        updateQuantity,
        clearCart,
        total: storeTotal,
        count: storeCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

