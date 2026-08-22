import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProductsFromDb, PRODUCTS } from './products';
import { supabase } from './supabase';

vi.mock('./supabase', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

describe('fetchProductsFromDb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return mapped products when database fetch succeeds', async () => {
    const mockDbData = [
      {
        id: 'db-1',
        sku: 'SKU1',
        name: 'DB Product 1',
        name_telugu_script: 'తెలుగు',
        slug: 'db-product-1',
        category: 'pickles',
        diet_type: 'veg',
        description: 'DB Description',
        ingredients: ['Ing 1'],
        image_url: 'http://example.com/img.jpg',
        images: ['http://example.com/img.jpg'],
        actual_price: 100,
        selling_price: 80,
        rating: 4.5,
        review_count: 10,
        in_stock: true,
        available_locations: ['Loc1'],
        heat_level: 7,
        featured: true,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z',
      },
    ];

    const mockOrder = vi.fn().mockResolvedValue({ data: mockDbData, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

    const products = await fetchProductsFromDb();

    expect(supabase.from).toHaveBeenCalledWith('products');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockOrder).toHaveBeenCalledWith('sku', { ascending: true });
    expect(products).toHaveLength(1);
    expect(products[0].id).toBe('db-1');
    expect(products[0].name).toBe('DB Product 1');
    expect(products[0].createdAt).toEqual(new Date('2025-01-01T00:00:00.000Z'));
  });

  it('should return PRODUCTS fallback when database data is empty', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

    const products = await fetchProductsFromDb();

    expect(products).toEqual(PRODUCTS);
  });

  it('should return PRODUCTS fallback and log error when database returns an error object', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const dbError = new Error('Database connection failed');

    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: dbError });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

    const products = await fetchProductsFromDb();

    expect(products).toEqual(PRODUCTS);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch products from Supabase, using mock fallback:',
      dbError
    );

    consoleErrorSpy.mockRestore();
  });

  it('should return PRODUCTS fallback and log error when supabase call throws an exception', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unexpectedError = new Error('Network failure');

    const mockOrder = vi.fn().mockRejectedValue(unexpectedError);
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    vi.mocked(supabase.from).mockReturnValue({ select: mockSelect } as any);

    const products = await fetchProductsFromDb();

    expect(products).toEqual(PRODUCTS);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch products from Supabase, using mock fallback:',
      unexpectedError
    );

    consoleErrorSpy.mockRestore();
  });
});
