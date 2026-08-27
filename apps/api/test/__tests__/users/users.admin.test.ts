import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import app from "../../../src/app.js";
import { TEST_USERS } from "../../helpers/test-data";
import { getAuthToken } from "../../helpers/auth.helpers";
import {
  expectValidUserStructure,
  expect401Error,
  expect403Error,
  expect400WithMessage,
  expect404Error,
  expectJsonResponse,
} from "../../helpers/assertions";
import { getAuthValidationTests } from "../../helpers/request.helpers";

describe("GET /api/v1/users/:id (Admin Route)", function () {
  let user1Token: string;
  let user2Token: string;
  let adminToken: string;

  beforeAll(async function () {
    user1Token = await getAuthToken({
      email: TEST_USERS.user1.email,
      password: TEST_USERS.user1.password,
    });
    user2Token = await getAuthToken({
      email: TEST_USERS.user2.email,
      password: TEST_USERS.user2.password,
    });
    adminToken = await getAuthToken({
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password,
    });
  });

  describe("Authentication validation", function () {
    getAuthValidationTests().forEach(({ name, setupAuth }) => {
      it(name, async function () {
        const req = request(app).get(
          `/api/v1/users/${TEST_USERS.user1.userId}`,
        );
        const res = await setupAuth(req);

        expect401Error(res);
      });
    });
  });

  describe("UUID validation", function () {
    const invalidUUIDs = [
      { id: "not-a-uuid", desc: "invalid format" },
      { id: "123", desc: "too short" },
      { id: "f96084c5-ad81-4a19-99ef", desc: "incomplete UUID" },
      {
        id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        desc: "invalid characters",
      },
    ];

    invalidUUIDs.forEach(({ id, desc }) => {
      it(`returns 400 when id is ${desc}`, async function () {
        const res = await request(app)
          .get(`/api/v1/users/${id}`)
          .set("Cookie", adminToken);

        expect400WithMessage(res, /id.*valid UUID/i);
      });
    });
  });

  describe("Authorization/Permission checks", function () {
    it("allows admin to access any user's data", async function () {
      const res = await request(app)
        .get(`/api/v1/users/${TEST_USERS.user1.userId}`)
        .set("Cookie", adminToken);

      expectJsonResponse(res, 200);
      expectValidUserStructure(res.body.data, {
        username: TEST_USERS.user1.username,
        email: TEST_USERS.user1.email,
      });
    });

    it("allows user to access their own data", async function () {
      const res = await request(app)
        .get(`/api/v1/users/${TEST_USERS.user1.userId}`)
        .set("Cookie", user1Token);

      expectJsonResponse(res, 200);
      expectValidUserStructure(res.body.data, {
        username: TEST_USERS.user1.username,
        email: TEST_USERS.user1.email,
      });
    });

    it("denies user access to another user's data", async function () {
      const res = await request(app)
        .get(`/api/v1/users/${TEST_USERS.user2.userId}`)
        .set("Cookie", user1Token);

      expect403Error(res);
      expect(res.body.error.message).toMatch(/not allowed/i);
    });
  });

  describe("Successful user retrieval", function () {
    it("returns complete user data for user1", async function () {
      const res = await request(app)
        .get(`/api/v1/users/${TEST_USERS.user1.userId}`)
        .set("Cookie", adminToken);

      expectJsonResponse(res, 200);
      expectValidUserStructure(res.body.data, {
        username: TEST_USERS.user1.username,
        email: TEST_USERS.user1.email,
      });
    });

    it("returns complete user data for user2", async function () {
      const res = await request(app)
        .get(`/api/v1/users/${TEST_USERS.user2.userId}`)
        .set("Cookie", adminToken);

      expectJsonResponse(res, 200);
      expectValidUserStructure(res.body.data, {
        username: TEST_USERS.user2.username,
        email: TEST_USERS.user2.email,
      });
    });

    it("returns admin user data when admin requests their own data", async function () {
      const res = await request(app)
        .get(`/api/v1/users/${TEST_USERS.admin.userId}`)
        .set("Cookie", adminToken);

      expectJsonResponse(res, 200);
      expectValidUserStructure(res.body.data, {
        username: TEST_USERS.admin.username,
        email: TEST_USERS.admin.email,
      });
    });

    it("does not expose sensitive credentials in response", async function () {
      const res = await request(app)
        .get(`/api/v1/users/${TEST_USERS.user1.userId}`)
        .set("Cookie", adminToken);

      expectJsonResponse(res, 200);
      expect(res.body).not.toHaveProperty("credentials");
      expect(res.body).not.toHaveProperty("auth");
    });
  });

  describe("Non-existent user", function () {
    it("returns 404 for non-existent user ID", async function () {
      const nonExistentId = "e970bb08-3470-41de-be0b-753df9ec6562";
      const res = await request(app)
        .get(`/api/v1/users/${nonExistentId}`)
        .set("Cookie", adminToken);

      expect404Error(res);
      expect(res.body.error.message).toMatch(/No user.*found/i);
    });
  });
});

describe("GET /api/v1/users/ (Admin - Get All Users)", function () {
  let user1Token: string;
  let user2Token: string;
  let adminToken: string;

  beforeAll(async function () {
    user1Token = await getAuthToken({
      email: TEST_USERS.user1.email,
      password: TEST_USERS.user1.password,
    });
    user2Token = await getAuthToken({
      email: TEST_USERS.user2.email,
      password: TEST_USERS.user2.password,
    });
    adminToken = await getAuthToken({
      email: TEST_USERS.admin.email,
      password: TEST_USERS.admin.password,
    });
  });

  describe("Authentication validation", function () {
    getAuthValidationTests().forEach(({ name, setupAuth }) => {
      it(name, async function () {
        const req = request(app).get("/api/v1/users/");
        const res = await setupAuth(req);

        expect401Error(res);
      });
    });
  });

  describe("Authorization/Permission checks", function () {
    it("denies access to regular users", async function () {
      const res = await request(app)
        .get("/api/v1/users/")
        .set("Cookie", user1Token);

      expect403Error(res);
      expect(res.body.error.message).toMatch(/not allowed|permission|admin/i);
    });

    it("denies access to different regular users", async function () {
      const res = await request(app)
        .get("/api/v1/users/")
        .set("Cookie", user2Token);

      expect403Error(res);
    });
  });

  describe("Successful user list retrieval", function () {
    it("returns 200 and list of all users for admin", async function () {
      const res = await request(app)
        .get("/api/v1/users/")
        .set("Cookie", adminToken);

      expectJsonResponse(res, 200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("results");
      expect(Array.isArray(res.body.data.usersData)).toBe(true);
      expect(res.body.data.usersData.length).toBeGreaterThan(0);
      expect(res.body.results).toBe(res.body.data.usersData.length);
    });
  });
});
