const jwt = require("jsonwebtoken");
const { authenticateSocket } = require("../../src/middleware/socketAuth");

jest.mock("jsonwebtoken");
jest.mock("jwks-rsa", () => {
  return jest.fn(() => ({
    getSigningKey: jest.fn((kid, cb) => {
      cb(null, { getPublicKey: () => "fake-public-key" });
    }),
  }));
});
jest.mock("../../src/prisma", () => ({
  user: { findUnique: jest.fn() },
}));

describe("authenticateSocket middleware", () => {
  afterEach(() => jest.clearAllMocks());

  it("should call next with error if no token", (done) => {
    const socket = { handshake: { auth: {} } };
    authenticateSocket(socket, (err) => {
      expect(err).toBeDefined();
      expect(err.message).toBe("Authentication required");
      done();
    });
  });

  it("should call next with error if token is invalid", (done) => {
    jwt.verify.mockImplementation((token, getKey, opts, cb) => {
      cb(new Error("Invalid token"), null);
    });

    const socket = { handshake: { auth: { token: "bad-token" } } };
    authenticateSocket(socket, (err) => {
      expect(err).toBeDefined();
      expect(err.message).toBe("Invalid token");
      done();
    });
  });

  it("should call next with error if user not found in DB", (done) => {
    const prisma = require("../../src/prisma");
    jwt.verify.mockImplementation((token, getKey, opts, cb) => {
      cb(null, { sub: "auth0|123" });
    });
    prisma.user.findUnique.mockResolvedValue(null);

    const socket = { handshake: { auth: { token: "good-token" } } };
    authenticateSocket(socket, (err) => {
      expect(err).toBeDefined();
      expect(err.message).toBe("User not found");
      done();
    });
  });

  it("should set socket.user and call next if valid", (done) => {
    const prisma = require("../../src/prisma");
    const user = { id: "u1", auth0Sub: "auth0|123" };
    jwt.verify.mockImplementation((token, getKey, opts, cb) => {
      cb(null, { sub: "auth0|123" });
    });
    prisma.user.findUnique.mockResolvedValue(user);

    const socket = { handshake: { auth: { token: "good-token" } } };
    authenticateSocket(socket, (err) => {
      expect(err).toBeUndefined();
      expect(socket.user).toEqual(user);
      done();
    });
  });
});
