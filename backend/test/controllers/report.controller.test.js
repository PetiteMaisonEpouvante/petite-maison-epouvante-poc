const reportController = require("../../src/controllers/report.controller");
const reportService = require("../../src/services/report.service");

jest.mock("../../src/services/report.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("ReportController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("create", () => {
    it("should return 400 if reason missing", async () => {
      const req = { user: { id: "u1" }, body: { targetType: "LISTING" } };
      const res = mockRes();

      await reportController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if targetType missing", async () => {
      const req = { user: { id: "u1" }, body: { reason: "SPAM" } };
      const res = mockRes();

      await reportController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create report and return 201", async () => {
      const req = {
        user: { id: "u1" },
        body: { reason: "SPAM", targetType: "LISTING", listingId: "l1" },
      };
      const res = mockRes();
      reportService.create.mockResolvedValue({ id: "r1" });

      await reportController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 500 on error", async () => {
      const req = {
        user: { id: "u1" },
        body: { reason: "SPAM", targetType: "LISTING" },
      };
      const res = mockRes();
      reportService.create.mockRejectedValue(new Error("DB error"));

      await reportController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
