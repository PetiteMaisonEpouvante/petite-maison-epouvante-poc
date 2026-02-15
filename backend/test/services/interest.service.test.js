const interestService = require("../../src/services/interest.service");
const prisma = require("../../src/prisma");

jest.mock("../../src/prisma", () => ({
  userInterest: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
}));

describe("InterestService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getByUser", () => {
    it("should get interests for a user", async () => {
      const interests = [{ id: "i1", category: "FIGURINES" }];
      prisma.userInterest.findMany.mockResolvedValue(interests);

      const result = await interestService.getByUser("u1");
      expect(prisma.userInterest.findMany).toHaveBeenCalledWith({ where: { userId: "u1" } });
      expect(result).toEqual(interests);
    });
  });

  describe("setForUser", () => {
    it("should replace all interests", async () => {
      prisma.userInterest.deleteMany.mockResolvedValue({});
      prisma.userInterest.createMany.mockResolvedValue({ count: 2 });
      prisma.userInterest.findMany.mockResolvedValue([
        { id: "i1", category: "FIGURINES" },
        { id: "i2", category: "BOOKS" },
      ]);

      const result = await interestService.setForUser("u1", ["FIGURINES", "BOOKS"]);
      expect(prisma.userInterest.deleteMany).toHaveBeenCalledWith({ where: { userId: "u1" } });
      expect(prisma.userInterest.createMany).toHaveBeenCalledWith({
        data: [
          { userId: "u1", category: "FIGURINES" },
          { userId: "u1", category: "BOOKS" },
        ],
      });
      expect(result).toHaveLength(2);
    });

    it("should return empty array when categories is empty", async () => {
      prisma.userInterest.deleteMany.mockResolvedValue({});

      const result = await interestService.setForUser("u1", []);
      expect(prisma.userInterest.deleteMany).toHaveBeenCalled();
      expect(prisma.userInterest.createMany).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
