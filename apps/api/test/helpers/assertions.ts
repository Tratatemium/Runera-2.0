import type { Response } from "supertest";
import type { DBRun } from "../../src/models/runs.models";
import type { DBUser } from "../../src/models/users.models";

import { expect } from "@jest/globals";

function expectValidJwtToken(response: Response) {
  expect(response.statusCode).toBe(200);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("status", "success");
  expect(response.body).toHaveProperty("data", null);
  expect(response.headers).toHaveProperty("set-cookie");

  const cookies = Array.isArray(response.headers["set-cookie"])
    ? response.headers["set-cookie"]
    : [response.headers["set-cookie"]];
  const tokenCookie = cookies.find((cookie) => cookie?.startsWith("token="));
  expect(tokenCookie).toBeDefined();

  const tokenValue = tokenCookie.split(";")[0].slice("token=".length);
  expect(tokenValue.length).toBeGreaterThan(0);
  expect(tokenValue).toMatch(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
  );
}

function expectValidRunStructure(run: DBRun | { runData: DBRun }) {
  const runData = "runData" in run ? run.runData : run;

  expect(runData).toHaveProperty("runId");
  expect(runData).toHaveProperty("userId");
  expect(runData).toHaveProperty("startTime");
  expect(runData).toHaveProperty("durationSec");
  expect(runData).toHaveProperty("distanceMeters");

  expect(typeof runData.runId).toBe("string");
  expect(typeof runData.userId).toBe("string");
  expect(typeof runData.startTime).toBe("string");
  expect(typeof runData.durationSec).toBe("number");
  expect(typeof runData.distanceMeters).toBe("number");

  expect(new Date(runData.startTime).toString()).not.toBe("Invalid Date");
  expect(runData.durationSec).toBeGreaterThan(0);
  expect(runData.distanceMeters).toBeGreaterThan(0);
}

function expectValidUserStructure(
  user: DBUser | { userData: DBUser },
  expectedAccount: { username?: string; email?: string } = {},
) {
  const userData = "userData" in user ? user.userData : user;

  expect(userData).toHaveProperty("account");
  expect(userData).toHaveProperty("profile");
  expect(userData).not.toHaveProperty("_id");
  expect(userData).not.toHaveProperty("credentials");

  if (expectedAccount.username) {
    expect(userData.account).toHaveProperty(
      "username",
      expectedAccount.username,
    );
  }
  if (expectedAccount.email) {
    expect(userData.account).toHaveProperty("email", expectedAccount.email);
  }
}

function expect400WithMessage(
  response: Response,
  expectedError: string | RegExp | { message: string; field: string },
) {
  expect(response.statusCode).toBe(400);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );

  const { error } = response.body;

  if (typeof expectedError === "string") {
    expect(error.message).toBe(expectedError);
  } else {
    if (expectedError instanceof RegExp) {
      expect(error.message).toMatch(expectedError);
      return;
    }

    if (expectedError?.message != null) {
      if (typeof expectedError.message === "string") {
        expect(error.message).toBe(expectedError.message);
      } else {
        expect(error.message).toMatch(expectedError.message);
      }
    }

    if (Object.prototype.hasOwnProperty.call(expectedError || {}, "field")) {
      expect(error.field).toBe(expectedError.field);
    }
  }
}

function expect401Error(response: Response) {
  expect(response.statusCode).toBe(401);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
}

function expect403Error(response: Response) {
  expect(response.statusCode).toBe(403);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
}

function expect404Error(response: Response) {
  expect(response.statusCode).toBe(404);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
}

function expect409Error(response: Response) {
  expect(response.statusCode).toBe(409);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
}

function expect415Error(response: Response) {
  expect(response.statusCode).toBe(415);
  expect(response.headers["content-type"]).toMatch(/json/);
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      message: expect.any(String),
    }),
  );
}

function expectJsonResponse(response: Response, expectedStatus = 200) {
  expect(response.statusCode).toBe(expectedStatus);
  expect(response.headers["content-type"]).toMatch(/json/);
}

export {
  expectValidJwtToken,
  expectValidRunStructure,
  expectValidUserStructure,
  expect400WithMessage,
  expect401Error,
  expect403Error,
  expect404Error,
  expect409Error,
  expect415Error,
  expectJsonResponse,
};
