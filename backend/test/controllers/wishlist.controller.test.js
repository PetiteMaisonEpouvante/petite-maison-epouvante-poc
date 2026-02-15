jest.mock("../../src/services/wishlist.service", () => ({
  list: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
}));

const wishlistController = require("../../src/controllers/wishlist.controller");
const wishlistService = require("../../src/services/wishlist.service");


const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("WishlistController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("list", () => {
    it("should return wishlists", async () => {
      const req = { user: { id: "u1" } };
      const res = mockRes();
      wishlistService.list.mockResolvedValue([{ id: "w1" }]);

      await wishlistController.list(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: "w1" }]);
    });
  });

  describe("create", () => {
    it("should return 400 if title missing", async () => {
      const req = { user: { id: "u1" }, body: { category: "FIGURINES" } };
      const res = mockRes();

      await wishlistController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if category missing", async () => {
      const req = { user: { id: "u1" }, body: { title: "Test" } };
      const res = mockRes();

      await wishlistController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create wishlist and return 201", async () => {
      const req = { user: { id: "u1" }, body: { title: "Test", category: "FIGURINES" } };
      const res = mockRes();
      wishlistService.create.mockResolvedValue({ id: "w1" });

      await wishlistController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("remove", () => {
    it("should return 404 if not found", async () => {
      const req = { params: { id: "w1" }, user: { id: "u1" } };
      const res = mockRes();
      wishlistService.remove.mockResolvedValue(null);

      await wishlistController.remove(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should remove and return success", async () => {
      const req = { params: { id: "w1" }, user: { id: "u1" } };
      const res = mockRes();
      wishlistService.remove.mockResolvedValue(true);

      await wishlistController.remove(req, res);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });
});
