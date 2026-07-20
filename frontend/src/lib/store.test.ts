import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { Product } from './types';

const mockProduct: Product = {
  id: 'prod-1',
  sku: 'RKF1',
  name: 'Test Pickle',
  nameTeluguScript: 'టెస్ట్ పచ్చడి',
  slug: 'test-pickle',
  category: 'pickles',
  description: 'A test pickle',
  ingredients: ['mango', 'chili'],
  imageUrl: 'http://example.com/img.jpg',
  images: [],
  actualPrice: 100,
  sellingPrice: 90,
  rating: 4.5,
  reviewCount: 10,
  inStock: true,
  availableLocations: ['HYD'],
  heatLevel: 5,
  featured: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('useStore - Wishlist', () => {
  beforeEach(() => {
    useStore.setState({ wishlist: [] });
  });

  it('toggleWishlist adds missing item', () => {
    useStore.getState().toggleWishlist(mockProduct);
    expect(useStore.getState().wishlist).toHaveLength(1);
    expect(useStore.getState().wishlist[0].id).toBe('prod-1');
    expect(useStore.getState().inWishlist('prod-1')).toBe(true);
  });

  it('toggleWishlist removes existing item', () => {
    useStore.getState().toggleWishlist(mockProduct); // Add
    expect(useStore.getState().wishlist).toHaveLength(1);

    useStore.getState().toggleWishlist(mockProduct); // Remove
    expect(useStore.getState().wishlist).toHaveLength(0);
    expect(useStore.getState().inWishlist('prod-1')).toBe(false);
  });

  it('inWishlist correctly identifies if item is in wishlist', () => {
    expect(useStore.getState().inWishlist('prod-1')).toBe(false);
    useStore.getState().toggleWishlist(mockProduct);
    expect(useStore.getState().inWishlist('prod-1')).toBe(true);
    useStore.getState().toggleWishlist({ ...mockProduct, id: 'prod-2' });
    expect(useStore.getState().inWishlist('prod-2')).toBe(true);
  });
});
