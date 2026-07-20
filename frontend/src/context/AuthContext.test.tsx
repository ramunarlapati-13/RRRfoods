import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@/lib/supabase', () => {
  return {
    supabase: {
      from: vi.fn(),
      auth: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(() => {
          return { data: { subscription: { unsubscribe: vi.fn() } } };
        }),
      },
    },
  };
});

// A test component to consume the context
function TestComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (!user) return <div data-testid="no-user">No User</div>;

  return (
    <div>
      <div data-testid="user-email">{user.email}</div>
      <div data-testid="user-role">{user.role}</div>
      <div data-testid="user-uid">{user.uid}</div>
    </div>
  );
}

describe('AuthContext - role assignment fallback logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation to not throw errors right away but we will customize per test
    (supabase.auth.onAuthStateChange as any).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    });
  });

  it('assigns admin role when db query throws an error and email is admin@rrrfoods.in', async () => {
    // 1. Mock getSession to return a user with admin email
    const mockUser = {
      id: 'test-admin-uid',
      email: 'admin@rrrfoods.in',
      created_at: '2023-01-01T00:00:00Z',
    };

    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    // 2. Mock supabase.from('profiles').select().eq().single() to throw an error
    const singleMock = vi.fn().mockRejectedValue(new Error('Simulated DB Error'));
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    (supabase.from as any).mockReturnValue({ select: selectMock });

    // Spy on console.error so it doesn't clutter test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // 3. Assert that loading finishes and role is admin
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('admin@rrrfoods.in');
    expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    expect(screen.getByTestId('user-uid')).toHaveTextContent('test-admin-uid');

    // Verify console.error was called due to the simulated DB error
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching user profile from profiles table:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('assigns customer role when db query throws an error and email is a normal user email', async () => {
    // 1. Mock getSession to return a user with customer email
    const mockUser = {
      id: 'test-customer-uid',
      email: 'user@example.com',
      created_at: '2023-01-01T00:00:00Z',
    };

    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    // 2. Mock supabase.from('profiles').select().eq().single() to throw an error
    const singleMock = vi.fn().mockRejectedValue(new Error('Simulated DB Error 2'));
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    (supabase.from as any).mockReturnValue({ select: selectMock });

    // Spy on console.error so it doesn't clutter test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // 3. Assert that loading finishes and role is customer
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com');
    expect(screen.getByTestId('user-role')).toHaveTextContent('customer');
    expect(screen.getByTestId('user-uid')).toHaveTextContent('test-customer-uid');

    // Verify console.error was called due to the simulated DB error
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching user profile from profiles table:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
