const notificationService = require("../../src/services/notification.service");
const prisma = require("../../src/prisma");


describe("NotificationService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("listByUser", () => {
    it("should return paginated notifications with unread count", async () => {
      const items = [{ id: "n1", title: "Test" }];
      prisma.notification.findMany.mockResolvedValue(items);
      prisma.notification.count
        .mockResolvedValueOnce(1)   // total
        .mockResolvedValueOnce(1);  // unreadCount

      const result = await notificationService.listByUser("u1");
      expect(result).toEqual({ items, total: 1, unreadCount: 1, page: 1 });
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read for user", async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 1 });
      await notificationService.markAsRead("n1", "u1");
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { id: "n1", userId: "u1" },
        data: { read: true },
      });
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all unread notifications as read", async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 5 });
      await notificationService.markAllAsRead("u1");
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: "u1", read: false },
        data: { read: true },
      });
    });
  });

  describe("create", () => {
    it("should create a notification", async () => {
      const data = { userId: "u1", title: "Test", body: "body", link: "/test" };
      prisma.notification.create.mockResolvedValue({ id: "n1", ...data });

      const result = await notificationService.create(data);
      expect(prisma.notification.create).toHaveBeenCalledWith({ data });
      expect(result.id).toBe("n1");
    });
  });
});
