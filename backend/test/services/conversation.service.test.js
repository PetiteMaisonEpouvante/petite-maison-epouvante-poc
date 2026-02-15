const conversationService = require("../../src/services/conversation.service");
const prisma = require("../../src/prisma");

describe("ConversationService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("findOrCreate", () => {
    it("should throw if listing not found", async () => {
      prisma.listing.findUnique.mockResolvedValue(null);
      await expect(conversationService.findOrCreate("l1", "u1")).rejects.toThrow("Listing not found");
    });

    it("should return existing conversation", async () => {
      const listing = { id: "l1", userId: "u2" };
      const existing = { id: "c1", listingId: "l1", participants: [] };
      prisma.listing.findUnique.mockResolvedValue(listing);
      prisma.conversation.findFirst.mockResolvedValue(existing);

      const result = await conversationService.findOrCreate("l1", "u1");
      expect(result).toEqual(existing);
      expect(prisma.conversation.create).not.toHaveBeenCalled();
    });

    it("should create new conversation if none exists", async () => {
      const listing = { id: "l1", userId: "u2" };
      const created = { id: "c1", listingId: "l1" };
      prisma.listing.findUnique.mockResolvedValue(listing);
      prisma.conversation.findFirst.mockResolvedValue(null);
      prisma.conversation.create.mockResolvedValue(created);

      const result = await conversationService.findOrCreate("l1", "u1");
      expect(result).toEqual(created);
      expect(prisma.conversation.create).toHaveBeenCalled();
    });
  });

  describe("listByUser", () => {
    it("should list conversations for a user", async () => {
      const convs = [{ id: "c1" }];
      prisma.conversation.findMany.mockResolvedValue(convs);

      const result = await conversationService.listByUser("u1");
      expect(result).toEqual(convs);
    });
  });

  describe("getById", () => {
    it("should return null if conversation not found", async () => {
      prisma.conversation.findUnique.mockResolvedValue(null);
      const result = await conversationService.getById("c1", "u1");
      expect(result).toBeNull();
    });

    it("should return null if user is not a participant", async () => {
      prisma.conversation.findUnique.mockResolvedValue({
        id: "c1",
        participants: [{ userId: "u2" }],
      });
      const result = await conversationService.getById("c1", "u1");
      expect(result).toBeNull();
    });

    it("should return conversation if user is participant", async () => {
      const conv = { id: "c1", participants: [{ userId: "u1" }, { userId: "u2" }] };
      prisma.conversation.findUnique.mockResolvedValue(conv);
      const result = await conversationService.getById("c1", "u1");
      expect(result).toEqual(conv);
    });
  });
});
