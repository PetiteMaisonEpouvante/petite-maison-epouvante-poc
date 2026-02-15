import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminRoute from '../layout/AdminRoute';

vi.mock('../../context/UserContext', () => ({
  useUser: vi.fn(),
}));

import { useUser } from '../../context/UserContext';

describe('AdminRoute', () => {
  it('should show spinner when loading', () => {
    vi.mocked(useUser).mockReturnValue({ dbUser: null, loading: true, authReady: false, refresh: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should redirect if no user', () => {
    vi.mocked(useUser).mockReturnValue({ dbUser: null, loading: false, authReady: false, refresh: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should redirect if user is USER role', () => {
    vi.mocked(useUser).mockReturnValue({
      dbUser: { id: 'u1', role: 'USER' } as any,
      loading: false,
      authReady: true,
      refresh: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should render outlet for ADMIN', () => {
    vi.mocked(useUser).mockReturnValue({
      dbUser: { id: 'u1', role: 'ADMIN' } as any,
      loading: false,
      authReady: true,
      refresh: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should render outlet for MODERATOR', () => {
    vi.mocked(useUser).mockReturnValue({
      dbUser: { id: 'u1', role: 'MODERATOR' } as any,
      loading: false,
      authReady: true,
      refresh: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
