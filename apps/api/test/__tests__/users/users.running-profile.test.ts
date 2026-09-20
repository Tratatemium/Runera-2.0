import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import app from "../../../src/app.js";
import {
  TEST_USERS,
  VALID_RUNNING_PROFILE_DATA,
} from "../../helpers/test-data";
import { getAuthToken } from "../../helpers/auth.helpers";
import {
  expect400WithMessage,
  expect401Error,
  expect415Error,
  expectJsonResponse,
} from "../../helpers/assertions";
import {
  getAuthValidationTests,
  getContentTypeTests,
} from "../../helpers/request.helpers";

describe("PATCH /api/v1/users/me/running-profile", function () {
  let user1Token: string;

  beforeAll(async function () {
    user1Token = await getAuthToken({
      email: TEST_USERS.user1.email,
      password: TEST_USERS.user1.password,
    });
  });

  describe("Content-Type validation", function () {
    getContentTypeTests().forEach(({ name, contentType, body }) => {
      it(name, async function () {
        const res = await request(app)
          .patch("/api/v1/users/me/running-profile")
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
        const req = request(app)
          .patch("/api/v1/users/me/running-profile")
          .send({ health: { items: [] } });
        const res = await setupAuth(req);

        expect401Error(res);
      });
    });
  });

  describe("Running profile object validation", function () {
    it("returns 400 when the request body has no supported fields", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/running-profile")
        .set("Cookie", user1Token)
        .send({});

      expect400WithMessage(
        res,
        "runningProfile must have one of the required fields: runningPreferences, health.",
      );
    });

    it("returns 400 for an unknown top-level field", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/running-profile")
        .set("Cookie", user1Token)
        .send({ unknownField: true });

      expect400WithMessage(res, "Unknown field: unknownField");
    });

    it("returns 400 for an invalid nested field", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/running-profile")
        .set("Cookie", user1Token)
        .send({
          runningPreferences: {
            constraints: { maxRunMinutes: 0 },
          },
        });

      expect400WithMessage(res, /maxRunMinutes/);
    });

    it("returns 400 for an invalid enum value", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/running-profile")
        .set("Cookie", user1Token)
        .send({
          health: { items: ["unknown_condition"] },
        });

      expect400WithMessage(res, /health.items/);
    });
  });

  describe("Successful running profile updates", function () {
    it("returns the saved running preferences and health data", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/running-profile")
        .set("Cookie", user1Token)
        .send(VALID_RUNNING_PROFILE_DATA);

      expectJsonResponse(res, 200);
      expect(res.body.data.savedRunningProfile).toEqual(
        expect.objectContaining(VALID_RUNNING_PROFILE_DATA),
      );
    });

    it("allows partial updates to either running profile section", async function () {
      const res = await request(app)
        .patch("/api/v1/users/me/running-profile")
        .set("Cookie", user1Token)
        .send({ health: { items: [] } });

      expectJsonResponse(res, 200);
      expect(res.body.data.savedRunningProfile.health).toEqual({ items: [] });
    });
  });
});
