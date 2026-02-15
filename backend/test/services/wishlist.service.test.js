const wishlistService = require("../../src/services/wishlist.service");
const prisma = require("../../src/prisma");


describe("WishlistService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("should list wishlists for a user", async () => {
      const items = [{ id: "w1", title: "My Wishlist" }];
      prisma.wishlist.findMany.mockResolvedValue(items);

      const result = await wishlistService.list("u1");
      expect(prisma.wishlist.findMany).toHaveBeenCalledWith({
        where: { userId: "u1" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(items);
    });
  });

  describe("create", () => {
    it("should create a wishlist item", async () => {
      const item = { id: "w1", title: "Test", category: "FIGURINES", userId: "u1" };
      prisma.wishlist.create.mockResolvedValue(item);

      const result = await wishlistService.create("u1", { title: "Test", category: "FIGURINES" });
      expect(prisma.wishlist.create).toHaveBeenCalledWith({
        data: { title: "Test", category: "FIGURINES", userId: "u1" },
      });
      expect(result).toEqual(item);
    });
  });

  describe("remove", () => {
    it("should remove wishlist item if owner", async () => {
      prisma.wishlist.findUnique.mockResolvedValue({ id: "w1", userId: "u1" });
      prisma.wishlist.delete.mockResolvedValue({});

      const result = await wishlistService.remove("w1", "u1");
      expect(result).toBe(true);
    });

    it("should return null if item not found", async () => {
      prisma.wishlist.findUnique.mockResolvedValue(null);
      const result = await wishlistService.remove("w1", "u1");
      expect(result).toBeNull();
    });

    it("should return null if not owner", async () => {
      prisma.wishlist.findUnique.mockResolvedValue({ id: "w1", userId: "u2" });
      const result = await wishlistService.remove("w1", "u1");
      expect(result).toBeNull();
    });
  });
});
