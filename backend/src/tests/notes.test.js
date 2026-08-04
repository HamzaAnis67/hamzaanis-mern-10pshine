const request = require("supertest");
const app = require("../app");

describe("📝 Notes API Endpoints", () => {
  let authToken = "";
  let createdNoteId = null;

  // Setup: Create a temporary test user & acquire JWT token before running notes tests
  before(async () => {
    const timestamp = Date.now();
    const testUser = {
      username: `noteuser_${timestamp}`,
      email: `noteuser_${timestamp}@example.com`,
      password: "TestPassword123!",
    };

    // 1. Signup
    await request(app).post("/api/auth/signup").send(testUser);

    // 2. Signin to get JWT Token
    const loginRes = await request(app).post("/api/auth/signin").send({
      email: testUser.email,
      password: testUser.password,
    });

    authToken = loginRes.body.token;
  });

  it("should reject note creation without an auth token", async () => {
    const { expect } = await import("chai");

    const res = await request(app)
      .post("/api/notes")
      .send({ title: "Unauthorized Note", content: "No token" });

    expect(res.status).to.equal(401);
  });

  it("should create a new note with a valid auth token", async () => {
    const { expect } = await import("chai");

    const res = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Note Title",
        content: "<h1>Test Rich Text Content</h1>",
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("noteId");
    createdNoteId = res.body.noteId;
  });

  it("should retrieve all notes for the authenticated user", async () => {
    const { expect } = await import("chai");

    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.greaterThan(0);
  });

  it("should update an existing note", async () => {
    const { expect } = await import("chai");

    const res = await request(app)
      .put(`/api/notes/${createdNoteId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Updated Note Title",
        content: "<p>Updated Content</p>",
      });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Note updated successfully");
  });

  it("should delete the created note", async () => {
    const { expect } = await import("chai");

    const res = await request(app)
      .delete(`/api/notes/${createdNoteId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Note deleted successfully");
  });
});
