const adminController = require("../../src/controllers/admin.controller");
const reportService = require("../../src/services/report.service");
const listingService = require("../../src/services/listing.service");
const userService = require("../../src/services/user.service");

jest.mock("../../src/services/report.service");
jest.mock("../../src/services/listing.service");
jest.mock("../../src/services/user.service");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("AdminController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("listReports", () => {
    it("should return reports", async () => {
      const req = { query: {} };
      const res = mockRes();
      reportService.listAll.mockResolvedValue({ items: [], total: 0 });

      await adminController.listReports(req, res);
      expect(res.json).toHaveBeenCalledWith({ items: [], total: 0 });
    });
  });

  describe("reviewReport", () => {
    it("should return 400 for invalid status", async () => {
      const req = { params: { id: "r1" }, body: { status: "INVALID" } };
      const res = mockRes();

      await adminController.reviewReport(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should review report with REVIEWED status", async () => {
      const req = { params: { id: "r1" }, body: { status: "REVIEWED" } };
      const res = mockRes();
      reportService.review.mockResolvedValue({ id: "r1", status: "REVIEWED" });

      await adminController.reviewReport(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: "r1", status: "REVIEWED" });
    });

    it("should review report with DISMISSED status", async () => {
      const req = { params: { id: "r1" }, body: { status: "DISMISSED" } };
      const res = mockRes();
      reportService.review.mockResolvedValue({ id: "r1", status: "DISMISSED" });

      await adminController.reviewReport(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: "r1", status: "DISMISSED" });
    });
  });

  describe("updateListingStatus", () => {
    it("should return 400 for invalid status", async () => {
      const req = { params: { id: "l1" }, body: { status: "INVALID" } };
      const res = mockRes();

      await adminController.updateListingStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should update listing status", async () => {
      const req = { params: { id: "l1" }, body: { status: "SUSPENDED" } };
      const res = mockRes();
      listingService.updateStatus.mockResolvedValue({ id: "l1", status: "SUSPENDED" });

      await adminController.updateListingStatus(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: "l1", status: "SUSPENDED" });
    });
  });

  describe("updateUserRole", () => {
    it("should return 400 for invalid role", async () => {
      const req = { params: { id: "u1" }, body: { role: "SUPERADMIN" } };
      const res = mockRes();

      await adminController.updateUserRole(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should update user role", async () => {
      const req = { params: { id: "u1" }, body: { role: "MODERATOR" } };
      const res = mockRes();
      userService.updateRole.mockResolvedValue({ id: "u1", role: "MODERATOR" });

      await adminController.updateUserRole(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: "u1", role: "MODERATOR" });
    });
  });

  describe("listUsers", () => {
    it("should return all users", async () => {
      const req = {};
      const res = mockRes();
      userService.listAll.mockResolvedValue([{ id: "u1" }]);

      await adminController.listUsers(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: "u1" }]);
    });
  });
});
