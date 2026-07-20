import { fetchProductsFromDb, PRODUCTS } from '../products';
import { supabase } from '../supabase';

jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('fetchProductsFromDb', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns products from db when successful', async () => {
    const mockData = [
      {
        id: 'db-001',
        sku: 'RKF-TEST',
        name: 'Test Product',
        actual_price: 100,
        selling_price: 90,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const selectMock = jest.fn().mockReturnValue({ order: jest.fn().mockResolvedValue({ data: mockData, error: null }) });
    (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

    const result = await fetchProductsFromDb();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('db-001');
    expect(result[0].sku).toBe('RKF-TEST');
  });

  it('returns PRODUCTS fallback when there is an error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const selectMock = jest.fn().mockReturnValue({ order: jest.fn().mockResolvedValue({ data: null, error: new Error('Database connection failed') }) });
    (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

    const result = await fetchProductsFromDb();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch products from Supabase, using mock fallback:',
      expect.any(Error)
    );
    expect(result).toEqual(PRODUCTS);

    consoleErrorSpy.mockRestore();
  });

  it('returns PRODUCTS fallback when it throws an exception', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const selectMock = jest.fn().mockReturnValue({ order: jest.fn().mockRejectedValue(new Error('Network error')) });
    (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

    const result = await fetchProductsFromDb();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch products from Supabase, using mock fallback:',
      expect.any(Error)
    );
    expect(result).toEqual(PRODUCTS);

    consoleErrorSpy.mockRestore();
  });

  it('returns PRODUCTS fallback when no data is returned', async () => {
    const selectMock = jest.fn().mockReturnValue({ order: jest.fn().mockResolvedValue({ data: [], error: null }) });
    (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

    const result = await fetchProductsFromDb();

    expect(result).toEqual(PRODUCTS);
  });
});
