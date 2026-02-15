import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocketProvider, useSocket } from '../SocketContext';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(() => ({
    isAuthenticated: false,
    getAccessTokenSilently: vi.fn(),
  })),
}));

vi.mock('socket.io-client', () => ({
  io: vi.fn(),
}));

function TestConsumer() {
  const socket = useSocket();
  return <span data-testid="socket">{socket ? 'connected' : 'null'}</span>;
}

describe('SocketContext', () => {
  it('should provide null socket when not authenticated', () => {
    render(
      <SocketProvider>
        <TestConsumer />
      </SocketProvider>
    );

    expect(screen.getByTestId('socket').textContent).toBe('null');
  });
});
