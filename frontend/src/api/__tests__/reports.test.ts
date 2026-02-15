import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createReport } from '../reports';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('reports API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should create report for listing', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'r1' } });
    const result = await createReport({
      reason: 'SPAM',
      targetType: 'LISTING',
      listingId: 'l1',
    });
    expect(apiClient.post).toHaveBeenCalledWith('/reports', {
      reason: 'SPAM',
      targetType: 'LISTING',
      listingId: 'l1',
    });
    expect(result).toEqual({ id: 'r1' });
  });

  it('should create report for message', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'r2' } });
    const result = await createReport({
      reason: 'OFFENSIVE',
      details: 'test details',
      targetType: 'MESSAGE',
      messageId: 'm1',
    });
    expect(apiClient.post).toHaveBeenCalledWith('/reports', {
      reason: 'OFFENSIVE',
      details: 'test details',
      targetType: 'MESSAGE',
      messageId: 'm1',
    });
    expect(result).toEqual({ id: 'r2' });
  });
});
