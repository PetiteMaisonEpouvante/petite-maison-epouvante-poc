import apiClient from './client';
import type { User, UserInterest, ListingCategory } from '../types';

export const syncUser = (data: { email: string; nickname?: string; avatar?: string }) =>
  apiClient.post<User>('/auth/sync', data).then((r) => r.data);

export const getMe = () =>
  apiClient.get<User>('/auth/me').then((r) => r.data);

export const getInterests = () =>
  apiClient.get<UserInterest[]>('/users/interests').then((r) => r.data);

export const setInterests = (categories: ListingCategory[]) =>
  apiClient.put<UserInterest[]>('/users/interests', { categories }).then((r) => r.data);
