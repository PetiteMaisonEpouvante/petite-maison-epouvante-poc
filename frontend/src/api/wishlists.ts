import apiClient from './client';
import type { Wishlist, ListingCategory } from '../types';

export const getWishlists = () =>
  apiClient.get<Wishlist[]>('/wishlists').then((r) => r.data);

export const createWishlist = (data: { title: string; category: ListingCategory }) =>
  apiClient.post<Wishlist>('/wishlists', data).then((r) => r.data);

export const deleteWishlist = (id: string) =>
  apiClient.delete(`/wishlists/${id}`).then((r) => r.data);
