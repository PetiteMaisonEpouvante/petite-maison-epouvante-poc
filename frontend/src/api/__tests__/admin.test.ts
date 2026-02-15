import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getReports, reviewReport, updateListingStatus, getUsers, updateUserRole } from '../admin';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('admin API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should get reports', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { items: [], total: 0 } });
    const result = await getReports({ status: 'PENDING', page: 1 });
    expect(apiClient.get).toHaveBeenCalledWith('/admin/reports', { params: { status: 'PENDING', page: 1 } });
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('should get reports without params', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { items: [] } });
    await getReports();
    expect(apiClient.get).toHaveBeenCalledWith('/admin/reports', { params: {} });
  });

  it('should review report', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { id: 'r1', status: 'REVIEWED' } });
    const result = await reviewReport('r1', 'REVIEWED');
    expect(apiClient.patch).toHaveBeenCalledWith('/admin/reports/r1', { status: 'REVIEWED' });
    expect(result).toEqual({ id: 'r1', status: 'REVIEWED' });
  });

  it('should update listing status', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { id: 'l1', status: 'SUSPENDED' } });
    const result = await updateListingStatus('l1', 'SUSPENDED');
    expect(apiClient.patch).toHaveBeenCalledWith('/admin/listings/l1/status', { status: 'SUSPENDED' });
    expect(result).toEqual({ id: 'l1', status: 'SUSPENDED' });
  });

  it('should get users', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [{ id: 'u1' }] });
    const result = await getUsers();
    expect(apiClient.get).toHaveBeenCalledWith('/admin/users');
    expect(result).toEqual([{ id: 'u1' }]);
  });

  it('should update user role', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ data: { id: 'u1', role: 'ADMIN' } });
    const result = await updateUserRole('u1', 'ADMIN');
    expect(apiClient.patch).toHaveBeenCalledWith('/admin/users/u1/role', { role: 'ADMIN' });
    expect(result).toEqual({ id: 'u1', role: 'ADMIN' });
  });
});
