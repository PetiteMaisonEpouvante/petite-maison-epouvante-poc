const messageService = require("../../src/services/message.service");
const prisma = require("../../src/prisma");

describe("MessageService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("listByConversation", () => {
    it("should throw FORBIDDEN if user is not participant", async () => {
      prisma.conversationParticipant.findFirst.mockResolvedValue(null);
      await expect(messageService.listByConversation("c1", "u1")).rejects.toThrow("FORBIDDEN");
    });

    it("should return paginated messages", async () => {
      prisma.conversationParticipant.findFirst.mockResolvedValue({ id: "p1" });
      const messages = [{ id: "m1", content: "hello" }];
      prisma.message.findMany.mockResolvedValue(messages);
      prisma.message.count.mockResolvedValue(1);

      const result = await messageService.listByConversation("c1", "u1");
      expect(result).toEqual({ messages, total: 1, page: 1 });
    });

    it("should handle custom pagination", async () => {
      prisma.conversationParticipant.findFirst.mockResolvedValue({ id: "p1" });
      prisma.message.findMany.mockResolvedValue([]);
      prisma.message.count.mockResolvedValue(0);

      const result = await messageService.listByConversation("c1", "u1", { page: 2, limit: 10 });
      expect(result.page).toBe(2);
    });
  });

  describe("create", () => {
    it("should throw FORBIDDEN if user is not participant", async () => {
      prisma.conversationParticipant.findFirst.mockResolvedValue(null);
      await expect(messageService.create("c1", "u1", "hello")).rejects.toThrow("FORBIDDEN");
    });

    it("should create message and update conversation timestamp", async () => {
      prisma.conversationParticipant.findFirst.mockResolvedValue({ id: "p1" });
      const msg = { id: "m1", content: "hello", sender: { id: "u1" } };
      prisma.message.create.mockResolvedValue(msg);
      prisma.conversation.update.mockResolvedValue({});

      const result = await messageService.create("c1", "u1", "hello");
      expect(result).toEqual(msg);
      expect(prisma.conversation.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "c1" } })
      );
    });
  });
});
