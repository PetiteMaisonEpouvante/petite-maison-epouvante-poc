const notificationController = require("../../src/controllers/notification.controller");
const notificationService = require("../../src/services/notification.service");

jest.mock("../../src/services/notification.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("NotificationController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("should return notifications", async () => {
      const req = { user: { id: "u1" }, query: {} };
      const res = mockRes();
      notificationService.listByUser.mockResolvedValue({ items: [], total: 0, unreadCount: 0 });

      await notificationController.list(req, res);
      expect(res.json).toHaveBeenCalledWith({ items: [], total: 0, unreadCount: 0 });
    });

    it("should return 500 on error", async () => {
      const req = { user: { id: "u1" }, query: {} };
      const res = mockRes();
      notificationService.listByUser.mockRejectedValue(new Error("DB error"));

      await notificationController.list(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("markAsRead", () => {
    it("should mark as read", async () => {
      const req = { params: { id: "n1" }, user: { id: "u1" } };
      const res = mockRes();
      notificationService.markAsRead.mockResolvedValue({});

      await notificationController.markAsRead(req, res);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all as read", async () => {
      const req = { user: { id: "u1" } };
      const res = mockRes();
      notificationService.markAllAsRead.mockResolvedValue({});

      await notificationController.markAllAsRead(req, res);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
