import request from "supertest";
import { describe, it, beforeAll, expect } from "@jest/globals";
import app from "../../../src/app.js";
import { TEST_USERS } from "../../helpers/test-data";
import { getAuthToken } from "../../helpers/auth.helpers";
import {
  expectValidUserStructure,
  expect401Error,
  expectJsonResponse,
} from "../../helpers/assertions";
import { getAuthValidationTests } from "../../helpers/request.helpers";

describe("GET /api/v1/users/me", function () {
  let user1Token: string;
  let user2Token: string;

  beforeAll(async function () {
    user1Token = await getAuthToken({
      email: TEST_USERS.user1.email,
      password: TEST_USERS.user1.password,
    });
    user2Token = await getAuthToken({
      email: TEST_USERS.user2.email,
      password: TEST_USERS.user2.password,
    });
  });

  describe("Authentication validation", function () {
    getAuthValidationTests().forEach(({ name, setupAuth }) => {
      it(name, async function () {
        const req = request(app).get("/api/v1/users/me");
        const res = await setupAuth(req);

        expect401Error(res);
      });
    });
  });

  describe("Successful requests", function () {
    it("returns 200 and user data for authenticated user", async function () {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", user1Token);

      expectJsonResponse(res, 200);
      expectValidUserStructure(res.body.data, {
        username: TEST_USERS.user1.username,
        email: TEST_USERS.user1.email,
      });
    });

    it("returns correct data for different authenticated users", async function () {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", user2Token);

      expectJsonResponse(res, 200);
      expectValidUserStructure(res.body.data, {
        username: TEST_USERS.user2.username,
        email: TEST_USERS.user2.email,
      });
    });
  });
});

describe("POST /api/v1/auth/logoutAll", function () {
  describe("Authentication validation", function () {
    getAuthValidationTests().forEach(({ name, setupAuth }) => {
      it(name, async function () {
        const req = request(app).post("/api/v1/auth/logoutAll");
        const res = await setupAuth(req);

        expect401Error(res);
      });
    });
  });

  describe("Successful logout", function () {
    it("returns 200 when logging out all sessions", async function () {
      const token = await getAuthToken({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password,
      });

      const res = await request(app)
        .post("/api/v1/auth/logoutAll")
        .set("Cookie", token);

      expect(res.statusCode).toBe(200);
    });

    it("invalidates all previous tokens after logoutAll", async function () {
      const token = await getAuthToken({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password,
      });

      // Verify token works
      const beforeLogout = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", token);
      expect(beforeLogout.statusCode).toBe(200);

      // Logout all sessions
      await request(app).post("/api/v1/auth/logoutAll").set("Cookie", token);

      // Try to use old token
      const afterLogout = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", token);

      expect401Error(afterLogout);
    });

    it("invalidates multiple tokens after logoutAll", async function () {
      // Login twice to get two tokens
      const token1 = await getAuthToken({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password,
      });
      const token2 = await getAuthToken({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password,
      });

      // Verify both tokens work
      const check1 = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", token1);
      expect(check1.statusCode).toBe(200);

      const check2 = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", token2);
      expect(check2.statusCode).toBe(200);

      // Logout all sessions using first token
      await request(app).post("/api/v1/auth/logoutAll").set("Cookie", token1);

      // Both tokens should now be invalid
      const afterLogout1 = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", token1);
      expect401Error(afterLogout1);

      const afterLogout2 = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", token2);
      expect401Error(afterLogout2);
    });

    it("allows login with new token after logoutAll", async function () {
      // Login and logout all
      const oldToken = await getAuthToken({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password,
      });

      await request(app).post("/api/v1/auth/logoutAll").set("Cookie", oldToken);

      // Login again to get new token
      const newToken = await getAuthToken({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password,
      });

      // Use new token to access protected endpoint
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", newToken);

      expectJsonResponse(res, 200);
      expect(res.body.data.userData).toHaveProperty("account");
    });
  });
});
