const { createDeepAutoMock } = require("./mocks/autoMock.cjs");

// ✅ Prisma : on mock plusieurs IDs possibles selon tes require("../prisma") / require("./prisma")
jest.mock("../src/prisma", () => createDeepAutoMock());

const prisma = require("../src/prisma");

// Prisma.$transaction(cb) => exécute cb(tx)
// Ici on simule tx = prisma lui-même (suffisant pour tes tests)
prisma.$transaction = jest.fn(async (cb) => cb(prisma));

// ✅ Auth0 middleware : on neutralise express-oauth2-jwt-bearer en test
jest.mock("express-oauth2-jwt-bearer", () => ({
  auth: () => (req, res, next) => next(),
}));

// ✅ Socket : getIO doit être un jest.fn() pour pouvoir faire getIO.mockReturnValue(...)
jest.mock("../src/socket", () => ({
  initIO: jest.fn(),
  getIO: jest.fn(),
}));

// ✅ (optionnel) si tu utilises jsonwebtoken ailleurs
jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));

afterEach(() => {
  jest.clearAllMocks();
});
