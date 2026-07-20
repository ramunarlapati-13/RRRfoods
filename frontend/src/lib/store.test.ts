import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { Product, CartItem } from './types';

describe('Store calculations - cartCount and cartTotal', () => {
  beforeEach(() => {
    // Clear the cart before each test
    useStore.getState().clearCart();
  });

  const mockProduct1: Product = {
    id: 'prod-1',
    sku: 'SKU1',
    name: 'Mango Pickle',
    nameTeluguScript: 'మామిడి పచ్చడి',
    slug: 'mango-pickle',
    category: 'pickles',
    dietType: 'veg',
    description: 'Spicy mango pickle',
    ingredients: ['mango', 'chili', 'salt'],
    imageUrl: 'url1',
    images: ['url1'],
    actualPrice: 200,
    sellingPrice: 150,
    rating: 4.5,
    reviewCount: 10,
    inStock: true,
    availableLocations: ['all'],
    heatLevel: 8,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct2: Product = {
    id: 'prod-2',
    sku: 'SKU2',
    name: 'Lemon Pickle',
    nameTeluguScript: 'నిమ్మ పచ్చడి',
    slug: 'lemon-pickle',
    category: 'pickles',
    dietType: 'veg',
    description: 'Tangy lemon pickle',
    ingredients: ['lemon', 'chili', 'salt'],
    imageUrl: 'url2',
    images: ['url2'],
    actualPrice: 150,
    sellingPrice: 100,
    rating: 4.0,
    reviewCount: 5,
    inStock: true,
    availableLocations: ['all'],
    heatLevel: 5,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should return 0 for cartCount and cartTotal when cart is empty', () => {
    const store = useStore.getState();
    expect(store.cartCount()).toBe(0);
    expect(store.cartTotal()).toBe(0);
  });

  it('should correctly calculate cartCount and cartTotal after adding items', () => {
    const store = useStore.getState();
    store.addItem(mockProduct1, 2); // 2 * 150 = 300
    store.addItem(mockProduct2, 1); // 1 * 100 = 100

    // After adding 2 of prod-1 and 1 of prod-2
    // cartCount: 2 + 1 = 3
    // cartTotal: 300 + 100 = 400
    expect(useStore.getState().cartCount()).toBe(3);
    expect(useStore.getState().cartTotal()).toBe(400);
  });

  it('should update correctly when an item quantity is updated', () => {
    const store = useStore.getState();
    store.addItem(mockProduct1, 2);

    // update prod-1 to quantity 5
    useStore.getState().updateQuantity('prod-1', 5);

    // cartCount: 5
    // cartTotal: 5 * 150 = 750
    expect(useStore.getState().cartCount()).toBe(5);
    expect(useStore.getState().cartTotal()).toBe(750);
  });

  it('should update correctly when an item is removed', () => {
    const store = useStore.getState();
    store.addItem(mockProduct1, 2);
    store.addItem(mockProduct2, 1);

    // remove prod-1
    useStore.getState().removeItem('prod-1');

    // cartCount should be 1 (prod-2)
    // cartTotal should be 1 * 100 = 100
    expect(useStore.getState().cartCount()).toBe(1);
    expect(useStore.getState().cartTotal()).toBe(100);
  });

  it('should reset counts when cart is cleared', () => {
    const store = useStore.getState();
    store.addItem(mockProduct1, 2);

    expect(useStore.getState().cartCount()).toBe(2);

    useStore.getState().clearCart();

    expect(useStore.getState().cartCount()).toBe(0);
    expect(useStore.getState().cartTotal()).toBe(0);
  });

  it('should calculate correctly when items are added using addCartItem', () => {
     const store = useStore.getState();

     const cartItem1: CartItem = {
         productId: 'prod-3',
         name: 'Item 3',
         imageUrl: 'url3',
         sellingPrice: 50,
         quantity: 4,
         sku: 'SKU3'
     };

     store.addCartItem(cartItem1);

     expect(useStore.getState().cartCount()).toBe(4);
     expect(useStore.getState().cartTotal()).toBe(200); // 4 * 50
  });

});
