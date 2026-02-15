import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWishlists, createWishlist, deleteWishlist } from '../wishlists';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('wishlists API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should fetch wishlists', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [{ id: 'w1' }] });
    const result = await getWishlists();
    expect(apiClient.get).toHaveBeenCalledWith('/wishlists');
    expect(result).toEqual([{ id: 'w1' }]);
  });

  it('should create wishlist', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'w1' } });
    const result = await createWishlist({ title: 'Test', category: 'FIGURINES' });
    expect(apiClient.post).toHaveBeenCalledWith('/wishlists', { title: 'Test', category: 'FIGURINES' });
    expect(result).toEqual({ id: 'w1' });
  });

  it('should delete wishlist', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { success: true } });
    const result = await deleteWishlist('w1');
    expect(apiClient.delete).toHaveBeenCalledWith('/wishlists/w1');
    expect(result).toEqual({ success: true });
  });
});
