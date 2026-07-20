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

  it('should fetch products successfully and map snake_case to camelCase', async () => {
    const mockDbData = [
      {
        id: 'prod-123',
        sku: 'RKF123',
        name: 'Test Pickle',
        name_telugu_script: 'టెస్ట్',
        slug: 'test-pickle',
        category: 'pickles',
        diet_type: 'veg',
        description: 'A test description',
        ingredients: ['Ing 1', 'Ing 2'],
        image_url: 'http://test.com/img.jpg',
        images: ['http://test.com/img.jpg'],
        actual_price: 300,
        selling_price: 250,
        rating: 4.5,
        review_count: 100,
        in_stock: true,
        available_locations: ['Loc1', 'Loc2'],
        heat_level: 8,
        featured: true,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      },
    ];

    const orderMock = jest.fn().mockResolvedValue({ data: mockDbData, error: null });
    const selectMock = jest.fn().mockReturnValue({ order: orderMock });
    (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

    const products = await fetchProductsFromDb();

    expect(supabase.from).toHaveBeenCalledWith('products');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(orderMock).toHaveBeenCalledWith('sku', { ascending: true });

    expect(products).toHaveLength(1);
    expect(products[0]).toEqual({
      id: 'prod-123',
      sku: 'RKF123',
      name: 'Test Pickle',
      nameTeluguScript: 'టెస్ట్',
      slug: 'test-pickle',
      category: 'pickles',
      dietType: 'veg',
      description: 'A test description',
      ingredients: ['Ing 1', 'Ing 2'],
      imageUrl: 'http://test.com/img.jpg',
      images: ['http://test.com/img.jpg'],
      actualPrice: 300,
      sellingPrice: 250,
      rating: 4.5,
      reviewCount: 100,
      inStock: true,
      availableLocations: ['Loc1', 'Loc2'],
      heatLevel: 8,
      featured: true,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    });
  });

  it('should return mock PRODUCTS if data is empty', async () => {
    const orderMock = jest.fn().mockResolvedValue({ data: [], error: null });
    const selectMock = jest.fn().mockReturnValue({ order: orderMock });
    (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

    const products = await fetchProductsFromDb();

    expect(products).toEqual(PRODUCTS);
  });

  it('should return mock PRODUCTS if error occurs', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Database connection failed');

    const orderMock = jest.fn().mockResolvedValue({ data: null, error: mockError });
    const selectMock = jest.fn().mockReturnValue({ order: orderMock });
    (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

    const products = await fetchProductsFromDb();

    expect(products).toEqual(PRODUCTS);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch products from Supabase, using mock fallback:', mockError);

    consoleErrorSpy.mockRestore();
  });
});
