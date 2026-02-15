const userService = require("../../src/services/user.service");
const prisma = require("../../src/prisma");


describe("UserService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("upsertFromAuth0", () => {
    it("should upsert a user from Auth0 data", async () => {
      const mockUser = { id: "u1", auth0Sub: "auth0|123", email: "a@b.com", nickname: "nick", avatar: null };
      prisma.user.upsert.mockResolvedValue(mockUser);

      const result = await userService.upsertFromAuth0("auth0|123", { email: "a@b.com", nickname: "nick", avatar: null });

      expect(prisma.user.upsert).toHaveBeenCalledWith({
        where: { auth0Sub: "auth0|123" },
        update: { email: "a@b.com", nickname: "nick", avatar: null },
        create: { auth0Sub: "auth0|123", email: "a@b.com", nickname: "nick", avatar: null },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("findBySub", () => {
    it("should find user by auth0Sub", async () => {
      const mockUser = { id: "u1", auth0Sub: "auth0|123" };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findBySub("auth0|123");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { auth0Sub: "auth0|123" } });
      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await userService.findBySub("auth0|unknown");
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      const mockUser = { id: "u1" };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findById("u1");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "u1" } });
      expect(result).toEqual(mockUser);
    });
  });

  describe("updateRole", () => {
    it("should update user role", async () => {
      const mockUser = { id: "u1", role: "ADMIN" };
      prisma.user.update.mockResolvedValue(mockUser);

      const result = await userService.updateRole("u1", "ADMIN");
      expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { role: "ADMIN" } });
      expect(result).toEqual(mockUser);
    });
  });

  describe("listAll", () => {
    it("should list all users with selected fields", async () => {
      const mockUsers = [{ id: "u1", email: "a@b.com" }];
      prisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await userService.listAll();
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: { id: true, email: true, nickname: true, avatar: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockUsers);
    });
  });
});
