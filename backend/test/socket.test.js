const { getIO } = require("../src/socket");

jest.mock("../src/middleware/socketAuth", () => ({
  authenticateSocket: jest.fn((socket, next) => next()),
}));
jest.mock("../src/services/message.service");

describe("Socket module", () => {
  it("getIO should return undefined before init", () => {
    expect(getIO()).toBeUndefined();
  });
});
