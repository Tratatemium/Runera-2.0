import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../../src/app.js";
import { expectJsonResponse } from "../../helpers/assertions.js";

describe("Server Health Endpoints", function () {
  describe("GET /health", function () {
    it("returns health status with uptime and version", async function () {
      const res = await request(app).get("/health");

      expectJsonResponse(res, 200);
      expect(res.body).toHaveProperty("status", "running");
      expect(res.body).toHaveProperty("uptime");
      expect(res.body).toHaveProperty("version");
      expect(res.body.uptime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });
});
