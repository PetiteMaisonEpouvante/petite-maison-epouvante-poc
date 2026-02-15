jest.mock("../../src/services/user.service", () => ({
  findBySub: jest.fn(),
  upsertFromAuth0: jest.fn(),
}));

const authController = require("../../src/controllers/auth.controller");
const userService = require("../../src/services/user.service");


const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("AuthController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getMe", () => {
    it("should return current user", async () => {
      const req = { auth: { payload: { sub: "auth0|123" } } };
      const res = mockRes();
      userService.findBySub.mockResolvedValue({ id: "u1", email: "a@b.com" });

      await authController.getMe(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: "u1", email: "a@b.com" });
    });

    it("should return 404 if user not found", async () => {
      const req = { auth: { payload: { sub: "auth0|unknown" } } };
      const res = mockRes();
      userService.findBySub.mockResolvedValue(null);

      await authController.getMe(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on error", async () => {
      const req = { auth: { payload: { sub: "auth0|123" } } };
      const res = mockRes();
      userService.findBySub.mockRejectedValue(new Error("DB error"));

      await authController.getMe(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("sync", () => {
    it("should sync user from Auth0", async () => {
      const req = {
        auth: { payload: { sub: "auth0|123" } },
        body: { email: "a@b.com", nickname: "nick", avatar: "url" },
      };
      const res = mockRes();
      userService.upsertFromAuth0.mockResolvedValue({ id: "u1" });

      await authController.sync(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: "u1" });
    });

    it("should return 400 if email missing", async () => {
      const req = { auth: { payload: { sub: "auth0|123" } }, body: {} };
      const res = mockRes();

      await authController.sync(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
