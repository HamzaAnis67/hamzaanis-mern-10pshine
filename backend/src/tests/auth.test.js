const request = require("supertest");
const app = require("../app");

describe("🔐 Auth API Endpoints", () => {
  // Generate unique credentials for each test run to prevent duplicate email errors
  const timestamp = Date.now();
  const testUser = {
    username: `user_${timestamp}`,
    email: `user_${timestamp}@example.com`,
    password: "TestPassword123!",
  };

  it("should register a new user successfully", async () => {
    const { expect } = await import("chai");

    const res = await request(app).post("/api/auth/signup").send(testUser);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("userId");
    expect(res.body.message).to.equal("User registered successfully!");
  });

  it("should fail registration if required fields are missing", async () => {
    const { expect } = await import("chai");

    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: testUser.email });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });

  it("should log in successfully and return a JWT token", async () => {
    const { expect } = await import("chai");

    const res = await request(app).post("/api/auth/signin").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    expect(res.body.user).to.have.property("email", testUser.email);
  });
});
