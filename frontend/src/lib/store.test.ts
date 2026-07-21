import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { Product } from './types';

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
