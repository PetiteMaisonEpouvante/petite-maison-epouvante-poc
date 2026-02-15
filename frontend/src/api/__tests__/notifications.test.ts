import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNotifications, markAsRead, markAllAsRead } from '../notifications';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('notifications API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should fetch notifications', async () => {
    const data = { items: [], total: 0, unreadCount: 0, page: 1 };
    vi.mocked(apiClient.get).mockResolvedValue({ data });
    const result = await getNotifications(2);
    expect(apiClient.get).toHaveBeenCalledWith('/notifications', { params: { page: 2 } });
    expect(result).toEqual(data);
  });

  it('should fetch notifications with default page', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { items: [] } });
    await getNotifications();
    expect(apiClient.get).toHaveBeenCalledWith('/notifications', { params: { page: 1 } });
  });

  it('should mark notification as read', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { success: true } });
    const result = await markAsRead('n1');
    expect(apiClient.patch).toHaveBeenCalledWith('/notifications/n1/read');
    expect(result).toEqual({ success: true });
  });

  it('should mark all as read', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { success: true } });
    const result = await markAllAsRead();
    expect(apiClient.patch).toHaveBeenCalledWith('/notifications/read-all');
    expect(result).toEqual({ success: true });
  });
});
