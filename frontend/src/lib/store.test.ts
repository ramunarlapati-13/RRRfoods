import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { CartItem, Product } from './types';

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

      useStore.getState().addCartItem(item);

      let cart = useStore.getState().cart;
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(1);
      expect(cart[0].productId).toBe('prod-1');

      const itemToAddAgain: CartItem = {
        ...item,
        quantity: 2,
      };
      useStore.getState().addCartItem(itemToAddAgain);

      cart = useStore.getState().cart;
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

describe('cartTotal calculation', () => {
  beforeEach(() => {
    // Reset the store before each test
    useStore.getState().clearCart();
  });

  it('should return 0 when the cart is empty', () => {
    expect(useStore.getState().cartTotal()).toBe(0);
  });

  it('should calculate the correct total for a single item with quantity 1', () => {
    const mockProduct: Product = {
      id: 'p1',
      sku: 'sku1',
      name: 'Product 1',
      nameTeluguScript: '',
      slug: 'product-1',
      category: 'sweets',
      description: '',
      ingredients: [],
      imageUrl: '',
      images: [],
      actualPrice: 150,
      sellingPrice: 100,
      rating: 5,
      reviewCount: 0,
      inStock: true,
      availableLocations: [],
      heatLevel: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    useStore.getState().addItem(mockProduct, 1);
    expect(useStore.getState().cartTotal()).toBe(100);
  });

  it('should calculate the correct total for a single item with multiple quantity', () => {
    const mockProduct: Product = {
      id: 'p2',
      sku: 'sku2',
      name: 'Product 2',
      nameTeluguScript: '',
      slug: 'product-2',
      category: 'sweets',
      description: '',
      ingredients: [],
      imageUrl: '',
      images: [],
      actualPrice: 250,
      sellingPrice: 200,
      rating: 5,
      reviewCount: 0,
      inStock: true,
      availableLocations: [],
      heatLevel: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    useStore.getState().addItem(mockProduct, 3); // 200 * 3 = 600
    expect(useStore.getState().cartTotal()).toBe(600);
  });

  it('should calculate the correct total for multiple different items', () => {
    const mockProduct1: Product = {
      id: 'p1',
      sku: 'sku1',
      name: 'Product 1',
      nameTeluguScript: '',
      slug: 'product-1',
      category: 'sweets',
      description: '',
      ingredients: [],
      imageUrl: '',
      images: [],
      actualPrice: 150,
      sellingPrice: 100,
      rating: 5,
      reviewCount: 0,
      inStock: true,
      availableLocations: [],
      heatLevel: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockProduct2: Product = {
      id: 'p2',
      sku: 'sku2',
      name: 'Product 2',
      nameTeluguScript: '',
      slug: 'product-2',
      category: 'sweets',
      description: '',
      ingredients: [],
      imageUrl: '',
      images: [],
      actualPrice: 250,
      sellingPrice: 200,
      rating: 5,
      reviewCount: 0,
      inStock: true,
      availableLocations: [],
      heatLevel: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    useStore.getState().addItem(mockProduct1, 2); // 100 * 2 = 200
    useStore.getState().addItem(mockProduct2, 3); // 200 * 3 = 600

    expect(useStore.getState().cartTotal()).toBe(800); // 200 + 600 = 800
  });
});
