import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutPage from '../page';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('CheckoutPage Error Handling', () => {
  const mockClearCart = jest.fn();
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockInsert = jest.fn();
  const mockFrom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    (useCart as jest.Mock).mockReturnValue({
      items: [{ productId: '1', name: 'Test Pickle', sellingPrice: 100, quantity: 2 }],
      total: 200,
      clearCart: mockClearCart,
    });

    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: 'user123', displayName: 'Test User', email: 'test@example.com', phoneNumber: '1234567890' },
      loading: false,
    });

    mockFrom.mockReturnValue({ insert: mockInsert });
    (supabase.from as jest.Mock) = mockFrom;

    // Spy on console.error to avoid cluttering test output and to assert on it
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should handle form submission errors gracefully', async () => {
    const user = userEvent.setup();

    // Mock a Supabase insertion error with a deferred promise so we can check loading state
    const mockError = { message: 'Database constraint failed' };
    let resolveInsert: any;
    const insertPromise = new Promise((resolve) => {
      resolveInsert = resolve;
    });
    mockInsert.mockReturnValueOnce(insertPromise);

    render(<CheckoutPage />);

    // Fill in required shipping details
    await user.type(screen.getByLabelText(/Address Line 1/i), '123 Test St');
    await user.type(screen.getByLabelText(/City/i), 'Testville');
    await user.type(screen.getByLabelText(/State/i), 'Test State');
    await user.type(screen.getByLabelText(/Pincode/i), '123456');

    // Submit the form
    const submitBtn = screen.getByRole('button', { name: /Place Order/i });

    // Do not await the click yet, as it triggers async handler
    user.click(submitBtn);

    // Verify it set loading to true
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
      expect(screen.getByRole('button', { name: /Placing Order/i })).toBeInTheDocument();
    });

    // Resolve the insert promise with an error
    resolveInsert({ error: mockError });

    await waitFor(() => {
      // 1. Verify supabase was called
      expect(mockFrom).toHaveBeenCalledWith('orders');
      expect(mockInsert).toHaveBeenCalled();

      // 2. Verify error toast was shown
      expect(toast.error).toHaveBeenCalledWith('Database constraint failed');

      // 3. Verify console.error was called
      expect(console.error).toHaveBeenCalledWith(mockError);
    });

    // 4. Verify clearCart was NOT called since order failed
    expect(mockClearCart).not.toHaveBeenCalled();

    // 5. Verify loading state was reset (finally block)
    await waitFor(() => {
      const resetBtn = screen.getByRole('button', { name: /Place Order/i });
      expect(resetBtn).not.toBeDisabled();
      expect(screen.queryByText(/Placing Order/i)).not.toBeInTheDocument();
    });
  });

  it('should fallback to default error message if error has no message', async () => {
    const user = userEvent.setup();

    // Mock an error without a message
    const mockError = { code: '500' };
    mockInsert.mockResolvedValueOnce({ error: mockError });

    render(<CheckoutPage />);

    // Fill in required shipping details
    await user.type(screen.getByLabelText(/Address Line 1/i), '123 Test St');
    await user.type(screen.getByLabelText(/City/i), 'Testville');
    await user.type(screen.getByLabelText(/State/i), 'Test State');
    await user.type(screen.getByLabelText(/Pincode/i), '123456');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /Place Order/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Order failed. Please try again.');
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });
});
