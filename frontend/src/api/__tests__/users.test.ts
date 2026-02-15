import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncUser, getMe, getInterests, setInterests } from '../users';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('users API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should sync user', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'u1' } });
    const result = await syncUser({ email: 'a@b.com', nickname: 'nick' });
    expect(apiClient.post).toHaveBeenCalledWith('/auth/sync', { email: 'a@b.com', nickname: 'nick' });
    expect(result).toEqual({ id: 'u1' });
  });

  it('should get current user', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { id: 'u1' } });
    const result = await getMe();
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    expect(result).toEqual({ id: 'u1' });
  });

  it('should get interests', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [{ category: 'FIGURINES' }] });
    const result = await getInterests();
    expect(apiClient.get).toHaveBeenCalledWith('/users/interests');
    expect(result).toEqual([{ category: 'FIGURINES' }]);
  });

  it('should set interests', async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: [{ category: 'BOOKS' }] });
    const result = await setInterests(['BOOKS']);
    expect(apiClient.put).toHaveBeenCalledWith('/users/interests', { categories: ['BOOKS'] });
    expect(result).toEqual([{ category: 'BOOKS' }]);
  });
});
