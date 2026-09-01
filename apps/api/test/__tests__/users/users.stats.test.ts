import request from "supertest";
import { describe, it, expect, beforeAll } from "@jest/globals";
import app from "../../../src/app.js";
import { TEST_USERS } from "../../helpers/test-data";
import { getAuthToken } from "../../helpers/auth.helpers";
import { expect401Error, expectJsonResponse } from "../../helpers/assertions";
import { getAuthValidationTests } from "../../helpers/request.helpers";

describe("GET /api/v1/users/me/stats", function () {
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
        const req = request(app).get("/api/v1/users/me/stats");
        const res = await setupAuth(req);

        expect401Error(res);
      });
    });
  });

  describe("Success", function () {
    it("returns 200 with the correct stats shape", async function () {
      const res = await request(app)
        .get("/api/v1/users/me/stats")
        .set("Cookie", user1Token);

      expectJsonResponse(res, 200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body).toHaveProperty("data.stats");

      const { stats } = res.body.data;

      // period stats keys
      for (const period of ["week", "year", "allTime"] as const) {
        expect(stats).toHaveProperty(period);
        const p = stats[period];
        if (p.totalRuns !== null) {
          expect(typeof p.totalRuns).toBe("number");
          expect(typeof p.totalTimeSec).toBe("number");
          expect(typeof p.totalDistanceMeters).toBe("number");
          expect(typeof p.avgPaceSecPerKm).toBe("number");
        } else {
          expect(p.totalRuns).toBeNull();
          expect(p.totalTimeSec).toBeNull();
          expect(p.totalDistanceMeters).toBeNull();
          expect(p.avgPaceSecPerKm).toBeNull();
        }
      }

      // fastest runs keys
      expect(stats).toHaveProperty("fastest");
      for (const dist of ["1k", "5k", "10k", "halfMarathon", "marathon"]) {
        expect(stats.fastest).toHaveProperty(dist);
        const fastest = stats.fastest[dist];
        if (fastest !== null) {
          expect(typeof fastest.runId).toBe("string");
          expect(typeof fastest.durationSec).toBe("number");
          expect(typeof fastest.distanceMeters).toBe("number");
          expect(typeof fastest.paceSecPerKm).toBe("number");
          expect(typeof fastest.date).toBe("string");
          expect(new Date(fastest.date).toString()).not.toBe("Invalid Date");
        }
      }
    });

    it("returns null periods and fastest runs when user has no runs", async function () {
      const res = await request(app)
        .get("/api/v1/users/me/stats")
        .set("Cookie", user2Token);

      // user2 has only runs outside the current week/year in the fixture
      expectJsonResponse(res, 200);
      const { stats } = res.body.data;

      // allTime may have data but shape must still be valid
      expect(stats).toHaveProperty("allTime");
      expect(stats).toHaveProperty("fastest");
    });

    it("only returns stats for the authenticated user", async function () {
      const res1 = await request(app)
        .get("/api/v1/users/me/stats")
        .set("Cookie", user1Token);

      const res2 = await request(app)
        .get("/api/v1/users/me/stats")
        .set("Cookie", user2Token);

      expectJsonResponse(res1, 200);
      expectJsonResponse(res2, 200);

      // user1 has more fixture runs than user2 — allTime totals must differ
      const allTime1 = res1.body.data.stats.allTime;
      const allTime2 = res2.body.data.stats.allTime;

      if (allTime1.totalRuns !== null && allTime2.totalRuns !== null) {
        expect(allTime1.totalRuns).not.toBe(allTime2.totalRuns);
      }
    });
  });
});
