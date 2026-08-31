const request = require("supertest");
const app = require("../app");

describe("Notes API Endpoints", () => {
  let user1Agent;
  let user2Agent;
  let createdNoteId = null;

  before(async () => {
    try {
      const timestamp = Date.now();

      user1Agent = request.agent(app);
      user2Agent = request.agent(app);

      const testUser1 = {
        username: `noteuser1_${timestamp}`,
        email: `noteuser1_${timestamp}@example.com`,
        password: "TestPassword123!",
      };

      const signupRes1 = await user1Agent
        .post("/api/auth/signup")
        .send(testUser1);

      if (signupRes1.status !== 201) {
        throw new Error(
          `User 1 registration rejected with status ${signupRes1.status}`,
        );
      }

      const loginRes1 = await user1Agent.post("/api/auth/signin").send({
        email: testUser1.email,
        password: testUser1.password,
      });

      if (loginRes1.status !== 200) {
        throw new Error(
          `User 1 authentication rejected with status ${loginRes1.status}`,
        );
      }

      const testUser2 = {
        username: `noteuser2_${timestamp}`,
        email: `noteuser2_${timestamp}@example.com`,
        password: "TestPassword123!",
      };

      const signupRes2 = await user2Agent
        .post("/api/auth/signup")
        .send(testUser2);

      if (signupRes2.status !== 201) {
        throw new Error(
          `User 2 registration rejected with status ${signupRes2.status}`,
        );
      }

      const loginRes2 = await user2Agent.post("/api/auth/signin").send({
        email: testUser2.email,
        password: testUser2.password,
      });

      if (loginRes2.status !== 200) {
        throw new Error(
          `User 2 authentication rejected with status ${loginRes2.status}`,
        );
      }
    } catch (error) {
      throw new Error(`Notes setup hook failed: ${error.message}`);
    }
  });

  it("should reject note creation without an auth token", async () => {
    try {
      const { expect } = await import("chai");

      const res = await request(app).post("/api/notes").send({
        title: "Unauthorized Note",
        content: "No token",
      });

      expect(res.status).to.equal(401);
    } catch (error) {
      throw new Error(
        `Unauthorized note creation test failed: ${error.message}`,
      );
    }
  });

  it("should create a new note with a valid auth cookie", async () => {
    try {
      const { expect } = await import("chai");

      const res = await user1Agent.post("/api/notes").send({
        title: "Test Note Title",
        content: "<h1>Test Rich Text Content</h1>",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("noteId");

      createdNoteId = res.body.noteId;
    } catch (error) {
      throw new Error(
        `Authenticated note creation test failed: ${error.message}`,
      );
    }
  });

  it("should retrieve all notes for the authenticated user", async () => {
    try {
      const { expect } = await import("chai");

      const res = await user1Agent.get("/api/notes");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(0);
    } catch (error) {
      throw new Error(`Retrieve notes test failed: ${error.message}`);
    }
  });

  it("should NOT include User 1's note in User 2's notes list", async () => {
    try {
      const { expect } = await import("chai");

      const res = await user2Agent.get("/api/notes");

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");

      const containsUser1Note = res.body.some(
        (note) => note.id === createdNoteId,
      );

      expect(containsUser1Note).to.equal(false);
    } catch (error) {
      throw new Error(`User isolation fetch test failed: ${error.message}`);
    }
  });

  it("should PREVENT User 2 from updating User 1's note", async () => {
    try {
      const { expect } = await import("chai");

      const res = await user2Agent.put(`/api/notes/${createdNoteId}`).send({
        title: "Malicious Overwrite",
        content: "<p>Hacked Content</p>",
      });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error");
    } catch (error) {
      throw new Error(
        `User isolation update protection test failed: ${error.message}`,
      );
    }
  });

  it("should PREVENT User 2 from deleting User 1's note", async () => {
    try {
      const { expect } = await import("chai");

      const res = await user2Agent.delete(`/api/notes/${createdNoteId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error");
    } catch (error) {
      throw new Error(
        `User isolation delete protection test failed: ${error.message}`,
      );
    }
  });

  it("should update an existing note for the owner", async () => {
    try {
      const { expect } = await import("chai");

      const res = await user1Agent.put(`/api/notes/${createdNoteId}`).send({
        title: "Updated Note Title",
        content: "<p>Updated Content</p>",
      });

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Note updated successfully");
    } catch (error) {
      throw new Error(`Note update test failed: ${error.message}`);
    }
  });

  it("should delete the created note for the owner", async () => {
    try {
      const { expect } = await import("chai");

      const res = await user1Agent.delete(`/api/notes/${createdNoteId}`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Note deleted successfully");
    } catch (error) {
      throw new Error(`Note deletion test failed: ${error.message}`);
    }
  });
});
