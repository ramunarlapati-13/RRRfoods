import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';
import { Product } from './types';

describe('useStore - Wishlist', () => {
  const mockProduct: Product = {
    id: 'product-1',
    sku: 'RKF-TEST-1',
    name: 'Test Pickle',
    nameTeluguScript: 'టెస్ట్ పచ్చడి',
    slug: 'test-pickle',
    category: 'pickles',
    dietType: 'veg',
    description: 'A test pickle',
    ingredients: ['Mango', 'Salt', 'Chili Powder'],
    imageUrl: '/images/test.jpg',
    images: ['/images/test.jpg'],
    actualPrice: 200,
    sellingPrice: 150,
    rating: 4.5,
    reviewCount: 10,
    inStock: true,
    availableLocations: ['HYD'],
    heatLevel: 8,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // Reset the store before each test
    useStore.setState({ wishlist: [] });
  });

  it('should add a product to the wishlist if it does not exist', () => {
    // Arrange
    const { toggleWishlist, wishlist: initialWishlist } = useStore.getState();
    expect(initialWishlist).toHaveLength(0);

    // Act
    useStore.getState().toggleWishlist(mockProduct);

    // Assert
    const { wishlist: updatedWishlist } = useStore.getState();
    expect(updatedWishlist).toHaveLength(1);
    expect(updatedWishlist[0]).toEqual(mockProduct);
  });

  it('should remove a product from the wishlist if it already exists', () => {
    // Arrange
    useStore.setState({ wishlist: [mockProduct] });
    const { wishlist: initialWishlist } = useStore.getState();
    expect(initialWishlist).toHaveLength(1);
    expect(initialWishlist[0]).toEqual(mockProduct);

    // Act
    useStore.getState().toggleWishlist(mockProduct);

    // Assert
    const { wishlist: updatedWishlist } = useStore.getState();
    expect(updatedWishlist).toHaveLength(0);
  });
});
