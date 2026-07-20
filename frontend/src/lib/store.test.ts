import { renderHook, act } from '@testing-library/react';
import { useStore } from './store';
import { Product } from './types';
import { describe, it, expect, beforeEach } from 'vitest';

const mockProduct1: Product = {
  id: 'prod1',
  sku: 'RKF001',
  name: 'Avakaya',
  nameTeluguScript: 'అవకాయ',
  slug: 'avakaya',
  category: 'pickles',
  description: 'Mango Pickle',
  ingredients: ['Mango', 'Mustard', 'Oil'],
  imageUrl: '/avakaya.jpg',
  images: [],
  actualPrice: 150,
  sellingPrice: 120,
  rating: 4.8,
  reviewCount: 15,
  inStock: true,
  availableLocations: ['all'],
  heatLevel: 8,
  featured: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProduct2: Product = {
  id: 'prod2',
  sku: 'RKF002',
  name: 'Gongura',
  nameTeluguScript: 'గోంగూర',
  slug: 'gongura',
  category: 'pickles',
  description: 'Gongura Pickle',
  ingredients: ['Gongura', 'Chili', 'Garlic'],
  imageUrl: '/gongura.jpg',
  images: [],
  actualPrice: 120,
  sellingPrice: 100,
  rating: 4.9,
  reviewCount: 20,
  inStock: true,
  availableLocations: ['all'],
  heatLevel: 7,
  featured: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('useStore - addItem', () => {
  beforeEach(() => {
    // Clear the cart before each test
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it('should add a new product to the cart with default quantity of 1', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct1);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0]).toEqual({
      productId: mockProduct1.id,
      name: mockProduct1.name,
      imageUrl: mockProduct1.imageUrl,
      sellingPrice: mockProduct1.sellingPrice,
      quantity: 1,
      sku: mockProduct1.sku,
    });
  });

  it('should add a new product to the cart with a specific quantity', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct1, 3);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].quantity).toBe(3);
  });

  it('should increment the quantity if the product already exists in the cart', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct1, 2);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].quantity).toBe(2);

    act(() => {
      result.current.addItem(mockProduct1, 4);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].quantity).toBe(6);
  });

  it('should handle multiple different products correctly', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.addItem(mockProduct1, 1);
      result.current.addItem(mockProduct2, 2);
    });

    expect(result.current.cart.length).toBe(2);

    const item1 = result.current.cart.find(i => i.productId === mockProduct1.id);
    const item2 = result.current.cart.find(i => i.productId === mockProduct2.id);

    expect(item1?.quantity).toBe(1);
    expect(item2?.quantity).toBe(2);
  });
});
