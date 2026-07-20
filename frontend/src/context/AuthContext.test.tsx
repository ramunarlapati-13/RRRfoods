import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getSession: jest.fn(),
        onAuthStateChange: jest.fn(),
      },
      from: jest.fn(),
    },
  };
});

// A test component to consume the AuthContext
const TestComponent = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No User</div>;

  return (
    <div>
      <div data-testid="user-role">{user.role}</div>
      <div data-testid="user-email">{user.email}</div>
      <div data-testid="user-displayname">{user.displayName}</div>
    </div>
  );
};

describe('AuthContext', () => {
  const mockSubscription = { unsubscribe: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default auth setup
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: mockSubscription },
    });
  });

  const mockSupabaseQuery = (mockReturn: { data: any; error: any }, shouldThrow: boolean = false) => {
    const mockSingle = jest.fn();
    if (shouldThrow) {
      mockSingle.mockRejectedValue(new Error('Network error or DB unreachable'));
    } else {
      mockSingle.mockResolvedValue(mockReturn);
    }

    const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });
  };

  it('sets user profile correctly when DB returns a profile', async () => {
    const mockSessionUser = {
      id: 'user123',
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00Z',
      user_metadata: { full_name: 'Test User' },
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockSessionUser } },
    });

    mockSupabaseQuery({
      data: {
        id: 'user123',
        display_name: 'Test DB Name',
        role: 'customer',
        created_at: '2023-01-01T00:00:00Z'
      },
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-displayname')).toHaveTextContent('Test DB Name');
      expect(screen.getByTestId('user-role')).toHaveTextContent('customer');
    });
  });

  it('falls back to sbUser details when DB query returns an error or no profile (else block)', async () => {
    const mockSessionUser = {
      id: 'user123',
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00Z',
      user_metadata: { full_name: 'Fallback User' },
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockSessionUser } },
    });

    // Return error to trigger else block
    mockSupabaseQuery({
      data: null,
      error: new Error('Profile not found')
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-displayname')).toHaveTextContent('Fallback User');
      expect(screen.getByTestId('user-role')).toHaveTextContent('customer');
    });
  });

  it('grants admin role in fallback if email matches admin (else block)', async () => {
    const mockSessionUser = {
      id: 'admin123',
      email: 'admin@rrrfoods.in',
      created_at: '2023-01-01T00:00:00Z',
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockSessionUser } },
    });

    mockSupabaseQuery({
      data: null,
      error: new Error('Profile not found')
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    });
  });

  it('falls back and correctly assigns role on DB exception (catch block)', async () => {
    // Suppress console.error for this test as we expect an error to be caught and logged
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockSessionUser = {
      id: 'err123',
      email: 'ramu@rexplore.tech',
      created_at: '2023-01-01T00:00:00Z',
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockSessionUser } },
    });

    // Force an exception in the query builder
    mockSupabaseQuery({ data: null, error: null }, true);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      // Despite the DB crashing, the user should be logged in as admin because of the fallback in the catch block
      expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
      expect(screen.getByTestId('user-email')).toHaveTextContent('ramu@rexplore.tech');
    });

    consoleSpy.mockRestore();
  });
});
