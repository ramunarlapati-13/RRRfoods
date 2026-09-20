import { describe, it, expect } from 'vitest';
import { Product } from '@/lib/types';
import { calculateCategoryCounts } from './calculateCategoryCounts';

describe('calculateCategoryCounts', () => {
  it('correctly counts categories for empty products list', () => {
    const products: Product[] = [];
    const counts = calculateCategoryCounts(products);
    expect(counts).toEqual({
      all: 0,
      pickles: 0,
      sweets: 0,
      meals: 0,
    });
  });

  it('correctly counts categories for a mixed list of products', () => {
    const products: Partial<Product>[] = [
      { id: '1', category: 'pickles' },
      { id: '2', category: 'pickles' },
      { id: '3', category: 'sweets' },
      { id: '4', category: 'meals' },
      { id: '5', category: 'pickles' },
    ];

    const counts = calculateCategoryCounts(products as Product[]);
    expect(counts).toEqual({
      all: 5,
      pickles: 3,
      sweets: 1,
      meals: 1,
    });
  });
});
