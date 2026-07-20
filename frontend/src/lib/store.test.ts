import { useStore } from './store';
import { Product } from './types';

describe('useStore - inWishlist', () => {
  const mockProduct1: Product = {
    id: 'prod-1',
    sku: 'SKU1',
    name: 'Product 1',
    nameTeluguScript: 'ప్రొడక్ట్ 1',
    slug: 'product-1',
    category: 'pickles',
    description: 'Test product 1',
    ingredients: [],
    imageUrl: 'url',
    images: [],
    actualPrice: 100,
    sellingPrice: 100,
    rating: 5,
    reviewCount: 1,
    inStock: true,
    availableLocations: [],
    heatLevel: 5,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockProduct2: Product = {
    id: 'prod-2',
    sku: 'SKU2',
    name: 'Product 2',
    nameTeluguScript: 'ప్రొడక్ట్ 2',
    slug: 'product-2',
    category: 'sweets',
    description: 'Test product 2',
    ingredients: [],
    imageUrl: 'url2',
    images: [],
    actualPrice: 150,
    sellingPrice: 150,
    rating: 4,
    reviewCount: 2,
    inStock: true,
    availableLocations: [],
    heatLevel: 2,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    // Reset the store state before each test
    useStore.setState({ wishlist: [] });
  });

  it('should return false when the wishlist is empty', () => {
    const state = useStore.getState();
    expect(state.inWishlist('prod-1')).toBe(false);
    expect(state.inWishlist('any-id')).toBe(false);
  });

  it('should return true when the product ID is in the wishlist', () => {
    useStore.setState({ wishlist: [mockProduct1] });
    const state = useStore.getState();
    expect(state.inWishlist('prod-1')).toBe(true);
  });

  it('should return false when the product ID is not in the wishlist but other products are', () => {
    useStore.setState({ wishlist: [mockProduct1] });
    const state = useStore.getState();
    expect(state.inWishlist('prod-2')).toBe(false);
  });

  it('should return true for multiple items in the wishlist', () => {
    useStore.setState({ wishlist: [mockProduct1, mockProduct2] });
    const state = useStore.getState();
    expect(state.inWishlist('prod-1')).toBe(true);
    expect(state.inWishlist('prod-2')).toBe(true);
  });

  it('should return false for edge cases like empty strings or undefined', () => {
    useStore.setState({ wishlist: [mockProduct1] });
    const state = useStore.getState();
    expect(state.inWishlist('')).toBe(false);
    // @ts-ignore - explicitly testing undefined
    expect(state.inWishlist(undefined)).toBe(false);
    // @ts-ignore - explicitly testing null
    expect(state.inWishlist(null)).toBe(false);
  });
});
