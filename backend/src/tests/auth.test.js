const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

describe("Auth API Endpoints", () => {
  const timestamp = Date.now();
  const testUser = {
    username: `user_${timestamp}`,
    email: `user_${timestamp}@example.com`,
    password: "TestPassword123!",
  };

  it("should register a new user successfully", async () => {
    try {
      const { expect } = await import("chai");
      const res = await request(app).post("/api/auth/signup").send(testUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("userId");
      expect(res.body.message).to.equal("User registered successfully!");
    } catch (error) {
      throw new Error(`Signup test flow failed: ${error.message}`);
    }
  });

  it("should fail registration if required fields are missing", async () => {
    try {
      const { expect } = await import("chai");
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: testUser.email });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error");
    } catch (error) {
      throw new Error(
        `Missing fields validation test failed: ${error.message}`,
      );
    }
  });

  it("should log in successfully and set an auth cookie", async () => {
    try {
      const { expect } = await import("chai");

      const res = await request(app).post("/api/auth/signin").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).to.equal(200);
      expect(res.body.user).to.have.property("email", testUser.email);

      expect(res.headers["set-cookie"]).to.exist;
      expect(res.headers["set-cookie"][0]).to.include("token=");
    } catch (error) {
      throw new Error(`Signin test flow failed: ${error.message}`);
    }
  });
});
