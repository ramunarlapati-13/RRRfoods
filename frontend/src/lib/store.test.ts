import { useStore } from './store';

// Mock the supabase module
jest.mock('./supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockRejectedValue(new Error('Supabase error')),
  },
}));

describe('store.ts: acceptB2bAgreement', () => {
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    // Reset store state
    useStore.setState({
      b2bSession: { projectId: 'test-project', status: 'Pending' },
    });
    // Mock console.error to avoid spamming the test output and to assert it's called
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('catches Supabase error', async () => {
    const { acceptB2bAgreement } = useStore.getState();

    // Call the function, it should not throw
    await acceptB2bAgreement('John Doe');

    // Verify error was caught and logged
    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error syncing B2B agreement to Supabase:',
      expect.any(Error)
    );
    expect(consoleErrorMock.mock.calls[0][1].message).toBe('Supabase error');

    // State is still updated locally
    expect(useStore.getState().b2bSession).toEqual({
      projectId: 'test-project',
      status: 'Active',
      signedName: 'John Doe',
    });
  });
});
