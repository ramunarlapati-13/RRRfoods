import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './store';
import { Product } from './types';

const mockProduct: Product = {
  id: 'p1',
  sku: 'SKU1',
  name: 'Test Product',
  nameTeluguScript: 'టెస్ట్',
  slug: 'test-product',
  category: 'pickles',
  description: 'Test Description',
  ingredients: [],
  imageUrl: 'test.jpg',
  images: [],
  actualPrice: 100,
  sellingPrice: 90,
  rating: 5,
  reviewCount: 0,
  inStock: true,
  availableLocations: [],
  heatLevel: 5,
  featured: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialState = useStore.getState();

describe('useStore', () => {
  beforeEach(() => {
    // Reset the store and local storage before each test
    localStorage.clear();
    useStore.setState(initialState, true);
  });

  describe('addItem', () => {
    it('should add a new product to the cart', () => {
      useStore.getState().addItem(mockProduct, 2);

      const cart = useStore.getState().cart;

      expect(cart).toHaveLength(1);
      expect(cart[0]).toEqual(
        expect.objectContaining({
          productId: 'p1',
          quantity: 2,
          name: 'Test Product',
          sellingPrice: 90,
        })
      );
    });

    it('should update the quantity of an existing product in the cart', () => {
      useStore.getState().addItem(mockProduct, 2);
      useStore.getState().addItem(mockProduct, 3);

      const cart = useStore.getState().cart;

      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(5);
    });

    it('should use default quantity of 1 if not provided', () => {
      useStore.getState().addItem(mockProduct);
      useStore.getState().addItem(mockProduct);

      const cart = useStore.getState().cart;

      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(2);
    });
  });
});
