const { requireRole } = require("../../src/middleware/requireRole");
const prisma = require("../../src/prisma");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("requireRole middleware", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 401 if no sub", async () => {
    const middleware = requireRole("ADMIN");
    const req = { auth: {} };
    const res = mockRes();
    const next = jest.fn();

    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 if user not found", async () => {
    const middleware = requireRole("ADMIN");
    const req = { auth: { payload: { sub: "auth0|123" } } };
    const res = mockRes();
    const next = jest.fn();
    prisma.user.findUnique.mockResolvedValue(null);

    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 403 if user role not in allowed roles", async () => {
    const middleware = requireRole("ADMIN");
    const req = { auth: { payload: { sub: "auth0|123" } } };
    const res = mockRes();
    const next = jest.fn();
    prisma.user.findUnique.mockResolvedValue({ id: "u1", role: "USER" });

    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should call next if user has required role", async () => {
    const middleware = requireRole("ADMIN", "MODERATOR");
    const req = { auth: { payload: { sub: "auth0|123" } } };
    const res = mockRes();
    const next = jest.fn();
    prisma.user.findUnique.mockResolvedValue({ id: "u1", role: "ADMIN" });

    await middleware(req, res, next);
    expect(req.user).toEqual({ id: "u1", role: "ADMIN" });
    expect(next).toHaveBeenCalled();
  });

  it("should accept MODERATOR when both ADMIN and MODERATOR are allowed", async () => {
    const middleware = requireRole("ADMIN", "MODERATOR");
    const req = { auth: { payload: { sub: "auth0|123" } } };
    const res = mockRes();
    const next = jest.fn();
    prisma.user.findUnique.mockResolvedValue({ id: "u1", role: "MODERATOR" });

    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
