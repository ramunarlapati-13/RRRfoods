import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeritageBoxSampler from '../src/components/HeritageBoxSampler';
import { CartProvider } from '../src/context/CartContext';
import toast from 'react-hot-toast';
import { useStore } from '../src/lib/store';

// Mock the cart context dependencies
jest.mock('../src/lib/store', () => {
  const addCartItem = jest.fn();
  return {
    useStore: jest.fn((selector) => {
      const state = {
        cart: [],
        addCartItem,
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        cartTotal: () => 0,
        cartCount: () => 0,
      };
      return selector(state);
    })
  };
});

// Mock toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

// Mock drag and drop so it renders children
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => <div>{children}</div>,
  Droppable: ({ children }: any) => children({ innerRef: jest.fn(), droppableProps: {}, placeholder: null }, {}),
  Draggable: ({ children }: any) => children({ innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {} }, {}),
}));

// Mock Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} fill={props.fill ? "true" : undefined} />,
}));

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <CartProvider>
      {ui}
    </CartProvider>
  );
};

describe('HeritageBoxSampler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders correctly', () => {
    renderWithContext(<HeritageBoxSampler />);
    expect(screen.getByText(/Choose your items/i)).toBeTruthy();
    expect(screen.getByText(/Your Heritage Box/i)).toBeTruthy();
  });

  it('adds items up to MAX_ITEMS and shows max items error', () => {
    renderWithContext(<HeritageBoxSampler />);

    // Find add buttons
    const addButtons = screen.getAllByRole('button', { name: /Add .* to Heritage Box/i });

    // Add 4 different items
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[1]);
    fireEvent.click(addButtons[2]);
    fireEvent.click(addButtons[3]);

    expect(toast.success).toHaveBeenCalledTimes(4);

    // Try adding a 5th item
    fireEvent.click(addButtons[4]);

    expect(toast.error).toHaveBeenCalledWith('Your Heritage Box can hold max 4 items.');
  });

  it('prevents adding duplicate items', () => {
    renderWithContext(<HeritageBoxSampler />);

    const addButtons = screen.getAllByRole('button', { name: /Add .* to Heritage Box/i });

    // Add the first item twice
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('is already in your box.'));
  });

  it('allows removing items', () => {
    renderWithContext(<HeritageBoxSampler />);

    const addButtons = screen.getAllByRole('button', { name: /Add .* to Heritage Box/i });
    fireEvent.click(addButtons[0]);

    // Remove the item
    const removeButton = screen.getByRole('button', { name: /Remove from box/i });
    fireEvent.click(removeButton);

    // It should no longer be in the box, we can verify by checking if the remove button is gone
    expect(screen.queryByRole('button', { name: /Remove from box/i })).toBeNull();
  });

  it('allows checking out with 3 or more items', () => {
    renderWithContext(<HeritageBoxSampler />);

    const addButtons = screen.getAllByRole('button', { name: /Add .* to Heritage Box/i });
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[1]);
    fireEvent.click(addButtons[2]);

    const checkoutButton = screen.getByRole('button', { name: /Add Box to Cart/i });
    expect(checkoutButton).not.toBeDisabled();

    // Checkout
    fireEvent.click(checkoutButton);
    expect(toast.success).toHaveBeenCalledWith('Heritage Box added to cart! 🎁');
  });
});
