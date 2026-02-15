const listingService = require("../../src/services/listing.service");
const prisma = require("../../src/prisma");

describe("ListingService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("should list active listings with pagination", async () => {
      const items = [{ id: "l1", title: "Test" }];
      prisma.listing.findMany.mockResolvedValue(items);
      prisma.listing.count.mockResolvedValue(1);

      const result = await listingService.list({ page: 1, limit: 20 });

      expect(result).toEqual({ items, total: 1, page: 1, totalPages: 1 });
      expect(prisma.listing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "ACTIVE" } })
      );
    });

    it("should filter by category", async () => {
      prisma.listing.findMany.mockResolvedValue([]);
      prisma.listing.count.mockResolvedValue(0);

      await listingService.list({ category: "FIGURINES" });

      expect(prisma.listing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "ACTIVE", category: "FIGURINES" } })
      );
    });

    it("should filter by type", async () => {
      prisma.listing.findMany.mockResolvedValue([]);
      prisma.listing.count.mockResolvedValue(0);

      await listingService.list({ type: "TRADE" });

      expect(prisma.listing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "ACTIVE", type: "TRADE" } })
      );
    });

    it("should filter by search term", async () => {
      prisma.listing.findMany.mockResolvedValue([]);
      prisma.listing.count.mockResolvedValue(0);

      await listingService.list({ search: "horror" });

      expect(prisma.listing.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "ACTIVE", title: { contains: "horror", mode: "insensitive" } },
        })
      );
    });
  });

  describe("getById", () => {
    it("should get listing by id with user info", async () => {
      const listing = { id: "l1", title: "Test", user: { id: "u1" } };
      prisma.listing.findUnique.mockResolvedValue(listing);

      const result = await listingService.getById("l1");

      expect(prisma.listing.findUnique).toHaveBeenCalledWith({
        where: { id: "l1" },
        include: { user: { select: { id: true, nickname: true, avatar: true, email: true } } },
      });
      expect(result).toEqual(listing);
    });
  });

  describe("create", () => {
    it("should create listing and notify interested users", async () => {
      const listing = { id: "l1", title: "Test", category: "FIGURINES", user: { id: "u1" } };
      prisma.listing.create.mockResolvedValue(listing);
      prisma.userInterest.findMany.mockResolvedValue([{ userId: "u2", category: "FIGURINES" }]);
      prisma.notification.createMany.mockResolvedValue({ count: 1 });

      const result = await listingService.create("u1", {
        title: "Test",
        description: "desc",
        category: "FIGURINES",
        condition: "MINT",
        type: "TRADE",
      });

      expect(result.listing).toEqual(listing);
      expect(result.notifiedUserIds).toEqual(["u2"]);
      expect(prisma.notification.createMany).toHaveBeenCalled();
    });

    it("should not create notifications if no interested users", async () => {
      const listing = { id: "l1", title: "Test", category: "FIGURINES" };
      prisma.listing.create.mockResolvedValue(listing);
      prisma.userInterest.findMany.mockResolvedValue([]);

      const result = await listingService.create("u1", { title: "Test" });

      expect(result.notifiedUserIds).toEqual([]);
      expect(prisma.notification.createMany).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update listing if owner", async () => {
      prisma.listing.findUnique.mockResolvedValue({ id: "l1", userId: "u1" });
      prisma.listing.update.mockResolvedValue({ id: "l1", title: "Updated" });

      const result = await listingService.update("l1", "u1", { title: "Updated" });
      expect(result).toEqual({ id: "l1", title: "Updated" });
    });

    it("should return null if listing not found", async () => {
      prisma.listing.findUnique.mockResolvedValue(null);
      const result = await listingService.update("l1", "u1", { title: "X" });
      expect(result).toBeNull();
    });

    it("should throw FORBIDDEN if not owner", async () => {
      prisma.listing.findUnique.mockResolvedValue({ id: "l1", userId: "u2" });
      await expect(listingService.update("l1", "u1", { title: "X" })).rejects.toThrow("FORBIDDEN");
    });
  });

  describe("remove", () => {
    it("should return null if listing not found", async () => {
      prisma.listing.findUnique.mockResolvedValue(null);
      const result = await listingService.remove("l1", "u1");
      expect(result).toBeNull();
    });

    it("should throw FORBIDDEN if not owner", async () => {
      prisma.listing.findUnique.mockResolvedValue({ id: "l1", userId: "u2" });
      await expect(listingService.remove("l1", "u1")).rejects.toThrow("FORBIDDEN");
    });

    it("should delete listing with transaction if owner", async () => {
      prisma.listing.findUnique.mockResolvedValue({ id: "l1", userId: "u1" });
      prisma.$transaction.mockResolvedValue(true);

      const result = await listingService.remove("l1", "u1");
      expect(result).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe("getByUser", () => {
    it("should get listings by user", async () => {
      const listings = [{ id: "l1" }];
      prisma.listing.findMany.mockResolvedValue(listings);

      const result = await listingService.getByUser("u1");
      expect(prisma.listing.findMany).toHaveBeenCalledWith({
        where: { userId: "u1" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(listings);
    });
  });

  describe("updateStatus", () => {
    it("should update listing status", async () => {
      prisma.listing.update.mockResolvedValue({ id: "l1", status: "SUSPENDED" });

      const result = await listingService.updateStatus("l1", "SUSPENDED");
      expect(prisma.listing.update).toHaveBeenCalledWith({
        where: { id: "l1" },
        data: { status: "SUSPENDED" },
      });
      expect(result.status).toBe("SUSPENDED");
    });
  });
});
