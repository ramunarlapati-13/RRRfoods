import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { CartItem } from './types';

describe('useStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({ cart: [] });
  });

  describe('addCartItem', () => {
    it('should correctly update quantity when adding an existing item', () => {
      const item: CartItem = {
        productId: 'prod-1',
        name: 'Test Product',
        imageUrl: 'test.jpg',
        sellingPrice: 100,
        quantity: 1,
        sku: 'RKF1',
      };

      // Add item initially
      useStore.getState().addCartItem(item);

      let cart = useStore.getState().cart;
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(1);
      expect(cart[0].productId).toBe('prod-1');

      // Add the exact same item again with quantity 2
      const itemToAddAgain: CartItem = {
        ...item,
        quantity: 2,
      };
      useStore.getState().addCartItem(itemToAddAgain);

      cart = useStore.getState().cart;
      // Length should still be 1, but quantity should be 1 + 2 = 3
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(3);
      expect(cart[0].productId).toBe('prod-1');
      expect(cart[0].sellingPrice).toBe(100);
    });

    it('should add a new item to cart if it does not exist', () => {
        const item1: CartItem = {
          productId: 'prod-1',
          name: 'Test Product 1',
          imageUrl: 'test1.jpg',
          sellingPrice: 100,
          quantity: 1,
          sku: 'RKF1',
        };

        const item2: CartItem = {
          productId: 'prod-2',
          name: 'Test Product 2',
          imageUrl: 'test2.jpg',
          sellingPrice: 200,
          quantity: 2,
          sku: 'RKF2',
        };

        useStore.getState().addCartItem(item1);
        useStore.getState().addCartItem(item2);

        const cart = useStore.getState().cart;
        expect(cart).toHaveLength(2);

        expect(cart[0].productId).toBe('prod-1');
        expect(cart[0].quantity).toBe(1);

        expect(cart[1].productId).toBe('prod-2');
        expect(cart[1].quantity).toBe(2);
    });
  });
});
