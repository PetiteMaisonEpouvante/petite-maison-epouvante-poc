import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getConversations, createConversation, getMessages, sendMessage } from '../conversations';
import apiClient from '../client';

vi.mock('../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('conversations API', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should fetch conversations', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: [{ id: 'c1' }] });
    const result = await getConversations();
    expect(apiClient.get).toHaveBeenCalledWith('/conversations');
    expect(result).toEqual([{ id: 'c1' }]);
  });

  it('should create conversation', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'c1' } });
    const result = await createConversation('l1');
    expect(apiClient.post).toHaveBeenCalledWith('/conversations', { listingId: 'l1' });
    expect(result).toEqual({ id: 'c1' });
  });

  it('should fetch messages', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { messages: [], total: 0, page: 1 } });
    const result = await getMessages('c1', 2);
    expect(apiClient.get).toHaveBeenCalledWith('/conversations/c1/messages', { params: { page: 2 } });
    expect(result).toEqual({ messages: [], total: 0, page: 1 });
  });

  it('should fetch messages with default page', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { messages: [] } });
    await getMessages('c1');
    expect(apiClient.get).toHaveBeenCalledWith('/conversations/c1/messages', { params: { page: 1 } });
  });

  it('should send message', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 'm1' } });
    const result = await sendMessage('c1', 'hello');
    expect(apiClient.post).toHaveBeenCalledWith('/conversations/c1/messages', { content: 'hello' });
    expect(result).toEqual({ id: 'm1' });
  });
});
