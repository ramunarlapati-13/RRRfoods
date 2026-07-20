import { useStore } from '../store';
import { CartItem } from '../types';

describe('Store removeItem functionality', () => {
  beforeEach(() => {
    useStore.setState({ cart: [] });
  });

  const mockItem1: CartItem = {
    productId: 'p1',
    name: 'Item 1',
    imageUrl: '/img1.jpg',
    sellingPrice: 10,
    quantity: 1,
    sku: 'SKU1',
  };

  const mockItem2: CartItem = {
    productId: 'p2',
    name: 'Item 2',
    imageUrl: '/img2.jpg',
    sellingPrice: 20,
    quantity: 2,
    sku: 'SKU2',
  };

  it('should remove an existing item from the cart', () => {
    useStore.setState({ cart: [mockItem1] });

    useStore.getState().removeItem('p1');

    expect(useStore.getState().cart).toHaveLength(0);
  });

  it('should not change the cart if removing an item that does not exist', () => {
    useStore.setState({ cart: [mockItem1] });

    useStore.getState().removeItem('non-existent-id');

    expect(useStore.getState().cart).toHaveLength(1);
    expect(useStore.getState().cart[0].productId).toBe('p1');
  });

  it('should handle removing an item from an empty cart', () => {
    useStore.getState().removeItem('p1');

    expect(useStore.getState().cart).toHaveLength(0);
  });

  it('should remove the correct item when multiple items are in the cart', () => {
    useStore.setState({ cart: [mockItem1, mockItem2] });

    useStore.getState().removeItem('p1');

    expect(useStore.getState().cart).toHaveLength(1);
    expect(useStore.getState().cart[0].productId).toBe('p2');
  });
});
