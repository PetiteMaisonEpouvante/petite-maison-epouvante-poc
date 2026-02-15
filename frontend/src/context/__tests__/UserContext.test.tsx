import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(),
}));

vi.mock('../../api/users', () => ({
  syncUser: vi.fn(),
  getMe: vi.fn(),
}));

vi.mock('../../api/client', () => ({
  setAuthInterceptor: vi.fn(),
  default: {},
}));

import { useAuth0 } from '@auth0/auth0-react';
import { syncUser, getMe } from '../../api/users';

function TestConsumer() {
  const { dbUser, loading, authReady } = useUser();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authReady">{String(authReady)}</span>
      <span data-testid="user">{dbUser ? dbUser.id : 'null'}</span>
    </div>
  );
}

describe('UserContext', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should provide default values when not authenticated', async () => {
    vi.mocked(useAuth0).mockReturnValue({
      isAuthenticated: false,
      getAccessTokenSilently: vi.fn(),
      user: null,
    } as any);

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('should sync user when authenticated', async () => {
    const mockGetToken = vi.fn();
    vi.mocked(useAuth0).mockReturnValue({
      isAuthenticated: true,
      getAccessTokenSilently: mockGetToken,
      user: { email: 'a@b.com', nickname: 'nick', picture: 'pic.jpg' },
    } as any);
    vi.mocked(syncUser).mockResolvedValue({} as any);
    vi.mocked(getMe).mockResolvedValue({ id: 'u1' } as any);

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('u1');
    });
  });
});
