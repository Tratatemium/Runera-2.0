import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../../src/app.js";
import { TEST_RUN_IDS } from "../../helpers/test-data";
import {
  expectValidRunStructure,
  expect404Error,
  expect400WithMessage,
  expectJsonResponse,
} from "../../helpers/assertions";

describe("GET /api/v1/runs/:id", function () {
  it("returns 200 and run JSON for an existing ID", async function () {
    const runId = TEST_RUN_IDS.user1Run1;
    const res = await request(app).get(`/api/v1/runs/${runId}`);

    expectJsonResponse(res, 200);
    expect(res.body.data.runData).toHaveProperty("runId", runId);
    expectValidRunStructure(res.body.data.runData);
  });

  it("returns 404 for a non-existing ID", async function () {
    const runId = TEST_RUN_IDS.nonExistent;
    const res = await request(app).get(`/api/v1/runs/${runId}`);

    expect404Error(res);
  });

  it("returns 400 for non-UUID", async function () {
    const runId = "not-a-UUID";
    const res = await request(app).get(`/api/v1/runs/${runId}`);

    expect400WithMessage(res, /invalid|UUID/i);
  });
});
