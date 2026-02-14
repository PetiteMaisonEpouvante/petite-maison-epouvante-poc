import apiClient from './client';
import type { Listing, PaginatedResponse, ListingCategory, ListingType } from '../types';

export interface ListingFilters {
  category?: ListingCategory;
  type?: ListingType;
  search?: string;
  page?: number;
  limit?: number;
}

export const listListings = (filters: ListingFilters = {}) =>
  apiClient.get<PaginatedResponse<Listing>>('/listings', { params: filters }).then((r) => r.data);

export const getListingById = (id: string) =>
  apiClient.get<Listing>(`/listings/${id}`).then((r) => r.data);

export const getMyListings = () =>
  apiClient.get<Listing[]>('/listings/mine').then((r) => r.data);

export const createListing = (data: Partial<Listing>) =>
  apiClient.post<Listing>('/listings', data).then((r) => r.data);

export const updateListing = (id: string, data: Partial<Listing>) =>
  apiClient.put<Listing>(`/listings/${id}`, data).then((r) => r.data);

export const deleteListing = (id: string) =>
  apiClient.delete(`/listings/${id}`).then((r) => r.data);
