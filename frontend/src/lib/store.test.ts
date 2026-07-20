import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './store';
import { CartItem } from './types';

// Mock localStorage for Zustand persist middleware
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useStore', () => {
  const mockProduct: CartItem = {
    productId: 'test-1',
    name: 'Test Product',
    quantity: 5,
    imageUrl: 'http://example.com/img.jpg',
    sellingPrice: 100,
    sku: 'TEST-SKU'
  };

  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({ cart: [] });
    window.localStorage.clear();
  });

  describe('updateQuantity', () => {
    it('should update the quantity when it is positive', () => {
      useStore.setState({ cart: [mockProduct] });

      useStore.getState().updateQuantity('test-1', 10);

      const cart = useStore.getState().cart;
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(10);
    });

    it('should remove the item when quantity is zero', () => {
      useStore.setState({ cart: [mockProduct] });

      useStore.getState().updateQuantity('test-1', 0);

      expect(useStore.getState().cart).toHaveLength(0);
    });

    it('should remove the item when quantity is negative', () => {
      useStore.setState({ cart: [mockProduct] });

      useStore.getState().updateQuantity('test-1', -5);

      expect(useStore.getState().cart).toHaveLength(0);
    });

    it('should not throw error or change state if product not found and trying to update quantity', () => {
      useStore.setState({ cart: [mockProduct] });

      useStore.getState().updateQuantity('non-existent-product', 10);

      const cart = useStore.getState().cart;
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(5);
    });
  });
});
