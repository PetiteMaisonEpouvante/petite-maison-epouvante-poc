const request = require("supertest");
const { app } = require("../src/server");

describe("health", () => {
  it("GET /hello", async () => {
    const res = await request(app).get("/hello");
    expect(res.status).toBe(200);
    expect(res.body.message).toContain("Hello");
  });
});
