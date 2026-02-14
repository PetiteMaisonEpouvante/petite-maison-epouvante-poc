import apiClient from './client';
import type { Conversation, Message } from '../types';

export const getConversations = () =>
  apiClient.get<Conversation[]>('/conversations').then((r) => r.data);

export const createConversation = (listingId: string) =>
  apiClient.post<Conversation>('/conversations', { listingId }).then((r) => r.data);

export const getMessages = (conversationId: string, page = 1) =>
  apiClient
    .get<{ messages: Message[]; total: number; page: number }>(
      `/conversations/${conversationId}/messages`,
      { params: { page } }
    )
    .then((r) => r.data);

export const sendMessage = (conversationId: string, content: string) =>
  apiClient
    .post<Message>(`/conversations/${conversationId}/messages`, { content })
    .then((r) => r.data);
