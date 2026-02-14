import apiClient from './client';
import type { Report, PaginatedResponse, User, Listing, ListingStatus, ReportStatus, Role } from '../types';

export const getReports = (params: { status?: ReportStatus; page?: number } = {}) =>
  apiClient.get<PaginatedResponse<Report>>('/admin/reports', { params }).then((r) => r.data);

export const reviewReport = (id: string, status: ReportStatus) =>
  apiClient.patch<Report>(`/admin/reports/${id}`, { status }).then((r) => r.data);

export const updateListingStatus = (id: string, status: ListingStatus) =>
  apiClient.patch<Listing>(`/admin/listings/${id}/status`, { status }).then((r) => r.data);

export const getUsers = () =>
  apiClient.get<User[]>('/admin/users').then((r) => r.data);

export const updateUserRole = (id: string, role: Role) =>
  apiClient.patch<User>(`/admin/users/${id}/role`, { role }).then((r) => r.data);
