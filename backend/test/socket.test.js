const { getIO } = require("../src/socket");

describe("Socket module", () => {
  it("getIO should return undefined before init", () => {
    expect(getIO()).toBeUndefined();
  });
});
