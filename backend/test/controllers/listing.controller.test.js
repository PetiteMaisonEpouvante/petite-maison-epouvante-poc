const listingController = require("../../src/controllers/listing.controller");
const listingService = require("../../src/services/listing.service");

jest.mock("../../src/services/listing.service");
jest.mock("../../src/socket", () => ({ getIO: jest.fn(() => null) }));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("ListingController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("should return listings", async () => {
      const req = { query: { page: 1 } };
      const res = mockRes();
      listingService.list.mockResolvedValue({ items: [], total: 0 });

      await listingController.list(req, res);
      expect(res.json).toHaveBeenCalledWith({ items: [], total: 0 });
    });

    it("should return 500 on error", async () => {
      const req = { query: {} };
      const res = mockRes();
      listingService.list.mockRejectedValue(new Error("DB error"));

      await listingController.list(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getById", () => {
    it("should return listing by id", async () => {
      const req = { params: { id: "l1" } };
      const res = mockRes();
      listingService.getById.mockResolvedValue({ id: "l1" });

      await listingController.getById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: "l1" });
    });

    it("should return 404 if not found", async () => {
      const req = { params: { id: "l1" } };
      const res = mockRes();
      listingService.getById.mockResolvedValue(null);

      await listingController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("create", () => {
    it("should create listing and return 201", async () => {
      const req = { user: { id: "u1" }, body: { title: "Test" } };
      const res = mockRes();
      listingService.create.mockResolvedValue({
        listing: { id: "l1", title: "Test", category: "FIGURINES" },
        notifiedUserIds: [],
      });

      await listingController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should send socket notifications to interested users", async () => {
      const mockTo = jest.fn().mockReturnValue({ emit: jest.fn() });
      const { getIO } = require("../../src/socket");
      getIO.mockReturnValue({ to: mockTo });

      const req = { user: { id: "u1" }, body: { title: "Test" } };
      const res = mockRes();
      listingService.create.mockResolvedValue({
        listing: { id: "l1", title: "Test", category: "FIGURINES" },
        notifiedUserIds: ["u2", "u3"],
      });

      await listingController.create(req, res);
      expect(mockTo).toHaveBeenCalledWith("user:u2");
      expect(mockTo).toHaveBeenCalledWith("user:u3");
    });
  });

  describe("update", () => {
    it("should update listing", async () => {
      const req = { params: { id: "l1" }, user: { id: "u1" }, body: { title: "Updated" } };
      const res = mockRes();
      listingService.update.mockResolvedValue({ id: "l1", title: "Updated" });

      await listingController.update(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: "l1", title: "Updated" });
    });

    it("should return 404 if not found", async () => {
      const req = { params: { id: "l1" }, user: { id: "u1" }, body: {} };
      const res = mockRes();
      listingService.update.mockResolvedValue(null);

      await listingController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 if FORBIDDEN", async () => {
      const req = { params: { id: "l1" }, user: { id: "u1" }, body: {} };
      const res = mockRes();
      listingService.update.mockRejectedValue(new Error("FORBIDDEN"));

      await listingController.update(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("remove", () => {
    it("should remove listing", async () => {
      const req = { params: { id: "l1" }, user: { id: "u1" } };
      const res = mockRes();
      listingService.remove.mockResolvedValue(true);

      await listingController.remove(req, res);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should return 404 if not found", async () => {
      const req = { params: { id: "l1" }, user: { id: "u1" } };
      const res = mockRes();
      listingService.remove.mockResolvedValue(null);

      await listingController.remove(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 if FORBIDDEN", async () => {
      const req = { params: { id: "l1" }, user: { id: "u1" } };
      const res = mockRes();
      listingService.remove.mockRejectedValue(new Error("FORBIDDEN"));

      await listingController.remove(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("getMyListings", () => {
    it("should return user listings", async () => {
      const req = { user: { id: "u1" } };
      const res = mockRes();
      listingService.getByUser.mockResolvedValue([{ id: "l1" }]);

      await listingController.getMyListings(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: "l1" }]);
    });
  });
});
