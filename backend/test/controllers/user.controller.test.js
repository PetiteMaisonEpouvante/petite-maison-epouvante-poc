jest.mock("../../src/services/interest.service", () => ({
  getByUser: jest.fn(),
  setForUser: jest.fn(),
}));

const userController = require("../../src/controllers/user.controller");
const interestService = require("../../src/services/interest.service");


const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("UserController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getInterests", () => {
    it("should return user interests", async () => {
      const req = { user: { id: "u1" } };
      const res = mockRes();
      interestService.getByUser.mockResolvedValue([{ category: "FIGURINES" }]);

      await userController.getInterests(req, res);
      expect(res.json).toHaveBeenCalledWith([{ category: "FIGURINES" }]);
    });

    it("should return 500 on error", async () => {
      const req = { user: { id: "u1" } };
      const res = mockRes();
      interestService.getByUser.mockRejectedValue(new Error("fail"));

      await userController.getInterests(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("setInterests", () => {
    it("should return 400 if categories is not array", async () => {
      const req = { user: { id: "u1" }, body: { categories: "not-array" } };
      const res = mockRes();

      await userController.setInterests(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should set interests", async () => {
      const req = { user: { id: "u1" }, body: { categories: ["FIGURINES"] } };
      const res = mockRes();
      interestService.setForUser.mockResolvedValue([{ category: "FIGURINES" }]);

      await userController.setInterests(req, res);
      expect(res.json).toHaveBeenCalledWith([{ category: "FIGURINES" }]);
    });
  });
});
