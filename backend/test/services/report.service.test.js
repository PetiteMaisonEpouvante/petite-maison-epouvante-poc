const reportService = require("../../src/services/report.service");
const prisma = require("../../src/prisma");

jest.mock("../../src/prisma", () => ({
  report: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
}));

describe("ReportService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("create", () => {
    it("should create a report for a listing", async () => {
      const report = { id: "r1", reason: "SPAM", targetType: "LISTING", listingId: "l1" };
      prisma.report.create.mockResolvedValue(report);

      const result = await reportService.create("u1", {
        reason: "SPAM",
        details: "test",
        targetType: "LISTING",
        listingId: "l1",
      });

      expect(prisma.report.create).toHaveBeenCalledWith({
        data: {
          reason: "SPAM",
          details: "test",
          targetType: "LISTING",
          reporterId: "u1",
          listingId: "l1",
          messageId: null,
        },
      });
      expect(result).toEqual(report);
    });

    it("should create a report for a message", async () => {
      prisma.report.create.mockResolvedValue({ id: "r1" });

      await reportService.create("u1", {
        reason: "OFFENSIVE",
        targetType: "MESSAGE",
        messageId: "m1",
      });

      expect(prisma.report.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ messageId: "m1", listingId: null }),
      });
    });
  });

  describe("listAll", () => {
    it("should list all reports with pagination", async () => {
      prisma.report.findMany.mockResolvedValue([{ id: "r1" }]);
      prisma.report.count.mockResolvedValue(1);

      const result = await reportService.listAll();
      expect(result).toEqual({ items: [{ id: "r1" }], total: 1, page: 1, totalPages: 1 });
    });

    it("should filter by status", async () => {
      prisma.report.findMany.mockResolvedValue([]);
      prisma.report.count.mockResolvedValue(0);

      await reportService.listAll({ status: "PENDING" });
      expect(prisma.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: "PENDING" } })
      );
    });
  });

  describe("review", () => {
    it("should update report status", async () => {
      prisma.report.update.mockResolvedValue({ id: "r1", status: "REVIEWED" });

      const result = await reportService.review("r1", "REVIEWED");
      expect(prisma.report.update).toHaveBeenCalledWith({
        where: { id: "r1" },
        data: { status: "REVIEWED" },
      });
      expect(result.status).toBe("REVIEWED");
    });
  });
});
