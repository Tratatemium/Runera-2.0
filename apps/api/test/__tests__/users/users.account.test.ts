import request from "supertest";
import { describe, it, expect, beforeAll, afterEach } from "@jest/globals";
import app from "../../../src/app.js";
import * as seeding from "../../helpers/seeding.js";
import User from "../../../src/models/users.models.js";
import { TEST_USERS } from "../../helpers/test-data";
import { getAuthToken } from "../../helpers/auth.helpers";
import {
  expect400WithMessage,
  expect401Error,
  expect415Error,
} from "../../helpers/assertions";
import {
  getAuthValidationTests,
  getContentTypeTests,
} from "../../helpers/request.helpers";

/**
 * Test suite for PATCH /api/v1/users/me/account endpoint
 * Covers password, email, and username updates
 */
describe("PATCH /api/v1/users/me/account", function () {
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

  afterEach(async function () {
    // Reseed data after each test to maintain consistent state
    await User.deleteMany({});
    await seeding.seedData(User, "users");
  });

  describe("Common validations", function () {
    describe("Content-Type validation", function () {
      getContentTypeTests().forEach(({ name, contentType, body }) => {
        it(name, async function () {
          const res = await request(app)
            .patch("/api/v1/users/me/account")
            .set("Content-Type", contentType)
            .set("Cookie", user1Token)
            .send(body);

          expect415Error(res);
        });
      });
    });

    describe("Authentication validation", function () {
      getAuthValidationTests().forEach(({ name, setupAuth }) => {
        it(name, async function () {
          const req = request(app).patch("/api/v1/users/me/account").send({
            currentPassword: TEST_USERS.user1.password,
            newPassword: "NewPassword456!",
          });
          const res = await setupAuth(req);

          expect401Error(res);
        });
      });
    });

    describe("currentPassword validation", function () {
      it("returns 400 when currentPassword is missing", async function () {
        const res = await request(app)
          .patch("/api/v1/users/me/account")
          .set("Cookie", user1Token)
          .send({ newPassword: "NewPassword456!" });

        expect400WithMessage(res, "currentPassword must be provided.");
      });

      it("returns 401 when currentPassword is incorrect", async function () {
        const res = await request(app)
          .patch("/api/v1/users/me/account")
          .set("Cookie", user1Token)
          .send({
            currentPassword: "WrongPassword123!",
            newPassword: "NewPassword456!",
          });

        expect401Error(res);
      });
    });

    describe("Field update validation", function () {
      const invalidFieldCombinations = [
        {
          data: { currentPassword: TEST_USERS.user1.password },
          desc: "no update field",
        },
        {
          data: {
            currentPassword: TEST_USERS.user1.password,
            newPassword: "NewPassword456!",
            newEmail: "newemail@test.com",
          },
          desc: "multiple update fields",
        },
        {
          data: {
            currentPassword: TEST_USERS.user1.password,
            newPassword: "NewPassword456!",
            newEmail: "newemail@test.com",
            newUsername: "newusername123",
          },
          desc: "all three update fields",
        },
      ];

      invalidFieldCombinations.forEach(({ data, desc }) => {
        it(`returns 400 when ${desc} provided`, async function () {
          const res = await request(app)
            .patch("/api/v1/users/me/account")
            .set("Cookie", user1Token)
            .send(data);

          expect400WithMessage(
            res,
            "Request body must include currentPassword and only one of: newPassword, newEmail, newUsername.",
          );
        });
      });
    });
  });

  describe("Password updates", function () {
    const passwordValidationCases = [
      {
        password: "Short1!",
        message: "password must be at least 8 characters long.",
      },
      {
        password: "A".repeat(129),
        message: "password must be at most 128 characters long.",
      },
      { password: 123456789012, message: "password must be a string." },
    ];

    passwordValidationCases.forEach(({ password, message }) => {
      it(`returns 400 for invalid newPassword: ${message}`, async function () {
        const res = await request(app)
          .patch("/api/v1/users/me/account")
          .set("Cookie", user1Token)
          .send({
            currentPassword: TEST_USERS.user1.password,
            newPassword: password,
          });

        expect400WithMessage(res, message);
      });
    });

    it("successfully updates password", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user1Token)
        .send({
          currentPassword: TEST_USERS.user1.password,
          newPassword: "NewPassword456!",
        });

      expect(res.statusCode).toBe(200);
    });

    it("invalidates previous token after password update", async function () {
      const oldToken = user1Token;

      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", oldToken)
        .send({
          currentPassword: TEST_USERS.user1.password,
          newPassword: "BrandNewPassword123!",
        });

      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", oldToken);

      expect401Error(res);
    });

    it("allows login with new password after update", async function () {
      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user1Token)
        .send({
          currentPassword: TEST_USERS.user1.password,
          newPassword: "UpdatedPassword789!",
        });

      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: TEST_USERS.user1.email,
        password: "UpdatedPassword789!",
      });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.headers).toHaveProperty("set-cookie");
    });

    it("rejects login with old password after update", async function () {
      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user1Token)
        .send({
          currentPassword: TEST_USERS.user1.password,
          newPassword: "AnotherPassword321!",
        });

      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: TEST_USERS.user1.email,
        password: TEST_USERS.user1.password,
      });

      expect(loginRes.statusCode).toBe(401);
    });
  });

  describe("Email updates", function () {
    const emailValidationCases = [
      { email: "notanemail", message: "email must be a valid email address." },
      {
        email: "new email@test.com",
        message: "email must not contain whitespace.",
      },
      {
        email: "a".repeat(250) + "@test.com",
        message: "email must not be longer than 254 characters.",
      },
      { email: 12345, message: "email must be a string." },
    ];

    emailValidationCases.forEach(({ email, message }) => {
      it(`returns 400 for invalid newEmail: ${message}`, async function () {
        const res = await request(app)
          .patch("/api/v1/users/me/account")
          .set("Cookie", user2Token)
          .send({
            currentPassword: TEST_USERS.user2.password,
            newEmail: email,
          });

        expect400WithMessage(res, message);
      });
    });

    it("successfully updates email", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user2Token)
        .send({
          currentPassword: TEST_USERS.user2.password,
          newEmail: "updated_runner02@test.com",
        });

      expect(res.statusCode).toBe(200);
    });

    it("invalidates previous token after email update", async function () {
      const oldToken = user2Token;

      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", oldToken)
        .send({
          currentPassword: TEST_USERS.user2.password,
          newEmail: "completely_new_email@test.com",
        });

      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", oldToken);

      expect401Error(res);
    });

    it("allows login with new email after update", async function () {
      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user2Token)
        .send({
          currentPassword: TEST_USERS.user2.password,
          newEmail: "new_runner02@test.com",
        });

      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: "new_runner02@test.com",
        password: TEST_USERS.user2.password,
      });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.headers).toHaveProperty("set-cookie");
    });

    it("rejects login with old email after update", async function () {
      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user2Token)
        .send({
          currentPassword: TEST_USERS.user2.password,
          newEmail: "latest_runner02@test.com",
        });

      const loginRes = await request(app).post("/api/v1/auth/login").send({
        email: TEST_USERS.user2.email,
        password: TEST_USERS.user2.password,
      });

      expect(loginRes.statusCode).toBe(401);
    });
  });

  describe("Username updates", function () {
    const usernameValidationCases = [
      {
        username: "abc",
        message: "username must be between 4 and 20 characters long.",
      },
      {
        username: "a".repeat(21),
        message: "username must be between 4 and 20 characters long.",
      },
      {
        username: "user@name",
        message: "username may only contain letters, numbers, and underscores.",
      },
      {
        username: "user name",
        message: "username may only contain letters, numbers, and underscores.",
      },
      { username: 123456, message: "username must be a string." },
    ];

    usernameValidationCases.forEach(({ username, message }) => {
      it(`returns 400 for invalid newUsername: ${message}`, async function () {
        const res = await request(app)
          .patch("/api/v1/users/me/account")
          .set("Cookie", user1Token)
          .send({
            currentPassword: TEST_USERS.user1.password,
            newUsername: username,
          });

        expect400WithMessage(res, message);
      });
    });

    it("successfully updates username", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user1Token)
        .send({
          currentPassword: TEST_USERS.user1.password,
          newUsername: "updated_runner_01",
        });

      expect(res.statusCode).toBe(200);
    });

    it("invalidates previous token after username update", async function () {
      const oldToken = user1Token;

      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", oldToken)
        .send({
          currentPassword: TEST_USERS.user1.password,
          newUsername: "totally_new_username",
        });

      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Cookie", oldToken);

      expect401Error(res);
    });

    it("allows login with new username after update", async function () {
      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user1Token)
        .send({
          currentPassword: TEST_USERS.user1.password,
          newUsername: "newest_runner_01",
        });

      const loginRes = await request(app).post("/api/v1/auth/login").send({
        username: "newest_runner_01",
        password: TEST_USERS.user1.password,
      });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.headers).toHaveProperty("set-cookie");
    });

    it("rejects login with old username after update", async function () {
      await request(app)
        .patch("/api/v1/users/me/account")
        .set("Cookie", user1Token)
        .send({
          currentPassword: TEST_USERS.user1.password,
          newUsername: "final_runner_01",
        });

      const loginRes = await request(app).post("/api/v1/auth/login").send({
        username: TEST_USERS.user1.username,
        password: TEST_USERS.user1.password,
      });

      expect(loginRes.statusCode).toBe(401);
    });

    const validUsernames = [
      { username: "valid_user_name_123", desc: "with underscores" },
      { username: "username123456", desc: "with numbers" },
    ];

    validUsernames.forEach(({ username, desc }) => {
      it(`accepts valid username ${desc}`, async function () {
        const res = await request(app)
          .patch("/api/v1/users/me/account")
          .set("Cookie", user1Token)
          .send({
            currentPassword: TEST_USERS.user1.password,
            newUsername: username,
          });

        expect(res.statusCode).toBe(200);
      });
    });
  });
});
