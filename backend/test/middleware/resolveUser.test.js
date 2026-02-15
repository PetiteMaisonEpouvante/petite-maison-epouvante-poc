const { resolveUser } = require("../../src/middleware/resolveUser");
const prisma = require("../../src/prisma");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("resolveUser middleware", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 401 if no sub in auth", async () => {
    const req = { auth: {} };
    const res = mockRes();
    const next = jest.fn();

    await resolveUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if auth is undefined", async () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    await resolveUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return 404 if user not found in DB", async () => {
    const req = { auth: { payload: { sub: "auth0|123" } } };
    const res = mockRes();
    const next = jest.fn();
    prisma.user.findUnique.mockResolvedValue(null);

    await resolveUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it("should set req.user and call next if user found", async () => {
    const user = { id: "u1", auth0Sub: "auth0|123" };
    const req = { auth: { payload: { sub: "auth0|123" } } };
    const res = mockRes();
    const next = jest.fn();
    prisma.user.findUnique.mockResolvedValue(user);

    await resolveUser(req, res, next);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
});
