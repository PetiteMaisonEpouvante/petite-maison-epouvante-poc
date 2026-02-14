import apiClient from './client';
import type { Notification } from '../types';

interface NotifResponse {
  items: Notification[];
  total: number;
  unreadCount: number;
  page: number;
}

export const getNotifications = (page = 1) =>
  apiClient.get<NotifResponse>('/notifications', { params: { page } }).then((r) => r.data);

export const markAsRead = (id: string) =>
  apiClient.patch(`/notifications/${id}/read`).then((r) => r.data);

export const markAllAsRead = () =>
  apiClient.patch('/notifications/read-all').then((r) => r.data);
