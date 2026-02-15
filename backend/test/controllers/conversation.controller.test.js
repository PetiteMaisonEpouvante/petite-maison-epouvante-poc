const conversationController = require("../../src/controllers/conversation.controller");
const conversationService = require("../../src/services/conversation.service");
const messageService = require("../../src/services/message.service");

jest.mock("../../src/services/conversation.service");
jest.mock("../../src/services/message.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("ConversationController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("should return conversations", async () => {
      const req = { user: { id: "u1" } };
      const res = mockRes();
      conversationService.listByUser.mockResolvedValue([{ id: "c1" }]);

      await conversationController.list(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: "c1" }]);
    });
  });

  describe("create", () => {
    it("should return 400 if listingId missing", async () => {
      const req = { user: { id: "u1" }, body: {} };
      const res = mockRes();

      await conversationController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create conversation and return 201", async () => {
      const req = { user: { id: "u1" }, body: { listingId: "l1" } };
      const res = mockRes();
      conversationService.findOrCreate.mockResolvedValue({ id: "c1" });

      await conversationController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 404 if listing not found", async () => {
      const req = { user: { id: "u1" }, body: { listingId: "l1" } };
      const res = mockRes();
      conversationService.findOrCreate.mockRejectedValue(new Error("Listing not found"));

      await conversationController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getMessages", () => {
    it("should return messages", async () => {
      const req = { params: { id: "c1" }, user: { id: "u1" }, query: {} };
      const res = mockRes();
      messageService.listByConversation.mockResolvedValue({ messages: [], total: 0 });

      await conversationController.getMessages(req, res);
      expect(res.json).toHaveBeenCalledWith({ messages: [], total: 0 });
    });

    it("should return 403 if FORBIDDEN", async () => {
      const req = { params: { id: "c1" }, user: { id: "u1" }, query: {} };
      const res = mockRes();
      messageService.listByConversation.mockRejectedValue(new Error("FORBIDDEN"));

      await conversationController.getMessages(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("sendMessage", () => {
    it("should return 400 if content empty", async () => {
      const req = { params: { id: "c1" }, user: { id: "u1" }, body: { content: "" } };
      const res = mockRes();

      await conversationController.sendMessage(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if content missing", async () => {
      const req = { params: { id: "c1" }, user: { id: "u1" }, body: {} };
      const res = mockRes();

      await conversationController.sendMessage(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create and return message", async () => {
      const req = { params: { id: "c1" }, user: { id: "u1" }, body: { content: "hello" } };
      const res = mockRes();
      messageService.create.mockResolvedValue({ id: "m1", content: "hello" });

      await conversationController.sendMessage(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 403 if FORBIDDEN", async () => {
      const req = { params: { id: "c1" }, user: { id: "u1" }, body: { content: "hello" } };
      const res = mockRes();
      messageService.create.mockRejectedValue(new Error("FORBIDDEN"));

      await conversationController.sendMessage(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
