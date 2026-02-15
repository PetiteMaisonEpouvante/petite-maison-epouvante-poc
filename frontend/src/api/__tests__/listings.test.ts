import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listListings, getListingById, getMyListings, createListing, updateListing, deleteListing } from '../listings';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('listings API', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('listListings', () => {
    it('should fetch listings with filters', async () => {
      const data = { items: [], total: 0, page: 1, totalPages: 0 };
      vi.mocked(apiClient.get).mockResolvedValue({ data });

      const result = await listListings({ category: 'FIGURINES', page: 1 });
      expect(apiClient.get).toHaveBeenCalledWith('/listings', { params: { category: 'FIGURINES', page: 1 } });
      expect(result).toEqual(data);
    });

    it('should fetch listings without filters', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: { items: [] } });
      await listListings();
      expect(apiClient.get).toHaveBeenCalledWith('/listings', { params: {} });
    });
  });

  describe('getListingById', () => {
    it('should fetch listing by id', async () => {
      const listing = { id: 'l1', title: 'Test' };
      vi.mocked(apiClient.get).mockResolvedValue({ data: listing });

      const result = await getListingById('l1');
      expect(apiClient.get).toHaveBeenCalledWith('/listings/l1');
      expect(result).toEqual(listing);
    });
  });

  describe('getMyListings', () => {
    it('should fetch user listings', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ data: [{ id: 'l1' }] });
      const result = await getMyListings();
      expect(apiClient.get).toHaveBeenCalledWith('/listings/mine');
      expect(result).toEqual([{ id: 'l1' }]);
    });
  });

  describe('createListing', () => {
    it('should post new listing', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'l1' } });
      const result = await createListing({ title: 'Test' });
      expect(apiClient.post).toHaveBeenCalledWith('/listings', { title: 'Test' });
      expect(result).toEqual({ id: 'l1' });
    });
  });

  describe('updateListing', () => {
    it('should update listing', async () => {
      vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 'l1', title: 'Updated' } });
      const result = await updateListing('l1', { title: 'Updated' });
      expect(apiClient.put).toHaveBeenCalledWith('/listings/l1', { title: 'Updated' });
      expect(result).toEqual({ id: 'l1', title: 'Updated' });
    });
  });

  describe('deleteListing', () => {
    it('should delete listing', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: { success: true } });
      const result = await deleteListing('l1');
      expect(apiClient.delete).toHaveBeenCalledWith('/listings/l1');
      expect(result).toEqual({ success: true });
    });
  });
});
